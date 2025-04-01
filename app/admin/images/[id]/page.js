// app/admin/images/[id]/page.js
"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditImage() {
    const router = useRouter();
    const { id } = useParams();
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [projectId, setProjectId] = useState("");
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetch("/api/projects")
            .then((res) => res.json())
            .then(setProjects)
            .catch(console.error);

        if (id) {
            fetch(`/api/images/${id}`)
                .then((res) => res.json())
                .then((data) => {
                    setUrl(data.url);
                    setTitle(data.title || "");
                    setDescription(data.description || "");
                    setProjectId(data.projectId || "");
                })
                .catch(console.error);
        }
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const res = await fetch(`/api/images/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                url,
                title,
                description,
                projectId: projectId ? parseInt(projectId) : null,
            }),
        });
        if (res.ok) {
            router.push("/admin/images");
        } else {
            console.error("Update failed");
        }
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this image?")) {
            const res = await fetch(`/api/images/${id}`, { method: "DELETE" });
            if (res.ok) {
                router.push("/admin/images");
            } else {
                console.error("Delete failed");
            }
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 space-y-6">
            <h2 className="text-3xl font-bold text-center mb-4">
                Rediger bilde
            </h2>
            <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">
                        Lenke til bilde (URL):
                    </label>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                        className="bg-black text-white border border-gray-500 rounded w-full p-2"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Tittel:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-black text-white border border-gray-500 rounded w-full p-2"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">
                        Beskrivelse:
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-black text-white border border-gray-500 rounded w-full p-2"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">
                        Tilhørende prosjekt:
                    </label>
                    <select
                        value={projectId || ""}
                        onChange={(e) => setProjectId(e.target.value)}
                        className="bg-black text-white border border-gray-500 rounded w-full p-2"
                    >
                        <option value="">-- Ingen --</option>
                        {projects.map((proj) => (
                            <option key={proj.id} value={proj.id}>
                                {proj.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-between">
                    <button type="submit" className="btn-golden">
                        Lagre endringer
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="btn-inverted border-red-500 text-red-400 hover:text-white"
                    >
                        Slett bilde
                    </button>
                </div>
            </form>
        </div>
    );
}
