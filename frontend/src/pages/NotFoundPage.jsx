import { Link } from "react-router-dom";
import { MessageSquare, Home, ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-base-200 justify-center items-center overflow-hidden">
            {/* Left Side - Content */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12 text-center animate-fade-in-up">
                <div className="w-full max-w-md space-y-8">
                    {/* Icon Animation */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative flex justify-center">
                            <div className="size-24 rounded-2xl bg-base-100/50 backdrop-blur-xl flex items-center justify-center border border-base-content/10 animate-bounce-slow">
                                <MessageSquare className="size-12 text-primary" />
                            </div>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="space-y-4">
                        <h1 className="text-9xl font-bold text-primary opacity-20 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 -z-10 select-none">
                            404
                        </h1>
                        <h2 className="text-3xl font-bold">Page Not Found</h2>
                        <p className="text-base-content/60">
                            Oops! It looks like you've wandered off the chat grid. The conversation you're looking for doesn't exist here.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/"
                            className="btn btn-primary btn-lg gap-2 group hover:scale-105 transition-transform"
                        >
                            <Home className="size-5" />
                            Return Home
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="btn btn-outline btn-lg gap-2 group hover:scale-105 transition-transform"
                        >
                            <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
                            Go Back
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Side - Interactive Pattern (Hidden on mobile) */}
            <div className="hidden lg:flex h-full bg-base-300 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                <div className="space-y-8 p-12 relative z-10 w-full max-w-lg">
                    {/* Floating Chat Bubbles Mockup */}
                    <div className="chat chat-start animate-float-delay-1">
                        <div className="chat-bubble chat-bubble-primary">Where am I? 🤔</div>
                    </div>
                    <div className="chat chat-end animate-float-delay-2">
                        <div className="chat-bubble chat-bubble-secondary">Looks like a 404 error...</div>
                    </div>
                    <div className="chat chat-start animate-float-delay-3">
                        <div className="chat-bubble">Is anyone there?</div>
                    </div>
                    <div className="chat chat-end animate-float-delay-4">
                        <div className="chat-bubble chat-bubble-error">Page not found! 🚫</div>
                    </div>
                </div>

                {/* Animated Background Circles */}
                <div className="absolute top-1/4 left-1/4 size-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 size-64 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>
        </div>
    );
};

export default NotFoundPage;
