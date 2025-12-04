"use client";

import { useState, useEffect, useCallback } from "react";
import { URLS, GalleryImage } from "@/utils/api";
import { toast } from "react-hot-toast";

// Auth-aware fetch
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { useAuth } from "@/hooks/useAuth";

interface UseGalleryOptions {
  enabled?: boolean;
  page?: GalleryImage["page"];
  section?: GalleryImage["section"];
}

export function useGallery(options: UseGalleryOptions = {}) {
  const { enabled = true, page, section } = options;

  const authFetch = useAuthFetch();

  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Uploading state

  // Files
  const [imageFile, setImageFile] = useState<File | null>(null);

  const GALLERY_URL = URLS.GALLERY;

  // -----------------------------------------------------
  // FETCH GALLERY
  // -----------------------------------------------------
  const fetchGallery = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);

      const url = new URL(GALLERY_URL);
      if (page) url.searchParams.set("page", page);
      if (section) url.searchParams.set("section", section);

      const res = await authFetch(url.toString(), { method: "GET" });
      if (!res.ok) throw new Error("Failed to fetch gallery");

      const data = await res.json();
      setGallery(Array.isArray(data) ? data : data.results ?? []);
    } catch (err) {
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  }, [enabled, page, section, authFetch]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  // -----------------------------------------------------
  // ADD NEW GALLERY ITEM
  // -----------------------------------------------------
  const addGalleryImage = async (
    payload: Record<string, FormDataEntryValue>
  ) => {
    try {
      const formData = new FormData();

      // Only append allowed model fields
      if (payload.page) formData.append("page", payload.page);
      if (payload.section) formData.append("section", payload.section);

      // append file
      if (imageFile) {
        formData.append("image", imageFile);
      } else {
        toast.error("Please select an image.");
        return;
      }

      const res = await authFetch(GALLERY_URL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      toast.success("Uploaded successfully!");

      setImageFile(null);
      fetchGallery();
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  // -----------------------------------------------------
  // DELETE ITEM
  // -----------------------------------------------------
  const deleteGalleryImage = async (id: number) => {
    if (!confirm("Are you sure you want to delete this?")) return;

    try {
      const res = await authFetch(`${GALLERY_URL}${id}/`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      toast.success("Deleted!");
      fetchGallery();
    } catch (err) {
      toast.error("Could not delete.");
    }
  };

  return {
    gallery,
    loading,

    imageFile,
    setImageFile,

    addGalleryImage,
    deleteGalleryImage,

    refetch: fetchGallery,
  };
}
