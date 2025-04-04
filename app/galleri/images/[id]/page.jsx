"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion"; // Add AnimatePresence
import { SpinningLoader } from "@/app/components/SpinningLoader";

export default function ImagePage() {
    const { id } = useParams();
    const [image, setImage] = useState(null);
    const [allImages, setAllImages] = useState([]);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/images/${id}`)
            .then((res) => res.json())
            .then((response) => {
                if (response.success && response.data) {
                    setImage(response.data);
                    if (response.data.projectId) {
                        fetch(`/api/projects/${response.data.projectId}`)
                            .then((res) => res.json())
                            .then((projResponse) => {
                                if (projResponse.success && projResponse.data) {
                                    setProject(projResponse.data);
                                }
                            })
                            .catch((err) =>
                                console.error("Failed to fetch project:", err)
                            );
                    }
                } else {
                    console.error("Failed to fetch image:", response.error);
                }
            })
            .catch((err) => console.error("Failed to fetch image:", err));

        fetch("/api/images")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setAllImages(data);
                } else {
                    console.error(
                        "Expected array from /api/images, got:",
                        data
                    );
                    setAllImages([]);
                }
            })
            .catch((err) => {
                console.error("Failed to fetch images:", err);
                setAllImages([]);
            })
            .finally(() => setLoading(false));
    }, [id]);

    const currentIndex = allImages.findIndex(
        (img) => img && img.id === parseInt(id)
    );
    const prevImage = currentIndex > 0 ? allImages[currentIndex - 1] : null;
    const nextImage =
        currentIndex < allImages.length - 1
            ? allImages[currentIndex + 1]
            : null;

    if (loading || !image) {
        return (
            <div className="h-screen grid place-items-center bg-black pb-128">
                <SpinningLoader />
            </div>
        );
    }

    return (
        <div className="bg-black flex flex-col min-h-screen pb-16 overflow-y-hidden">
            <motion.div
                className="pb-8 inner"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Link
                    href="/galleri"
                    className="flex items-center text-primary-light hover:text-white bg-black"
                >
                    <span className="text-5xl">{"<"}</span>
                    <span>Tilbake til galleri</span>
                </Link>
            </motion.div>

            <div className="inner flex flex-col gap-32 overflow-hidden">
                <motion.div
                    key={image.id} // Re-run animation when image changes
                    className="flex flex-col gap-8 items-center text-center lg:text-left"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="flex flex-col lg:items-center gap-8 lg:flex-row lg:gap-12">
                        <Image
                            src={image.url}
                            alt={image.title || "Bilde"}
                            width={1200}
                            height={600}
                            className="mx-auto lg:mx-0 w-full max-w-fit lg:w-1/2 max-h-[480px] object-contain rounded-lg border-4 border-primary-light"
                        />
                        <motion.div
                            className="flex flex-col gap-4 md:gap-8"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <h1 className="text-4xl lg:text-6xl font-extralight text-pretty">
                                {image.title || "Uten tittel"}
                            </h1>
                            <p className="text-sm sm:text-base max-w-2xl text-pretty font-light">
                                {image.description ||
                                    "Ingen beskrivelse tilgjengelig."}
                            </p>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    className="flex justify-between items-center mt-[-64px]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    {prevImage ? (
                        <Link
                            href={`/galleri/images/${prevImage.id}`}
                            className="btn-inverted"
                        >
                            Forrige bilde
                        </Link>
                    ) : (
                        <div></div>
                    )}
                    {nextImage && (
                        <Link
                            href={`/galleri/images/${nextImage.id}`}
                            className="btn-golden"
                        >
                            Neste bilde
                        </Link>
                    )}
                </motion.div>

                {project && (
                    <motion.div
                        key={project.id} // Re-run animation when project changes
                        className="flex flex-col gap-8 mt-[-64px] mx-auto items-center"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.8 }}
                    >
                        <h2 className="text-2xl sm:text-3xl font-extralight">
                            Bilde tilhører dette prosjektet
                        </h2>
                        <div className="flex flex-col items-center max-w-fit lg:flex-row gap-8">
                            {project.images && project.images.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 1 }}
                                >
                                    <Image
                                        src={project.images[0].url}
                                        alt={project.title}
                                        width={288}
                                        height={144}
                                        className="max-w-fit max-h-fit h-56 object-contain rounded border-2 border-primary-light"
                                    />
                                </motion.div>
                            )}
                            <motion.div
                                className="flex flex-col gap-6 justify-center items-center lg:items-start text-center lg:text-left"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 1.2 }}
                            >
                                <h3 className="text-3xl font-extralight mb-[-12px]">
                                    {project.title}
                                </h3>
                                <p className="text-sm line-clamp-3 max-w-xl">
                                    {project.description}
                                </p>
                                <Link
                                    href={`/galleri/${project.id}`}
                                    className="max-w-fit"
                                >
                                    <div className="btn-golden">
                                        Se hele prosjektet
                                    </div>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
