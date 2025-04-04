// app/admin/login/page.js
"use client";
import { useState } from "react";
import { signIn } from "@auth/core"; // Using @auth/core directly
import { useRouter } from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false);
        if (res && res.ok) {
            router.push("/admin");
        } else {
            setError("Invalid credentials or not an admin");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
            <h1 className="text-3xl mb-4 font-extralight">Admin Login</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="p-2 border bg-primary-dark text-white rounded"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="p-2 border bg-primary-dark text-white rounded"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}
