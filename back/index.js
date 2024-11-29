const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors'); // Importer cors
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const projectRoutes = require('./routes/projectRoutes');
const collaborationRoutes = require('./routes/collaborationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const tagRoutes = require('./routes/tagRoutes'); // Tag routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Activer CORS

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api', collaborationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/tags', tagRoutes); // Tag routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
