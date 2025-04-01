import Header from "./components/sections/Header";
import "./globals.css";
export default function RootLayout({ children }) {
    return (
        <html lang="no">
            <body>
                <Header />
                {children}
            </body>
        </html>
    );
}
