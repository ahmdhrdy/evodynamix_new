"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setIsAdmin(!!token);
    fetchServices();
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleServices = () => setIsServicesOpen(!isServicesOpen);
  const handleScroll = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  const fetchServices = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/services");
      const data = await res.json();
      if (res.ok) setServices(data);
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  };

  return (
    <nav className="bg-[#1A1A2E]/80 backdrop-blur-sm p-4 fixed w-full top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Link href="/#home" className="flex items-center">
            <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-full border-2 border-white/30" />
            <span className="text-white text-xl font-semibold ml-2 tracking-tight">Evodynamix</span>
          </Link>
        </div>
        <div className="flex items-center space-x-8">
          {["Home", "Service", "About", "Portfolio", "Contact"].map((item, index) => (
            item === "Service" ? (
              <div key={index} className="relative">
                <Link
                  href="/#services"
                  onClick={(e) => {
                    handleScroll("service");
                    toggleServices();
                  }}
                  className="text-white text-base font-medium hover:text-[#00C4B4] transition duration-200 relative group focus:outline-none"
                >
                  {item}
                  <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-[#00C4B4] transition-all duration-200 group-hover:w-full"></span>
                </Link>
                {isServicesOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-[#1A1A2E]/90 backdrop-blur-sm rounded-lg shadow-lg py-2 border border-white/20">
                    {services.length > 0 ? (
                      services.map((service) => (
                        <Link
                          key={service.id}
                          href={`/services/${service.title.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={() => setIsServicesOpen(false)}
                          className="block px-4 py-2 text-white text-sm hover:bg-white/20 transition duration-200"
                        >
                          {service.title}
                        </Link>
                      ))
                    ) : (
                      <span className="block px-4 py-2 text-white text-sm">Loading services...</span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={index}
                href={`/#${item.toLowerCase()}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleScroll(item.toLowerCase());
                }}
                className="text-white text-base font-medium hover:text-[#00C4B4] transition duration-200 relative group"
              >
                {item}
                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-[#00C4B4] transition-all duration-200 group-hover:w-full"></span>
              </Link>
            )
          ))}
          {isAdmin && (
            <Link href="/admin" className="text-white text-base font-medium hover:text-[#00C4B4] transition duration-200">
              Admin
            </Link>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/quote">
            <button className="bg-[#00C4B4] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#00A399] transition duration-200 shadow-md">
              Request a Quote
            </button>
          </Link>
          <div className="relative">
            <button onClick={toggleDropdown} className="focus:outline-none">
              <Image src="/user.png" alt="Account" width={30} height={30} className="rounded-full border border-white/20" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-[#1A1A2E]/90 backdrop-blur-sm rounded-lg shadow-lg py-2 border border-white/20">
                {isAdmin ? (
                  <button
                    onClick={() => {
                      localStorage.removeItem("adminToken");
                      setIsAdmin(false);
                      window.location.href = "/";
                    }}
                    className="block px-4 py-2 text-white text-sm hover:bg-white/20 transition duration-200"
                  >
                    Logout
                  </button>
                ) : (
                  <Link href="/admin/login">
                    <span className="block px-4 py-2 text-white text-sm hover:bg-white/20 transition duration-200">
                      Admin Login
                    </span>
                  </Link>
                )}
                <Link href="/#home">
                  <span className="block px-4 py-2 text-white text-sm hover:bg-white/20 transition duration-200">
                    User
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}