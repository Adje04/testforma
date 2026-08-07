import ResourceCategory from "../../models/ResourceCategory.js";

export const getAllResourceCategory = async (req, res) => {

    try {
        const categories = await ResourceCategory.find({});

        if (!categories.length) {
            return res.status(404).json({
                success: false,
                message: "Aucune categorie question trouvée",
            });
        }
        res.status(200).json({ 
            success: true, 
            message: "Catégories récupérées avec succès",
            data: categories });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "une erreur de source inattendue est survenue",
            error: error.message
        });
    }

}

export const createResourceCategory = async (req, res) => {

    try {

        const { name, description } = req.body

        const resourceCategory = new ResourceCategory({name, description})
        const savedCategory = await resourceCategory.save();

        res.status(201).json({ success: true, message: "catégorie créé avec succès", data: savedCategory });

    } catch (error) {

        res.status(500)
            .json({
                success: false,
                message: "une erreur de source inattendue s'est produite",
                error: error.message
            });
    }
}

export const updateResourceCategory = async (req, res) => {

    const { id } = req.params;

    const { name, description } = req.body

    const resourceCategory = await ResourceCategory.findById(id)

    try {

        if (!resourceCategory) {
            return res.status(404).json({ success: false, message: 'Catégorie non trouvée' });
        }

        const updateCategory = await ResourceCategory.findByIdAndUpdate(
            id,
            {
                name: name || resourceCategory.name,
                description: description || resourceCategory.description
            },
            { new: true, runValidators: true }
        );
        res.status(200).json({
            success: true,
            message: "catégorie modifiée avec succès",
            data: updateCategory
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "une erreur de source inattendue s'est produite",
            error: error.message
        });
    }
}

export const deleteResourceCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const resourceCategory = await ResourceCategory.findByIdAndDelete(id);

        if (!resourceCategory)
            return res.status(404).json({
                success: false,
                message: "Catégorie non trouvé",
            });

        res.status(200).json({
            success: true,
            message: "Catégorie suppriméee avec succès !",
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "une ereur de source inatendue s'est produite",
        });
    }
}


