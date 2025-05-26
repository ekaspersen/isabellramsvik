// app/galleri/components/ProjectScroller.jsx
"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import projectsData from "@/app/api/gallery/data/projects.json";
import imagesData from "@/app/api/gallery/data/images.json";

export const ProjectScroller = () => {
    const containerRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            const enrichedProjects = projectsData.projects.map((project) => ({
                ...project,
                images: project.imageIds
                    .map((imageId) =>
                        imagesData.images.find((img) => img.id === imageId)
                    )
                    .filter(Boolean),
            }));
            setProjects(enrichedProjects);
        } catch (err) {
            console.error("Failed to process projects:", err);
            setError("Kunne ikke laste prosjekter.");
        }
    }, []);

    useEffect(() => {
        const el = containerRef.current;
        const handleScroll = () => {
            if (!el) return;
            const scrollLeft = el.scrollLeft;
            const scrollWidth = el.scrollWidth - el.clientWidth;
            const progress =
                (scrollWidth > 0 ? scrollLeft / scrollWidth : 0) * 100;
            setScrollProgress(progress);
        };
        if (el) {
            el.addEventListener("scroll", handleScroll);
            return () => el.removeEventListener("scroll", handleScroll);
        }
    }, []);

    if (error) {
        return (
            <div className="text-primary-light text-center p-4">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div
                ref={containerRef}
                className="overflow-x-scroll scrollbar-hide flex gap-8 pb-4"
            >
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <div
                            key={project.id}
                            className="flex-shrink-0 flex flex-col gap-2 max-w-[288px] lg:max-w-[540px]"
                        >
                            {project.images && project.images.length > 0 ? (
                                <Image
                                    className="h-36 w-72 lg:w-[540px] lg:h-[270px] object-cover border-4 border-primary-light rounded-tr-4xl"
                                    src={project.images[0].url}
                                    alt={project.title || "Prosjektbilde"}
                                    width={540}
                                    height={270}
                                    onError={(e) => {
                                        console.error(
                                            `Failed to load image: ${project.images[0].url}`
                                        );
                                        e.target.src = "/images/fallback.jpg";
                                    }}
                                />
                            ) : (
                                <div className="h-36 w-72 lg:w-[540px] lg:h-[270px] bg-primary-dark border-4 border-primary-light rounded-tr-4xl flex items-center justify-center text-sm">
                                    Ingen bilder
                                </div>
                            )}
                            <h3 className="text-2xl mt-2 sm:text-3xl font-extralight">
                                {project.title}
                            </h3>
                            <p className="text-sm line-clamp-3 lg:max-w-5/6">
                                {project.description}
                            </p>
                            <Link
                                href={`/galleri/projects/${project.id}`}
                                className="max-w-fit mt-auto"
                            >
                                <div className="btn-golden max-w-fit">
                                    SE PROSJEKT
                                </div>
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-primary-light w-full">
                        Ingen prosjekter tilgjengelig
                    </div>
                )}
            </div>
            <div className="w-full h-1 bg-white/10 rounded overflow-hidden mt-4">
                <div
                    className="h-full bg-primary-light transition-all duration-100 ease-out"
                    style={{ width: `${scrollProgress}%` }}
                ></div>
            </div>
        </div>
    );
};
