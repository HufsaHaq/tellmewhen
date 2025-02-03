"use client";

import { useState } from 'react';
import Header from "../components/Header";
import "../app/globals.css";

function Page() {
  const [email, setEmail] = useState('');

  const features = [
    {
      title: "QR Code Integration",
      desc: "Generate unique QR codes for each customer or service queue",
      icon: "🔗"
    },
    {
      title: "Real-time Notifications",
      desc: "Instant push notifications directly to customers' devices",
      icon: "📲"
    },
    {
      title: "No Hardware Needed",
      desc: "Works with any smartphone - no specialized equipment required",
      icon: "📱"
    }
  ];

  const steps = [
    { title: "1. Scan", desc: "Customer scans business QR code" },
    { title: "2. Wait", desc: "Customer goes about their day" },
    { title: "3. Notify", desc: "Business sends notification when ready" }
  ];

  return (
    <>  
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-4xl md:text-3xl font-bold mb-6">
                Modernise your customer notifications with QR-based alerts
            </h2>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="bg-gray-200 w-64 h-64 rounded-xl flex items-center justify-center">
              [QR Code Demo]
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose TellMeWhen?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center p-6">
                <div className="text-2xl font-bold mb-4 text-blue-600">{step.title}</div>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


     <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
        Archie Calvert | Hufsa Haq | Nurassyl Molshin | Muhammed Choudhary | Palak Singh | Varvara Frolenkova | Vuk Stojkovic
        </div>
      </footer>
    </>
  );
}

export default Page;