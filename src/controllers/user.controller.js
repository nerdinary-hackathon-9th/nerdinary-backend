import { successHandler } from '../middleware/responseHandler.js';
import { userCheckNickname, userJoinChallenge, showUserChallenges } from '../services/user.service.js'

export const handleCheckNickname = async (req, res, next) => {
    try {
        const nickname = req.query.nickname;
        const isAvailable = await userCheckNickname(nickname);
        return successHandler(res, '닉네임 확인 성공', { isAvailable });
    
    } catch (err) {
        next(err);
    }
};

export const handleJoinChallenge = async (req,res,next) => {
    try{
        const challengeId = req.body.challengeId;
        const userId = req.body.userId;
        const userChallenge = await userJoinChallenge(userId, challengeId);
        return successHandler(res, '챌린지 참가 성공', { userChallenge });

    }catch (err) {
        next(err);
    }
}

export const handleGetMyChallenges = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.userId, 10);
        const userChallenges = await showUserChallenges(userId);
       return successHandler(res, '사용자 챌린지 조회 성공', { userChallenges });

    }catch (err) {
        next(err);
    }
}
