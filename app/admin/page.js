// app/admin/page.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { SpinningLoader } from "@/app/components/SpinningLoader";

export default function Dashboard() {
    const [stats, setStats] = useState({ projects: 0, images: 0, messages: 0 });
    const [recentMessages, setRecentMessages] = useState([]);
    const [recentProjects, setRecentProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch("/api/projects?page=1&limit=3").then((res) => res.json()),
            fetch("/api/images?page=1&limit=10").then((res) => res.json()),
            fetch("/api/messages?page=1&limit=3").then((res) => res.json()),
        ])
            .then(([projects, images, messages]) => {
                if (
                    Array.isArray(projects) &&
                    Array.isArray(images) &&
                    Array.isArray(messages)
                ) {
                    setStats({
                        projects: projects.length,
                        images: images.length,
                        messages: messages.length,
                    });
                    setRecentProjects(projects.slice(0, 3));
                    setRecentMessages(messages.slice(0, 3));
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load dashboard data:", err);
                setLoading(false);
            });
    }, []);

    const hasNumbers = (text) => /\d/.test(text);

    if (loading) {
        return (
            <div className="h-screen grid place-items-center">
                <SpinningLoader />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-12">
            <h1 className="text-4xl md:text-5xl font-extralight">
                Welcome, Admin
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="bg-primary-dark p-6 rounded-lg border-2 border-primary-light flex flex-col items-center text-center">
                    <h2 className="text-3xl md:text-4xl">{stats.projects}</h2>
                    <p className="text-sm md:text-base">Projects</p>
                    <Link href="/admin/projects" className="btn-golden mt-4">
                        Manage
                    </Link>
                </div>
                <div className="bg-primary-dark p-6 rounded-lg border-2 border-primary-light flex flex-col items-center text-center">
                    <h2 className="text-3xl md:text-4xl">{stats.images}</h2>
                    <p className="text-sm md:text-base">Images</p>
                    <Link href="/admin/images" className="btn-golden mt-4">
                        Manage
                    </Link>
                </div>
                <div className="bg-primary-dark p-6 rounded-lg border-2 border-primary-light flex flex-col items-center text-center">
                    <h2 className="text-3xl md:text-4xl">{stats.messages}</h2>
                    <p className="text-sm md:text-base">Messages</p>
                    <Link href="/admin/messages" className="btn-golden mt-4">
                        View All
                    </Link>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl md:text-3xl font-extralight">
                        Recent Messages
                    </h2>
                    <Link href="/admin/messages" className="btn-inverted">
                        See All
                    </Link>
                </div>
                {recentMessages.length === 0 ? (
                    <p className="text-sm italic text-primary-light">
                        No messages yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentMessages.map((message) => (
                            <div
                                key={message.id}
                                className="bg-primary-dark p-4 rounded-lg border-2 border-primary-light"
                            >
                                <h3 className="text-lg font-light">
                                    {message.fullname}
                                </h3>
                                <p className="text-sm opacity-70">
                                    {message.email}{" "}
                                    {hasNumbers(message.phone)
                                        ? `| ${message.phone}`
                                        : ""}
                                </p>
                                <p className="text-sm line-clamp-2 mt-2">
                                    {message.wish}
                                </p>
                                <p className="text-xs mt-2 opacity-50">
                                    {new Date(
                                        message.createdAt
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl md:text-3xl font-extralight">
                        Recent Projects
                    </h2>
                    <Link href="/admin/projects" className="btn-inverted">
                        See All
                    </Link>
                </div>
                {recentProjects.length === 0 ? (
                    <p className="text-sm italic text-primary-light">
                        No projects yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentProjects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-primary-dark p-4 rounded-lg border-2 border-primary-light"
                            >
                                {project.images && project.images[0] ? (
                                    <Image
                                        src={project.images[0].url}
                                        alt={project.title}
                                        width={200}
                                        height={100}
                                        className="w-full h-24 object-cover rounded mb-2"
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
                                <Link
                                    href={`/admin/projects/${project.id}`}
                                    className="btn-golden mt-4 inline-block"
                                >
                                    Edit
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
