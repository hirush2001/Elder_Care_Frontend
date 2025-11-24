import React from "react";

export default function CaregiverPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-start">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-2xl p-8">

        {/* Header */}
        <h1 className="text-3xl font-bold text-blue-700">Caregiver Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Manage caregiver details, schedule, and assigned elders.
        </p>

        {/* Caregiver Profile */}
        <div className="mt-6 flex items-center gap-6 bg-blue-50 p-6 rounded-xl">
          <img
            src="/caregiver-img.png"
            className="w-24 h-24 rounded-full border"
            alt="Caregiver"
          />

          <div>
            <h2 className="text-xl font-semibold">Jane Doe</h2>
            <p className="text-gray-600">Senior Caregiver</p>
            <p className="text-sm text-gray-500 mt-1">
              Experience: 6+ years | Certified Elder Assistant
            </p>
          </div>
        </div>

        {/* Contact + Work Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

          <div className="p-4 border rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-800">Contact Information</h3>
            <p className="text-gray-600 mt-2">📞 +94 76 234 5678</p>
            <p className="text-gray-600">📧 jane.care@example.com</p>
          </div>

          <div className="p-4 border rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-800">Work Schedule</h3>
            <p className="text-gray-600 mt-2">🕒 8 AM – 6 PM</p>
            <p className="text-gray-600">🗓 Monday – Saturday</p>
          </div>

        </div>

        {/* Assigned Elders */}
        <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-3">
          Assigned Elders
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Elder Card */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-gray-700">John Silva</h4>
            <p className="text-sm text-gray-600 mt-1">Age: 76</p>
            <p className="text-sm text-gray-600">Condition: Heart issues</p>

            <button className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
              Monitor
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-gray-700">Mary Perera</h4>
            <p className="text-sm text-gray-600 mt-1">Age: 82</p>
            <p className="text-sm text-gray-600">Condition: Diabetes</p>

            <button className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
              Monitor
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
