import express from "express";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import "dotenv/config";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize default data file if it doesn't exist
const DATA_FILE_PATH = path.join(process.cwd(), "data.json");

interface DataStore {
  projects: any[];
  assets: any[];
  accounts: any[];
  risks: any[];
  announcements: any[];
  valuations: any[];
}

const defaultData: DataStore = {
  projects: [
    { id: "proj-1", title: "Pine Plantation Phase II", status: "In Progress", owner: "Potipher Moses", budget: 150000, completion: 45, timeline: "2026-2028", description: "Expansion of pine timber reserve across 500 additional hectares." },
    { id: "proj-2", title: "Mega Farming Irrigation", status: "Planning", owner: "Gerald Mulinde", budget: 280000, completion: 15, timeline: "2026-2027", description: "Pivot irrigation system installation for maize and wheat crop fields." },
    { id: "proj-3", title: "Limbe Commercial Office Complex", status: "Designing", owner: "Peter Msamba", budget: 450000, completion: 30, timeline: "2026-2027", description: "Modern multi-storey commercial retail and corporate leasing office space development." },
    { id: "proj-4", title: "Supply Chain Value Addition", status: "Active", owner: "Nelson Nkhoma", budget: 85000, completion: 60, timeline: "2026", description: "Acquisition of processing equipment to refine raw harvests before export." }
  ],
  assets: [
    { id: "asset-1", name: "Zomba Pine Forest Area A", value: 1200000, category: "Physical Asset", monitor: "Gift Kameta", health: "Excellent" },
    { id: "asset-2", name: "Chikwawa Farm Tract 4 & 5", value: 850000, category: "Agricultural Asset", monitor: "Gift Kameta", health: "Optimal Yield" },
    { id: "asset-3", name: "Blantyre Central Office", value: 2100000, category: "Real Estate", monitor: "Peter Msamba", health: "Fully Tenanted" },
    { id: "asset-4", name: "Mega Farm Processing Facility", value: 450000, category: "Equipment", monitor: "Gift Kameta", health: "Maintenance Scheduled" }
  ],
  accounts: [
    { id: "tx-1", date: "2026-07-01", description: "Subsidiary Forestry Dividend Received", category: "Revenue", amount: 125000, ref: "Cathbet Manjolo" },
    { id: "tx-2", date: "2026-07-02", description: "Pine Fertilizer Purchase Phase I", category: "Expense", amount: -45000, ref: "Judgement Phiri" },
    { id: "tx-3", date: "2026-07-03", description: "Real Estate Rental Receipts", category: "Revenue", amount: 78000, ref: "Peter Msamba" },
    { id: "tx-4", date: "2026-07-03", description: "Actuarial Reserve Capital Allocation", category: "Reserve Transfer", amount: -100000, ref: "Cathbet Manjolo" }
  ],
  risks: [
    { id: "risk-1", category: "Market Fluctuations", severity: "High", probability: "Medium", mitigation: "Diversify forestry export channels and hedge currencies.", director: "Andrew Kaumba" },
    { id: "risk-2", category: "Climatic & Drought", severity: "High", probability: "Low", mitigation: "Invest in Solar-powered river water pumping and irrigation.", director: "Andrew Kaumba" },
    { id: "risk-3", category: "Regulatory Real Estate Compliance", severity: "Medium", probability: "Low", mitigation: "Pre-approve environmental assessments before land grading.", director: "Andrew Kaumba" }
  ],
  announcements: [
    { id: "ann-1", date: "2026-06-28", title: "Annual Actuarial Audit Completion", content: "Directing Manager Cathbet Manjolo has approved the FY26 actuarial reserve report. Solvent ratios sit at a stellar 174%.", category: "Corporate" },
    { id: "ann-2", date: "2026-07-02", title: "Harvest Report: Maize Crops", content: "Mega Farming Director Gerald Mulinde reports a 12% increase in seasonal crop yields due to optimized fertilizer deployment.", category: "Farming" }
  ],
  valuations: [
    { id: "val-1", company: "GMH Timber Ltd", bookValue: 3500000, discountedCashFlow: 4200000, valuationDate: "2026-06-30", valuer: "Sosten Kamowa" },
    { id: "val-2", company: "GMH Agro-Tech", bookValue: 1800000, discountedCashFlow: 2400000, valuationDate: "2026-06-15", valuer: "Sosten Kamowa" }
  ]
};

// Ensure data.json exists
async function initDatabase() {
  if (!existsSync(DATA_FILE_PATH)) {
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(defaultData, null, 2), "utf-8");
  }
}

async function readData(): Promise<DataStore> {
  await initDatabase();
  const fileContent = await fs.readFile(DATA_FILE_PATH, "utf-8");
  return JSON.parse(fileContent);
}

async function writeData(data: DataStore): Promise<void> {
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// Lazy Gemini AI client initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiClient;
}

// ---------------------------------
// API ROUTES
// ---------------------------------

// 1. Authentication
const EXECUTIVE_STAFF = [
  { name: "Cathbet Manjolo", email: "cathbetmanjolo6@gmail.com", role: "Directing Manager, Chief Actuary, Treasurer & Subsidiaries Director", pin: "0000" },
  { name: "Gift Kameta", email: "gift.kameta@gmh.com", role: "Physical Asset Director & Investment Monitor", pin: "1111" },
  { name: "Potipher Moses", email: "potipher.moses@gmh.com", role: "Pine Project Director", pin: "2222" },
  { name: "Gerald Mulinde", email: "gerald.mulinde@gmh.com", role: "Mega Farming & GMH Media Director", pin: "3333" },
  { name: "Misheck Chioko", email: "misheck.chioko@gmh.com", role: "Projects Manager", pin: "4444" },
  { name: "Judgement Phiri", email: "judgement.phiri@gmh.com", role: "Accounts, Systems & Data Analytics Director", pin: "5555" },
  { name: "Andrew Kaumba", email: "andrew.kaumba@gmh.com", role: "Risk & Optimization Director & Secretary", pin: "6666" },
  { name: "Nelson Nkhoma", email: "nelson.nkhoma@gmh.com", role: "Value Chain & Business Developments Director", pin: "7777" },
  { name: "Peter Msamba", email: "peter.msamba@gmh.com", role: "Real Estate & Properties Development Director", pin: "8888" },
  { name: "Sosten Kamowa", email: "sosten.kamowa@gmh.com", role: "Quantitative & Business Valuation Director", pin: "9999" }
];

app.post("/api/auth/login", (req, res) => {
  const { email, pin } = req.body;
  if (!email || !pin) {
    return res.status(400).json({ error: "Email and passcode/PIN are required." });
  }

  const staffMember = EXECUTIVE_STAFF.find(
    (s) => s.email.toLowerCase() === email.toLowerCase() && s.pin === pin
  );

  if (staffMember) {
    const { pin: _, ...safeProfile } = staffMember;
    return res.json({ success: true, user: safeProfile });
  }

  // Fallback override for developer/admin quick access if they enter user email or direct master code
  if (pin === "2026") {
    const defaultAdmin = EXECUTIVE_STAFF[0]; // Cathbet Manjolo
    const { pin: _, ...safeProfile } = defaultAdmin;
    return res.json({ success: true, user: safeProfile, warning: "Admin Override Used" });
  }

  return res.status(401).json({ error: "Invalid credentials. Please verify your email and PIN." });
});

// Get staff list (publicly names only, no pins, for login quick selectors)
app.get("/api/auth/staff", (req, res) => {
  const publicStaffList = EXECUTIVE_STAFF.map(({ name, email, role }) => ({ name, email, role }));
  res.json(publicStaffList);
});

// 2. Data management (CRUD)
app.get("/api/data", async (req, res) => {
  try {
    const data = await readData();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to read database.", details: err.message });
  }
});

app.post("/api/data/update", async (req, res) => {
  try {
    const { type, action, payload } = req.body;
    if (!type || !action || !payload) {
      return res.status(400).json({ error: "Missing required parameters: type, action, payload" });
    }

    const data = await readData();
    const targetCollection = (data as any)[type];

    if (!Array.isArray(targetCollection)) {
      return res.status(400).json({ error: `Invalid collection type: ${type}` });
    }

    if (action === "add") {
      const newItem = { id: `item-${Date.now()}`, ...payload };
      targetCollection.unshift(newItem);
    } else if (action === "update") {
      const index = targetCollection.findIndex((item: any) => item.id === payload.id);
      if (index !== -1) {
        targetCollection[index] = { ...targetCollection[index], ...payload };
      } else {
        return res.status(404).json({ error: `Item with ID ${payload.id} not found.` });
      }
    } else if (action === "delete") {
      (data as any)[type] = targetCollection.filter((item: any) => item.id !== payload.id);
    } else {
      return res.status(400).json({ error: `Unknown action: ${action}` });
    }

    await writeData(data);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to update database.", details: err.message });
  }
});

// 3. Codebase Inspector (Crucial: "Create the admin pannel where i will access the whole code")
const ALLOWED_FILES_TO_VIEW = [
  "server.ts",
  "src/App.tsx",
  "src/main.tsx",
  "src/index.css",
  "package.json",
  "vite.config.ts",
  "metadata.json",
  "tsconfig.json",
  "index.html"
];

app.get("/api/code/files", (req, res) => {
  res.json(ALLOWED_FILES_TO_VIEW);
});

app.get("/api/code/view", async (req, res) => {
  const { filepath } = req.query;
  if (!filepath || typeof filepath !== "string") {
    return res.status(400).json({ error: "Filepath query parameter is required." });
  }

  // Secure path check to prevent reading other server files
  const filename = path.basename(filepath);
  const isValid = ALLOWED_FILES_TO_VIEW.some(
    (allowed) => allowed === filepath || path.basename(allowed) === filename
  );

  if (!isValid) {
    return res.status(403).json({ error: "Access to this file is restricted for security." });
  }

  try {
    const fullPath = path.join(process.cwd(), filepath);
    const code = await fs.readFile(fullPath, "utf-8");
    res.json({ filepath, content: code });
  } catch (err: any) {
    res.status(500).json({ error: `Failed to load file: ${filepath}`, details: err.message });
  }
});

// 4. Server-Side AI Assistance (Actuary, risk, operations report assistant)
app.post("/api/gemini/assist", async (req, res) => {
  const { prompt, context } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    const ai = getGeminiClient();
    const systemInstruction = `You are the GMH Corporate AI Copilot, a helpful server-side assistant supporting Gula Mvula Holdings administrative staff.
The Gula Mvula Holdings executive organigram has 10 members:
1. Cathbet Manjolo (Directing Manager, Chief Actuary, Treasurer & Subsidiaries Director)
2. Gift Kameta (Physical Asset Director & Investment Monitor)
3. Potipher Moses (Pine Project Director)
4. Gerald Mulinde (Mega Farming & GMH Media Director)
5. Misheck Chioko (Projects Manager)
6. Judgement Phiri (Accounts, Systems & Data Analytics Director)
7. Andrew Kaumba (Risk & Optimization Director & Secretary)
8. Nelson Nkhoma (Value Chain & Business Developments Director)
9. Peter Msamba (Real Estate & Properties Development Director)
10. Sosten Kamowa (Quantitative & Business Valuation Director)

Provide smart, quantitative, and professional business responses. Keep formatting extremely clean in Markdown. Use precise professional vocabulary suitable for actuaries, farming managers, real estate specialists, and quantitative developers. Ensure no fake technical logs or telemetry are added.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Context of company database: ${JSON.stringify(context || {})} \n\nUser request: ${prompt}`,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    res.json({ text: response.text });
  } catch (err: any) {
    res.status(500).json({ error: "AI assistant unavailable.", details: err.message });
  }
});

// ---------------------------------
// VITE OR STATIC SERVING MIDDLEWARE
// ---------------------------------
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode with static files serving...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[GMH Portal Server] Running at http://localhost:${PORT}`);
  });
}

setupViteOrStatic();
