"use client";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { SpinningLoader } from "../SpinningLoader";

export default function SkreddersyddMaleriForm() {
    const [form, setForm] = useState({
        fullname: "",
        phone: "",
        email: "",
        wish: "",
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!form.fullname.trim()) newErrors.fullname = "Navn er påkrevd.";
        if (!form.email.trim()) {
            newErrors.email = "Epost er påkrevd.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = "Ugyldig epostadresse.";
        }
        if (!form.wish.trim())
            newErrors.wish = "Vennligst skriv inn ønsket motiv.";
        return newErrors;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
                {
                    from_name: form.fullname,
                    email: form.email,
                    phone: form.phone || "Not provided",
                    wish: form.wish,
                },
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
            );
            setSuccess("Takk for meldingen! Jeg kontakter deg snart.");
            setForm({ fullname: "", phone: "", email: "", wish: "" });
            setErrors({});
        } catch (error) {
            console.error("Failed to send email:", error);
            setSuccess(null);
            alert("Noe gikk galt. Prøv igjen senere.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen grid place-items-center">
                <SpinningLoader />
            </div>
        );
    }

    return (
        <section
            id="onskeskjema"
            className="bg-black py-16 rounded-tr-[64px] border-t-2 border-primary-light"
        >
            <div className="inner flex flex-col gap-12 text-center">
                <div className="flex flex-col">
                    <h1 className="text-4xl sm:text-6xl font-extralight text-clr-primary-light mb-4">
                        Skreddersydd Maleri
                    </h1>
                    <p className="italic text-center sm:text-xl text-primary-light">
                        Ønsker du noe helt spesielt? <br />
                        Beskriv ditt kunstverk så kontakter jeg deg snart!
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="max-w-sm w-full mx-auto flex flex-col text-left gap-8"
                >
                    {/* Fullt navn */}
                    <span>
                        <label
                            className="block font-light italic text-primary mb-1"
                            htmlFor="fullname"
                        >
                            Ditt fulle navn*
                        </label>
                        <input
                            id="fullname"
                            type="text"
                            value={form.fullname}
                            onChange={handleChange}
                            className="w-full bg-white text-black px-4 py-3"
                        />
                        {errors.fullname && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.fullname}
                            </p>
                        )}
                    </span>

                    {/* Telefon */}
                    <span>
                        <label
                            className="block font-light italic text-primary mb-1"
                            htmlFor="phone"
                        >
                            Telefon
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full bg-white text-black px-4 py-3"
                        />
                    </span>

                    {/* Epost */}
                    <span>
                        <label
                            className="block font-light italic text-primary mb-1"
                            htmlFor="email"
                        >
                            Epost*
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full bg-white text-black px-4 py-3"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email}
                            </p>
                        )}
                    </span>

                    {/* Ønske */}
                    <span>
                        <label
                            className="block font-light italic text-primary mb-1"
                            htmlFor="wish"
                        >
                            Ditt ønske*
                        </label>
                        <textarea
                            id="wish"
                            rows={2}
                            value={form.wish}
                            onChange={handleChange}
                            className="w-full bg-white text-black px-4 py-3"
                        />
                        {errors.wish && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.wish}
                            </p>
                        )}
                    </span>

                    <span className="flex flex-col items-center">
                        <button
                            type="submit"
                            className="btn-golden inline-block"
                        >
                            Send inn ønske
                        </button>
                        <span className="mt-1 italic font-light text-xs text-primary-light">
                            Trykk her for å sende inn skjema
                        </span>
                        {success && (
                            <p className="text-green-500 text-sm text-center mt-2">
                                {success}
                            </p>
                        )}
                    </span>
                </form>
            </div>
        </section>
    );
}
