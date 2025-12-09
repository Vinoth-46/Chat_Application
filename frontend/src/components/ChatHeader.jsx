import { X, Bot, ArrowLeft } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();

    return (
        <div className="p-2.5 border-b border-base-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Back Button */}
                    <button onClick={() => setSelectedUser(null)} className="lg:hidden">
                        <ArrowLeft />
                    </button>

                    {/* Avatar */}
                    <div className="avatar">
                        <div className="size-10 rounded-full relative">
                            {selectedUser.profilePic ? (
                                <img src={selectedUser.profilePic} alt={selectedUser.fullName} />
                            ) : (
                                <div className="bg-primary/10 w-full h-full flex items-center justify-center rounded-full">
                                    <span className="text-xl font-bold text-primary capitalize">
                                        {selectedUser.fullName?.charAt(0)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* User Info */}
                    <div>
                        <h3 className="font-medium flex items-center gap-2">
                            {selectedUser.fullName}
                            {selectedUser.isAi && <Bot className="size-4 text-blue-500" />}
                        </h3>
                        <p className="text-xs text-base-content/70">
                            {onlineUsers.includes(selectedUser._id) || selectedUser.isAi ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>

                {/* Close button */}
                <button onClick={() => setSelectedUser(null)}>
                    <X />
                </button>
            </div>
        </div>
    );
};
export default ChatHeader;
