// app/admin/projects/new/page.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SpinningLoader } from "@/app/components/SpinningLoader";

export default function NewProject() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([
        {
            file: null,
            title: "",
            description: "",
            preview: null,
            displayInGallery: true,
        },
    ]);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (index, field, value) => {
        const updatedImages = [...images];
        if (field === "file" && value) {
            const file = value[0];
            updatedImages[index] = {
                ...updatedImages[index],
                file,
                preview: URL.createObjectURL(file),
            };
        } else if (field === "displayInGallery") {
            updatedImages[index] = {
                ...updatedImages[index],
                displayInGallery: value,
            };
        } else {
            updatedImages[index] = { ...updatedImages[index], [field]: value };
        }
        setImages(updatedImages);
    };

    const addImageField = () => {
        setImages([
            ...images,
            {
                file: null,
                title: "",
                description: "",
                preview: null,
                displayInGallery: true,
            },
        ]);
    };

    const removeImageField = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (images.some((img) => !img.file)) {
            alert("Please upload an image for each entry.");
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("imagesCount", images.length);
        images.forEach((img, index) => {
            formData.append(`file_${index}`, img.file);
            formData.append(`title_${index}`, img.title);
            formData.append(`description_${index}`, img.description);
            formData.append(`displayInGallery_${index}`, img.displayInGallery);
        });

        try {
            const res = await fetch("/api/projects", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                router.push("/admin/projects");
            } else {
                alert("Failed to create project: " + data.error.message);
            }
        } catch (err) {
            console.error("Error creating project:", err);
            alert("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        return () =>
            images.forEach(
                (img) => img.preview && URL.revokeObjectURL(img.preview)
            );
    }, [images]);

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-4xl md:text-5xl font-extralight">
                New Project
            </h1>
            {loading ? (
                <div className="h-screen grid place-items-center">
                    <SpinningLoader />
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm">Project Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-primary-dark border-2 border-primary-light rounded p-2 text-white"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm">Project Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="bg-primary-dark border-2 border-primary-light rounded p-2 text-white h-32"
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <h2 className="text-2xl font-extralight">Images</h2>
                        {images.map((img, index) => (
                            <div
                                key={index}
                                className="bg-primary-dark p-4 rounded-lg border-2 border-primary-light flex flex-col md:flex-row gap-4"
                            >
                                <div className="flex flex-col gap-2 flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            handleImageChange(
                                                index,
                                                "file",
                                                e.target.files
                                            )
                                        }
                                        className="bg-primary-dark border-2 border-primary-light rounded p-2 text-white"
                                    />
                                    <input
                                        type="text"
                                        value={img.title}
                                        onChange={(e) =>
                                            handleImageChange(
                                                index,
                                                "title",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Image Title"
                                        className="bg-primary-dark border-2 border-primary-light rounded p-2 text-white"
                                    />
                                    <textarea
                                        value={img.description}
                                        onChange={(e) =>
                                            handleImageChange(
                                                index,
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Image Description"
                                        className="bg-primary-dark border-2 border-primary-light rounded p-2 text-white h-24"
                                    />
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={img.displayInGallery}
                                            onChange={(e) =>
                                                handleImageChange(
                                                    index,
                                                    "displayInGallery",
                                                    e.target.checked
                                                )
                                            }
                                            className="w-5 h-5 accent-primary-light"
                                        />
                                        <label className="text-sm">
                                            Display in gallery
                                        </label>
                                    </div>
                                    {images.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeImageField(index)
                                            }
                                            className="btn-inverted bg-red-600 hover:bg-red-700 mt-2"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                {img.preview && (
                                    <div className="flex flex-col items-center">
                                        <Image
                                            src={img.preview}
                                            alt={`Preview ${index + 1}`}
                                            width={200}
                                            height={100}
                                            className="w-full md:w-48 h-24 object-cover rounded border-2 border-primary-light"
                                        />
                                        <p className="text-sm mt-2">
                                            {img.file?.name}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addImageField}
                            className="btn-golden mt-2 w-full md:w-auto"
                        >
                            Add Another Image
                        </button>
                    </div>

                    <button type="submit" className="btn-golden mt-4">
                        Create Project
                    </button>
                </form>
            )}
        </div>
    );
}
