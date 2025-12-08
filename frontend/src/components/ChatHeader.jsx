import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();

    return (
        <div className="p-2.5 border-b border-base-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
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
                        <h3 className="font-medium">{selectedUser.fullName}</h3>
                        <p className="text-xs text-base-content/70">
                            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
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
