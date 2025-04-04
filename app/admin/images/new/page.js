// app/admin/images/new/page.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SpinningLoader } from "@/app/components/SpinningLoader";

export default function NewImage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [projectId, setProjectId] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch("/api/projects")
            .then((res) => res.json())
            .then((data) => setProjects(Array.isArray(data) ? data : []))
            .catch((err) => console.error("Failed to fetch projects:", err));
    }, []);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const previewUrl = URL.createObjectURL(selectedFile);
            setPreview(previewUrl);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please upload an image.");
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("projectId", projectId || "");

        try {
            const res = await fetch("/api/images", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                router.push("/admin/images");
            } else {
                alert("Failed to upload image: " + data.error.message);
            }
        } catch (err) {
            console.error("Error uploading image:", err);
            alert("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-4xl md:text-5xl font-extralight">New Image</h1>
            {loading ? (
                <div className="h-screen grid place-items-center">
                    <SpinningLoader />
                </div>
            ) : (
                <div className="flex flex-col md:flex-row gap-8">
                    {preview && (
                        <div className="w-full md:w-1/2 flex flex-col items-center">
                            <Image
                                src={preview}
                                alt="Image Preview"
                                width={400}
                                height={200}
                                className="w-full h-48 md:h-64 object-cover rounded border-2 border-primary-light"
                            />
                            <p className="text-sm mt-2">{file.name}</p>
                        </div>
                    )}
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
                            <label className="text-sm">
                                Project (Optional)
                            </label>
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
                        <div className="flex flex-col gap-2">
                            <label className="text-sm">Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="bg-primary-dark border-2 border-primary-light rounded p-2 text-white"
                            />
                        </div>
                        <button type="submit" className="btn-golden mt-4">
                            Upload Image
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
