const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const Part = mongoose.model(
    "Part",
    new mongoose.Schema({ name: String, partNumber: String, images: [String] }, { strict: false })
  );

  const parts = await Part.find(
    { "images.0": { $regex: "^/uploads/parts/" } },
    { name: 1, partNumber: 1, images: 1 }
  ).lean();

  console.log(`Total parts with real cropped pictures: ${parts.length}`);
  parts.forEach((p) => {
    console.log(`${p.partNumber.padEnd(16)} | ${p.name.padEnd(52)} -> ${p.images[0]}`);
  });
  process.exit(0);
})();

