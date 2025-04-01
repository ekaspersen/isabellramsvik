// app/admin/projects/[id]/page.js
"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditProject() {
    const router = useRouter();
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (id) {
            fetch(`/api/projects/${id}`)
                .then((res) => res.json())
                .then((data) => {
                    setTitle(data.title);
                    setDescription(data.description);
                    const sortedImages = data.images.sort(
                        (a, b) => (a.position || a.id) - (b.position || b.id)
                    );
                    setImages(sortedImages);
                })
                .catch((err) => console.error(err));
        }
    }, [id]);

    const moveImageUp = (index) => {
        if (index === 0) return;
        const newImages = [...images];
        [newImages[index - 1], newImages[index]] = [
            newImages[index],
            newImages[index - 1],
        ];
        setImages(newImages);
    };

    const moveImageDown = (index) => {
        if (index === images.length - 1) return;
        const newImages = [...images];
        [newImages[index], newImages[index + 1]] = [
            newImages[index + 1],
            newImages[index],
        ];
        setImages(newImages);
    };

    const handleImageChange = (index, field, value) => {
        const newImages = [...images];
        newImages[index][field] = value;
        setImages(newImages);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const updatedImages = images.map((img, idx) => ({
            id: img.id,
            title: img.title,
            description: img.description,
            position: idx + 1,
        }));
        const res = await fetch(`/api/projects/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description, images: updatedImages }),
        });
        if (res.ok) {
            router.push("/admin/projects");
        } else {
            console.error("Update failed");
        }
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this project?")) {
            const res = await fetch(`/api/projects/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                router.push("/admin/projects");
            } else {
                console.error("Delete failed");
            }
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-center mb-6">
                Rediger Prosjekt
            </h2>
            <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                    <label className="block text-lg font-medium">Tittel:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    />
                </div>
                <div>
                    <label className="block text-lg font-medium">
                        Beskrivelse:
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    />
                </div>

                <div>
                    <h3 className="text-xl font-bold mb-2">Bilder</h3>
                    {images.map((img, index) => (
                        <div
                            key={img.id}
                            className="border border-primary-light bg-black rounded-md p-4 mb-4"
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                                <img
                                    src={img.url}
                                    alt={img.title || "Project Image"}
                                    className="w-full md:w-48 h-32 object-cover rounded mb-4 md:mb-0"
                                />
                                <div className="flex-1">
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium">
                                            Bilde Tittel:
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
                                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">
                                            Bilde Beskrivelse:
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
                                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col items-center space-y-2 mt-4 md:mt-0">
                                    <button
                                        type="button"
                                        onClick={() => moveImageUp(index)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveImageDown(index)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                    >
                                        ↓
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center gap-4">
                    <button type="submit" className="btn-golden">
                        Oppdater
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Slett Prosjekt
                    </button>
                </div>
            </form>
        </div>
    );
}
