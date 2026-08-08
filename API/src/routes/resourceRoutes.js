import express from 'express';
import { createResource, downloadResource, getAllResources } from '../controllers/ResourceController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { upload } from "../utils/upload.js";

const router = express.Router();

//multer methode
router.post("/upload", verifyToken, upload.fields([{ name: "cover", maxCount: 1 }, { name: "resource", maxCount: 1 }]), createResource);

router.get("/resources", getAllResources)

router.get("/download/:resourceId", verifyToken, downloadResource);

export default router;






















