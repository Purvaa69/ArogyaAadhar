import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

// ─── Multer setup for image uploads ─────────────────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  },
});

// Serve uploaded images statically
app.use('/uploads', express.static(uploadsDir));

// ─── In-memory posts store ──────────────────────────────────────────────────
let posts = [];
let nextId = 100;

// ─── Gemini AI setup ────────────────────────────────────────────────────────
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: GEMINI_MODEL });
}

/** Demo / offline analysis when no key or Gemini request fails (invalid key, quota, network, etc.) */
function buildMockAnalysis(imageFilename) {
  return {
    description:
      'This screenshot appears to show a suspicious message requesting personal information including Aadhaar number and bank details. The sender impersonates a government health official and uses urgent language to pressure the victim into sharing sensitive data immediately.',
    category: 'WhatsApp',
    tags: ['Fake URL', 'Asks for Aadhaar', 'OTP demand', 'Sarkari impersonation'],
    fraudMessage:
      '"Your ABHA card is being suspended. Send your Aadhaar and bank details immediately to avoid losing your health benefits."',
    ...(imageFilename ? { imageUrl: `/uploads/${imageFilename}` } : {}),
  };
}

// ─── POST /api/analyze-image ────────────────────────────────────────────────
// Accepts an uploaded image, sends it to Gemini for VLM analysis,
// returns auto-generated description and category.
app.post('/api/analyze-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const model = getGeminiModel();

    if (!model) {
      console.log('⚠️  No GEMINI_API_KEY set — returning mock AI analysis');
      return res.json(buildMockAnalysis(req.file.filename));
    }

    // Read the uploaded image and convert to base64
    const imagePath = req.file.path;
    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString('base64');
    const mimeType = req.file.mimetype;

    const prompt = `You are an AI fraud analyst for Indian healthcare schemes (ABHA, PM-JAY, Ayushman Bharat).

Analyze this screenshot of a potential scam/fraud attempt and respond in JSON format with these fields:
- "description": A 2-3 sentence description of the scam in plain English. Explain what the scammer is trying to do.
- "category": One of exactly these values: "WhatsApp", "Call", "Fake Link", "SMS", "Email", "In Person"
- "tags": An array of applicable red-flag tags from this list: ["Fake URL", "Asks for money", "OTP demand", "Impersonation", "Asks for Aadhaar", "Fake helpline", "Sarkari impersonation", "Phishing", "Fake agent", "Door-to-door fraud", "Identity theft", "Urgent tone"]
- "fraudMessage": The exact fraudulent message text visible in the screenshot, wrapped in quotes. If not clearly visible, generate a representative version based on what you see.

Respond ONLY with valid JSON, no markdown fences.`;

    let responseText;
    try {
      const result = await model.generateContent([
        { text: prompt },
        {
          inlineData: {
            mimeType,
            data: base64Image,
          },
        },
      ]);
      responseText = result.response.text();
    } catch (geminiErr) {
      console.error('Gemini request failed — using mock analysis:', geminiErr?.message || geminiErr);
      return res.json(buildMockAnalysis(req.file.filename));
    }

    // Try to parse JSON from the response
    let parsed;
    try {
      // Strip markdown code fences if present
      const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('Failed to parse Gemini response as JSON:', responseText);
      parsed = {
        description: responseText.slice(0, 300),
        category: 'WhatsApp',
        tags: ['Phishing'],
        fraudMessage: '"Suspicious activity detected in screenshot."',
      };
    }

    res.json({
      description: parsed.description || 'Potential scam detected in the uploaded screenshot.',
      category: parsed.category || 'WhatsApp',
      tags: parsed.tags || ['Phishing'],
      fraudMessage: parsed.fraudMessage || '"Suspicious message detected."',
      imageUrl: `/uploads/${req.file.filename}`,
    });
  } catch (err) {
    console.error('Error analyzing image:', err);
    if (req.file?.filename) {
      return res.json(buildMockAnalysis(req.file.filename));
    }
    res.status(500).json({ error: 'Failed to analyze image. Please try again.' });
  }
});

// ─── POST /api/posts ────────────────────────────────────────────────────────
// Create a new scam report post
app.post('/api/posts', (req, res) => {
  try {
    const { type, location, story, fraudMessage, tags, imageUrl, state, district, scheme } = req.body;

    const newPost = {
      id: nextId++,
      type: type || 'WhatsApp',
      time: 'Just now',
      location: location || district || 'Unknown',
      upvotes: 0,
      likes: 0,
      story: story || 'A community member reported a scam.',
      fraudMessage: fraudMessage || '"Suspicious activity reported."',
      tags: tags || ['Reported'],
      imageUrl: imageUrl || null,
      state: state || '',
      scheme: scheme || '',
      createdAt: new Date().toISOString(),
    };

    posts.unshift(newPost); // Add to front
    res.json({ success: true, post: newPost });
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// ─── GET /api/posts ─────────────────────────────────────────────────────────
// Returns all user-posted scam reports, sorted by score
app.get('/api/posts', (req, res) => {
  const scored = posts.map((p) => ({
    ...p,
    score: p.upvotes + p.likes * 2,
  }));
  scored.sort((a, b) => b.score - a.score);
  res.json(scored);
});

// ─── POST /api/posts/:id/like ───────────────────────────────────────────────
app.post('/api/posts/:id/like', (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find((p) => p.id === id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  post.likes++;
  res.json({ success: true, likes: post.likes });
});

// ─── POST /api/posts/:id/upvote ─────────────────────────────────────────────
app.post('/api/posts/:id/upvote', (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find((p) => p.id === id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  post.upvotes++;
  res.json({ success: true, upvotes: post.upvotes });
});

// ─── Health check ───────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', posts: posts.length });
});

// Multer / upload errors (wrong file type, size) → JSON instead of HTML error page
app.use((err, req, res, next) => {
  if (!err) return next();
  if (err.message === 'Only image files are allowed' || err.name === 'MulterError') {
    return res.status(400).json({ error: err.message || 'Invalid upload' });
  }
  next(err);
});

// ─── Start server ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 ArogyaAadhar Backend running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   POST /api/analyze-image  — Upload & AI analyze scam screenshot`);
  console.log(`   POST /api/posts          — Create new scam report`);
  console.log(`   GET  /api/posts          — Get all scam reports`);
  console.log(`   POST /api/posts/:id/like — Like a post`);
  console.log(`   POST /api/posts/:id/upvote — Upvote a post`);
  console.log(`   Model: ${GEMINI_MODEL}`);
  if (!process.env.GEMINI_API_KEY) {
    console.log(`\n⚠️  GEMINI_API_KEY not set in .env — AI analysis will return mock data`);
  } else {
    console.log(`\n✅ Gemini API key configured (invalid/expired keys fall back to mock analysis)`);
  }
});
