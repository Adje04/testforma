import Community from '../../models/Community.js';
import User from '../../models/User.js';
import { notifyCommunityAdded } from '../NotificationService.js';

function isCreatorOrMember(community, userId) {
    const isCreator = community.user_id.toString() === userId;
    const isMember = community.members.some(m => m.user_id.toString() === userId);
    return isCreator || isMember;
}

export const getAllCommunities = async () => {
    try {
        return await Community.find().populate('members.user_id');
    } catch (err) {
        throw new Error('Erreur lors de la récupération de toutes les communautés');
    }
};

export const getCommunityByUser = async (userId) => {
    try {
        return await Community.find({ 'members.user_id': userId });
    } catch (err) {
        throw new Error('Erreur lors de la recuperation de tes communautés');
    }
};

export const createCommunity = async (data, creatorId) => {
    try {
        const community = await Community.create(data);
        await addMemberByUserId(community._id, creatorId);
        return community;
    } catch (error) {
        throw new Error(`Erreur lors de la creation de la communauté: ${error.message}`);
    }
};

/*
* 
* Add a member to a community
* 
*/
export const addMember = async (communityId, email, requesterId, io) => {
    try {
        const community = await Community.findById(communityId);
        if (!community) throw new Error('Communauté non trouvée');

        if (!isCreatorOrMember(community, requesterId)) {
            const err = new Error('Vous devez être membre de cette communauté pour y ajouter quelqu\'un');
            err.statusCode = 403;
            throw err;
        }

        const user = await User.findOne({ email });
        if (!user) return false;

        const memberExists = community.members.some(member => member.user_id.equals(user._id));
        if (memberExists) return { memberExist: true };

        community.members.push({ user_id: user._id });
        await community.save();

        if (io) {
            await notifyCommunityAdded(io, {
                recipientId: user._id,
                communityName: community.name,
                communityId: community._id,
            });
        }

        return community;
    } catch (error) {
        throw error;
    }
};

export const addMemberByUserId = async (communityId, userId) => {
    try {
        const community = await Community.findById(communityId);
        const user = await User.findById(userId);

        if (!community) throw new Error('Communauté non trouvée');
        if (!user) throw new Error('Utilisateur non trouvé');

        const memberExists = community.members.some(member => member.user_id.equals(userId));
        if (memberExists) return { memberExist: true };

        community.members.push({ user_id: userId });
        await community.save();

        return { community };
    } catch (error) {
        throw new Error(`Erreur lors de l'ajout du membre: ${error.message}`);
    }
};

const CommunityService = {
    getAllCommunities,
    getCommunityByUser,
    createCommunity,
    addMember,
    addMemberByUserId
};

export default CommunityService;