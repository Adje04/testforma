import { log } from 'console';
import CommunityService from '../../services/Community/CommunityService.js';
import { validationResult } from 'express-validator';
import path from 'path';

export const index = async (req, res) => {
    try {
        const communities = await CommunityService.getAllCommunities();
        return res.status(200).json({ success: true, data: communities, message: 'Tous les communautés sont récupérées avec succès' });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

export const getCommunityByUser = async (req, res) => {
    try {
        const communities = await CommunityService.getCommunityByUser(req.user.id);
        return res.status(200).json({ success: true, data: communities, message: 'voici les communautés où vous êtes membres' });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};


export const registerCommunity = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Vous devez vous connecter' });
    }

    const { name, description, engineeringfield } = req.body;
    const avatar = req.file ? req.file.path : null; 

    const data = {
        name,
        description,
        engineeringfield,
        avatar,
        user_id: req.user.id
    };

    try {
        const community = await CommunityService.createCommunity(data, req.user.id);
        return res.status(201).json({ success: true, data: community, message: 'Votre communauté est créée' });
    } catch (err) {
      
        return res.status(500).json({ success: false, error: err.message });
    }
};


export const addMember = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    const { communityId } = req.params;

    try {
        const community = await CommunityService.addMember(communityId, email);

        if (!community) {
            // await CommunityService.sendInvitation(email, communityId); 
            return res.status(201).json({ success: false, message: 'pas encore inscit; une invitation vous aété envoyé' });
        }

        if (community.memberExist) {
            return res.status(409).json({ success: false, message: 'cet email est déja utilisé' });
        }

        return res.status(201).json({ success: true, data: community, message: 'membre ajouté avec succès' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

export const joinCommunity = async (req, res) => {
    try {
        const { communityId } = req.params;
        const userId = req.user.id; 

        const result = await CommunityService.addMemberByUserId(communityId, userId);
        console.log(result);
        if (result.memberExist) {
            return res.status(409).json({ success: false, message: 'Vous êtes déjà membre de cette communauté' });
        }

        return res.status(200).json({ success: true, data: result.community, message: 'Vous avez rejoint la communauté avec succès' });

    } catch (err) {
        
        return res.status(500).json({ success: false, error: err.message });
    }
};