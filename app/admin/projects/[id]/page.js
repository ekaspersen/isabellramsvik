// app/admin/projects/[id]/page.js
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { SpinningLoader } from "@/app/components/SpinningLoader";

export default function EditProject() {
    const { id } = useParams();
    const router = useRouter();
    const [project, setProject] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/projects/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setProject(data.data);
                    setTitle(data.data.title);
                    setDescription(data.data.description);
                    setImages(data.data.images || []);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch project:", err);
                setLoading(false);
            });
    }, [id]);

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const reorderedImages = Array.from(images);
        const [movedImage] = reorderedImages.splice(result.source.index, 1);
        reorderedImages.splice(result.destination.index, 0, movedImage);
        setImages(reorderedImages);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const updatedImages = images.map((img, index) => ({
            ...img,
            position: index,
        }));
        const res = await fetch(`/api/projects/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description, images: updatedImages }),
        });
        const data = await res.json();
        if (data.success) {
            router.push("/admin/projects");
        } else {
            alert("Failed to update project: " + data.error.message);
        }
        setLoading(false);
    };

    const handleImageDelete = async (imageId) => {
        if (confirm("Delete this image?")) {
            const res = await fetch(`/api/images/${imageId}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success) {
                setImages(images.filter((img) => img.id !== imageId));
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
            <h1 className="text-4xl md:text-5xl font-extralight">
                Edit Project
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-primary-dark border-2 border-primary-light rounded p-2 text-white"
                        required
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-primary-dark border-2 border-primary-light rounded p-2 text-white h-32"
                    />
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="images">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                            >
                                {images.map((image, index) => (
                                    <Draggable
                                        key={image.id}
                                        draggableId={image.id.toString()}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="bg-primary-dark p-4 rounded-lg border-2 border-primary-light flex flex-col gap-2"
                                            >
                                                <Image
                                                    src={image.url}
                                                    alt={image.title || "Image"}
                                                    width={200}
                                                    height={100}
                                                    className="w-full h-24 object-cover rounded"
                                                />
                                                <p className="text-sm">
                                                    {image.title || "No Title"}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleImageDelete(
                                                            image.id
                                                        )
                                                    }
                                                    className="btn-inverted mt-auto"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

                <button type="submit" className="btn-golden mt-4">
                    Save Changes
                </button>
            </form>
        </div>
    );
}
