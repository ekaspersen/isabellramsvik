import Link from "next/link";

// app/not-found.js
export default function NotFound() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center text-primary-light px-4">
            <div className="text-center flex flex-col gap-6">
                <h1 className="text-6xl sm:text-8xl font-extralight">404</h1>
                <p className="text-lg sm:text-xl max-w-md">
                    Oops! Siden du leter etter finnes ikke.
                </p>
                <Link
                    href="/"
                    className="btn-golden inline-block mx-auto max-w-fit"
                >
                    Tilbake til hjemmesiden
                </Link>
            </div>
        </div>
    );
}
