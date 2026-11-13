import { Order } from "../models/Order";
import { Part } from "../models/Part";
import { User } from "../models/User";
import { StockLog } from "../models/StockLog";

export const getDashboardStats = async () => {
  const [
    totalOrders,
    pendingOrders,
    totalUsers,
    totalParts,
    revenueAgg,
    lowStockParts,
    recentOrders,
    ordersByStatus,
    dailySales,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ orderStatus: "pending" }),
    User.countDocuments({ role: "customer" }),
    Part.countDocuments({ isActive: true }),
    Order.aggregate<{ totalSales: number }>([
      { $match: { orderStatus: { $ne: "cancelled" } } },
      { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } },
    ]),
    Part.find({
      isActive: true,
      $expr: { $lte: ["$stock", "$lowStockThreshold"] },
    })
      .populate("category", "name")
      .sort({ stock: 1 })
      .limit(15),
    Order.find().populate("user", "name email").sort({ createdAt: -1 }).limit(8),
    Order.aggregate<{ _id: string; count: number }>([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]),
    Order.aggregate<{ _id: string; sales: number; orders: number }>([
      { $match: { orderStatus: { $ne: "cancelled" } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 14 },
    ]),
  ]);

  const totalSales = revenueAgg[0]?.totalSales || 0;

  return {
    metrics: {
      totalSales: Number(totalSales.toFixed(2)),
      totalOrders,
      pendingOrders,
      totalUsers,
      totalParts,
      lowStockCount: lowStockParts.length,
    },
    lowStockParts,
    recentOrders,
    ordersByStatus: ordersByStatus.map((s) => ({ status: s._id, count: s.count })),
    dailySales: dailySales.map((d) => ({
      date: d._id,
      sales: Number(d.sales.toFixed(2)),
      orders: d.orders,
    })),
  };
};

export const getStockLogs = async (limit = 50) => {
  return StockLog.find()
    .populate("part", "name partNumber")
    .populate("user", "name email")
    .populate("orderId", "orderNumber")
    .sort({ createdAt: -1 })
    .limit(limit);
};

export const getAllUsers = async () => {
  return User.find().select("-password").sort({ createdAt: -1 });
};

