import React from 'react';

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-6 md:p-12">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
                <h1 className="text-3xl font-bold mb-6 text-blue-600">Support Center</h1>

                <p className="text-lg text-gray-700 mb-8">
                    Need help with Water Reminder? usage check out our frequently asked questions below or get in touch.
                </p>

                <section className="mb-10">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Frequently Asked Questions</h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="font-medium text-lg text-gray-900">How do I change my daily goal?</h3>
                            <p className="text-gray-600 mt-1">
                                Go to the Settings tab in the app and look for the "Daily Goal" input field. You can adjust the amount in milliliters (ml).
                            </p>
                        </div>

                        <div>
                            <h3 className="font-medium text-lg text-gray-900">Is my data backed up?</h3>
                            <p className="text-gray-600 mt-1">
                                Currently, all data is stored locally on your device. We recommend not clearing your browser cache or app data if you want to keep your history.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-medium text-lg text-gray-900">How do I turn on notifications?</h3>
                            <p className="text-gray-600 mt-1">
                                Navigate to Settings and toggle the "Notifications" switch. You may need to grant permission in your system settings as well.
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Contact Us</h2>
                    <p className="text-gray-700 mb-4">
                        Still have questions? We're here to help!
                    </p>
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <p className="font-medium text-blue-900">Email Support</p>
                        <a href="mailto:support@example.com" className="text-blue-600 underline text-lg">support@example.com</a>
                        <p className="text-sm text-blue-800 mt-2">
                            We typically respond within 24-48 hours.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
