import Community from '../../models/Community.js';
import User from '../../models/User.js';
// import { sendInvitationEmail, notifyCommunityMembers, sendRegisterUserAddedEmail } from '../utils/mailer.js';

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
        await addMemberByUserId (community._id, creatorId);  // Ajouterle createur diretement comme membre
        return community;
    } catch (error) {
        throw new Error(`Erreur lors de la creation de la communauté: ${error.message}`);
    }
};


export const addMember = async (communityId, email) => {
    try {
        const community = await Community.findById(communityId);
        const user = await User.findOne({ email });

        if (!community) throw new Error('Communauté non trouvé');
        if (!user) return false;  

        const memberExists = community.members.some(member => member.user_id.equals(user._id));
        if (memberExists) return { memberExist: true };

        community.members.push({ user_id: user._id });
        await community.save();

        // await sendRegisterUserAddedEmail(community, user);
        // await notifyCommunityMembers(community, user);

        return community;
    } catch (error) {
        throw new Error(`Error adding member: ${error.message}`);
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

    
        // await notifyCommunityMembers(community, user);

        return { community };
    } catch (error) {
        throw new Error(`Erreur lors de l'ajout du membre: ${error.message}`);
    }
};



// export const sendInvitation = async (email, communityId) => {
//     await sendInvitationEmail(email, communityId);
// };

const CommunityService = {
    getAllCommunities,
    getCommunityByUser,
    createCommunity,
    addMember,
    addMemberByUserId
    // sendInvitation
};

export default CommunityService;

