import Resource from "../models/Resource.js";
import path from "path";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const createResource = async (req, res) => {
  try {
    const { title, description, category } = req.body;
  
    let cover = 'coverDefault.png';
    // pour un cover specifique est téléchargée, utiliser son chemin
    if (req.files && req.files.cover) {
      cover = req.files.cover[0]; 
    }
    //vverifie si les fichiers existe
    if (!req.files || !req.files.resource) {
      return res.status(400).json({ success: false, message: "le cover et le fichier de la ressource sont requis" });
    }

    const resource = req.files.resource[0];  

    const newResource = new Resource({
      title,
      description,
      cover: cover.path, 
      name:resource.originalname,
      type: path.extname(resource.originalname).slice(1), // récuperer le type de la ressource
      size: resource.size,
      path: resource.path,
      user_id: req.user.id, 
      category,
    });

     const createdResource = await newResource.save();
      res.status(201).json({ success: true, message: "Resource created successfully", data: createdResource });
  } catch (error) {
     res.status(500).json({  success: false, message: 'une erreur de source innatendue c\'est produite; veuillez réssayer plus tard' });
    
  }
};


export const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find({}).populate("user_id", "username").populate("category");
    if (!resources.length) {
      return res.status(404).json({
          success: false,
          message: "questions non trouvées",
      });
  }
    res.json({ success: true, message: "Resources récupérés avec succès", data: resources });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur serveur lors de la récupération des ressources" });
  }
}


export const downloadResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const resource = await Resource.findById(resourceId);

    if (!resource) {
      return res.status(404).json({ success: false, message: "Ressource non trouvée" });
    }

    const filePath = resource.path;
    const fileName = resource.name;

    // Fixer les bons en-têtes pour le téléchargement
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Utiliser 'res.download' pour envoyer le fichier
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Erreur lors du téléchargement de la ressource', err);
        return res.status(500).json({ success: false, message: "Erreur lors du téléchargement de la ressource" });
      }
    });

  } catch (error) {
    console.error('Erreur serveur lors de la récupération de la ressource', error);
    res.status(500).json({ success: false, message: "Erreur serveur lors de la récupération de la ressource" });
  }
};


