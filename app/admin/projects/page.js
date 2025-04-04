// app/admin/projects/page.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { SpinningLoader } from "@/app/components/SpinningLoader";

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        fetchProjects();
    }, [page]);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `/api/projects?page=${page}&limit=${limit}`
            );
            const data = await res.json();
            if (Array.isArray(data)) {
                setProjects(data);
            } else if (!data.success) {
                console.error("Error fetching projects:", data.error.message);
            }
        } catch (err) {
            console.error("Failed to fetch projects:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (id) => {
        setSelectedProjects((prev) =>
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = async () => {
        if (selectedProjects.length === 0) return;
        if (confirm(`Delete ${selectedProjects.length} project(s)?`)) {
            await Promise.all(
                selectedProjects.map((id) =>
                    fetch(`/api/projects/${id}`, { method: "DELETE" })
                )
            );
            setProjects(
                projects.filter((p) => !selectedProjects.includes(p.id))
            );
            setSelectedProjects([]);
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Delete this project?")) {
            const res = await fetch(`/api/projects/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success) {
                setProjects(projects.filter((p) => p.id !== id));
            } else {
                alert("Failed to delete project: " + data.error.message);
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
                <h1 className="text-4xl md:text-5xl font-extralight">
                    Projects
                </h1>
                <div className="flex gap-4">
                    {selectedProjects.length > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            className="btn-inverted bg-red-600 hover:bg-red-700"
                        >
                            Delete Selected ({selectedProjects.length})
                        </button>
                    )}
                    <Link href="/admin/projects/new" className="btn-golden">
                        New Project
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
                    disabled={projects.length < limit}
                    className="btn-golden"
                >
                    Next
                </button>
            </div>

            {projects.length === 0 ? (
                <p className="text-sm italic text-primary-light">
                    No projects yet. Create one to get started!
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-primary-dark p-4 rounded-lg border-2 border-primary-light flex flex-col gap-4"
                        >
                            {project.images && project.images[0] ? (
                                <Image
                                    src={project.images[0].url}
                                    alt={project.title}
                                    width={200}
                                    height={100}
                                    className="w-full h-24 object-cover rounded"
                                />
                            ) : (
                                <div className="w-full h-24 bg-primary rounded flex items-center justify-center text-sm">
                                    No Image
                                </div>
                            )}
                            <h3 className="text-lg font-light">
                                {project.title}
                            </h3>
                            <p className="text-sm line-clamp-2">
                                {project.description}
                            </p>
                            <div className="flex gap-2">
                                <input
                                    type="checkbox"
                                    checked={selectedProjects.includes(
                                        project.id
                                    )}
                                    onChange={() => handleSelect(project.id)}
                                    className="w-5 h-5 accent-primary-light"
                                />
                                <span>Select</span>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={`/admin/projects/${project.id}`}
                                    className="btn-golden flex-1 text-center"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(project.id)}
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
