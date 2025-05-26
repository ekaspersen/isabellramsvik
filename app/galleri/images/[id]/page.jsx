// app/galleri/images/[id]/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import imagesData from "../../../api/gallery/data/images.json";
import projectsData from "../../../api/gallery/data/projects.json";

export default function ImagePage() {
    const { id } = useParams();
    const [image, setImage] = useState(null);
    const [allImages, setAllImages] = useState([]);
    const [project, setProject] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            const foundImage = imagesData.images.find(
                (img) => img.id === parseInt(id)
            );
            if (!foundImage) {
                throw new Error("Bilde ikke funnet");
            }
            setImage(foundImage);

            const galleryImages = imagesData.images.filter(
                (img) => img.displayInGallery
            );
            setAllImages(galleryImages);

            if (foundImage && foundImage.projectId !== 0) {
                const foundProject = projectsData.projects.find(
                    (proj) => proj.id === foundImage.projectId
                );
                if (foundProject) {
                    const projectWithImages = {
                        ...foundProject,
                        images: foundProject.imageIds
                            .map((imageId) =>
                                imagesData.images.find(
                                    (img) => img.id === imageId
                                )
                            )
                            .filter(Boolean),
                    };
                    setProject(projectWithImages);
                }
            }
        } catch (err) {
            console.error("Failed to process image data:", err);
            setError(err.message || "Kunne ikke laste bilde.");
        }
    }, [id]);

    const currentIndex = allImages.findIndex(
        (img) => img && img.id === parseInt(id)
    );
    const prevImage = currentIndex > 0 ? allImages[currentIndex - 1] : null;
    const nextImage =
        currentIndex < allImages.length - 1
            ? allImages[currentIndex + 1]
            : null;

    if (error) {
        return (
            <div className="h-screen grid place-items-center bg-black pb-128">
                <p className="text-primary-light">{error}</p>
            </div>
        );
    }

    if (!image) {
        return (
            <div className="h-screen grid place-items-center bg-black pb-128">
                <p className="text-primary-light">Laster...</p>
            </div>
        );
    }

    return (
        <div className="bg-black flex flex-col min-h-screen pb-16 overflow-y-hidden">
            <div
                className="pb-8 inner fade-up"
            >
                <Link
                    href="/galleri"
                    className="flex items-center text-primary-light hover:text-white bg-black"
                >
                    <span className="text-5xl">{"<"}</span>
                    <span>Tilbake til galleri</span>
                </Link>
            </div>

            <div className="inner flex flex-col gap-32 overflow-hidden fade-up">
                <div
                    key={image.id}
                    className="flex flex-col gap-8 items-center text-center lg:text-left fade-up"
                >
                    <div className="flex flex-col lg:items-center gap-8 lg:flex-row lg:gap-12 fade-up">
                        <Image
                            src={image.url}
                            alt={image.title || "Bilde"}
                            width={1200}
                            height={600}
                            className="mx-auto lg:mx-0 w-full max-w-fit lg:w-1/2 max-h-[480px] object-contain rounded-lg border-4 border-primary-light fade-up"
                            onError={(e) => {
                                console.error(
                                    `Failed to load image: ${image.url}`
                                );
                                e.target.src = "/images/fallback.jpg";
                            }}
                        />
                        <div
                            className="flex flex-col gap-4 md:gap-8 fade-up"
                        >
                            <h1 className="text-4xl lg:text-6xl font-extralight text-pretty fade-up">
                                {image.title || "Uten tittel"}
                            </h1>
                            <p className="text-sm sm:text-base max-w-2xl text-pretty font-light fade-up">
                                {image.description ||
                                    "Ingen beskrivelse tilgjengelig."}
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="flex justify-between items-center mt-[-64px] transition-all duration-500 opacity-100 translate-y-0"
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
                </div>

                {project && (
                    <div
                        key={project.id}
                        className="flex flex-col gap-8 mt-[-64px] mx-auto items-center fade-up"
                    >
                        <h2 className="text-2xl sm:text-3xl font-extralight">
                            Bilde tilhører dette prosjektet
                        </h2>
                        <div className="flex flex-col items-center max-w-fit lg:flex-row gap-8 fade-up">
                            {project.images && project.images.length > 0 && (
                                <div
                                >
                                    <Image
                                        src={project.images[0].url}
                                        alt={project.title}
                                        width={288}
                                        height={144}
                                        className="max-w-fit max-h-fit h-56 object-contain rounded border-2 border-primary-light"
                                        onError={(e) => {
                                            console.error(
                                                `Failed to load image: ${project.images[0].url}`
                                            );
                                            e.target.src =
                                                "/images/fallback.jpg";
                                        }}
                                    />
                                </div>
                            )}
                            <div
                                className="flex flex-col gap-6 justify-center items-center lg:items-start text-center lg:text-left fade-up"
                            >
                                <h3 className="text-3xl font-extralight mb-[-12px]">
                                    {project.title}
                                </h3>
                                <p className="text-sm line-clamp-3 max-w-xl">
                                    {project.description}
                                </p>
                                <Link
                                    href={`/galleri/projects/${project.id}`}
                                    className="max-w-fit"
                                >
                                    <div className="btn-golden">
                                        Se hele prosjektet
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
