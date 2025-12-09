import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const { login, isLoggingIn } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        login(formData);
    };

    return (
        <div className="min-h-screen mesh-bg flex flex-col items-center p-4 sm:p-6 pt-24 pb-10 relative">

            {/* Ambient Background Elements - Fixed to viewport so they don't scroll nicely */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            <div className="w-full max-w-md m-auto space-y-8 glass-premium p-8 sm:p-10 rounded-3xl animate-slide-up relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex flex-col items-center gap-3">
                        <div className="size-16 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center animate-float shadow-xl mb-2">
                            <MessageSquare className="size-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Welcome Back</h1>
                        <p className="text-base-content/70 text-lg">Sign in to continue your journey</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="form-control group">
                        <label className="label pl-1">
                            <span className="label-text font-medium text-white/80 group-focus-within:text-primary transition-colors">Email Address</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="size-5 text-white/40 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="email"
                                className="input w-full pl-11 glass-input text-white placeholder-white/30 rounded-xl h-12"
                                placeholder="your mail ID"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase() })}
                            />
                        </div>
                    </div>

                    <div className="form-control group">
                        <label className="label pl-1">
                            <span className="label-text font-medium text-white/80 group-focus-within:text-primary transition-colors">Password</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="size-5 text-white/40 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="input w-full pl-11 pr-10 glass-input text-white placeholder-white/30 rounded-xl h-12"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-4 flex items-center opacity-60 hover:opacity-100 transition-opacity"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="size-5 text-white" />
                                ) : (
                                    <Eye className="size-5 text-white" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full h-12 rounded-xl text-lg font-semibold shadow-lg hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-200 border-none bg-gradient-to-r from-primary to-secondary text-white"
                        disabled={isLoggingIn}
                    >
                        {isLoggingIn ? (
                            <>
                                <Loader2 className="size-5 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <div className="text-center pt-2">
                    <p className="text-white/60">
                        Don&apos;t have an account?{" "}
                        <Link to="/signup" className="text-white font-medium hover:text-primary hover:underline transition-all">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
export default LoginPage;
