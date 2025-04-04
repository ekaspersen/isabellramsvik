// app/aboutme/page.jsx
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Socials from "../components/Socials";
import SkreddersyddMaleriForm from "../components/sections/Skreddersyddmaleriform";

export default function Aboutme() {
    return (
        <>
            <div className="inner flex flex-col md:gap-8 py-32">
                <div className="flex flex-col gap-8 md:mb-8">
                    <h2 className="text-6xl font-extralight">Om meg</h2>
                    <div className="border-b-2 border-primary-light w-full"></div>
                </div>
                <div className="flex items-center flex-col justify-end md:flex-row md:gap-6 text-sm sm:text-base md:text-sm lg:text-base">
                    <div className="flex-1 flex flex-col gap-6 py-6 md:pt-0 max-w-2xl">
                        <p className="font-semibold">
                            f. 1997 og oppvokst i Nord-Norge, omgitt av en natur
                            som både utfordrer og inspirerer. Denne bakgrunnen
                            har formet meg som kunstner og ligger ofte som et
                            fundament i mine verk. Jeg startet min kunstneriske
                            reise for seks år siden, og allerede etter ett år
                            hadde jeg to års ventetid på kommisjoner og har
                            siden viet meg til å utvikle en allsidig praksis
                            innen kull, olje og akryl.
                        </p>
                        <p className="">
                            Utdannelsen min ved Nydalen Kunstskole, der jeg ble
                            utdannet som bildekunstner i 2025, har vært en
                            avgjørende milepæl i min kunstneriske utvikling og
                            har gitt meg et solid fundament for å utforske både
                            teknikk og uttrykk. I løpet av min karriere har jeg
                            hatt gleden av å delta i tre utstillinger, hvor jeg
                            har fått dele min kunst med et bredere publikum.
                            Disse utstillingene har vært viktige for å vise frem
                            bredden i arbeidet mitt, og har gitt meg muligheten
                            til å etablere meg som en seriøs aktør innen
                            kunstfeltet.
                        </p>
                    </div>
                    <Image
                        className="border-8 border-black mx-auto w-4/5 md:w-auto"
                        src="/homeaboutmepicture.png"
                        alt="About me picture"
                        width={360}
                        height={347}
                    />
                </div>
                <div className="flex flex-col-reverse items-center md:flex-row gap-6 text-sm sm:text-base md:text-sm lg:text-base">
                    <div className="flex-shrink-0">
                        <Image
                            className=" mx-auto w-4/5 md:w-auto"
                            src="/mountainsithink.jpeg"
                            alt="About me picture"
                            width={360}
                            height={347}
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-6 pt-6 md:pt-0 max-w-2xl">
                        <p className="">
                            Jeg kombinerer realistiske teknikker med
                            fantasifulle landskap, fordyper meg i portrettkunst
                            og lar ulike sjangre og stiler smelte sammen. Min
                            kunst beveger seg fra det detaljerte og nøyaktige
                            til det drømmende og abstrakte, alltid med et fokus
                            på å skape en forbindelse til betrakteren. Gjennom
                            kunsten ønsker jeg å formidle en indre verden,
                            særlig følelser og opplevelser som ofte forblir
                            usagte.
                        </p>
                        <p className="">
                            Jeg ser hvert kunstverk som en unik reise – enten
                            det er et portrett som utforsker menneskets indre,
                            eller et landskap som trekker betrakteren inn i et
                            nytt univers. Denne allsidigheten lar meg møte ulike
                            oppdrag og utfordringer med åpenhet og
                            nysgjerrighet. Min kunst handler om å oversette både
                            det synlige og det usynlige til noe som kan føles,
                            sees og oppleves.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col gap-6 pt-6 md:pt-0">
                    <p className="max-w-xl">
                        Kunst for meg er både personlig og visjonært. Jeg er en
                        kunstner med store ideer – alltid med en bok full av
                        konsepter og prosjekter som venter på å bli realisert.
                        Gjennom kunsten min ønsker jeg å formidle en indre
                        verden, ofte preget av følelser som ikke alltid er lett
                        å sette ord på.
                    </p>
                    <p className="font-bold max-w-xl">
                        Uansett om jeg jobber med et portrett, et landskap,
                        eller abstrakte komposisjoner, søker jeg alltid å skape
                        en dyp forbindelse mellom kunsten og betrakteren.
                    </p>
                    <div className="flex gap-6 flex-col-reverse md:flex-row">
                        <Link href="/galleri">
                            <span className="btn-golden inline-block">
                                SE GALLERI
                            </span>
                        </Link>
                        <Link href="/aboutme/#onskeskjema">
                            <span className="btn-inverted inline-block">
                                ØNSKESKJEMA
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
            <Socials />
            <div className="h-32"></div>
            <SkreddersyddMaleriForm />
        </>
    );
}
