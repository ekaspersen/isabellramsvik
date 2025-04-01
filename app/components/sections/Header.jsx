"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

                    <motion.div
                        className="h-1 bg-primary-light rounded"
                        animate={{
                            width: "75%",
                            marginLeft: isOpen ? "0%" : "auto",
                        }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.nav
                        initial={{ opacity: 0, x: 0, y: -50 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, x: 0, y: -50 }}
                        transition={{ duration: 0.3 }}
                        className="fixed top-[90px] left-0 right-0 bg-black shadow-lg pb-16 pt-8 flex flex-col items-center gap-16 text-white text-lg font-medium md:hidden z-40"
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
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    );
}

export default Header;
