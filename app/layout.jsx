// app/layout.jsx
import Header from "./components/sections/Header";
import ScrollHandler from "./components/ScrollHandler";
import "./globals.css";
import { Suspense } from "react";
import { SpinningLoader } from "./components/SpinningLoader";

export default function RootLayout({ children }) {
    return (
        <html lang="no">
            <body>
                <Header />
                <Suspense fallback={<SpinningLoader />}>
                    <ScrollHandler />
                </Suspense>
                {children}
            </body>
        </html>
    );
}
