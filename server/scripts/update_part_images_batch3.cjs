const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mongoUri = process.env.MONGO_URI || "mongodb+srv://affan:affan1234@cluster0.vkegmli.mongodb.net/automobile_parts?retryWrites=true&w=majority";

const partImageMapBatch3 = [
  {
    partNumber: "FLT-DEN-90915",
    name: "Spin-On Engine Oil Filter",
    image: "/uploads/parts/spin-on-engine-oil-filter.jpg"
  },
  {
    partNumber: "ENG-MER-27120",
    name: "Aluminum Coolant Thermostat Housing",
    image: "/uploads/parts/aluminum-coolant-thermostat-housing.jpg"
  },
  {
    partNumber: "ENG-HON-12341",
    name: "Valve Cover Gasket Set",
    image: "/uploads/parts/valve-cover-gasket-set.jpg"
  },
  {
    partNumber: "ENG-CON-6PK18",
    name: "Serpentine Drive Belt (6PK-1840)",
    image: "/uploads/parts/serpentine-drive-belt-6pk1840.jpg"
  },
  {
    partNumber: "ENG-TOY-12305",
    name: "Hydraulic Engine Mount (Right Side)",
    image: "/uploads/parts/hydraulic-engine-mount-right.jpg"
  },
  {
    partNumber: "ENG-GAT-TCK32",
    name: "Timing Belt & Tensioner Kit",
    image: "/uploads/parts/timing-belt-tensioner-kit.jpg"
  },
  {
    partNumber: "ENG-NGK-93175",
    name: "Iridium IX Spark Plug (Set of 4)",
    image: "/uploads/parts/iridium-spark-plugs-set4.jpg"
  },
  {
    partNumber: "BRK-NIS-41120",
    name: "Brake Caliper Rebuild Seal Kit",
    image: "/uploads/parts/brake-caliper-rebuild-seal-kit.jpg"
  },
  {
    partNumber: "BRK-BMW-34216",
    name: "Performance Slotted Brake Pad Set (Rear)",
    image: "/uploads/parts/performance-slotted-brake-pads-rear.jpg"
  },
  {
    partNumber: "BRK-HYU-59810",
    name: "ABS Wheel Speed Sensor (Front Left)",
    image: "/uploads/parts/abs-wheel-speed-sensor-front-left.jpg"
  },
  {
    partNumber: "BRK-SUZ-53200",
    name: "Rear Drum Brake Shoe Kit",
    image: "/uploads/parts/rear-drum-brake-shoe-kit.jpg"
  },
  {
    partNumber: "BRK-HON-45251",
    name: "Ventilated Front Brake Rotor (Pair)",
    image: "/uploads/parts/ventilated-front-brake-rotor-pair.jpg"
  },
  {
    partNumber: "BRK-TOY-04465",
    name: "Front Ceramic Brake Pad Set",
    image: "/uploads/parts/front-ceramic-brake-pad-set.jpg"
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

    for (const item of partImageMapBatch3) {
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

    console.log("\nAll 13 batch 3 parts have been updated with their cropped pictures in MongoDB Atlas!");
    process.exit(0);
  } catch (err) {
    console.error("Error updating part images:", err);
    process.exit(1);
  }
}

run();

