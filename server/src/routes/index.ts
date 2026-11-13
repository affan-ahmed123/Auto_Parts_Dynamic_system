import { Router } from "express";
import healthRoutes from "./health.routes";
import authRoutes from "./auth.routes";
import vehicleRoutes from "./vehicle.routes";
import categoryRoutes from "./category.routes";
import partRoutes from "./part.routes";
import cartRoutes from "./cart.routes";
import orderRoutes from "./order.routes";
import adminRoutes from "./admin.routes";

const rootRouter = Router();

rootRouter.use("/", healthRoutes);
rootRouter.use("/auth", authRoutes);
rootRouter.use("/vehicles", vehicleRoutes);
rootRouter.use("/categories", categoryRoutes);
rootRouter.use("/parts", partRoutes);
rootRouter.use("/cart", cartRoutes);
rootRouter.use("/orders", orderRoutes);
rootRouter.use("/admin", adminRoutes);

export default rootRouter;
