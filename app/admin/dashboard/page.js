"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function AdminDashboard() {
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notification, setNotification] = useState(null);
  const [newService, setNewService] = useState({ title: "", description: "", items: "", iconFile: null });
  const [newProject, setNewProject] = useState({ title: "", category: "", imageFile: null });
  const [editService, setEditService] = useState(null);
  const [editProject, setEditProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard"); // State to track active sidebar menu
  const router = useRouter();

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchData = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    try {
      const [servicesRes, projectsRes, quoteRes, contactRes, ordersRes] = await Promise.all([
        fetch("http://localhost:5000/api/services", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:5000/api/projects", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:5000/api/quote-requests", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:5000/api/contact-submissions", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:5000/api/orders", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (!servicesRes.ok) throw new Error(`HTTP error! Status: ${servicesRes.status}`);
      if (!projectsRes.ok) throw new Error(`HTTP error! Status: ${projectsRes.status}`);
      if (!quoteRes.ok) throw new Error(`HTTP error! Status: ${quoteRes.status}`);
      if (!contactRes.ok) throw new Error(`HTTP error! Status: ${contactRes.status}`);
      if (!ordersRes.ok) throw new Error(`HTTP error! Status: ${ordersRes.status}`);
      setServices(await servicesRes.json());
      setProjects(await projectsRes.json());
      setQuoteRequests(await quoteRes.json());
      setContactSubmissions(await contactRes.json());
      setOrders(await ordersRes.json());
    } catch (err) {
      showNotification(err.message, "error");
      if (err.message.includes("401")) {
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
      }
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [router]);

  const handleAddService = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", newService.title);
    formData.append("description", newService.description);
    formData.append("items", JSON.stringify(newService.items.split(",").map((item) => item.trim())));
    if (newService.iconFile) formData.append("icon", newService.iconFile);
    try {
      const res = await fetch("http://localhost:5000/api/services", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to add service");
      showNotification("Service added successfully!", "success");
      setNewService({ title: "", description: "", items: "", iconFile: null });
      fetchData();
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  const handleEditService = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", editService.title);
    formData.append("description", editService.description);
    formData.append("items", JSON.stringify(editService.items.split(",").map((item) => item.trim())));
    if (editService.iconFile) formData.append("icon", editService.iconFile);
    try {
      const res = await fetch(`http://localhost:5000/api/services/${editService.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to update service");
      showNotification("Service updated successfully!", "success");
      setEditService(null);
      fetchData();
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  const handleDeleteService = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/services/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to delete service");
      showNotification("Service deleted successfully!", "success");
      fetchData();
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", newProject.title);
    formData.append("category", newProject.category);
    if (newProject.imageFile) formData.append("image", newProject.imageFile);
    try {
      const res = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to add project");
      showNotification("Project added successfully!", "success");
      setNewProject({ title: "", category: "", imageFile: null });
      fetchData();
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  const handleEditProject = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", editProject.title);
    formData.append("category", editProject.category);
    if (editProject.imageFile) formData.append("image", editProject.imageFile);
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${editProject.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to update project");
      showNotification("Project updated successfully!", "success");
      setEditProject(null);
      fetchData();
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to delete project");
      showNotification("Project deleted successfully!", "success");
      fetchData();
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  const filteredServices = services.filter((service) =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredQuoteRequests = quoteRequests.filter((request) =>
    request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.budget.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredContactSubmissions = contactSubmissions.filter((submission) =>
    submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredOrders = orders.filter((order) =>
    order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.service_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sidebar menu items
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "/dashboard.png" },
    { id: "services", label: "Services", icon: "/service.png" },
    { id: "projects", label: "Projects", icon: "/project.png" },
    { id: "clients", label: "Clients", icon: "/client.png" },
    { id: "orders", label: "Orders", icon: "/order.png" },
    { id: "notifications", label: "Notifications", icon: "/notify.png" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1A2E] to-[#2A2A3D] py-6">
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white ${notification.type === "success" ? "bg-green-600" : "bg-red-600"} z-50`}>
          {notification.message}
        </div>
      )}
      <div className="container mx-auto">
        {/* Header */}
        <div className="p-4 bg-[#2A2A3D] rounded-lg shadow-lg mb-6 mt-10 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Image src="/dashboard.png" alt="Evodynamix Logo" width={40} height={40} className="rounded-full" />
            <h1 className="text-2xl font-bold text-[#00C4B4]">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Image src="/user.png" alt="User" width={30} height={30} className="rounded-full" />
              <span className="text-white">Admin</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        {(activeSection === "dashboard") && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-[#2A2A3D] p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-gray-400">Total Services</h3>
              <p className="text-2xl font-bold text-white">{services.length}</p>
            </div>
            <div className="bg-[#2A2A3D] p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-gray-400">Total Projects</h3>
              <p className="text-2xl font-bold text-white">{projects.length}</p>
            </div>
            <div className="bg-[#2A2A3D] p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-gray-400">Total Clients</h3>
              <p className="text-2xl font-bold text-white">{[...new Set([...quoteRequests, ...contactSubmissions].map((item) => item.email))].length}</p>
            </div>
            <div className="bg-[#2A2A3D] p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-gray-400">Total Orders</h3>
              <p className="text-2xl font-bold text-white">{orders.length}</p>
            </div>
          </div>
        )}

        {/* Sidebar and Main Content */}
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-[#1A1A2E] p-4 rounded-lg shadow-lg h-[calc(100vh-12rem)]">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center p-2 text-white rounded-lg transition duration-200 ${
                    activeSection === item.id ? "bg-[#2A2A3D]" : "hover:bg-[#2A2A3D]"
                  }`}
                >
                  <Image src={item.icon} alt={item.label} width={20} height={20} className="mr-2" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 ml-6">
            {/* Services Section */}
            {(activeSection === "dashboard" || activeSection === "services") && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Service List</h2>
                <div className="bg-[#2A2A3D] p-4 rounded-lg shadow-lg mb-4">
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 bg-[#1A1A2E] text-white rounded-lg border border-gray-600 focus:outline-none focus:border-[#00C4B4]"
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-white">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="p-2">Name</th>
                        <th className="p-2">Description</th>
                        <th className="p-2">Items</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredServices.length > 0 ? (
                        filteredServices.map((service) => (
                          <tr key={service.id} className="border-b border-gray-600 hover:bg-[#3A3A4D]">
                            <td className="p-2">{service.title}</td>
                            <td className="p-2">{service.description}</td>
                            <td className="p-2">{service.items.join(", ")}</td>
                            <td className="p-2 flex space-x-2">
                              <button
                                onClick={() => setEditService({ ...service, items: service.items.join(", ") })}
                                className="bg-blue-600 text-white px-2 py-1 rounded-lg hover:bg-blue-700"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteService(service.id)}
                                className="bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="p-2 text-center text-gray-400">No services found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Add Service Form */}
                <div className="bg-[#2A2A3D] p-4 rounded-lg shadow-lg mt-4">
                  <h3 className="text-xl font-semibold text-white mb-4">{editService ? "Edit Service" : "Add New Service"}</h3>
                  <form onSubmit={editService ? handleEditService : handleAddService} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Title"
                      value={editService ? editService.title : newService.title}
                      onChange={(e) => (editService ? setEditService({ ...editService, title: e.target.value }) : setNewService({ ...newService, title: e.target.value }))}
                      className="w-full p-2 bg-[#1A1A2E] text-white rounded-lg border border-gray-600"
                      required
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => (editService ? setEditService({ ...editService, iconFile: e.target.files[0] }) : setNewService({ ...newService, iconFile: e.target.files[0] }))}
                      className="w-full p-2 bg-[#1A1A2E] text-white rounded-lg border border-gray-600"
                    />
                    <textarea
                      placeholder="Description"
                      value={editService ? editService.description : newService.description}
                      onChange={(e) => (editService ? setEditService({ ...editService, description: e.target.value }) : setNewService({ ...newService, description: e.target.value }))}
                      className="w-full p-2 bg-[#1A1A2E] text-white rounded-lg border border-gray-600"
                      rows="3"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Items (comma-separated)"
                      value={editService ? editService.items : newService.items}
                      onChange={(e) => (editService ? setEditService({ ...editService, items: e.target.value }) : setNewService({ ...newService, items: e.target.value }))}
                      className="w-full p-2 bg-[#1A1A2E] text-white rounded-lg border border-gray-600"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-[#00C4B4] text-white px-4 py-2 rounded-lg hover:bg-[#00A399]"
                    >
                      {editService ? "Update Service" : "Add Service"}
                    </button>
                    {editService && (
                      <button
                        type="button"
                        onClick={() => setEditService(null)}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg ml-2 hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    )}
                  </form>
                </div>
              </section>
            )}

            {/* Projects Section */}
            {(activeSection === "dashboard" || activeSection === "projects") && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Project List</h2>
                <div className="bg-[#2A2A3D] p-4 rounded-lg shadow-lg mb-4">
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 bg-[#1A1A2E] text-white rounded-lg border border-gray-600 focus:outline-none focus:border-[#00C4B4]"
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-white">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="p-2">Title</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.length > 0 ? (
                        filteredProjects.map((project) => (
                          <tr key={project.id} className="border-b border-gray-600 hover:bg-[#3A3A4D]">
                            <td className="p-2">{project.title}</td>
                            <td className="p-2">{project.category}</td>
                            <td className="p-2 flex space-x-2">
                              <button
                                onClick={() => setEditProject(project)}
                                className="bg-blue-600 text-white px-2 py-1 rounded-lg hover:bg-blue-700"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProject(project.id)}
                                className="bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="p-2 text-center text-gray-400">No projects found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Add Project Form */}
                <div className="bg-[#2A2A3D] p-4 rounded-lg shadow-lg mt-4">
                  <h3 className="text-xl font-semibold text-white mb-4">{editProject ? "Edit Project" : "Add New Project"}</h3>
                  <form onSubmit={editProject ? handleEditProject : handleAddProject} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Title"
                      value={editProject ? editProject.title : newProject.title}
                      onChange={(e) => (editProject ? setEditProject({ ...editProject, title: e.target.value }) : setNewProject({ ...newProject, title: e.target.value }))}
                      className="w-full p-2 bg-[#1A1A2E] text-white rounded-lg border border-gray-600"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      value={editProject ? editProject.category : newProject.category}
                      onChange={(e) => (editProject ? setEditProject({ ...editProject, category: e.target.value }) : setNewProject({ ...newProject, category: e.target.value }))}
                      className="w-full p-2 bg-[#1A1A2E] text-white rounded-lg border border-gray-600"
                      required
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => (editProject ? setEditProject({ ...editProject, imageFile: e.target.files[0] }) : setNewProject({ ...newProject, imageFile: e.target.files[0] }))}
                      className="w-full p-2 bg-[#1A1A2E] text-white rounded-lg border border-gray-600"
                    />
                    <button
                      type="submit"
                      className="bg-[#00C4B4] text-white px-4 py-2 rounded-lg hover:bg-[#00A399]"
                    >
                      {editProject ? "Update Project" : "Add Project"}
                    </button>
                    {editProject && (
                      <button
                        type="button"
                        onClick={() => setEditProject(null)}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg ml-2 hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    )}
                  </form>
                </div>
              </section>
            )}

            {/* Clients (Quote Requests) Section */}
            {(activeSection === "dashboard" || activeSection === "clients") && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Client List (Quote Requests)</h2>
                <div className="bg-[#2A2A3D] p-4 rounded-lg shadow-lg mb-4">
                  <input
                    type="text"
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 bg-[#1A1A2E] text-white rounded-lg border border-gray-600 focus:outline-none focus:border-[#00C4B4]"
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-white">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="p-2">Email</th>
                        <th className="p-2">Budget</th>
                        <th className="p-2">Timeline</th>
                        <th className="p-2">Application Type</th>
                        <th className="p-2">Description</th>
                        <th className="p-2">Submitted At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQuoteRequests.map((request) => (
                        <tr key={request.id} className="border-b border-gray-600 hover:bg-[#3A3A4D]">
                          <td className="p-2">{request.email}</td>
                          <td className="p-2">{request.budget}</td>
                          <td className="p-2">{request.timeline}</td>
                          <td className="p-2">{request.application_type}</td>
                          <td className="p-2">{request.description}</td>
                          <td className="p-2">{new Date(request.submitted_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Clients (Contact Submissions) Section */}
            {(activeSection === "dashboard" || activeSection === "clients") && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Contact Submissions</h2>
                <div className="bg-[#2A2A3D] p-4 rounded-lg shadow-lg mb-4">
                  <input
                    type="text"
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 bg-[#1A1A2E] text-white rounded-lg border border-gray-600 focus:outline-none focus:border-[#00C4B4]"
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-white">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="p-2">Name</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Phone</th>
                        <th className="p-2">Message</th>
                        <th className="p-2">Submitted At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContactSubmissions.map((submission) => (
                        <tr key={submission.id} className="border-b border-gray-600 hover:bg-[#3A3A4D]">
                          <td className="p-2">{submission.name}</td>
                          <td className="p-2">{submission.email}</td>
                          <td className="p-2">{submission.phone || "N/A"}</td>
                          <td className="p-2">{submission.message || "N/A"}</td>
                          <td className="p-2">{new Date(submission.submitted_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Orders Section */}
            {(activeSection === "dashboard" || activeSection === "orders") && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Order List</h2>
                <div className="bg-[#2A2A3D] p-4 rounded-lg shadow-lg mb-4">
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 bg-[#1A1A2E] text-white rounded-lg border border-gray-600 focus:outline-none focus:border-[#00C4B4]"
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-white">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="p-2">Email</th>
                        <th className="p-2">Service</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Total</th>
                        <th className="p-2">Date</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-600 hover:bg-[#3A3A4D]">
                          <td className="p-2">{order.email}</td>
                          <td className="p-2">{order.service_title}</td>
                          <td className="p-2">
                            <span
                              className={`px-2 py-1 rounded ${
                                order.status === "Delivered"
                                  ? "bg-green-600"
                                  : order.status === "Pending"
                                  ? "bg-yellow-600"
                                  : "bg-red-600"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="p-2">${order.total}</td>
                          <td className="p-2">{new Date(order.created_at).toLocaleString()}</td>
                          <td className="p-2">
                            <button className="bg-blue-600 text-white px-2 py-1 rounded-lg mr-2 hover:bg-blue-700">
                              Edit
                            </button>
                            <button className="bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Notifications Section */}
            {(activeSection === "dashboard" || activeSection === "notifications") && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Notifications</h2>
                <div className="bg-[#2A2A3D] p-4 rounded-lg shadow-lg">
                  <p className="text-gray-400">No new notifications</p>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}