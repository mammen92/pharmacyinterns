import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config(); // Load environment variables

// Initialize express
const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB
const mongoURI =
  process.env.MONGO_URI || "mongodb+srv://mammen123:Cza5eHis8Cru4mRn@cluster0.y3mnd.mongodb.net/";

mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1); // Exit the process with failure
  });

// Define the schema for the disease
const diseaseSchema = new mongoose.Schema({
  Disease: String,
  AssociatedSystem: [String],
  Description: String,
  Medication: [
    {
      GenericName: String,
      Brands: [
        {
          BrandName: String,
          Image: String,
        },
        {
          BrandName: String,
          Image: String,
        },
      ],
      DoseAndDirection: String,
      Pregnancy: Boolean,
      Breastfeeding: Boolean,
      Age: String,
    },
  ],
  NonPharmacologicalMeasures: String,
  ReferralPoints: String,
});

const Disease = mongoose.model("Disease", diseaseSchema);

// Get a disease by name
app.get("/api/diseases/:name", async (req, res) => {
  try {
    const diseaseName = req.params.name;
    console.log(diseaseName);
    const disease = await Disease.findOne({ Disease: { $regex: new RegExp(diseaseName, "i") } });
    if (!disease) return res.status(404).json({ message: "Disease not found" });
    res.json(disease);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/diseases", async (req, res) => {
  try {
    const diseases = await Disease.find({},{Disease:1});
    res.json(diseases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'OTC.html'));
});

app.get('/edit', (req, res) => {
  res.sendFile(path.join(__dirname, 'OTCEdit.html'));
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})

export default app; // Export the app for testing or further use
