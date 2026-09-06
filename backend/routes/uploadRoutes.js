import express from "express";
import { v2 as cloudinary } from "cloudinary";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post(
    "/",
    upload.single("image"),
    async (req, res) => {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image uploaded",
            });
        }

        try {
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
            });

            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "tcr/menu",
                        resource_type: "image",
                    },
                    (error, uploadResult) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(uploadResult);
                        }
                    }
                );

                stream.end(req.file.buffer);
            });

            res.json({
                success: true,
                image: result.secure_url,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }

    }
);

export default router;