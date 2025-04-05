// app/admin/images/[id]/page.js
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { SpinningLoader } from "@/app/components/SpinningLoader";

export default function EditImage() {
    const { id } = useParams();
    const router = useRouter();
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [projectId, setProjectId] = useState("");
    const [displayInGallery, setDisplayInGallery] = useState(true);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch image and projects data
    useEffect(() => {
        Promise.all([
            fetch(`/api/images/${id}`).then((res) => res.json()),
            fetch("/api/projects").then((res) => res.json()),
        ])
            .then(([imageData, projectsData]) => {
                if (imageData.success) {
                    setImage(imageData.data);
                    setTitle(imageData.data.title || "");
                    setDescription(imageData.data.description || "");
                    setProjectId(imageData.data.projectId || "");
                    setDisplayInGallery(
                        imageData.data.displayInGallery !== false
                    );
                }
                if (Array.isArray(projectsData)) {
                    setProjects(projectsData);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch data:", err);
                setLoading(false);
            });
    }, [id]);

    // Submit updated image details
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await fetch(`/api/images/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                description,
                projectId: projectId || null,
                displayInGallery,
            }),
        });
        const data = await res.json();
        if (data.success) {
            router.push("/admin/images");
        } else {
            alert("Failed to update image: " + data.error.message);
        }
        setLoading(false);
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
            <h1 className="text-4xl md:text-5xl font-extralight">Edit Image</h1>
            <div className="flex flex-col md:flex-row gap-8">
                <Image
                    src={image.url}
                    alt={image.title || "Image"}
                    width={400}
                    height={200}
                    className="w-full max-w-fit max-h-fit md:w-1/2 h-64 md:h-96 object-contain rounded border-2 border-primary-light"
                />
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6 flex-1"
                >
                    <div className="flex flex-col gap-2">
                        <label className="text-sm">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-primary-dark border-2 border-primary-light rounded p-2 text-white"
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
                    <div className="flex flex-col gap-2">
                        <label className="text-sm">Project</label>
                        <select
                            value={projectId}
                            onChange={(e) => setProjectId(e.target.value)}
                            className="bg-primary-dark border-2 border-primary-light rounded p-2 text-white"
                        >
                            <option value="">No Project</option>
                            {projects.map((proj) => (
                                <option key={proj.id} value={proj.id}>
                                    {proj.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={displayInGallery}
                            onChange={(e) =>
                                setDisplayInGallery(e.target.checked)
                            }
                            className="w-5 h-5 accent-primary-light"
                        />
                        <label className="text-sm">Display in Gallery</label>
                    </div>
                    <button type="submit" className="btn-golden mt-4">
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}
