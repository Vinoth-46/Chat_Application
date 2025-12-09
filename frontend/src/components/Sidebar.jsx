import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Bot, Pin } from "lucide-react";

const Sidebar = () => {
    const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    const [pinnedUsers, setPinnedUsers] = useState(() => {
        const saved = localStorage.getItem("pinnedUsers");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    const togglePin = (e, userId) => {
        e.stopPropagation(); // Prevent selecting the user when pinning
        setPinnedUsers(prev => {
            const newPinned = prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId];
            localStorage.setItem("pinnedUsers", JSON.stringify(newPinned));
            return newPinned;
        });
    };

    const filteredUsers = showOnlineOnly
        ? users.filter((user) => onlineUsers.includes(user._id) || user.isAi)
        : users;

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        // 1. AI always on top
        if (a.isAi && !b.isAi) return -1;
        if (!a.isAi && b.isAi) return 1;

        // 2. Pinned users next
        const isPinnedA = pinnedUsers.includes(a._id);
        const isPinnedB = pinnedUsers.includes(b._id);
        if (isPinnedA && !isPinnedB) return -1;
        if (!isPinnedA && isPinnedB) return 1;

        return 0;
    });

    if (isUsersLoading) return <SidebarSkeleton />;

    return (
        <aside className="h-full w-full lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
            <div className="border-b border-base-300 w-full p-5">
                <div className="flex items-center gap-2">
                    <Users className="size-6" />
                    <span className="font-medium block">Contacts</span>
                </div>
                {/* Todo: Online filter toggle */}
                <div className="mt-3 hidden lg:flex items-center gap-2">
                    <label className="cursor-pointer flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showOnlineOnly}
                            onChange={(e) => setShowOnlineOnly(e.target.checked)}
                            className="checkbox checkbox-sm"
                        />
                        <span className="text-sm">Show online only</span>
                    </label>
                    <span className="text-xs text-zinc-500">
                        ({Math.max(0, onlineUsers.length - 1 + users.filter(u => u.isAi).length)} online)
                    </span>
                </div>
            </div>

            <div className="overflow-y-auto w-full py-3">
                {sortedUsers.map((user) => (
                    <button
                        key={user._id}
                        onClick={() => setSelectedUser(user)}
                        className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors group
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
                    >
                        <div className="relative mx-0">
                            {user.profilePic ? (
                                <img
                                    src={user.profilePic}
                                    alt={user.name}
                                    className="size-12 object-cover rounded-full"
                                />
                            ) : (
                                <div className="bg-primary/10 size-12 flex items-center justify-center rounded-full">
                                    <span className="text-lg font-bold text-primary capitalize">
                                        {user.fullName?.charAt(0)}
                                    </span>
                                </div>
                            )}
                            {(onlineUsers.includes(user._id) || user.isAi) && (
                                <span
                                    className={`absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-base-100 ${user.isAi ? "animate-pulse" : ""}`}
                                />
                            )}
                        </div>

                        {/* User info */}
                        <div className="flex-1 text-left min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                                <span className="font-semibold truncate flex items-center gap-1.5 text-base-content/90">
                                    {user.fullName}
                                    {user.isAi && <Bot className="size-3.5 text-blue-500" />}
                                    {pinnedUsers.includes(user._id) && !user.isAi && <Pin className="size-3 text-zinc-400 fill-zinc-400" />}
                                </span>
                                {/* Time placeholder or pinned icon logic could go here, but for now just spacing */}
                            </div>

                            <div className="flex justify-between items-center">
                                <span className={`text-sm truncate ${onlineUsers.includes(user._id) || user.isAi ? "text-green-500 font-medium" : "text-base-content/60"}`}>
                                    {onlineUsers.includes(user._id) || user.isAi ? "Online" : "Offline"}
                                </span>

                                {user.unreadCount > 0 && (
                                    <span className="flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-xs font-bold text-white bg-[#25D366] rounded-full shadow-sm">
                                        {user.unreadCount}
                                    </span>
                                )}
                            </div>
                        </div>
                    </button>
                ))}

                {sortedUsers.length === 0 && (
                    <div className="text-center text-zinc-500 py-4">No online users</div>
                )}
            </div>
        </aside>
    );
};
export default Sidebar;
