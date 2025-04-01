"use client";
import { ProjectScroller } from "./components/ProjectScroller";
import Socials from "../components/Socials";
import SkreddersyddMaleriForm from "../components/sections/Skreddersyddmaleriform";
import { ResponsiveImageGrid } from "./components/ResponsiveImageGrid";

const allImages = [
    "/mountainsithink.jpeg",
    "/homeaboutmepicture.png",
    "/mountainsithink.jpeg",
    "/isabellpainting.jpg",
    "/heropicture.png",
    "/mountainsithink.jpeg",
    "/homeaboutmepicture.png",
    "/mountainsithink.jpeg",
    "/isabellpainting.jpg",
    "/heropicture.png",
    "/mountainsithink.jpeg",
    "/homeaboutmepicture.png",
    "/mountainsithink.jpeg",
    "/isabellpainting.jpg",
    "/mountainsithink.jpeg",
    "/isabellpainting.jpg",
    "/heropicture.png",
    "/mountainsithink.jpeg",
    "/homeaboutmepicture.png",
    "/mountainsithink.jpeg",
    "/isabellpainting.jpg",
    "/mountainsithink.jpeg",
    "/isabellpainting.jpg",
    "/heropicture.png",
    "/mountainsithink.jpeg",
    "/homeaboutmepicture.png",
    "/mountainsithink.jpeg",
    "/isabellpainting.jpg",
    "/mountainsithink.jpeg",
    "/isabellpainting.jpg",
    "/heropicture.png",
    "/mountainsithink.jpeg",
    "/homeaboutmepicture.png",
    "/mountainsithink.jpeg",
    "/isabellpainting.jpg",
];

export default function Galleri() {
    return (
        <div className="bg-black py-24 flex flex-col gap-24">
            <div className="inner flex flex-col gap-24">
                <div className="border-b-2 border-primary-light pb-8 flex flex-col items-center text-center gap-8">
                    <h1 className="text-5xl sm:text-8xl font-extralight">
                        Galleri
                    </h1>
                    <p className="text-sm sm:text-base max-w-2xl">
                        Kunst for meg er både personlig og visjonært. Jeg er en
                        kunstner med store ideer. Alltid med en bok full av
                        konsepter og prosjekter som venter på å bli realisert.{" "}
                    </p>
                </div>
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-5xl sm:text-6xl font-extralight">
                            Mine verk
                        </h2>
                        <p className="text-sm sm:text-base">
                            Bla deg gjennom alle mine kunstverk og utstillinger.
                            <br />
                            Ser noe interressant ut? Klikk på bilde for mer info
                            om prosjektet...
                        </p>
                    </div>
                    <ResponsiveImageGrid />
                </div>

                <div className="flex flex-col gap-12">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-5xl sm:text-6xl font-extralight">
                            Prosjekter
                        </h2>
                        <p className="text-sm sm:text-base max-w-4xl">
                            Her er mine samlinger og større prosjekter. Lorem
                            ipsum dolor sit amet connectetur. Kurrikulome set
                            youth aler mierde doctor proctor. trenger noe mer
                            tekst her ja.
                        </p>
                    </div>
                    <ProjectScroller />
                </div>
            </div>
            <Socials />
            <SkreddersyddMaleriForm />
        </div>
    );
}
