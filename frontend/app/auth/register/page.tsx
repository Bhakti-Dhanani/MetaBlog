"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiUser, FiMail, FiLock, FiGlobe, FiPenTool } from "react-icons/fi";

const Register = () => {
  const [role, setRole] = useState<string | null>(null);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRoleSelection = (selectedRole: string) => {
    setRole(selectedRole);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log('Submitting registration with data:', { ...form, role });
      
      const response = await fetch("http://localhost:1337/api/auth/local/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role }),
      });

      const data = await response.json();
      console.log('Registration response:', data);

      if (response.ok) {
        alert("Registration successful!");
        router.push("/auth/login");
      } else {
        console.error('Registration failed:', data);
        alert(data.error?.message || data.message || "Registration failed!");
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert("An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
            <h1 className="text-2xl font-bold text-white">MetaBlog</h1>
            <p className="text-blue-100 mt-1">
              {!role ? "Get started with your blogging journey" : `Register as ${role}`}
            </p>
          </div>
          
          <div className="p-6">
            {!role ? (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 text-center">Choose your role</h2>
                
                <div className="grid gap-4">
                  <button
                    onClick={() => handleRoleSelection("Tenant Admin")}
                    className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <FiGlobe className="text-blue-600 text-xl" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-800">Tenant Admin</h3>
                      <p className="text-sm text-gray-500">Create and manage your own blog</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleRoleSelection("Contributor")}
                    className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
                  >
                    <div className="bg-green-100 p-3 rounded-full mr-4">
                      <FiPenTool className="text-green-600 text-xl" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-800">Contributor</h3>
                      <p className="text-sm text-gray-500">Write for an existing blog</p>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    required
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    required
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Registering...' : 'Register'}
                </button>
                
                <button 
                  type="button" 
                  onClick={() => setRole(null)} 
                  className="flex items-center justify-center w-full py-2 px-4 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
                >
                  <FiArrowLeft className="mr-2" />
                  Back to role selection
                </button>
              </form>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <a href="/auth/login" className="text-blue-600 hover:underline font-medium">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By registering, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;