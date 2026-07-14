AI Resume Analyzer ⭐

A full-stack web application that allows users to upload their PDF resumes and receive an instant Applicant Tracking System (ATS) compatibility score. The application utilizes Google's Gemini 3.5 Flash model with native PDF vision capabilities to extract skills, identify missing keywords, and suggest actionable grammar and formatting improvements.

Features
PDF Vision Parsing: Bypasses buggy text-extraction libraries by sending raw Base64 encoded PDFs directly to the AI model.
Job Description Matching: Users can paste a target job description to receive a highly customized ATS score and tailored resume feedback.
In-Memory File Handling: Uses Multer to process incoming file streams directly in RAM, optimizing server performance and eliminating unnecessary disk writes.
Structured JSON Responses: Forces the AI to return strict JSON data structures, seamlessly mapping the output to the frontend UI dashboard.

Tech Stack
Frontend: HTML5, CSS3, Vanilla JavaScript (DOM Manipulation, Fetch API)
Backend: Node.js, Express.js
Middleware: Multer (Multi-part form data handling), CORS
AI Integration: Google Gemini REST API (gemini-3.5-flash)

Setup & Installation

2. Set up the backend
Navigate to the backend directory and install the required dependencies:
bash:
cd resume-backend
npm install express multer cors dotenv

3. Configure Environment Variables
Create a .env file inside the resume-backend folder and add your Google Gemini API key: 
GEMINI_API_KEY= Your Api key
PORT=5000

4. Run the Application
Start the Node.js server:
bash
node server.js

Once the server is running on http://localhost:5000, open the resume.html file in any modern web browser to use the application.

Upload Your resume and hit the analyse button, It will give all +ve and -ve of your resume
