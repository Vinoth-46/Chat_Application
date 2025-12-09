import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
    const { selectedUser } = useChatStore();

    return (
        <div className="h-[100dvh] bg-base-200">
            <div className="flex items-center justify-center pt-16 px-0 sm:pt-20 sm:px-4 h-full">
                <div className="bg-base-100 rounded-none sm:rounded-lg shadow-cl w-full max-w-6xl h-full sm:h-[calc(100vh-8rem)]">
                    <div className="flex h-full rounded-lg overflow-hidden">
                        <div className={`h-full w-full lg:w-72 ${selectedUser ? "hidden lg:flex" : "flex"}`}>
                            <Sidebar />
                        </div>

                        <div className={`flex-1 ${!selectedUser ? "hidden lg:flex" : "flex"}`}>
                            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default HomePage;
