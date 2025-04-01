// app / admin / layout.js;
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProject() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const router = useRouter();

    const handleAddImage = () => {
        setImages([
            ...images,
            { file: null, title: "", description: "", preview: "" },
        ]);
    };

    const handleImageChange = (index, field, value) => {
        const newImages = [...images];
        newImages[index][field] = value;
        setImages(newImages);
    };

    const handleFileChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageChange(index, "file", file);
            const previewUrl = URL.createObjectURL(file);
            handleImageChange(index, "preview", previewUrl);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("imagesCount", images.length);
        images.forEach((img, index) => {
            if (img.file) {
                formData.append(`file_${index}`, img.file);
            }
            formData.append(`title_${index}`, img.title);
            formData.append(`description_${index}`, img.description);
        });

        const res = await fetch("/api/projects", {
            method: "POST",
            body: formData,
        });
        if (res.ok) {
            router.push("/admin/projects");
        } else {
            console.error("Failed to create project");
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6">
            <h2 className="text-2xl font-bold text-center mb-6">
                Create New Project
            </h2>
            <form
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                className="space-y-6"
            >
                <div>
                    <label className="block font-medium">Project Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                    />
                </div>
                <div>
                    <label className="block font-medium">
                        Project Description:
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 p-2"
                    />
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-4">Images</h3>
                    {images.map((img, index) => (
                        <div key={index} className="border rounded-md p-4 mb-4">
                            <div className="mb-2">
                                <label className="block font-medium">
                                    File:
                                </label>
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(index, e)}
                                    required
                                    className="mt-1 block w-full"
                                />
                            </div>
                            {img.preview && (
                                <div className="mb-2">
                                    <img
                                        src={img.preview}
                                        alt="Preview"
                                        className="w-full h-48 object-cover rounded"
                                    />
                                </div>
                            )}
                            <div className="mb-2">
                                <label className="block font-medium">
                                    Image Title:
                                </label>
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
                                    className="mt-1 block w-full rounded-md border-gray-300 p-2"
                                />
                            </div>
                            <div>
                                <label className="block font-medium">
                                    Image Description:
                                </label>
                                <textarea
                                    value={img.description}
                                    onChange={(e) =>
                                        handleImageChange(
                                            index,
                                            "description",
                                            e.target.value
                                        )
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 p-2"
                                />
                            </div>
                        </div>
                    ))}
                    <div className="text-center mb-4">
                        <button
                            type="button"
                            onClick={handleAddImage}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Add Image
                        </button>
                    </div>
                </div>
                <div className="text-center">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                        Create Project
                    </button>
                </div>
            </form>
        </div>
    );
}
