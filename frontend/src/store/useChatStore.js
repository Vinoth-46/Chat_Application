import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isTyping: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;

            set({
                messages: [...get().messages, newMessage],
            });
        });

        socket.on("messageSeen", (updatedMessage) => {
            const { messages } = get();
            const updatedMessages = messages.map((msg) =>
                msg._id === updatedMessage._id ? { ...msg, status: "seen" } : msg
            );
            set({ messages: updatedMessages });
        });

        socket.on("typing", ({ senderId }) => {
            if (selectedUser._id === senderId) {
                set({ isTyping: true });
            }
        });

        socket.on("stopTyping", ({ senderId }) => {
            if (selectedUser._id === senderId) {
                set({ isTyping: false });
            }
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
        socket.off("messageSeen");
        socket.off("typing");
        socket.off("stopTyping");
    },

    markMessageAsSeen: async (messageId) => {
        try {
            await axiosInstance.put(`/messages/${messageId}/seen`);
            // Optimistic update
            const { messages } = get();
            const updatedMessages = messages.map((msg) =>
                msg._id === messageId ? { ...msg, status: "seen" } : msg
            );
            set({ messages: updatedMessages });
        } catch (error) {
            console.error("Failed to mark message as seen:", error);
        }
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
