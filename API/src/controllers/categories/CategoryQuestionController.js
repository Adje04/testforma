import CategoryQuestion from "../../models/CategoryQuestion.js"


export const getAllCategoryQuestion = async (req, res) => {

    try {
        const categories = await CategoryQuestion.find({});

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


export const createCategoryQuestion = async (req, res) => {

    try {

        const { name, description } = req.body

        const categoryQuestion = new CategoryQuestion({ name, description })
        const savedCategory = await categoryQuestion.save();

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

export const updateCategoryQuestion = async (req, res) => {

    const { id } = req.params;

    const { name, description } = req.body

    const categoryQuestion = await CategoryQuestion.findById(id)

    try {

        if (!categoryQuestion) {
            return res.status(404).json({ success: false, message: 'Catégorie non trouvée' });
        }

        const updateCategory = await CategoryQuestion.findByIdAndUpdate(
            id,
            {
                name: name || categoryQuestion.name,
                description: description || categoryQuestion.description
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

export const deleteCategoryQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const categoryQuestion = await CategoryQuestion.findByIdAndDelete(id);

        if (!categoryQuestion)
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


