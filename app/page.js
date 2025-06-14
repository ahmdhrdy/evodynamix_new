"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [errorServices, setErrorServices] = useState(null);
  const [errorProjects, setErrorProjects] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [formStatus, setFormStatus] = useState('');
  const [notification, setNotification] = useState(null);
  const brandContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const scrollAnimationRef = useRef(null);

  const aboutCategories = [
    { title: "Innovation and Creativity", content: "We approach each project with a fresh perspective, combining innovation and creativity to solve challenges." },
    { title: "Client-Centric Approach", content: "We prioritize our clients' needs and objectives, tailoring our solutions to align with their vision and goals." },
    { title: "Expert Team", content: "Our team comprises skilled professionals dedicated to delivering exceptional results." },
    { title: "Proven Results", content: "We have a track record of transforming ideas into successful realities for our clients." },
  ];

  const testimonials = [
    { quote: "Working with Evodynamix has been a game-changer for our business. Their innovative solutions exceeded our expectations!", author: "Al Ruhul Sabbir, Admin Officer", rating: 5, avatar: "/rahul.png" },
    { quote: "The team’s dedication and expertise made our project a success. Highly recommend their services!", author: "Olivia, Marketing Manager", rating: 5, avatar: "/olivia.png" },
    { quote: "Evodynamix transformed our ideas into reality with professionalism and creativity. Amazing experience!", author: "George Pento, Project Manager", rating: 4, avatar: "/pento.png" },
  ];

  const brands = [
    { name: "Brand 1", logo: "/brand1.png" },
    { name: "Brand 2", logo: "/brand2.jpg" },
    { name: "Brand 3", logo: "/brand3.png" },
    { name: "Brand 4", logo: "/brand4.png" },
    { name: "Brand 5", logo: "/brand5.png" },
  ];

  const teamMembers = [
    { name: "Sakib Hossain", role: "Founder & CEO", photo: "/sakib.jpg" },
    { name: "Medisa Kally", role: "Chief Technology Officer", photo: "/medisa.jpg" },
    { name: "Brown Kytzer", role: "CTO", photo: "/brown.jpg" },
  ];

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchServices = async () => {
    try {
      setLoadingServices(true);
      const res = await fetch('http://localhost:5000/api/services', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      const updatedData = data.map(service => ({
        ...service,
        items: service.items.map(item => {
          if (item.includes('Marketing')) return item.replace(' Marketing', '');
          if (item.includes('Development')) return item.replace(' Development', '');
          if (item.includes('Innovation')) return item.replace(' Innovation', '');
          if (item.includes('Testing')) return item.replace(' Testing', '');
          if (item.includes('Services')) return item.replace(' Services', '');
          if (item.includes('Software')) return item.replace(' Software', '');
          if (item.includes('Solutions')) return item.replace(' Solutions', '');
          if (item.includes('Comprehensive')) return item.replace('Comprehensive ', '');
          if (item.includes('Strategic')) return item.replace('Strategic ', '');
          if (item.includes('Business Model')) return 'Business Model';
          if (item.includes('Culture of')) return 'Culture';
          return item;
        }),
      }));
      setServices(updatedData);
      setErrorServices(null);
    } catch (err) {
      console.error('Error fetching services:', err.message);
      setErrorServices(err.message.includes('401') ? 'Services are temporarily unavailable. Please try again later.' : `Failed to load services: ${err.message}. Please try again later.`);
    } finally {
      setLoadingServices(false);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const res = await fetch('http://localhost:5000/api/projects', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setProjects(data);
      setErrorProjects(null);
    } catch (err) {
      console.error('Error fetching projects:', err.message);
      setErrorProjects(err.message.includes('401') ? 'Projects are temporarily unavailable. Please try again later.' : `Failed to load projects: ${err.message}. Please try again later.`);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchProjects();
    const fetchInterval = setInterval(() => {
      fetchServices();
      fetchProjects();
    }, 30000);

    const animateScroll = () => {
      if (brandContainerRef.current && isAutoScrolling) {
        brandContainerRef.current.scrollLeft += 0.5;
        if (brandContainerRef.current.scrollLeft >= brandContainerRef.current.scrollWidth / 2) {
          brandContainerRef.current.scrollLeft = 0;
        }
      }
      scrollAnimationRef.current = requestAnimationFrame(animateScroll);
    };

    if (isAutoScrolling) {
      scrollAnimationRef.current = requestAnimationFrame(animateScroll);
    }

    return () => {
      clearInterval(fetchInterval);
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
      }
    };
  }, [isAutoScrolling]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('Submitting...');

    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // Check response and parse as text first to handle non-JSON responses
      const text = await res.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (parseErr) {
        throw new Error('Server returned an invalid response. Please try again or contact support.');
      }

      if (!res.ok) {
        throw new Error(result.error || `HTTP error! Status: ${res.status}`);
      }

      showNotification('Message sent successfully!', 'success');
      setFormStatus('');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      showNotification(error.message || 'Error occurred while sending message.', 'error');
      setFormStatus('');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - brandContainerRef.current.offsetLeft);
    setScrollLeft(brandContainerRef.current.scrollLeft);
    setIsAutoScrolling(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsAutoScrolling(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - brandContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    brandContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseEnter = () => {
    setIsAutoScrolling(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="relative">
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white z-[1000] ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {notification.message}
        </div>
      )}
      <section id="home" className="min-h-screen bg-gradient-to-b from-[#000000] to-[#1A2A44] flex items-center justify-center text-center">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={containerVariants}
          className="pt-20"
        >
          <motion.h2
            variants={itemVariants}
            className="text-[#00C4B4] text-2xl uppercase mb-4 font-semibold tracking-wider"
          >
            Where Tech Meets Transformation
          </motion.h2>
          <motion.h1
            variants={itemVariants}
            className="text-white text-5xl md:text-6xl font-bold leading-tight"
          >
            Join Us in Shaping the Future
          </motion.h1>
        </motion.div>
      </section>

      <section id="services" className="bg-[#1A1A2E] py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-12"
          >
            <motion.h2 variants={itemVariants} className="text-white text-3xl md:text-4xl font-bold mb-4">
              Our Services
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-300 text-lg">
              Discover How Our Extensive Service Offerings Can Benefit You
            </motion.p>
          </motion.div>
          {loadingServices ? (
            <p className="text-gray-300 text-center">Loading services...</p>
          ) : errorServices ? (
            <p className="text-red-500 text-center">{errorServices}</p>
          ) : services.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03, boxShadow: "0px 15px 30px rgba(0, 196, 180, 0.2)" }}
                  className="bg-[#2A2A3D] rounded-lg shadow-lg p-6 text-center text-white"
                >
                  <div className="flex justify-center mb-4">
                    <Image
                      src={service.icon || '/default-icon.png'}
                      alt={`${service.title} icon`}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-400 mb-4 text-sm">{service.description}</p>
                  {Array.isArray(service.items) && service.items.length > 0 ? (
                    <ul className="text-gray-300 list-disc pl-6 mb-4 text-left">
                      {service.items.map((item, i) => (
                        <li key={i} className="text-sm mb-1">{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-sm mb-4">No items available</p>
                  )}
                  <Link
                    href={`/services/${service.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-[#00C4B4] font-semibold hover:text-[#00A399] transition duration-300"
                  >
                    Read More →
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="text-gray-300 text-center">No services available.</p>
          )}
        </div>
      </section>

      <section id="about" className="bg-[#1A1A1A] py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-12"
          >
            <motion.h1 variants={itemVariants} className="text-white text-4xl md:text-5xl font-bold mb-4">
              Who We <span className="text-[#00C4B4]">Are</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-gray-300 text-lg">
              Providing top-notch technology.
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={containerVariants}
            className="flex flex-col md:flex-row items-center gap-8 mb-12"
          >
            <motion.div variants={itemVariants} className="md:w-1/2">
              <motion.p variants={itemVariants} className="text-gray-300 text-lg mb-6">
                EvoDynamix Solutions is a dynamic and innovative software development company committed to shaping the future through technology. Our mission is to empower ideas, code with precision, and deliver digital solutions that make an impact.
              </motion.p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {aboutCategories.map((category, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="p-4 bg-[#2A2A3D]/80 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                  >
                    <h3 className="text-white text-lg font-semibold mb-2">{category.title}</h3>
                    <p className="text-gray-300 text-sm">{category.content}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="md:w-1/2">
              <Image
                src="/about.jpg"
                alt="About Us"
                width={500}
                height={400}
                className="rounded-lg shadow-lg object-cover"
              />
            </motion.div>
          </motion.div>
          <motion.h3
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={itemVariants}
            className="text-white text-2xl md:text-3xl font-bold text-center mb-8"
          >
            What Our Clients Say
          </motion.h3>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 196, 180, 0.3)" }}
                className="p-6 bg-[#2A2A3D]/80 rounded-lg shadow-md transition duration-300 text-center"
              >
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  width={80}
                  height={80}
                  className="rounded-full mx-auto mb-4 object-cover"
                />
                <p className="text-gray-300 mb-4 italic text-sm">"{testimonial.quote}"</p>
                <p className="text-white font-semibold">{testimonial.author}</p>
                <div className="flex justify-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${i < testimonial.rating ? 'text-[#00FF00]' : 'text-gray-500'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
          <motion.h3
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={itemVariants}
            className="text-white text-2xl md:text-3xl font-bold text-center mb-8"
          >
            Trusted by Best Brands
          </motion.h3>
          <div
            ref={brandContainerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            className="flex overflow-x-hidden whitespace-nowrap py-4 cursor-grab select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {[...brands, ...brands].map((brand, index) => (
              <div key={index} className="inline-block mx-6">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={120}
                  height={60}
                  className="opacity-70 hover:opacity-100 transition duration-300"
                />
              </div>
            ))}
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </div>
          <motion.h3
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={itemVariants}
            className="text-white text-2xl md:text-3xl font-bold text-center mb-8 mt-8"
          >
            Meet Our Team
          </motion.h3>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center p-4 bg-[#2A2A3D]/80 rounded-lg shadow-md hover:shadow-lg transition duration-300"
              >
                <Image
                  src={member.photo}
                  alt={member.name}
                  width={200}
                  height={200}
                  className="rounded-full mx-auto mb-4 object-cover"
                />
                <h4 className="text-white text-lg font-semibold">{member.name}</h4>
                <p className="text-gray-300">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="portfolio" className="bg-gradient-to-b from-black to-gray-800 py-16">
        <div className="container mx-auto px-4">
          <motion.h3
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={itemVariants}
            className="text-[#00C4B4] text-xl text-center mb-2"
          >
            Our Latest Projects
          </motion.h3>
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={itemVariants}
            className="text-white text-3xl md:text-4xl font-bold text-center mb-8"
          >
            Latest Projects
          </motion.h2>
          {loadingProjects ? (
            <p className="text-gray-300 text-center">Loading projects...</p>
          ) : errorProjects ? (
            <p className="text-red-500 text-center">{errorProjects}</p>
          ) : projects.length > 0 ? (
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {projects.map((project, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition duration-300"
                >
                  <Image
                    src={project.image || '/p1.jpg'}
                    alt={project.title}
                    width={500}
                    height={300}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute bottom-4 left-4 text-white bg-black/50 p-2 rounded">
                    <p className="text-[#00C4B4] uppercase text-sm">{project.category || 'Uncategorized'}</p>
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="text-gray-300 text-center">No projects available.</p>
          )}
          <div className="text-right mt-8">
            <Link
              href="/quote"
              className="bg-gradient-to-r from-[#00C4B4] to-[#007BFF] text-white px-6 py-2 rounded-full hover:from-[#00A399] hover:to-[#0066CC] transition duration-300 transform hover:scale-105"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-[#1A1A2E] py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-12"
          >
            <motion.h2 variants={itemVariants} className="text-white text-3xl md:text-4xl font-bold mb-4">
              Contact Us
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-300 text-lg">
              Let’s discuss your project ideas.
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={containerVariants}
            className="flex flex-col md:flex-row justify-between items-start max-w-5xl mx-auto gap-8"
          >
            <motion.div variants={itemVariants} className="md:w-1/3 mb-8 md:mb-0">
              <Image
                src="/contact.png"
                alt="Contact Image"
                width={300}
                height={400}
                className="rounded-lg object-cover"
              />
            </motion.div>
            <motion.div variants={itemVariants} className="md:w-2/3 md:pl-8 text-left">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-white mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-[#2A2A3D]/80 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-[#00C4B4] transition duration-300"
                    placeholder="Your Name"
                    required
                  />
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
                  <label htmlFor="phone" className="block text-white mb-2">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-[#2A2A3D]/80 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-[#00C4B4] transition duration-300"
                    placeholder="Your Phone Number"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-white mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-[#2A2A3D]/80 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-[#00C4B4] transition duration-300"
                    placeholder="Your Message"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#00C4B4] to-[#007BFF] text-white px-6 py-3 rounded-lg hover:from-[#00A399] hover:to-[#0066CC] transition duration-300 transform hover:scale-105"
                  disabled={formStatus === 'Submitting...'}
                >
                  {formStatus === 'Submitting...' ? 'Submitting...' : 'Send Message'}
                </button>
                {formStatus && !notification && <p className="text-gray-300 mt-4">{formStatus}</p>}
              </form>
            </motion.div>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={itemVariants}
            className="text-center mt-8"
          >
            <p className="text-gray-300 text-lg">
              For urgent inquiries, email us at{' '}
              <a href="mailto:contact@evodynamix.onmicrosoft.com" className="text-[#00C4B4] hover:underline">
                contact@evodynamix.onmicrosoft.com
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      <footer className="bg-[#1A1A2E] py-8 text-center text-gray-300">
        <p>© {new Date().getFullYear()} Evodynamix Solutions. All rights reserved.</p>
      </footer>
    </div>
  );
}