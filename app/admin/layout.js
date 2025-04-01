// app/admin/layout.js
"use client";
import Link from "next/link";

export default function AdminLayout({ children }) {
    return (
        <div className="max-w-5xl mx-auto p-8 font-sans">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold">Admin Panel</h1>
                <nav className="mt-8 flex justify-center flex-col gap-8 md:flex-row md:gap-4">
                    <Link href="/admin">
                        <span className="btn-inverted mx-2">Dashboard</span>
                    </Link>
                    <Link href="/admin/projects">
                        <span className="btn-inverted mx-2">Prosjekter</span>
                    </Link>
                    <Link href="/admin/images">
                        <span className="btn-inverted mx-2">Bilder</span>
                    </Link>
                    <Link href="/admin/messages">
                        <span className="btn-inverted mx-2">Ønsker</span>
                    </Link>
                </nav>
            </header>
            <main>{children}</main>
        </div>
    );
}
