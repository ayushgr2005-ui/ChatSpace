import { uploadOnCloudinary } from "../lib/cloudinary.js";
import { Message } from "../models/message-model.js";
import { User } from "../models/user-model.js";
import { userSocketMap, io } from "../server.js";
import fs from "node:fs";

//get all users list
export const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;

        const filteredUsers = await User
            .find({
                _id: {
                    $ne: userId
                }
            })
            .select("-password");

        //count number of msgs not seen
        const unseenMsgs = {};
        const unseen = filteredUsers.map(async (user) => {            
		const unseenCount = await Message.countDocuments({
    			senderId: user._id,
    			receiverId: userId,
    			seen: false
		});
            unseenMsgs[user._id] = unseenCount;
	    
            return unseenCount;
        });
        const usersWithUnseen = await Promise.all(unseen);
        res.status(200).json({ success: true, users: filteredUsers, unseenMsgs });
    } catch (error) {
        console.log("Get users error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

//get all msgs between two users

export const getAllMessages = async (req, res) => {
    try {
        const userId = req.user._id;
        const otherUserId = req.params.userId;

        if (!otherUserId || !otherUserId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        if (userId.toString() === otherUserId) {
            return res.status(400).json({
                success: false,
                message: "Cannot fetch a conversation with yourself"
            });
        }

        const otherUser = await User.findById(otherUserId).select("_id");

        if (!otherUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: userId }
            ]
        }).sort({ createdAt: 1 });

        await Message.updateMany(
            {
                senderId: otherUserId,
                receiverId: userId,
                seen: false
            },
            {
                $set: { seen: true }
            }
        );

        return res.status(200).json({
            success: true,
            messages
        });
    } catch (error) {
        console.log("Get messages error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

//make a msg seen using msgId

// Mark a received message as seen
export const makeMsgSeen = async (req, res) => {
    try {
        const msgId = req.params.msgId;
        const userId = req.user._id;

        const message = await Message.findOneAndUpdate(
            {
                _id: msgId,
                receiverId: userId
            },
            {
                $set: { seen: true }
            },
            {
                new: true
            }
        );

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found or access denied"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Message marked as seen"
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid message ID"
            });
        }

        console.log("Mark message seen error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


//send a msg from sender to receiver

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.user._id;
        const { text } = req.body;
        const receiverId = req.params.userId;

        if (!receiverId || !/^[0-9a-fA-F]{24}$/.test(receiverId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid receiver ID"
            });
        }

        if (senderId.toString() === receiverId) {
            return res.status(400).json({
                success: false,
                message: "Cannot send a message to yourself"
            });
        }

        const receiver = await User.findById(receiverId).select("_id");

        if (!receiver) {
            return res.status(404).json({
                success: false,
                message: "Receiver not found"
            });
        }

        let imageUrl = "";

        if (req.file) {
            if (!req.uploadsEnabled) {
                try {
                    if (req.file.path) {
                        await fs.promises.unlink(req.file.path);
                    }
                } catch (error) {
                    // Ignore temporary file cleanup errors
                }

                return res.status(403).json({
                    success: false,
                    message: "Image uploads are disabled"
                });
            }

            const uploadResponse = await uploadOnCloudinary(req.file.path);

            if (uploadResponse) {
                imageUrl = uploadResponse.secure_url;
            } else {
                return res.status(500).json({
                    success: false,
                    message: "Image upload failed"
                });
            }
        }

        const messageText = typeof text === "string" ? text.trim() : "";

        if (!messageText && !imageUrl) {
            return res.status(400).json({
                success: false,
                message: "Either text or image is required"
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text: messageText,
            image: imageUrl
        });

        await newMessage.save();

        const receiverSocketId = userSocketMap.get(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return res.status(201).json({
            success: true,
            newMessage
        });
    } catch (error) {
        console.log("Send message error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
