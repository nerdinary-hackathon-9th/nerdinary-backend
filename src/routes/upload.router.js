import express from "express";
import { upload } from "../configs/multer.config.js";
import { uploadImage }  from "../controllers/upload.controller.js";

const router = express.Router();

// POST /upload/image
router.post(
    "/image",
    upload.single("image"),
    uploadImage
);

export default router;