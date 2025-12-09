import { X, Bot, ArrowLeft, Trash2, MoreVertical } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
    const { selectedUser, setSelectedUser, clearChat } = useChatStore();
    const { onlineUsers } = useAuthStore();

    return (
        <div className="p-2.5 border-b border-base-300 bg-base-100">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Back Button */}
                    <button onClick={() => setSelectedUser(null)} className="lg:hidden text-base-content/70 hover:text-base-content transition-colors">
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
                        <h3 className="font-medium flex items-center gap-2 text-base-content">
                            {selectedUser.fullName}
                            {selectedUser.isAi && <Bot className="size-4 text-blue-500" />}
                        </h3>
                        <p className={`text-xs ${onlineUsers.includes(selectedUser._id) || selectedUser.isAi ? "text-[#25D366]" : "text-base-content/70"}`}>
                            {onlineUsers.includes(selectedUser._id) || selectedUser.isAi ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Options Menu (Only for AI for now) */}
                    {selectedUser.isAi && (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle btn-sm text-base-content/70">
                                <MoreVertical size={20} />
                            </div>
                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 p-2 shadow-lg border border-base-300">
                                <li>
                                    <button onClick={clearChat} className="text-error hover:bg-error/10">
                                        <Trash2 size={16} />
                                        Clear Chat
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}

                    {/* Close button */}
                    <button onClick={() => setSelectedUser(null)} className="text-base-content/70 hover:text-base-content transition-colors">
                        <X />
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ChatHeader;
