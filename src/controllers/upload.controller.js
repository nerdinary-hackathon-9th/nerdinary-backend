import snapService  from "../services/snap.service.js";
import { BadRequestError } from "../errors.js";

//import { successHandler } from '../middleware/responseHandler.js';

export const uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new BadRequestError("이미지 파일이 필요합니다.");
        }

        const imageUrl = await snapService.uploadImageOnly(req.file);

        return res.status(201).json({
            success: true,
            message: "이미지 업로드 성공",
            data: { imageUrl },
        });
    } catch (err) {
        next(err);
    }
};