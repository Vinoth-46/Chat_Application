import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Trash2, Calendar, Shield, Edit2, Check, X } from "lucide-react";
import ChangePassword from "../components/ChangePassword";
import toast from "react-hot-toast";

const ProfilePage = () => {
    const { authUser, isUpdatingProfile, updateProfile, deleteAccount } = useAuthStore();
    const [selectedImg, setSelectedImg] = useState(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(authUser?.fullName || "");

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async () => {
            const base64Image = reader.result;
            setSelectedImg(base64Image);
        };
    };

    const handleUpdateProfile = async () => {
        try {
            await updateProfile({ profilePic: selectedImg });
            setSelectedImg(null);
            toast.success("Profile photo updated successfully");
        } catch (error) {
            toast.error("Failed to update profile photo");
        }
    };

    const handleUpdateName = async () => {
        if (!newName.trim()) {
            toast.error("Name cannot be empty");
            return;
        }
        try {
            await updateProfile({ fullName: newName });
            setIsEditingName(false);
            toast.success("Name updated successfully");
        } catch (error) {
            toast.error("Failed to update name");
        }
    };


    return (
        <div className="min-h-screen pt-20 pb-10 px-4 bg-base-100">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Your Profile
                    </h1>
                    <p className="text-base-content/60 mt-2">Manage your account settings and preferences</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Left Column - Avatar & Identity */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-base-200/50 backdrop-blur-xl border border-base-300 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm">
                            <div className="relative group">
                                <div className="size-32 rounded-full overflow-hidden border-4 border-base-100 shadow-lg">
                                    {selectedImg || authUser.profilePic ? (
                                        <img
                                            src={selectedImg || authUser.profilePic}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-5xl font-bold text-primary">
                                            {authUser?.fullName?.charAt(0) || "U"}
                                        </div>
                                    )}
                                </div>

                                <label
                                    htmlFor="avatar-upload"
                                    className={`
                    absolute bottom-0 right-0 
                    bg-primary hover:bg-primary-focus
                    p-2.5 rounded-full cursor-pointer 
                    transition-all duration-200 shadow-md
                    ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                  `}
                                >
                                    <Camera className="w-5 h-5 text-white" />
                                    <input
                                        type="file"
                                        id="avatar-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={isUpdatingProfile}
                                    />
                                </label>
                            </div>

                            {/* Name Display / Edit */}
                            <div className="mt-4 w-full flex flex-col items-center">
                                {isEditingName ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="input input-sm input-bordered w-full max-w-[150px]"
                                            autoFocus
                                        />
                                        <button onClick={handleUpdateName} className="btn btn-sm btn-circle btn-success btn-outline">
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => {
                                            setIsEditingName(false);
                                            setNewName(authUser.fullName);
                                        }} className="btn btn-sm btn-circle btn-error btn-outline">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-xl font-bold">{authUser.fullName}</h2>
                                        <button onClick={() => setIsEditingName(true)} className="btn btn-ghost btn-xs btn-circle opacity-60 hover:opacity-100">
                                            <Edit2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <p className="text-sm text-base-content/60">{authUser.email}</p>

                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                                <span className="badge badge-success badge-outline gap-1">
                                    <Shield className="w-3 h-3" /> Active
                                </span>
                                <span className="badge badge-neutral badge-outline gap-1">
                                    <Calendar className="w-3 h-3" /> Joined {authUser.createdAt ? authUser.createdAt.split("T")[0] : "N/A"}
                                </span>
                            </div>

                            {selectedImg && (
                                <button
                                    onClick={handleUpdateProfile}
                                    className="btn btn-primary w-full mt-6"
                                    disabled={isUpdatingProfile}
                                >
                                    {isUpdatingProfile ? "Saving..." : "Save Changes"}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Details & Config */}
                    <div className="md:col-span-2 space-y-6">

                        {/* Personal Information */}
                        <div className="card bg-base-200/50 backdrop-blur-xl border border-base-300 shadow-sm">
                            <div className="card-body">
                                <h3 className="card-title text-lg mb-4">Personal Information</h3>
                                <div className="grid gap-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text flex items-center gap-2">
                                                <User className="w-4 h-4" /> Full Name
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={authUser.fullName}
                                            className="input input-bordered w-full bg-base-100"
                                            readOnly
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text flex items-center gap-2">
                                                <Mail className="w-4 h-4" /> Email
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={authUser.email}
                                            className="input input-bordered w-full bg-base-100"
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security */}
                        <div className="card bg-base-200/50 backdrop-blur-xl border border-base-300 shadow-sm">
                            <div className="card-body">
                                <h3 className="card-title text-lg mb-4">Security</h3>
                                <ChangePassword />
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="card bg-base-200/50 backdrop-blur-xl border border-red-500/20 shadow-sm">
                            <div className="card-body">
                                <h3 className="card-title text-lg text-error mb-2">Danger Zone</h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Delete Account</p>
                                        <p className="text-sm text-base-content/60">Permanently remove your account and all data.</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                                                deleteAccount();
                                            }
                                        }}
                                        className="btn btn-error btn-outline btn-sm"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
export default ProfilePage;
