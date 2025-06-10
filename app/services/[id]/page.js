"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function ServicePage() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/services`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch service');

        // Find the service
        const foundService = data.find(s => s.title.toLowerCase().replace(/\s+/g, '-') === id);
        if (!foundService) throw new Error('Service not found');
        setService(foundService);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchService();
  }, [id]);

  if (loading) return <p className="text-center text-gray-300 py-16">Loading...</p>;
  if (error) return <p className="text-center text-red-500 py-16">{error}</p>;
  if (!service) return <p className="text-center text-gray-300 py-16">Service not found.</p>;

  return (
    <div className="min-h-screen bg-[#1A1A2E] py-16">
      <div className="container mx-auto px-4">
        <div className="bg-[#2A2A3D] rounded-lg shadow-lg p-8 text-white">
          <div className="flex justify-center mb-6">
            <Image
              src={service.icon || '/default-icon.png'}
              alt={`${service.title} icon`}
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-center mb-4">{service.title}</h1>
          <p className="text-gray-300 text-lg text-center mb-6">{service.description}</p>
          {Array.isArray(service.items) && service.items.length > 0 ? (
            <ul className="text-gray-300 list-disc pl-6 mb-6 max-w-md mx-auto">
              {service.items.map((item, index) => (
                <li key={index} className="mb-2">{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-300 text-center mb-6">No items available.</p>
          )}
          <div className="text-center">
            <Link href="/#services" className="text-[#00C4B4] font-semibold hover:text-[#00A399] transition duration-300">
              Back to Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}