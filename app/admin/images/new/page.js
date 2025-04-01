// app/admin/images/new/page.js
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateImage() {
    const [projects, setProjects] = useState([]);
    const [projectId, setProjectId] = useState("");
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetch("/api/projects")
            .then((res) => res.json())
            .then((data) => setProjects(data))
            .catch((err) => console.error(err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return alert("Image file is required");

        const formData = new FormData();
        formData.append("file", file);
        if (projectId) formData.append("projectId", projectId);
        formData.append("title", title);
        formData.append("description", description);

        const res = await fetch("/api/images", {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            router.push("/admin/images");
        } else {
            alert("Failed to upload image");
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 space-y-6">
            <h2 className="text-3xl font-bold text-center mb-4">Nytt bilde</h2>
            <form
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                className="space-y-4"
            >
                <div>
                    <label className="block font-medium mb-1">
                        Tilknytt til prosjekt (valgfritt):
                    </label>
                    <select
                        className="bg-black text-white border border-gray-500 rounded w-full p-2"
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
                    >
                        <option value="">-- Ingen --</option>
                        {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                                {project.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block font-medium mb-1">
                        Velg bilde:
                    </label>
                    <input
                        type="file"
                        required
                        onChange={(e) => setFile(e.target.files[0])}
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
                <div className="text-center">
                    <button type="submit" className="btn-golden">
                        Last opp
                    </button>
                </div>
            </form>
        </div>
    );
}
