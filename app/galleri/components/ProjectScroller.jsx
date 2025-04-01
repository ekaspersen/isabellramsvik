"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";

export const ProjectScroller = () => {
    const containerRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetch("/api/projects")
            .then((res) => res.json())
            .then((data) => setProjects(data))
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        const el = containerRef.current;
        const handleScroll = () => {
            if (!el) return;
            const scrollLeft = el.scrollLeft;
            const scrollWidth = el.scrollWidth - el.clientWidth;
            const progress = (scrollLeft / scrollWidth) * 100;
            setScrollProgress(progress);
        };
        if (el) {
            el.addEventListener("scroll", handleScroll);
            return () => el.removeEventListener("scroll", handleScroll);
        }
    }, []);

    return (
        <div className="w-full">
            <div
                ref={containerRef}
                className="overflow-x-scroll scrollbar-hide flex gap-8 pb-4"
            >
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="flex-shrink-0 flex flex-col gap-2 max-w-[288px] lg:max-w-[540px]"
                    >
                        {project.images.length > 0 && (
                            <Image
                                className="h-36 w-72 lg:w-[540px] lg:h-[270px] object-cover border-4 border-primary-light rounded-tr-4xl"
                                src={project.images[0].url}
                                alt={project.title}
                                width={288}
                                height={144}
                            />
                        )}
                        <h3 className="text-2xl mt-2 sm:text-3xl font-extralight">
                            {project.title}
                        </h3>
                        <p className="text-sm line-clamp-3 lg:max-w-5/6">
                            {project.description}
                        </p>
                    </div>
                ))}
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
