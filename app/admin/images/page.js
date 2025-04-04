"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { SpinningLoader } from "@/app/components/SpinningLoader";

export default function Images() {
    const [images, setImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        fetchImages();
    }, [page]);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/images?page=${page}&limit=${limit}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setImages(data);
            } else if (!data.success) {
                console.error("Error fetching images:", data.error.message);
            }
        } catch (err) {
            console.error("Failed to fetch images:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (id) => {
        setSelectedImages((prev) =>
            prev.includes(id) ? prev.filter((iid) => iid !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = async () => {
        if (selectedImages.length === 0) return;
        if (confirm(`Delete ${selectedImages.length} image(s)?`)) {
            await Promise.all(
                selectedImages.map((id) =>
                    fetch(`/api/images/${id}`, { method: "DELETE" })
                )
            );
            setImages(images.filter((img) => !selectedImages.includes(img.id)));
            setSelectedImages([]);
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Delete this image?")) {
            const res = await fetch(`/api/images/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                setImages(images.filter((img) => img.id !== id));
            } else {
                alert("Failed to delete image: " + data.error.message);
            }
        }
    };

    if (loading) {
        return (
            <div className="h-screen grid place-items-center">
                <SpinningLoader />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-4xl md:text-5xl font-extralight">Images</h1>
                <div className="flex gap-4">
                    {selectedImages.length > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            className="btn-inverted bg-red-600 hover:bg-red-700"
                        >
                            Delete Selected ({selectedImages.length})
                        </button>
                    )}
                    <Link href="/admin/images/new" className="btn-golden">
                        New Image
                    </Link>
                </div>
            </div>

            <div className="flex justify-between mb-4">
                <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="btn-inverted"
                >
                    Previous
                </button>
                <span>Page {page}</span>
                <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={images.length < limit}
                    className="btn-golden"
                >
                    Next
                </button>
            </div>

            {images.length === 0 ? (
                <p className="text-sm italic text-primary-light">
                    No images yet. Upload one to get started!
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((image) => (
                        <div
                            key={image.id}
                            className="bg-primary-dark p-4 rounded-lg border-2 border-primary-light flex flex-col gap-4"
                        >
                            <Image
                                src={image.url}
                                alt={image.title || "Image"}
                                width={200}
                                height={200}
                                className="w-full max-w-fit mx-auto h-48 object-contain rounded border-2 border-primary-light"
                            />
                            <h2 className="text-xl font-light mt-auto">
                                {image.title || "No Title"}
                            </h2>
                            <p className="text-sm line-clamp-2">
                                {image.description}
                            </p>
                            <div className="flex gap-2">
                                <input
                                    type="checkbox"
                                    checked={selectedImages.includes(image.id)}
                                    onChange={() => handleSelect(image.id)}
                                    className="w-5 h-5 accent-primary-light"
                                />
                                <span>Select</span>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={`/admin/images/${image.id}`}
                                    className="btn-golden flex-1 text-center"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(image.id)}
                                    className="btn-inverted flex-1"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
