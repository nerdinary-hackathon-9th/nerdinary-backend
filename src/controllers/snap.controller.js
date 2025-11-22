import snapService from "../services/snap.service.js";
import { BadRequestError } from "../errors.js";
import { successHandler } from "../middlewares/responseHandler.js";
import { isCreateSnapDTO } from "../dtos/resCreateSnap.dto.js";

class SnapController {
  async createSnap(req, res, next) {
    try {
      const { challenge_id, user_id } = req.params;
      const challengeId = Number(challenge_id);
      const userId = Number(user_id);

      const { title, content } = req.body;

      if (!title) {
        throw new BadRequestError("스냅 제목(title)은 필수입니다.");
      }

      const dto = { title, content };

      const newSnap = await snapService.createSnap(challengeId, userId, dto, req.files);
      return successHandler(res, "리뷰 생성 완료", newSnap);
    } catch (err) {
      next(err);
    }
  }

  async deleteSnap(req, res, next) {
    try {
        const { snap_id, user_id } = req.params;
        const snapId = Number(snap_id);
        const userId = Number(user_id);

        const deleteSnap = await snapService.deleteSnap(snapId, userId);
        return successHandler(res, "리뷰 삭제 성공", { deleteSnap });
    } catch (err) {
        next(err);
    }
  }

  async getSnapsByChallenge(req, res, next) {
    try {
        const { challenge_id } = req.params;
        const challengeId = Number(challenge_id);

        const snaps = await snapService.getSnapsByChallenge(challengeId);
        return successHandler(res, "챌린지별 인증샷 조회 완료", snaps);
    } catch (err) {
        next(err);
    }
  }

  async getSnapByUserId(req, res, next) {
    try {
        const { user_id } = req.params;
        const userId = Number(user_id);

        const snaps = await snapService.getSnapsByUser(userId);
        return successHandler(res, "유저별 인증샷 조회 완료", snaps);
    } catch (err) {
        next(err);
    }
  }

  async getSnapBySnapId(req, res, next) {
    try {
        const { snap_id } = req.params;
        const snpaId = Number(snap_id);

        const snap = await snapService.getSnapsBySnapId(snpaId);
        return successHandler(res, `${snap.id} 인증샷 조회 완료`, snap);
    } catch (err) {
        next(err);
    }
  }
}

export default new SnapController();