// app/components/sections/HomeAboutMe.jsx
import Image from "next/image";
import Link from "next/link";
import React from "react";

const HomeAboutMe = () => {
    return (
        <div className="inner flex justify-center items-center py-32">
            <div className="pr-8">
                <Image
                    src="/homeaboutmepicture.png"
                    alt="Hero banner"
                    width={450}
                    height={547}
                    objectFit="cover"
                />
            </div>
            <div className="flex-1 flex flex-col gap-8 border-l-2 border-primary-light pl-8 py-16">
                <h1 className="text-6xl font-extralight">Min Historie</h1>
                <p className="">
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
