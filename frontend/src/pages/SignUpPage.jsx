import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const { signup, isSigningUp } = useAuthStore();

    const validateForm = () => {
        if (!formData.fullName.trim()) return toast.error("Full name is required");
        if (!formData.email.trim()) return toast.error("Email is required");
        if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
        if (!formData.password) return toast.error("Password is required");
        if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = validateForm();
        if (success === true) signup(formData);
    };

    return (
        <div className="min-h-screen mesh-bg flex flex-col items-center p-4 sm:p-6 pt-24 pb-10 relative">



            <div className="w-full max-w-md m-auto space-y-8 glass-premium p-8 sm:p-10 rounded-3xl animate-slide-up relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex flex-col items-center gap-3">
                        <div className="size-16 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center animate-float shadow-xl mb-2">
                            <MessageSquare className="size-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-base-content mb-2">Create Account</h1>
                        <p className="text-base-content/70 text-lg opacity-80 font-light ">Get started with your free account</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="form-control group">
                        <label className="label pl-1">
                            <span className="label-text font-medium text-base-content/80 group-focus-within:text-primary transition-colors">Full Name</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="size-5 text-base-content/40 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="input w-full pl-11 glass-input text-base-content placeholder-base-content/30 rounded-xl h-12"
                                placeholder="Your Full Name"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-control group">
                        <label className="label pl-1">
                            <span className="label-text font-medium text-base-content/80 group-focus-within:text-primary transition-colors">Email</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="size-5 text-base-content/40 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="email"
                                className="input w-full pl-11 glass-input text-base-content placeholder-base-content/30 rounded-xl h-12"
                                placeholder="Your Email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase() })}
                            />
                        </div>
                    </div>

                    <div className="form-control group">
                        <label className="label pl-1">
                            <span className="label-text font-medium text-base-content/80 group-focus-within:text-primary transition-colors">Password</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="size-5 text-base-content/40 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="input w-full pl-11 pr-10 glass-input text-base-content placeholder-base-content/30 rounded-xl h-12"
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-4 flex items-center opacity-60 hover:opacity-100 transition-opacity"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="size-5 text-base-content/70" />
                                ) : (
                                    <Eye className="size-5 text-base-content/70" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full h-12 rounded-xl text-lg font-semibold shadow-lg hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-200 border-none bg-gradient-to-r from-primary to-secondary text-white"
                        disabled={isSigningUp}
                    >
                        {isSigningUp ? (
                            <>
                                <Loader2 className="size-5 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                <div className="text-center pt-2">
                    <p className="text-base-content/60">
                        Already have an account?{" "}
                        <Link to="/login" className="text-base-content font-medium hover:text-primary hover:underline transition-all">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
export default SignUpPage;
