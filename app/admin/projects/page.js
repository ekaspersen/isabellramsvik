// app/admin/projects/page.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProjectsList() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetch("/api/projects")
            .then((res) => res.json())
            .then((data) => setProjects(data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6 text-center">
                Alle Prosjekter
            </h2>
            <div className="text-center mb-6">
                <Link href="/admin/projects/new">
                    <button className="btn-golden">Nytt Prosjekt</button>
                </Link>
            </div>
            {projects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-black border border-primary-light p-4 rounded-lg"
                        >
                            <h3 className="text-lg font-semibold text-primary-light">
                                {project.title}
                            </h3>
                            {project.images?.[0]?.url && (
                                <img
                                    src={project.images[0].url}
                                    alt={
                                        project.images[0].title ||
                                        "Prosjektbilde"
                                    }
                                    className="w-full h-40 object-cover rounded my-2"
                                />
                            )}
                            <Link href={`/admin/projects/${project.id}`}>
                                <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                                    Rediger
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center">Ingen prosjekter funnet.</p>
            )}
        </div>
    );
}
