import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { getGfsBucket } from "../lib/db.js";
import { generateAIResponse } from "../lib/gemini.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        const usersWithUnreadCounts = await Promise.all(
            filteredUsers.map(async (user) => {
                const unreadCount = await Message.countDocuments({
                    senderId: user._id,
                    receiverId: loggedInUserId,
                    status: { $ne: "seen" }
                });
                return { ...user.toObject(), unreadCount };
            })
        );

        res.status(200).json(usersWithUnreadCounts);
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            // Upload base64 image to GridFS
            const buffer = Buffer.from(image.split(",")[1], "base64");
            const gfs = getGfsBucket();
            const filename = `msg_${senderId}_${Date.now()}`;

            const uploadStream = gfs.openUploadStream(filename, {
                contentType: "image/png",
            });

            uploadStream.end(buffer);

            await new Promise((resolve, reject) => {
                uploadStream.on("finish", () => {
                    imageUrl = `/api/images/${uploadStream.id}`;
                    resolve();
                });
                uploadStream.on("error", (err) => {
                    console.error("GridFS Upload Error", err);
                    reject(err);
                });
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();


        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);

        // AI Bot Logic
        try {
            const receiverUser = await User.findById(receiverId);
            if (receiverUser && receiverUser.isAi) {
                // Get chat history for better context
                const history = await Message.find({
                    $or: [
                        { senderId, receiverId },
                        { senderId: receiverId, receiverId: senderId }
                    ]
                }).sort({ createdAt: 1 }).limit(10); // Limit to last 10 messages for context

                // Format history for Gemini
                const historyForAi = history.map(msg => ({
                    role: msg.senderId.toString() === senderId.toString() ? 'user' : 'model',
                    parts: [{ text: msg.text || (msg.image ? "[Image]" : "") }]
                }));

                const aiResponseText = await generateAIResponse(historyForAi, text);

                const aiMessage = new Message({
                    senderId: receiverId,
                    receiverId: senderId,
                    text: aiResponseText
                });

                await aiMessage.save();

                const senderSocketId = getReceiverSocketId(senderId);
                if (senderSocketId) {
                    io.to(senderSocketId).emit("newMessage", aiMessage);
                }
            }
        } catch (aiError) {
            console.error("Error generating AI response:", aiError);
        }
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const markMessageAsSeen = async (req, res) => {
    try {
        const { id: messageId } = req.params;
        const userId = req.user._id;

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        if (message.receiverId.toString() !== userId.toString()) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        message.status = "seen";
        await message.save();

        const senderSocketId = getReceiverSocketId(message.senderId);
        if (senderSocketId) {
            io.to(senderSocketId).emit("messageSeen", message);
        }

        res.status(200).json(message);
    } catch (error) {
        console.log("Error in markMessageAsSeen controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
