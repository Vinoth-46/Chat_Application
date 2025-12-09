import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import { connectDB } from "../lib/db.js";
import bcrypt from "bcryptjs";

dotenv.config();

const createAiUser = async () => {
    try {
        await connectDB();

        const aiEmail = "nova@ai.com";
        const existingUser = await User.findOne({ email: aiEmail });

        if (existingUser) {
            existingUser.isAi = true;
            await existingUser.save();
            console.log("Existing user 'Nova AI' updated to be AI.");
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("ai-password-123", salt);

            const newUser = new User({
                email: aiEmail,
                fullName: "Nova AI",
                password: hashedPassword,
                isAi: true,
                profilePic: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Nova"
            });

            await newUser.save();
            console.log("New AI user 'Nova AI' created.");
        }

        process.exit(0);
    } catch (error) {
        console.error("Error creating AI user:", error);
        process.exit(1);
    }
};

createAiUser();
