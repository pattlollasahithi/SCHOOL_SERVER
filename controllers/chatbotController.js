import Groq from "groq-sdk";
import fs from 'fs/promises';
import path from 'path';
import logger from '../utils/logger.js';
import asyncHandler from '../middleware/asyncHandler.js';

const __dirname = path.resolve();
const guidelinesPath = path.join(__dirname, 'data', 'guidlines.txt');

// In-memory cache for school guidelines
let cachedGuidelines = null;

export const chatbotQuery = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ reply: "Message is required." });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ reply: "API key is not configured." });
  }

  // Load guidelines into memory once, async
  if (!cachedGuidelines) {
    try {
      cachedGuidelines = await fs.readFile(guidelinesPath, 'utf8');
      logger.info('Guidelines loaded into cache successfully.');
    } catch (err) {
      logger.error('Failed to read guidelines file:', err.message);
      return res.status(500).json({ reply: "Guidelines data not found on server." });
    }
  }

  try {
    const groq = new Groq({ apiKey });

    const systemInstruction = "You are a school assistant. Answer ONLY using provided context from guidlines.txt.\nDo not answer unrelated queries.\nDo not assume or generate new information.\nIf data is missing, ask user to contact the school.";
    
    const prompt = `Context (guidlines.txt):\n${cachedGuidelines}\n\nUser Query: ${message}\n\nFollow the instructions carefully. If the user query is completely unrelated to school or education, respond with: "I am designed to assist only with queries related to this school. Please ask a school-related question."\nIf no relevant data is found in context, respond with: "I couldn't find the requested information in our records. Please contact the school directly for more details."\nIf relevant, provide a clean, structured response.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
    });

    let reply = chatCompletion.choices[0]?.message?.content || "I couldn't process that request.";
    
    // Clean markdown formatting for consistent presentation
    reply = reply.replace(/\*\*/g, '').trim();

    return res.json({ reply });
  } catch (error) {
    logger.error("Chatbot API Error:", error.message);
    
    // Fallback for API limit or failure
    if (error.status === 429 || (error.message && error.message.includes("429"))) {
      return res.status(429).json({ reply: "I'm currently receiving too many questions. Please wait a moment and try again, or contact the school office." });
    }

    return res.status(500).json({ reply: "Oops, something went wrong on my end. Please try again or contact the school office." });
  }
});
