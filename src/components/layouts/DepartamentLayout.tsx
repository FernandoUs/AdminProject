"use client";
import React, { useState } from "react";
import {
    LayoutDashboard,
    Building2,
    Users,
    LogOut,
    Menu,
    X,
    Bell,
    ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const router = useRouter();

    const navigationItems = [
        { name: "Departamentos", icon: LayoutDashboard, href: "/" },
        { name: "Residentes", icon: Users, href: "/residents" },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out
          ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
            >
                {/* Sidebar Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b">
                    <Link href="/" className="flex items-center space-x-2">
                        <Building2 className="w-8 h-8 text-blue-600" />
                        <span className="text-xl font-bold text-gray-900">
                            AdminPanel
                        </span>
                    </Link>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="px-4 pt-4">
                    <ul className="space-y-1">
                        {navigationItems.map((item) => (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Sidebar Footer */}
                <div className="absolute bottom-0 w-full p-4 border-t">
                    <button
                        className="flex items-center w-full px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
                        onClick={() => {
                            localStorage.removeItem("tenantId");
                            router.push("/login");
                        }}
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div
                className={`lg:ml-64 transition-margin duration-200 ease-in-out ${
                    isSidebarOpen ? "ml-64" : "ml-0"
                }`}
            >
                {/* Top Navigation */}
                <header className="h-16 bg-white shadow-sm">
                    <div className="h-full px-4 flex items-center justify-between">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden text-gray-500 hover:text-gray-700"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="flex items-center space-x-4">
                            {/* Profile Dropdown */}
                            <div className="relative flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                                <div className="rounded-full bg-blue-500 px-4 py-2 text-white">
                                    A
                                </div>
                                <span>Admin</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
};

export default DashboardLayout;
