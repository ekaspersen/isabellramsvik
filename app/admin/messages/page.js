// ✅ Paste this into: app/admin/messages/page.js
"use client";
import { useEffect, useState } from "react";

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetch("/api/messages")
            .then((res) => res.json())
            .then((data) => setMessages(data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6 text-center">
                Innkommende Meldinger
            </h2>
            {messages.length === 0 ? (
                <p className="text-center">Ingen meldinger funnet.</p>
            ) : (
                <ul className="space-y-6">
                    {messages.map((msg) => (
                        <li
                            key={msg.id}
                            className="border border-primary-light bg-black p-4 rounded-lg"
                        >
                            <div className="text-lg font-semibold text-primary-light">
                                {msg.fullname} &lt;{msg.email}&gt;
                            </div>
                            {msg.phone && (
                                <div className="text-sm text-white">
                                    Telefon: {msg.phone}
                                </div>
                            )}
                            <p className="text-white mt-2 italic">{msg.wish}</p>
                            <p className="text-xs text-gray-400 mt-2">
                                Mottatt:{" "}
                                {new Date(msg.createdAt).toLocaleString(
                                    "no-NO"
                                )}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
