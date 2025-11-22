import snapRepository from "../repositories/snap.repositories.js";
import { BadRequestError, NotFoundError } from "../errors.js";
import { uploadToS3 } from "../configs/s3.config.js";

class SnapService {
  async createSnap(challengeId, userId, dto, files) {
    const challenge = await snapRepository.findChallengeById(challengeId);
    if (!challenge) throw new NotFoundError("존재하지 않는 챌린지입니다.");

    const user = await snapRepository.findUserById(userId);
    if (!user) throw new NotFoundError("존재하지 않는 사용자입니다.");

    if (challenge.endAt && new Date(challenge.endAt) < new Date()) {
      throw new BadRequestError("이미 종료된 챌린지입니다.");
    }

    const existing = await snapRepository.findParticipation(challengeId, userId);
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

    return await snapRepository.createSnap(snapData);
  }

  async uploadImage(file, challengeId, userId) {
    try {
      const key = `sihaeng-bucket/snap/challenge_${challengeId}/user_${userId}`;
      const imageUrl = await uploadToS3(file.buffer, key, file.mimetype);
      return imageUrl;
    } catch (err) {
      throw new BadRequestError("이미지 업로드에 실패했습니다.");
    }
  }

  async uploadImageOnly(file) {
    try {
      const timestamp = Date.now();
      const safeName = file.originalname?.replace(/\s+/g, "_") || "image";
      const key = `sihaeng-bucket/uploads/${timestamp}_${safeName}`;
      const imageUrl = await uploadToS3(file.buffer, key, file.mimetype);
      return imageUrl;
    } catch (err) {
      throw new BadRequestError("이미지 업로드에 실패했습니다.");
    }
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
    return await snapRepository.findSnapsBySnap(snapId);
  }
}

export default new SnapService();