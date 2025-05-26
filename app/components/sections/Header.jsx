// app/components/sections/Header.jsx
"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";


function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const navLinks = [
        { href: "/", label: "Hjem" },
        { href: "/galleri", label: "Galleri" },
        { href: "/aboutme", label: "Om meg" },
        { href: "/#onskeskjema", label: "Ønskeskjema" },
        { href: "/#kontakt", label: "KONTAKT", isButton: true },
    ];

    return (
        <header className="bg-black flex w-full sticky top-0 z-50">
            <div className="inner w-full flex justify-between items-center py-4 px-4">
                <Image
                    className="z-[100000]"
                    src="/icons/logo.jpg"
                    alt="Logo"
                    width={60}
                    height={60}
                />

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center text-white gap-8 text-lg font-medium">
                    {navLinks.map(({ href, label, isButton }) => (
                        <Link href={href} key={label}>
                            <span
                                className={`hover:text-primary-light transition-all ${
                                    isButton ? "btn-golden block" : ""
                                }`}
                            >
                                {label}
                            </span>
                        </Link>
                    ))}
                </nav>

                {/* Hamburger for mobile */}
                <div
                    className="md:hidden z-[100000] flex flex-col justify-between w-9 h-5 cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="h-1 w-full bg-primary-light rounded" />
                    <div className="h-1 w-full bg-primary-light rounded" />
                    <div
                        className={`h-1 bg-primary-light rounded transition-all duration-300 ${isOpen ? 'w-[75%] ml-0' : 'w-[75%] ml-auto'}`}
                    />
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <nav
                    className="fixed top-[90px] left-0 right-0 bg-black shadow-lg pb-16 pt-8 flex flex-col items-center gap-16 text-white text-lg font-medium md:hidden z-40 transition-all duration-300 transform animate-slide-down"
                >
                    {navLinks.map(({ href, label, isButton }) => (
                        <Link
                            href={href}
                            key={label}
                            onClick={() => setIsOpen(false)}
                        >
                            <span
                                className={`hover:text-primary-light text-xl transition-all ${
                                    isButton
                                        ? "btn-golden inline-block"
                                        : ""
                                }`}
                            >
                                {label}
                            </span>
                        </Link>
                    ))}
                </nav>
            )}

        </header>
    );
}

export default Header;
