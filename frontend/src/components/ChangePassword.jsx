import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Lock, Loader2 } from "lucide-react";

const ChangePassword = () => {
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const { updatePassword, isUpdatingProfile } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return alert("Passwords do not match");
        }
        await updatePassword({
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword,
        });
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Current Password
                </div>
                <input
                    type="password"
                    className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                />
            </div>
            <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    New Password
                </div>
                <input
                    type="password"
                    className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                />
            </div>
            <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Confirm New Password
                </div>
                <input
                    type="password"
                    className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                />
            </div>
            <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isUpdatingProfile}
            >
                {isUpdatingProfile ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Updating...
                    </>
                ) : (
                    "Change Password"
                )}
            </button>
        </form>
    );
};

export default ChangePassword;
