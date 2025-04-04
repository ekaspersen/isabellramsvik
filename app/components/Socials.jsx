// app/components/Socials.jsx
import Image from "next/image";
import React from "react";

export default function Socials() {
    return (
        <div id="kontakt" className="inner w-full">
            <div className="bg-black border-2 border-primary-light flex flex-col gap-8 items-center py-16 w-full">
                <h2 className="text-4xl sm:text-6xl font-extralight">
                    Sosiale Medier
                </h2>
                <div className="border-b-2 border-primary-light w-3xl max-w-4/5"></div>
                <p className="max-w-sm italic text-center px-2">
                    Hold deg oppdatert og kom i kontakt med meg på mine sosiale
                    medier!
                </p>
                <div className="flex flex-col gap-6 mx-auto w-full max-w-4/5 lg:max-w-fit">
                    <a
                        href="https://www.instagram.com/isabellramsvik/"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-xl underline text-primary-light hover:text-white transition-all"
                    >
                        <Image
                            src="/icons/golden_instagram.png"
                            alt="Instagram"
                            width={32}
                            height={32}
                        />
                        isabellramsvik
                    </a>
                    <a
                        href="https://www.facebook.com/profile.php?id=61558489484381"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-xl underline text-primary-light hover:text-white transition-all"
                    >
                        <Image
                            src="/icons/golden_facebook.png"
                            alt="Facebook"
                            width={32}
                            height={32}
                        />
                        Ramsvik Kunst - Isabell Ramsvik
                    </a>
                </div>
            </div>
        </div>
    );
}
