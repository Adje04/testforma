import dotenv from 'dotenv';
import mongoose from 'mongoose'


dotenv.config();

export default async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Connexion à la base de données réussie');
    } catch (error) {
        console.error('Erreur de connexion à la base de données', error);
    }
}

