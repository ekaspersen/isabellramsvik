// app/components/ScrollHandler.jsx
"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ScrollHandler() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const hash = window.location.hash; // Get the hash from the URL
        if (pathname === "/") {
            if (hash === "#onskeskjema") {
                // Scroll to SkreddersyddMaleriForm on the homepage
                const formElement = document.getElementById("onskeskjema");
                if (formElement) {
                    formElement.scrollIntoView({ behavior: "smooth" });
                }
            } else if (hash === "#kontakt") {
                // Scroll to kontakt section on the homepage
                const kontaktElement = document.getElementById("kontakt");
                if (kontaktElement) {
                    kontaktElement.scrollIntoView({ behavior: "smooth" });
                }
            } else {
                // Scroll to top if no specific hash on homepage
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        } else {
            // Scroll to top for all other routes
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [pathname, searchParams]); // Re-run on route or query/hash change

    return null; // No UI, just a handler
}
