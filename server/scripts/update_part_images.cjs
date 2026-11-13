const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mongoUri = process.env.MONGO_URI || "mongodb+srv://affan:affan1234@cluster0.vkegmli.mongodb.net/automobile_parts?retryWrites=true&w=majority";

const partImageMap = [
  {
    partNumber: "OIL-PRE-COOL4",
    name: "Long-Life Premixed Engine Coolant (4 Liter)",
    image: "/uploads/parts/honda-coolant-4l.jpg"
  },
  {
    partNumber: "OIL-ATE-DOT41",
    name: "DOT 4 High-Performance Brake Fluid (1 Liter)",
    image: "/uploads/parts/bendix-dot4-brake-fluid.jpg"
  },
  {
    partNumber: "OIL-MOB-0W204",
    name: "0W-20 Eco Synthetic Motor Oil (4 Liter)",
    image: "/uploads/parts/shell-helix-0w20.jpg"
  },
  {
    partNumber: "OIL-CAS-EDGE5",
    name: "5W-30 Full Synthetic Motor Oil (4 Liter)",
    image: "/uploads/parts/motorcraft-5w30-oil.jpg"
  },
  {
    partNumber: "TYR-UNI-LUG20",
    name: "Chrome Steel Wheel Lug Nuts M12x1.5 (Set of 20)",
    image: "/uploads/parts/chrome-lug-nuts-m12.jpg"
  },
  {
    partNumber: "TYR-SKF-VKBA6",
    name: "Front Wheel Hub & Bearing Assembly",
    image: "/uploads/parts/wheel-hub-bearing-assembly.jpg"
  },
  {
    partNumber: "TYR-MIC-20555",
    name: "205/55R16 Primacy 4 All-Season Tyre",
    image: "/uploads/parts/michelin-primacy4-tyre.jpg"
  },
  {
    partNumber: "BDY-KIA-86831",
    name: "Heavy-Duty Molded Splash Guards / Mud Flaps (Set of 4)",
    image: "/uploads/parts/molded-splash-guards-mudflaps.jpg"
  },
  {
    partNumber: "BDY-BOS-33970",
    name: "Silicone All-Weather Wiper Blades (Pair 24\"/16\")",
    image: "/uploads/parts/silicone-wiper-blades-pair.jpg"
  },
  {
    partNumber: "BDY-MER-20588",
    name: "Front Honeycomb Bumper Grille (Gloss Black)",
    image: "/uploads/parts/front-honeycomb-grille.jpg"
  },
  {
    partNumber: "BDY-TYC-52504",
    name: "Power Heated Side Mirror Assembly (Left)",
    image: "/uploads/parts/power-heated-side-mirror.jpg"
  },
  {
    partNumber: "LGT-OSR-2825D",
    name: "T10 / W5W LED Interior & License Plate Bulbs (4-Pack)",
    image: "/uploads/parts/t10-w5w-led-bulbs.jpg"
  },
  {
    partNumber: "LGT-DEP-21719",
    name: "LED Tail Light Assembly (Right Side)",
    image: "/uploads/parts/led-tail-light-assembly.jpg"
  },
  {
    partNumber: "LGT-TYC-19598",
    name: "Clear Lens Fog Light Lamp Assembly (Pair)",
    image: "/uploads/parts/clear-lens-fog-lights-pair.jpg"
  },
  {
    partNumber: "LGT-PHI-11362",
    name: "H11 LED Headlight Bulb Kit (6000K White)",
    image: "/uploads/parts/h11-led-headlight-bulbs.jpg"
  }
];

async function run() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully!");

    const Part = mongoose.model(
      "Part",
      new mongoose.Schema({
        name: String,
        partNumber: String,
        images: [String]
      }, { strict: false })
    );

    for (const item of partImageMap) {
      // Find by partNumber or regex name
      const res = await Part.updateMany(
        {
          $or: [
            { partNumber: item.partNumber },
            { name: { $regex: new RegExp(item.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") } }
          ]
        },
        {
          $set: { images: [item.image] }
        }
      );

      console.log(`Updated part: "${item.name}" (SKU: ${item.partNumber}) -> ${item.image} [Matched: ${res.matchedCount}, Modified: ${res.modifiedCount}]`);
    }

    console.log("\nAll 15 parts have been updated with their cropped pictures in MongoDB Atlas!");
    process.exit(0);
  } catch (err) {
    console.error("Error updating part images:", err);
    process.exit(1);
  }
}

run();

