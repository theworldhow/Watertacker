import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-6 md:p-12">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
                <h1 className="text-3xl font-bold mb-6 text-blue-600">Privacy Policy</h1>
                <p className="mb-4 text-gray-600 text-sm">Last Updated: {new Date().toLocaleDateString()}</p>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-3">1. Overview</h2>
                    <p className="text-gray-700 leading-relaxed">
                        Your privacy is important to us. "Water Reminder" is designed to be a private and secure way to track your daily hydration.
                        We do not collect, store, or share your personal data on our servers. All hydration data is stored locally on your device.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-3">2. Data Collection</h2>
                    <p className="text-gray-700 leading-relaxed">
                        The app operates entirely offline for its core functionality.
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Hydration Data:</strong> Stored locally on your device using your browser's LocalStorage or file system (for native apps).</li>
                            <li><strong>Personal Information:</strong> We do not ask for or store your name, email, or phone number.</li>
                        </ul>
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-3">3. Third-Party Services</h2>
                    <p className="text-gray-700 leading-relaxed">
                        We may use standard Apple or Google services for app distribution and analytics (e.g., crash reporting) provided by the operating system,
                        which adhere to their own privacy policies.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-3">4. Contact Us</h2>
                    <p className="text-gray-700 leading-relaxed">
                        If you have any questions about this Privacy Policy, please contact us at:
                        <br />
                        <a href="mailto:support@example.com" className="text-blue-600 underline mt-1 block">support@example.com</a>
                    </p>
                </section>
            </div>
        </div>
    );
}
