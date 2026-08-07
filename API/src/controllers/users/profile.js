import User from "../../models/User.js";



export const updateProfile = async (req, res) => {
    const { name } = req.body;
    const avatar = req.file ? req.file.path : null; // Vérifie si un avatar est uploadé

    try {
        const userId = req.user.id; // Assurez-vous que l'ID de l'utilisateur est récupéré depuis le token

        // Trouver l'utilisateur et mettre à jour son profil
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        user.name = name || user.name; // Met à jour le nom s'il est fourni
        if (avatar) {
            user.avatar = avatar; // Met à jour l'avatar s'il est fourni
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profil mis à jour avec succès',
            data: {
                name: user.name,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        console.log(error)
        // res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};



// const updateUser = await User.findByIdAndUpdate(
//     userId,
//     {
//         name: name || user.name,
//         avatar: avatar || user.avatar
//     },
//     { new: true, runValidators: true }
// );


export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select('name email avatar');
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        res.status(200).json({
            success: true,
            data: [user],
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        res.status(200).json({ success: true, message: 'Compte supprimé avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};
