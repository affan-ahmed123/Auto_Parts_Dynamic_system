const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mongoUri = process.env.MONGO_URI || "mongodb+srv://affan:affan1234@cluster0.vkegmli.mongodb.net/automobile_parts?retryWrites=true&w=majority";

const partImageMapBatch2 = [
  {
    partNumber: "ELC-UNI-OBD2X",
    name: "Heavy-Duty OBD2 Diagnostic Scanner",
    image: "/uploads/parts/obd2-scanner-diagnostic-tool.jpg"
  },
  {
    partNumber: "ELC-BOS-00011",
    name: "Starter Motor Assembly 1.4kW",
    image: "/uploads/parts/starter-motor-assembly-14kw.jpg"
  },
  {
    partNumber: "ELC-VAL-43980",
    name: "130A High-Output Alternator (Refurbished)",
    image: "/uploads/parts/alternator-130a-high-output.jpg"
  },
  {
    partNumber: "ELC-BOS-S5005",
    name: "12V 60Ah Maintenance-Free AGM Battery",
    image: "/uploads/parts/agm-maintenance-free-battery-12v.jpg"
  },
  {
    partNumber: "ELC-DEN-67313",
    name: "Direct-Ignition Coil Pack (Single)",
    image: "/uploads/parts/direct-ignition-coil-pack.jpg"
  },
  {
    partNumber: "SUS-TRW-JTE10",
    name: "Outer Tie Rod End (Left/Right Pair)",
    image: "/uploads/parts/outer-tie-rod-end-pair.jpg"
  },
  {
    partNumber: "SUS-BIL-36258",
    name: "Rear Coil Spring Set (Heavy Duty)",
    image: "/uploads/parts/rear-coil-spring-set.jpg"
  },
  {
    partNumber: "SUS-MON-90754",
    name: "Front Stabilizer Sway Bar Link Kit",
    image: "/uploads/parts/front-sway-bar-link-kit.jpg"
  },
  {
    partNumber: "SUS-MOO-RK620",
    name: "Lower Control Arm with Ball Joint",
    image: "/uploads/parts/lower-control-arm-ball-joint.jpg"
  },
  {
    partNumber: "SUS-KYB-33911",
    name: "Front Gas-Charged Shock Absorber (Pair)",
    image: "/uploads/parts/front-gas-shock-absorbers.jpg"
  },
  {
    partNumber: "FLT-MAN-HU702",
    name: "Cartridge Oil Filter (Euro Spec)",
    image: "/uploads/parts/cartridge-oil-filter-euro.jpg"
  },
  {
    partNumber: "FLT-SUZ-15410",
    name: "Cartridge Fuel Filter Element",
    image: "/uploads/parts/cartridge-fuel-filter-element.jpg"
  },
  {
    partNumber: "FLT-BOS-19874",
    name: "Activated Carbon Cabin Air Filter",
    image: "/uploads/parts/activated-carbon-cabin-filter.jpg"
  },
  {
    partNumber: "FLT-MAN-C2700",
    name: "Engine Air Intake Filter",
    image: "/uploads/parts/engine-air-intake-filter.jpg"
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

    for (const item of partImageMapBatch2) {
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

    console.log("\nAll 14 batch 2 parts have been updated with their cropped pictures in MongoDB Atlas!");
    process.exit(0);
  } catch (err) {
    console.error("Error updating part images:", err);
    process.exit(1);
  }
}

run();

