import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import path from 'path';
import connectToDatabase from './src/config/dbConfig.js';
import authRoutes from './src/routes/authRoutes.js';
import categoryQuestionRoutes from './src/routes/categoryQuestionRoutes.js'
import questionRoutes from './src/routes/questionRoutes.js';
import responseRoutes from './src/routes/responseRoutes.js';
import resourceCategoryRoutes from './src/routes/resourceCategoryRoutes.js'
import resourceRoutes from './src/routes/resourceRoutes.js';
import communityRoutes from './src/routes/communityRoutes.js';
import messageRoutes from './src/routes/messageRoutes.js';
import profileRoutes from './src/routes/profileRoutes.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import morgan from 'morgan';
import http from 'http';
import { initializeSocket } from './src/socket/socketConfig.js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express()
const server = http.createServer(app);

// Initialiser Socket.IO
const io = initializeSocket(server);
app.set('io', io);

app.use(helmet()); // en-têtes de sécurité HTTP standards (XSS, sniffing, clickjacking...)

// CORS piloté par variable d'environnement, plus jamais en dur dans le code
// CORS_ORIGINS dans .env, ex: "http://localhost:5173,https://foruma.app"
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',');

app.use(cors({
    origin: allowedOrigins,
    credentials: true, // indispensable pour que le cookie refreshToken soit envoyé/reçu
}));

app.use(cookieParser()); // nécessaire pour lire req.cookies.refreshToken
app.use(express.json());
app.use(morgan("dev"))

app.use('/resource', express.static(path.join(__dirname, "/src/upload/resource")));

app.use("/avatars", express.static(path.join(__dirname, "src/upload/avatars")));

app.use('/chats', express.static(path.join(__dirname, "src/upload/chats")));

// Routes
app.use('/api/v1.0.0/', authRoutes);
app.use('/api/v1.0.0/', categoryQuestionRoutes)
app.use('/api/v1.0.0/', questionRoutes);
app.use('/api/v1.0.0/', responseRoutes);
app.use('/api/v1.0.0/', resourceCategoryRoutes);
app.use('/api/v1.0.0/', resourceRoutes);
app.use('/api/v1.0.0/', communityRoutes);
app.use('/api/v1.0.0/', messageRoutes);
app.use('/api/v1.0.0/', profileRoutes);
//connexion à la db
connectToDatabase();


// Lancement du serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

