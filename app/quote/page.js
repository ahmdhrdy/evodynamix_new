"use client";

import { useState } from 'react';
import Image from 'next/image';

export default function QuotePage() {
  const [formData, setFormData] = useState({ budget: '', timeline: '', application_type: '', email: '', description: '' });
  const [formStatus, setFormStatus] = useState('');
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('Submitting...');

    try {
      const res = await fetch('http://localhost:5000/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || `HTTP error! Status: ${res.status}`);
      }

      showNotification('Quote request submitted successfully!');
      setFormStatus('');
      setFormData({ budget: '', timeline: '', application_type: '', email: '', description: '' });
    } catch (error) {
      showNotification(error.message || 'Error occurred while submitting quote request.', 'error');
      setFormStatus('');
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] py-16">
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white z-[1000] ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {notification.message}
        </div>
      )}
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-[#00C4B4]">Request a Quote</h1>
        <p className="mb-4 text-gray-300 text-lg">Fill out the form below to get a personalized quote for your project.</p>
        <div className="flex flex-col md:flex-row justify-between items-start max-w-5xl mx-auto">
          <div className="md:w-1/3 mb-8 md:mb-0">
            <Image
              src="/quote.jpg"
              alt="Quote Image"
              width={300}
              height={400}
              className="rounded-lg object-cover"
            />
          </div>
          <div className="md:w-2/3 md:pl-8 text-left">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="budget" className="block text-white mb-2">Budget</label>
                <input
                  type="text"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-[#2A2A3D]/80 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-[#00C4B4] transition duration-300"
                  placeholder="Your Budget (e.g., $5000)"
                  required
                />
              </div>
              <div>
                <label htmlFor="timeline" className="block text-white mb-2">Timeline</label>
                <select
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-[#2A2A3D]/80 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-[#00C4B4] transition duration-300"
                  required
                >
                  <option value="">Select Timeline</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                  <option value="DayByDay">Day By Day</option>
                </select>
              </div>
              <div>
                <label htmlFor="application_type" className="block text-white mb-2">Application Type</label>
                <select
                  id="application_type"
                  name="application_type"
                  value={formData.application_type}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-[#2A2A3D]/80 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-[#00C4B4] transition duration-300"
                  required
                >
                  <option value="">Select Application Type</option>
                  <option value="Android">Android</option>
                  <option value="DesktopPC">Desktop PC</option>
                  <option value="IOS">iOS</option>
                  <option value="Web">Web</option>
                </select>
              </div>
              <div>
                <label htmlFor="email" className="block text-white mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-[#2A2A3D]/80 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-[#00C4B4] transition duration-300"
                  placeholder="Your Email"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-white mb-2">Project Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows="5"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-[#2A2A3D]/80 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-[#00C4B4] transition duration-300"
                  placeholder="Describe your project requirements"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#00C4B4] to-[#007BFF] text-white px-6 py-3 rounded-lg hover:from-[#00A399] hover:to-[#0066CC] transition duration-300 transform hover:scale-105"
                disabled={formStatus === 'Submitting...'}
              >
                {formStatus === 'Submitting...' ? 'Submitting...' : 'Submit Quote Request'}
              </button>
              {formStatus && !notification && <p className="text-gray-300 mt-4">{formStatus}</p>}
            </form>
          </div>
        </div>
        <p className="text-gray-300 mt-8 text-lg">For urgent inquiries, email us at contact@evodynamix.onmicrosoft.com</p>
      </div>
    </div>
  );
}