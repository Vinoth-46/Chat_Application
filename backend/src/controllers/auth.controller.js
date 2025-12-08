import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { getGfsBucket } from "../lib/db.js";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        if (newUser) {
            // generate jwt token here
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid Password" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic, fullName } = req.body;
        const userId = req.user._id;

        const updateData = {};
        if (fullName) updateData.fullName = fullName;

        if (profilePic) {
            const buffer = Buffer.from(profilePic.split(",")[1], "base64");
            const gfs = getGfsBucket();
            const filename = `profile_${userId}_${Date.now()}`;

            const uploadStream = gfs.openUploadStream(filename, {
                contentType: "image/png",
            });

            uploadStream.end(buffer);

            uploadStream.on("finish", async () => {
                updateData.profilePic = `/api/images/${uploadStream.id}`;
                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    updateData,
                    { new: true }
                );
                res.status(200).json(updatedUser);
            });

            uploadStream.on("error", (error) => {
                console.error("GridFS Upload Error", error);
                res.status(500).json({ message: "Image upload failed" });
            });
        } else {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                updateData,
                { new: true }
            );
            res.status(200).json(updatedUser);
        }
    } catch (error) {
        console.log("error in update profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const user = await User.findById(userId);

        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid current password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.log("error in update password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user._id;
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.log("Error in deleteAccount controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
