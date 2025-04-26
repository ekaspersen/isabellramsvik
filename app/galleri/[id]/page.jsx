// app/galleri/[id]/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectScroller } from "../components/ProjectScroller";
import { SpinningLoader } from "@/app/components/SpinningLoader";

export default function ProjectPage() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            setLoading(true);
            fetch(`/api/gallery/projects/${id}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        setProject(data.data);
                    } else {
                        console.error("Failed to fetch project:", data.error);
                    }
                })
                .catch((err) => console.error("Failed to fetch project:", err))
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    if (loading || !project) {
        return (
            <div className="h-screen grid place-items-center bg-black pb-128">
                <SpinningLoader />
            </div>
        );
    }

    const displayImage =
        project.images && project.images.length > 0 ? project.images[0] : null;

    return (
        <div className="bg-black flex flex-col overflow-x-hidden">
            <div className="inner flex flex-col gap-32">
                <div className="flex flex-col gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link
                            href="/galleri"
                            className="flex items-center text-primary-light hover:text-white"
                        >
                            <span className="text-5xl">{"<"}</span>
                            <span>Tilbake til galleri</span>
                        </Link>
                    </motion.div>

                    <motion.div
                        key={project.id}
                        className="flex flex-col lg:items-center gap-8 lg:flex-row lg:gap-12 items-center text-center lg:text-left"
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeIn" }}
                    >
                        {displayImage ? (
                            <Image
                                src={displayImage.url}
                                alt={displayImage.title || project.title}
                                width={1200}
                                height={600}
                                className="w-full max-w-fit lg:w-1/2 max-h-[480px] object-contain rounded-lg border-4 border-primary-light"
                            />
                        ) : (
                            <div className="w-full max-w-fit lg:w-1/2 max-h-[480px] bg-primary-dark rounded-lg border-4 border-primary-light flex items-center justify-center text-sm">
                                No Images
                            </div>
                        )}
                        <motion.div
                            className="flex flex-col gap-4 lg:gap-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: 0.3,
                                ease: "easeIn",
                            }}
                        >
                            <h1 className="text-4xl sm:text-6xl font-extralight">
                                {project.title}
                            </h1>
                            <p className="text-sm sm:text-base font-light max-w-2xl px-1">
                                {project.description}
                            </p>
                        </motion.div>
                    </motion.div>
                </div>

                <motion.div
                    className="flex flex-col gap-4 mt-[-64px]"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                >
                    <h2 className="text-2xl sm:text-3xl font-extralight">
                        Bilder i prosjektet
                    </h2>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                        {(project.images || []).map((image, index) => (
                            <motion.div
                                key={image.id}
                                className="cursor-pointer"
                                onClick={() => handleImageClick(image)}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.8 + index * 0.1,
                                }}
                            >
                                <Image
                                    src={image.url}
                                    alt={image.title || "Prosjektbilde"}
                                    width={200}
                                    height={200}
                                    className="w-full h-32 object-cover rounded border-2 border-primary-light hover:border-white"
                                />
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8">
                        <AnimatePresence mode="wait">
                            {selectedImage ? (
                                <motion.div
                                    key={selectedImage.id}
                                    className="flex flex-col gap-4 items-center text-center"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{
                                        duration: 0.2,
                                        ease: "easeIn",
                                    }}
                                >
                                    <Image
                                        src={selectedImage.url}
                                        alt={
                                            selectedImage.title || "Valgt bilde"
                                        }
                                        width={800}
                                        height={400}
                                        className="w-full max-h-[480px] object-contain max-w-fit rounded-lg border-4 border-primary-light"
                                    />
                                    <h3 className="text-2xl font-light mb-[-8px]">
                                        {selectedImage.title}
                                    </h3>
                                    <p className="text-sm max-w-2xl font-light">
                                        {selectedImage.description}
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.p
                                    key="no-image"
                                    className="text-sm text-primary-light italic"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    Klikk på et bilde for å se mer
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                <motion.div
                    className="flex flex-col gap-6"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 1 }}
                >
                    <h2 className="text-2xl sm:text-3xl font-extralight">
                        Sjekk ut andre prosjekter
                    </h2>
                    <ProjectScroller />
                </motion.div>

                <motion.div
                    className="pb-8 mt-[-64px]"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                >
                    <Link
                        href="/galleri"
                        className="flex items-center text-primary-light hover:text-white bg-black"
                    >
                        <span className="text-5xl">{"<"}</span>
                        <span>Tilbake til galleri</span>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
