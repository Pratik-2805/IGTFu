"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

interface User {
    id: number;
    name: string;
    email: string;
    role: "admin" | "manager" | "sales"; // ADMIN ADDED
    status?: "active" | "inactive";
}

interface ManageTeamTabProps {
    team: User[];
    loading: boolean;
    createUser: (
        payload: { name: string; email: string; role: "manager" | "sales" }
    ) => Promise<{ ok: boolean; error?: any }>;
    deleteUser: (id: number) => Promise<boolean>;
}

export default function ManageTeamTab({
    team,
    loading,
    createUser,
    deleteUser,
}: ManageTeamTabProps) {

    const [showModal, setShowModal] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<"manager" | "sales">("manager");

    const openAddModal = () => {
        setName("");
        setEmail("");
        setRole("manager");
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        await createUser({ name, email, role });
        closeModal();
    };

    if (loading) {
        return (
            <div className="py-40 flex justify-center">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="font-serif text-3xl">Manage Team</h2>

                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-all duration-500 font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Add Team Member
                </button>
            </div>

            {/* Team List */}
            <div className="space-y-4">
                {team.map((user) => (
                    <div
                        key={user.id}
                        className="bg-muted/30 border-2 border-border rounded-lg p-6 hover:shadow-lg transition-all duration-500"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                            {/* Left section */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <h3 className="font-serif text-xl">{user.name}</h3>

                                    {/* Status Badge */}
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${user.status === "inactive"
                                            ? "bg-red-500 text-white"
                                            : "bg-green-500 text-white"
                                            }`}
                                    >
                                        {user.status === "inactive" ? "INACTIVE" : "ACTIVE"}
                                    </span>

                                    {/* ADMIN BADGE */}
                                    {user.role === "admin" && (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                                            ADMIN
                                        </span>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground mb-1">Email</p>
                                        <p className="font-medium">{user.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground mb-1">Role</p>
                                        <p className="font-medium uppercase">{user.role}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                {user.role !== "admin" ? (
                                    <button
                                        onClick={() => deleteUser(user.id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-500 flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed flex items-center gap-2"
                                    >
                                        Admin (Locked)
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {team.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No team members found.</p>
                    </div>
                )}
            </div>

            {/* Add User Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-background rounded-lg max-w-lg w-full shadow-xl overflow-hidden">

                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-background">
                            <h3 className="font-serif text-2xl">Add Team Member</h3>

                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-muted rounded-md transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">

                            <div>
                                <label className="block text-sm font-medium mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 rounded-md border border-border bg-background focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 rounded-md border border-border bg-background focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Role</label>
                                <select
                                    value={role}
                                    onChange={(e) =>
                                        setRole(e.target.value as "manager" | "sales")
                                    }
                                    className="w-full px-4 py-2 rounded-md border border-border bg-background"
                                >
                                    <option value="manager">Manager</option>
                                    <option value="sales">Sales</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-6 py-3 rounded-md border border-border hover:bg-muted transition-all duration-500 font-medium"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-all duration-500 font-medium"
                                >
                                    Add
                                </button>
                            </div>

                        </form>

                    </div>
                </div>
            )}
        </div>
    );
}
