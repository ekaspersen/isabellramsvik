import Header from "./components/sections/Header";
import ScrollHandler from "./components/ScrollHandler"; // Import the new component
import "./globals.css";

export default function RootLayout({ children }) {
    return (
        <html lang="no">
            <body>
                <Header />
                <ScrollHandler />
                {children}
                {/* Footer can be added here */}
            </body>
        </html>
    );
}
