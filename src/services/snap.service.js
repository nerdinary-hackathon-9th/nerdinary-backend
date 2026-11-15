import snapRepository from "../repositories/snap.repositories.js";
import { BadRequestError, NotFoundError } from "../errors.js";

class SnapService {
  async createSnap(challengeId, userId, dto, files) {
    const challenge = await snapRepository.findChallengeById(challengeId);
    if (!challenge) throw new NotFoundError("존재하지 않는 챌린지입니다.");

    const user = await snapRepository.findUserById(userId);
    if (!user) throw new NotFoundError("존재하지 않는 사용자입니다.");

    if (challenge.endAt && new Date(challenge.endAt) < new Date()) {
      throw new BadRequestError("이미 종료된 챌린지입니다.");
    }

    const existing = await snapRepository.findSnapByUserAndChallenge(challengeId, userId);
    if (existing) throw new BadRequestError("이미 인증샷을 제출한 챌린지입니다.");

    let imageUrl = null;
    if (files && files.length > 0) {
      const file = files[0];
      imageUrl = await this.uploadImage(file, challengeId, userId);
    }

    const snapData = {
      challengeId,
      userId,
      imageUrl,
      ...dto
    };

    const snap = await snapRepository.createSnap(snapData);
    await snapRepository.createParticipation(challengeId, userId);
    return snap;
  }

  async uploadImage(file, challengeId, userId) {
    const base = process.env.SERVER_URL || 'http://localhost:8000';
    return `${base}/uploads/${file.filename}`;
  }

  async uploadImageOnly(file) {
    const base = process.env.SERVER_URL || 'http://localhost:8000';
    return `${base}/uploads/${file.filename}`;
  }

  async updateSnap(snapId, userId, { content, imageUrl }) {
    const snap = await snapRepository.findSnapById(snapId);
    if (!snap) throw new NotFoundError("존재하지 않는 인증샷입니다.");
    if (snap.userId !== userId) throw new BadRequestError("수정 권한이 없습니다.");

    return await snapRepository.updateSnap(snapId, { content, imageUrl });
  }

  async deleteSnap(snapId, userId) {
    const snap = await snapRepository.findSnapById(snapId);
    if (!snap) throw new NotFoundError("존재하지 않는 인증샷입니다.");

    if (snap.userId !== userId) throw new BadRequestError("삭제 권한이 없습니다.");

    await snapRepository.deleteSnap(snapId);
    // s3에서도 삭제하는 로직 필요
    return { message: "인증샷이 삭제되었습니다." };
  }

  async getSnapsByChallenge(challengeId) {
    return await snapRepository.findSnapsByChallenge(challengeId);
  }

  async getSnapsByUser(userId) {
    return await snapRepository.findSnapsByUser(userId);
  }

  async getSnapsBySnapId(snapId) {
    const snap = await snapRepository.findSnapsBySnap(snapId);
    if (!snap) throw new NotFoundError("존재하지 않는 인증샷입니다.");
    return snap
  }
}

export default new SnapService();