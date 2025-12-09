import { MessageSquare } from "lucide-react";

const LoadingPage = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-base-100">
            <div className="relative">
                {/* Pulsing Background */}
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping blur-xl"></div>

                {/* Logo Container */}
                <div className="relative flex flex-col items-center gap-4">
                    <div className="size-20 bg-primary/10 backdrop-blur-xl rounded-2xl flex items-center justify-center ring-4 ring-primary/5 shadow-2xl animate-pulse">
                        <MessageSquare className="size-10 text-primary animate-bounce-slow" />
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-pulse">
                            Rants ...
                        </h1>
                        <div className="flex gap-1">
                            <span className="size-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="size-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="size-2 bg-primary rounded-full animate-bounce"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingPage;
