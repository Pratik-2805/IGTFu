"use client";

import { useMemo, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { GalleryImage } from "@/utils/api";

interface GalleryTabProps {
    gallery: GalleryImage[];
    loading: boolean;

    imageFile: File | null;
    setImageFile: (f: File | null) => void;

    addGalleryImage: (data: Record<string, FormDataEntryValue>) => Promise<void> | void;
    deleteGalleryImage: (id: number) => void;
}

type PageType = GalleryImage["page"] | "";
type SectionType = GalleryImage["section"] | "";

/* ---------------------- OPTIONS ---------------------- */
const PAGE_OPTIONS = [
    { value: "about", label: "About" },
    { value: "gallery", label: "Gallery" },
];

const SECTION_OPTIONS = {
    about: [
        { value: "banner", label: "Banner (single image)" },
        { value: "why_exhibit", label: "Why Exhibit (≤ 10)" },
        { value: "why_choose_igtf", label: "Why Choose IGTF (≤ 10)" },
    ],
    gallery: [
        { value: "main", label: "Main (≤ 5 images)" },
        { value: "exhibition_moments", label: "Exhibition Moments (unlimited)" },
    ],
};

/* ---------------------- NORMALIZER ---------------------- */
const normalize = (str: string) =>
    str?.trim().toLowerCase().replace(/[\s-]+/g, "_");

export default function GalleryTab({
    gallery,
    loading,
    imageFile,
    setImageFile,
    addGalleryImage,
    deleteGalleryImage,
}: GalleryTabProps) {
    const [showModal, setShowModal] = useState(false);
    const [selectedPage, setSelectedPage] = useState<PageType>("");
    const [selectedSection, setSelectedSection] = useState<SectionType>("");

    const closeModal = () => {
        setShowModal(false);
        setImageFile(null);
    };

    /* ---------------------- FILTER ITEMS (FIXED) ---------------------- */
    const filteredItems = useMemo(() => {
        return gallery.filter((item) => {
            const pageMatch =
                !selectedPage ||
                normalize(item.page) === normalize(selectedPage);

            const sectionMatch =
                !selectedSection ||
                normalize(item.section) === normalize(selectedSection);

            return pageMatch && sectionMatch;
        });
    }, [gallery, selectedPage, selectedSection]);

    /* ---------------------- RULES ---------------------- */
    const { canAdd, limitText } = useMemo(() => {
        if (!selectedPage || !selectedSection) {
            return {
                canAdd: false,
                limitText: "Select a page and section.",
            };
        }

        const items = filteredItems;
        let canAdd = true;
        let limitText = "";

        if (selectedPage === "about" && selectedSection === "banner") {
            if (items.length >= 1) {
                canAdd = false;
                limitText = "Only 1 banner image allowed.";
            } else limitText = "Upload 1 banner image.";
        }

        else if (
            selectedPage === "about" &&
            ["why_exhibit", "why_choose_igtf"].includes(selectedSection)
        ) {
            if (items.length >= 10) {
                canAdd = false;
                limitText = "Max 10 images allowed.";
            } else limitText = `Images: ${items.length}/10`;
        }

        else if (selectedPage === "gallery" && selectedSection === "main") {
            if (items.length >= 5) {
                canAdd = false;
                limitText = "Max 5 images allowed.";
            } else limitText = `Images: ${items.length}/5`;
        }

        else {
            limitText = "Unlimited images allowed.";
        }

        return { canAdd, limitText };
    }, [filteredItems, selectedPage, selectedSection]);

    /* ---------------------- LOADING ---------------------- */
    if (loading) {
        return (
            <div className="py-40 flex justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading gallery...</p>
                </div>
            </div>
        );
    }

    /* ---------------------- UI ---------------------- */
    return (
        <div className="space-y-6">
            {/* FILTER BAR */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <label className="text-sm mb-1 block font-medium">Page</label>
                    <select
                        value={selectedPage}
                        onChange={(e) => {
                            setSelectedPage(e.target.value as PageType);
                            setSelectedSection("");
                        }}
                        className="px-3 py-2 border rounded-md w-full"
                    >
                        <option value="">Select Page</option>
                        {PAGE_OPTIONS.map((p) => (
                            <option key={p.value} value={p.value}>
                                {p.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex-1">
                    <label className="text-sm mb-1 block font-medium">Section</label>
                    <select
                        value={selectedSection}
                        disabled={!selectedPage}
                        onChange={(e) => setSelectedSection(e.target.value as SectionType)}
                        className="px-3 py-2 border rounded-md w-full disabled:bg-muted"
                    >
                        <option value="">Select Section</option>
                        {selectedPage &&
                            SECTION_OPTIONS[selectedPage]?.map((sec) => (
                                <option key={sec.value} value={sec.value}>
                                    {sec.label}
                                </option>
                            ))}
                    </select>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    disabled={!canAdd}
                    className={`px-5 py-2 rounded-md flex items-center gap-2 ${canAdd
                            ? "bg-primary text-white hover:bg-primary/90"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                        }`}
                >
                    <Plus className="w-4 h-4" /> Add
                </button>
            </div>

            <p className="text-xs text-muted-foreground">{limitText}</p>

            {/* IMAGE GRID */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((img) => (
                    <div
                        key={img.id}
                        className="bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-lg transition"
                    >
                        <img
                            src={img.image ?? ""}
                            className="w-full h-56 object-cover"
                            alt=""
                        />

                        <div className="p-4">
                            <button
                                onClick={() => deleteGalleryImage(img.id)}
                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-md"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl w-full max-w-lg shadow-xl overflow-hidden">
                        <div className="p-5 border-b flex justify-between items-center">
                            <h2 className="font-semibold text-xl">Upload Image</h2>
                            <button onClick={closeModal} className="p-2">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();

                                const data: Record<string, FormDataEntryValue> = {
                                    page: selectedPage,
                                    section: selectedSection,
                                };

                                await addGalleryImage(data);
                                closeModal();
                            }}
                            className="p-5 space-y-4"
                        >
                            <div>
                                <label className="block mb-2 font-medium text-sm">
                                    Select Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    required
                                    onChange={(e) =>
                                        setImageFile(e.target.files?.[0] || null)
                                    }
                                    className="w-full border rounded-md p-2"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 border rounded-md py-3 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-primary text-white rounded-md py-3 hover:bg-primary/80"
                                >
                                    Upload
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
