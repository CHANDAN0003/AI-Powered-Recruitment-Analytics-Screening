const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Demo users
const users = [
  { email: 'candidate@demo.com', password: 'demo123', role: 'candidate', name: 'Demo Candidate' },
  { email: 'hr@demo.com', password: 'demo123', role: 'hr', name: 'Demo HR Manager' }
];

// Demo jobs
const jobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    description: 'We are looking for a passionate Frontend Developer to join our team. You will be responsible for building user-facing features using modern JavaScript frameworks.',
    skills: ['JavaScript', 'React', 'CSS', 'HTML'],
    salary: '$80,000 - $120,000',
    type: 'Full-time',
    experience: 'Mid Level'
  },
  // ... add more jobs as needed
];

// --- API Endpoints ---

// Login
app.post('/api/login', (req, res) => {
  const { email, password, role } = req.body;
  const user = users.find(u => u.email === email && u.password === password && u.role === role);
  if (user) {
    res.json({
      success: true,
      user: { email: user.email, role: user.role, name: user.name },
      token: 'demo_token_' + Date.now()
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Get jobs
app.get('/api/jobs', (req, res) => {
  res.json(jobs);
});

// Apply for a job
app.post('/api/apply', (req, res) => {
  // In a real app, you'd save the application to a database
  res.json({ success: true, message: 'Application submitted successfully!' });
});

// Chatbot
app.post('/api/chatbot', (req, res) => {
  const { message } = req.body;
  // Simple demo response
  res.json({ response: `You said: "${message}". This is a demo chatbot response.` });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend API running at http://localhost:${PORT}`);
});

// Example fetch calls (for reference only, not executable in Node.js server file)
// fetch('http://localhost:5000/api/login', { ... })
// fetch('http://localhost:5000/api/jobs', { ... })
// fetch('http://localhost:5000/api/apply', { ... })
// fetch('http://localhost:5000/api/chatbot', { ... })

fetch('http://localhost:5000/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: 'password' })
})
.then(response => response.json())
.then(data => {
  console.log(data);
})
.catch(error => {
  console.error('Error:', error);
});