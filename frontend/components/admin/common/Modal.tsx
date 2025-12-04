"use client";

import { X } from "lucide-react";

interface ModalProps {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}

export default function Modal({ title, onClose, children }: ModalProps) {
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">

                {/* Header */}
                <div className="p-6 border-b sticky top-0 bg-background flex justify-between items-center">
                    <h2 className="text-2xl font-serif">{title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-md">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {children}
                </div>

            </div>
        </div>
    );
}
