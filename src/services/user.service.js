import { ExistsError, NotFoundError, NotFoundUserError } from '../errors.js';
import { getUser, getUserById, getChallenge, createUserChallenge, isAlreadyJoin, getMyChallenges } from '../repositories/user.repository.js';

export const userCheckNickname = async (nickname) => {
    const user = await getUser(nickname);
    if(user){
        return false;
    }
    return true;
}

export const userJoinChallenge = async (userId, challengeId) => {

    const user = await getUserById(userId);
    if(user===null){
        throw new NotFoundUserError("존재하지 않는 사용자입니다.");
    }

    const challenge = await getChallenge(challengeId);
    if(challenge === null) {
        throw new NotFoundError("해당 챌린지를 찾을 수 없습니다.");
    }

    const participant = await isAlreadyJoin(userId, challengeId);
    if(participant!==null){
        throw new ExistsError("이미 참여중인 챌린지입니다.");
    }
    
    const userChallenge = await createUserChallenge(userId, challengeId);
    return userChallenge;

}

export const showUserChallenges = async (userId) => {
    const user = await getUserById(userId);
    if(user===null){
        throw new NotFoundUserError("존재하지 않는 사용자입니다.");
    }
    const challenges = getMyChallenges(userId);
    return challenges;
}


