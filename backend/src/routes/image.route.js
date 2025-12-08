import express from "express";
import { getGfsBucket } from "../lib/db.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/:id", async (req, res) => {
    try {
        const fileId = new mongoose.Types.ObjectId(req.params.id);
        const gfs = getGfsBucket();

        const files = await gfs.find({ _id: fileId }).toArray();
        if (!files || files.length === 0) {
            return res.status(404).json({ message: "File not found" });
        }

        const downloadStream = gfs.openDownloadStream(fileId);
        downloadStream.pipe(res);
    } catch (error) {
        console.error("Error serving image:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
