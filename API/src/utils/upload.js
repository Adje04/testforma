import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const createDirectory = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Génère un nom de fichier sûr : seule l'extension vient du fichier original,
const uniqueFilename = (file) => {
    const ext = path.extname(file.originalname).toLowerCase();
    return `${Date.now()}_${crypto.randomBytes(8).toString('hex')}${ext}`;
};

// Configuration du stockage pour Multer
const chatFileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../upload/chats");
    createDirectory(uploadPath); // Ensure the folder exists
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, uniqueFilename(file));
  },
});


const chatFileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|pdf|docx|pptx|zip/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb('format de fichier invalide. seuls les formats ZIP, JPEG, PNG, PDF, TXT, DOCX, PPTX sont autorisés.');
};

 export const chatFile = multer({ 
  storage: chatFileStorage, 
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: chatFileFilter
});

 
// multer resource storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../upload/resource");
    createDirectory(uploadPath); // Ensure the folder exists
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, uniqueFilename(file));
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const fileTypes = /zip|jpeg|jpg|png|svg|webp|pdf|txt|docx|pptx/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
      return cb(null, true);
    } else {
      return cb(new Error("format de fichier invalide. seuls les formats ZIP, JPEG, PNG, PDF, TXT, DOCX, PPTX sont autorisés."));
    }
  },
});
















