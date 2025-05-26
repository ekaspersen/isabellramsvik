// app/galleri/project/[id]/page.jsx
"use client";
import { useState, useEffect } from "react";

import { SpinningLoader } from "@/app/components/SpinningLoader";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { ProjectScroller } from "@/app/galleri/components/ProjectScroller";
import projectsData from "@/app/api/gallery/data/projects.json";
import imagesData from "@/app/api/gallery/data/images.json";

export default function ProjectPage() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [error, setError] = useState(null);
    const [mainImgLoaded, setMainImgLoaded] = useState(false);
    const [galleryImgLoaded, setGalleryImgLoaded] = useState({});
    const [selectedImgLoaded, setSelectedImgLoaded] = useState(false);



    useEffect(() => {
        try {
            const foundProject = projectsData.projects.find(
                (proj) => proj.id === parseInt(id)
            );
            if (!foundProject) {
                throw new Error("Prosjekt ikke funnet");
            }
            const projectWithImages = {
                ...foundProject,
                images: foundProject.imageIds
                    .map((imageId) =>
                        imagesData.images.find((img) => img.id === imageId)
                    )
                    .filter(Boolean),
            };
            setProject(projectWithImages);
        } catch (err) {
            console.error("Failed to process project:", err);
            setError(err.message || "Kunne ikke laste prosjekt.");
        }
    }, [id]);

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    if (error) {
        return (
            <div className="h-screen grid place-items-center bg-black pb-128">
                <p className="text-primary-light">{error}</p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="h-screen grid place-items-center bg-black pb-128">
                <p className="text-primary-light">Laster...</p>
            </div>
        );
    }

    const displayImage =
        project.images && project.images.length > 0 ? project.images[0] : null;

    return (
        <div className="page-fade-up bg-black flex flex-col overflow-x-hidden">
            <div className="inner flex flex-col gap-32 fade-up">
                <div className="flex flex-col gap-8 fade-up">
                    <div className="fade-up">
                        <Link
                            href="/galleri"
                            className="flex items-center text-primary-light hover:text-white"
                        >
                            <span className="text-5xl">{"<"}</span>
                            <span>Tilbake til galleri</span>
                        </Link>
                    </div>

                    <div
                        key={project.id}
                        className="flex flex-col lg:items-center gap-8 lg:flex-row lg:gap-12 items-center text-center lg:text-left fade-up"
                    >
                        {displayImage ? (
                            <div className="relative w-full max-w-fit lg:w-1/2 max-h-[480px] flex items-center justify-center">
                                <Image
                                    src={displayImage.url}
                                    alt={displayImage.title || project.title}
                                    width={1200}
                                    height={600}
                                    className="w-full max-w-fit lg:w-1/2 max-h-[480px] object-contain rounded-lg border-4 border-primary-light image-fade-in"
                                    priority
                                />
                            </div>
                        ) : (
                            <div className="w-full max-w-fit lg:w-1/2 max-h-[480px] bg-primary-dark rounded-lg border-4 border-primary-light flex items-center justify-center text-sm">
                                Ingen bilder
                            </div>
                        )}
                        <div className="flex flex-col gap-4 lg:gap-8 fade-up">
                            <h1 className="text-4xl sm:text-6xl font-extralight">
                                {project.title}
                            </h1>
                            <p className="text-sm sm:text-base font-light max-w-2xl px-1">
                                {project.description}
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="flex flex-col gap-4 mt-[-64px] transition-all duration-700 opacity-100 translate-y-0"
                >
                    <h2 className="text-2xl sm:text-3xl font-extralight">
                        Bilder i prosjektet
                    </h2>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-4 fade-up">
                        {(project.images || []).map((image, index) => {
                            return (
                                <div
                                    key={image.id}
                                    className="cursor-pointer transition-transform duration-500 scale-100 opacity-100 fade-up"
                                    onClick={() => handleImageClick(image)}
                                >
                                    <div className="relative w-full h-32 flex items-center justify-center">
                                        <Image
                                            src={image.url}
                                            alt={image.title || "Prosjektbilde"}
                                            width={200}
                                            height={200}
                                            className="w-full h-32 object-cover rounded border-2 border-primary-light hover:border-white image-fade-in"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-8 fade-up">
                        {selectedImage ? (
                            <div
                                key={selectedImage.id}
                                className="flex flex-col gap-4 items-center text-center fade-up"
                            >
                                <div className="relative w-full max-h-[480px] flex items-center justify-center">
                                    <Image
                                        src={selectedImage.url}
                                        alt={selectedImage.title || "Valgt bilde"}
                                        width={800}
                                        height={400}
                                        className="w-full max-h-[320px] object-contain max-w-fit rounded-lg border-4 border-primary-light image-fade-in"
                                    />
                                </div>
                                <h3 className="text-2xl font-light mb-[-8px]">
                                    {selectedImage.title}
                                </h3>
                                <p className="text-sm max-w-2xl font-light">
                                    {selectedImage.description}
                                </p>
                            </div>
                        ) : (
                            <p
                                key="no-image"
                                className="text-sm text-primary-light italic fade-up"
                            >
                                Klikk på et bilde for å se mer
                            </p>
                        )}
                    </div>
                </div>

                <div
                    className="flex flex-col gap-6 fade-up"
                >
                    <h2 className="text-2xl sm:text-3xl font-extralight">
                        Sjekk ut andre prosjekter
                    </h2>
                    <ProjectScroller />
                </div>

                <div
                    className="pb-8 mt-[-64px] fade-up"
                >
                    <Link
                        href="/galleri"
                        className="flex items-center text-primary-light hover:text-white bg-black"
                    >
                        <span className="text-5xl">{"<"}</span>
                        <span>Tilbake til galleri</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
