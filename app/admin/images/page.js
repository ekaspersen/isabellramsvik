"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ImagesList() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        fetch("/api/images")
            .then((res) => res.json())
            .then((data) => setImages(data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6 text-center">Alle Bilder</h2>
            <div className="text-center mb-6">
                <Link href="/admin/images/new">
                    <button className="btn-golden">Nytt Bilde</button>
                </Link>
            </div>
            {images.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {images.map((image) => (
                        <div
                            key={image.id}
                            className="bg-black border border-primary-light p-4 rounded-lg"
                        >
                            <img
                                src={image.url}
                                alt={image.title || "Image"}
                                className="w-full h-40 object-cover rounded mb-2"
                            />
                            <h4 className="text-lg text-primary-light font-medium">
                                {image.title}
                            </h4>
                            <Link href={`/admin/images/${image.id}`}>
                                <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                                    Rediger
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center">Ingen bilder funnet.</p>
            )}
        </div>
    );
}
