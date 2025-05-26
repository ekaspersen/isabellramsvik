// app/components/sections/HomeAboutMe.jsx
import Image from "next/image";
import Link from "next/link";
import React from "react";

const HomeAboutMe = () => {
    return (
        <div className="inner flex flex-col lg:flex-row lg:items-center py-32">
            <h1 className="text-6xl font-extralight md:hidden block pb-8 mr-auto">
                Min Historie
            </h1>
            <div className="lg:pr-8 mr-auto md:mx-auto lg:mx-0">
                <Image
                    src="/homeaboutmepicture.png"
                    alt="Hero banner"
                    width={450}
                    height={547}
                    objectFit="cover"
                />
            </div>
            <div className="flex-1 flex flex-col gap-8 lg:border-l-2 md:mx-auto lg:mx-0 border-primary-light lg:pl-8 pt-8 lg:py-16">
                <h1 className="text-6xl font-extralight hidden md:block md:pt-4 lg:pt-0">
                    Min Historie
                </h1>
                <p className="max-w-[608px]">
                    Kunst for meg er både personlig og visjonært. Jeg er en
                    kunstner med store ideer – alltid med en bok full av
                    konsepter og prosjekter som venter på å bli realisert.
                    Gjennom kunsten min ønsker jeg å formidle en indre verden,
                    ofte preget av følelser som ikke alltid er lett å sette ord
                    på.
                </p>
                <Link href="/aboutme">
                    <span className="btn-golden inline-block">
                        LES MER OM MEG
                    </span>
                </Link>
            </div>
        </div>
    );
};

export default HomeAboutMe;
