// app/admin/layout.js
"use client";
import { useState } from "react";
import Link from "next/link";

export default function AdminLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const navLinks = [
        { href: "/admin", label: "Dashboard" },
        { href: "/admin/projects", label: "Projects" },
        { href: "/admin/images", label: "Images" },
        { href: "/admin/messages", label: "Messages" },
    ];

    return (
        <div className="flex min-h-screen bg-black text-white">
            <aside
                className={`sticky left-0 w-64 bg-primary-dark p-6 transform transition-transform duration-300 top-0 z-[9999] ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0 md:static md:w-64`}
            >
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-extralight">Admin Panel</h1>
                    <button
                        className="md:hidden text-3xl"
                        onClick={toggleSidebar}
                    >
                        ×
                    </button>
                </div>
                <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="hover:text-primary-light"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            <main className="flex-1 p-4 md:p-8 md:ml-64">
                <button
                    className="md:hidden text-3xl mb-4"
                    onClick={toggleSidebar}
                >
                    ☰
                </button>
                {children}
            </main>
        </div>
    );
}
