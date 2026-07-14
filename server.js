const express = require('express');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/analyze', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file uploaded' });
        }

        console.log("1. File received! Size:", req.file.size, "bytes");

        const prompt = `
        You are an expert ATS (Applicant Tracking System). Analyze the attached resume.
        Provide a JSON response matching this exact structure:
        {
          "atsScore": 85,
          "skills": ["C++", "Algorithms"],
          "missingKeywords": ["System Design"],
          "grammarMistakes": [],
          "suggestions": ["Add metrics to impact statements."]
        }`;

        const base64pdf = req.file.buffer.toString('base64');
        console.log("2. Converted to Base64. Sending directly to Gemini REST API...");

        const apiKey = process.env.GEMINI_API_KEY;
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(geminiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                mimeType: "application/pdf",
                                data: base64pdf
                            }
                        }
                    ]
                }],
                generationConfig: {
                    responseMimeType: "application/json"
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("❌ Gemini API Error Details:", JSON.stringify(data, null, 2));
            return res.status(500).json({ error: 'Gemini API rejected the request.' });
        }

        console.log("3. Success! AI responded. Sending JSON back to frontend.");
        
        const rawJsonString = data.candidates[0].content.parts[0].text;
        res.json(JSON.parse(rawJsonString));

    } catch (error) {
        console.error("❌ Fatal Backend Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(5000, () => console.log('🚀 Server active on port 5000'));