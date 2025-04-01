// app/admin/page.js
"use client";

export default function AdminDashboard() {
    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-center mb-4">
                Velkommen til Adminpanelet
            </h2>
            <p className="text-center text-white/80">
                Herfra kan du administrere prosjekter, bilder og innkommende
                ønsker.
            </p>
        </div>
    );
}
