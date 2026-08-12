import express from "express";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post(
    "/",
    upload.single("image"),
    (req, res) => {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image uploaded",
            });
        }

        res.json({
            success: true,
            image: "/uploads/" + req.file.filename,
        });

    }
);

export default router;