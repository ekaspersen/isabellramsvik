"use client";
import { useState, useEffect } from "react";
import { SpinningLoader } from "@/app/components/SpinningLoader";

export default function Messages() {
    const [messages, setMessages] = useState([]);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        fetchMessages();
    }, [page]);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `/api/messages?page=${page}&limit=${limit}`
            );
            const data = await res.json();
            if (Array.isArray(data)) {
                setMessages(data);
            } else if (!data.success) {
                console.error("Error fetching messages:", data.error.message);
            }
        } catch (err) {
            console.error("Failed to fetch messages:", err);
        } finally {
            setLoading(false);
        }
    };

    const toggleRead = async (id) => {
        const message = messages.find((m) => m.id === id);
        const updatedMessage = { ...message, read: !message.read };
        setMessages(messages.map((m) => (m.id === id ? updatedMessage : m)));
        await fetch("/api/messages", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, read: updatedMessage.read }),
        });
    };

    const toggleFavorite = async (id) => {
        const message = messages.find((m) => m.id === id);
        const updatedMessage = { ...message, favorite: !message.favorite };
        setMessages(messages.map((m) => (m.id === id ? updatedMessage : m)));
        await fetch("/api/messages", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, favorite: updatedMessage.favorite }),
        });
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("desc");
        }
    };

    const sortedMessages = [...messages].sort((a, b) => {
        if (sortBy === "createdAt") {
            return sortOrder === "asc"
                ? new Date(a.createdAt) - new Date(b.createdAt)
                : new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortBy === "read") {
            return sortOrder === "asc" ? a.read - b.read : b.read - a.read;
        } else if (sortBy === "favorite") {
            return sortOrder === "asc"
                ? a.favorite - b.favorite
                : b.favorite - a.favorite;
        }
        return 0;
    });

    const hasNumbers = (text) => /\d/.test(text); // Check if string contains numbers

    if (loading) {
        return (
            <div className="h-screen grid place-items-center">
                <SpinningLoader />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-4xl md:text-5xl font-extralight">
                    Messages
                </h1>
                <div className="flex flex-col sm:flex-row gap-2">
                    <select
                        value={sortBy}
                        onChange={(e) => handleSort(e.target.value)}
                        className="bg-primary-dark border-2 border-primary-light rounded p-2 text-white"
                    >
                        <option value="createdAt">Sort by Date</option>
                        <option value="read">Sort by Read Status</option>
                        <option value="favorite">Sort by Favorite</option>
                    </select>
                    <button
                        onClick={() =>
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                        }
                        className="btn-inverted"
                    >
                        {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
                    </button>
                </div>
            </div>

            <div className="flex justify-between mb-4">
                <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="btn-inverted"
                >
                    Previous
                </button>
                <span>Page {page}</span>
                <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={messages.length < limit}
                    className="btn-golden"
                >
                    Next
                </button>
            </div>

            {messages.length === 0 ? (
                <p className="text-sm italic text-primary-light">
                    No messages yet.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedMessages.map((message) => (
                        <div
                            key={message.id}
                            className={`p-6 rounded-lg border-2 ${
                                message.read
                                    ? "bg-primary-dark border-primary-light/50"
                                    : "bg-primary border-primary-light"
                            } flex flex-col gap-4`}
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-light">
                                    {message.fullname}
                                </h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            toggleFavorite(message.id)
                                        }
                                        className={`text-2xl ${
                                            message.favorite
                                                ? "text-yellow-400"
                                                : "text-primary-light"
                                        }`}
                                    >
                                        ★
                                    </button>
                                    <button
                                        onClick={() => toggleRead(message.id)}
                                        className="text-sm text-primary-light hover:text-white"
                                    >
                                        {message.read
                                            ? "Mark Unread"
                                            : "Mark Read"}
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm opacity-70">
                                    {message.email} |
                                </p>
                                <p className="text-sm opacity-70">
                                    {"Tlf: "}
                                    {hasNumbers(message.phone)
                                        ? message.phone
                                        : "No phone"}
                                </p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm opacity-70">Message:</p>
                                <p className="text-sm line-clamp-3">
                                    {message.wish}
                                </p>
                            </div>

                            <p className="text-xs opacity-50">
                                {new Date(
                                    message.createdAt
                                ).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
