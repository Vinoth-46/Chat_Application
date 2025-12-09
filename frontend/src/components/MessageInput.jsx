import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Image, Send, X, Smile, Paperclip, Camera, Mic } from "lucide-react";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";

const MessageInput = () => {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const fileInputRef = useRef(null);
    const { sendMessage, selectedUser } = useChatStore();
    const { socket } = useAuthStore();
    const timeoutRef = useRef(null);
    const emojiPickerRef = useRef(null);

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return;

        try {
            await sendMessage({
                text: text.trim(),
                image: imagePreview,
            });

            // Clear form
            setText("");
            setImagePreview(null);
            setShowEmojiPicker(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const onEmojiClick = (emojiObject) => {
        setText((prev) => prev + emojiObject.emoji);
    };

    return (
        <div className="p-2 w-full bg-transparent relative">
            {imagePreview && (
                <div className="mb-3 flex items-center gap-2 px-2">
                    <div className="relative">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
                            type="button"
                        >
                            <X className="size-3" />
                        </button>
                    </div>
                </div>
            )}

            {/* Emoji Picker */}
            {showEmojiPicker && (
                <div ref={emojiPickerRef} className="absolute bottom-20 left-4 z-50 shadow-xl rounded-xl">
                    <EmojiPicker
                        theme="dark"
                        onEmojiClick={onEmojiClick}
                        lazyLoadEndpoints={["https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/"]}
                    />
                </div>
            )}

            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                {/* Main Input Pill */}
                <div className="flex-1 flex gap-2 items-center bg-[#202c33] rounded-full px-4 py-2">
                    <button
                        type="button"
                        className={`transition-colors ${showEmojiPicker ? "text-emerald-500" : "text-zinc-400 hover:text-zinc-300"}`}
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                        <Smile size={24} />
                    </button>

                    <input
                        type="text"
                        className="w-full bg-transparent border-none outline-none text-white placeholder-zinc-400 font-normal"
                        placeholder="Message"
                        value={text}
                        onClick={() => setShowEmojiPicker(false)}
                        onChange={(e) => {
                            setText(e.target.value);
                            socket.emit("typing", { receiverId: selectedUser._id });

                            // Debounce stop typing
                            if (timeoutRef.current) clearTimeout(timeoutRef.current);
                            timeoutRef.current = setTimeout(() => {
                                socket.emit("stopTyping", { receiverId: selectedUser._id });
                            }, 2000);
                        }}
                    />

                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            className="text-zinc-400 hover:text-zinc-300 transition-colors rotate-45"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Paperclip size={22} />
                        </button>
                        {/* Hidden File Input */}
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                        />

                        {/* Camera Icon - Visual only as requested */}
                        {!text && !imagePreview && (
                            <button type="button" className="text-zinc-400 hover:text-zinc-300 transition-colors">
                                <Camera size={22} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Send Button Circle */}
                <button
                    type="submit"
                    className="flex items-center justify-center size-12 rounded-full bg-[#00a884] hover:bg-[#008f6f] transition-all flex-shrink-0"
                    disabled={!text.trim() && !imagePreview}
                >
                    <Send size={22} className="text-white ml-0.5" />
                </button>
            </form>
        </div>
    );
};
export default MessageInput;
