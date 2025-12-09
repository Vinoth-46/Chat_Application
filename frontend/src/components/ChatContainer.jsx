import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { Check, CheckCheck } from "lucide-react";

const ChatContainer = () => {
    const {
        messages,
        getMessages,
        isMessagesLoading,
        selectedUser,
        subscribeToMessages,
        unsubscribeFromMessages,
        markMessageAsSeen,
        isTyping,
    } = useChatStore();
    const { authUser } = useAuthStore();
    const messageEndRef = useRef(null);

    useEffect(() => {
        getMessages(selectedUser._id);

        subscribeToMessages();

        return () => unsubscribeFromMessages();
    }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.senderId !== authUser._id && lastMessage.status !== "seen") {
                markMessageAsSeen(lastMessage._id);
            }
        }
    }, [messages, markMessageAsSeen, authUser._id]);

    if (isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#0b141a] bg-repeat" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundBlendMode: "overlay", backgroundSize: "400px" }}>
            <ChatHeader />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                        ref={messageEndRef}
                    >
                        <div className=" chat-image avatar">
                            <div className="size-10 rounded-full border border-base-content/10">
                                {
                                    (message.senderId === authUser._id ? authUser.profilePic : selectedUser.profilePic) ? (
                                        <img
                                            src={
                                                message.senderId === authUser._id
                                                    ? authUser.profilePic
                                                    : selectedUser.profilePic
                                            }
                                            alt="profile pic"
                                        />
                                    ) : (
                                        <div className="bg-primary/10 w-full h-full flex items-center justify-center rounded-full">
                                            <span className="text-lg font-bold text-primary capitalize">
                                                {(message.senderId === authUser._id
                                                    ? authUser.fullName
                                                    : selectedUser.fullName
                                                )?.charAt(0)}
                                            </span>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1 text-gray-300">
                                {formatMessageTime(message.createdAt)}
                            </time>
                        </div>
                        <div className={`chat-bubble flex flex-col shadow-md max-w-[70%] rounded-xl ${message.senderId === authUser._id
                            ? "bg-[#005c4b] text-white rounded-tr-none"
                            : "bg-[#202c33] text-white rounded-tl-none"
                            }`}>
                            {message.image && (
                                <img
                                    src={message.image}
                                    alt="Attachment"
                                    className="sm:max-w-[200px] rounded-md mb-2 object-cover"
                                />
                            )}
                            {message.text && <p className="leading-relaxed">{message.text}</p>}

                            {message.senderId === authUser._id && (
                                <div className="self-end mt-1">
                                    {message.status === "sent" && <Check className="w-3.5 h-3.5 text-gray-400" />}
                                    {message.status === "delivered" && <CheckCheck className="w-3.5 h-3.5 text-gray-400" />}
                                    {message.status === "seen" && <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="chat chat-start">
                        <div className=" chat-image avatar">
                            <div className="size-10 rounded-full border">
                                {selectedUser.profilePic ? (
                                    <img src={selectedUser.profilePic} alt="profile pic" />
                                ) : (
                                    <div className="bg-primary/10 w-full h-full flex items-center justify-center rounded-full">
                                        <span className="text-lg font-bold text-primary capitalize">
                                            {selectedUser.fullName.charAt(0)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="chat-header mb-1">
                            <span className="text-xs opacity-50 ml-1">Typing...</span>
                        </div>
                        <div className="chat-bubble flex flex-col backdrop-blur-md bg-base-200/80 shadow-sm">
                            <div className="flex gap-1 items-center h-5 px-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-base-content/40 animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-base-content/40 animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-base-content/40 animate-bounce"></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <MessageInput />
        </div>
    );
};
export default ChatContainer;
