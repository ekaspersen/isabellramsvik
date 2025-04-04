import Header from "./components/sections/Header";
import ScrollHandler from "./components/ScrollHandler";
import "./globals.css";
import { Suspense } from "react";

export default function RootLayout({ children }) {
    return (
        <html lang="no">
            <body>
                <Header />
                <Suspense fallback={<div>Loading...</div>}>
                    <ScrollHandler />
                </Suspense>
                {children}
            </body>
        </html>
    );
}
