"use client"
import React, { useState } from 'react';
import { 
  Users, 
  RefreshCw,
  Search,
  Plus
} from 'lucide-react';

const SAMPLE_DATA = [
  {
    _id: "673026ddcf7eef24b6656b40",
    nombre:  "FernandoUs",
    email: "fernan@gmail.com",
    departamento: "502",
  },
  {
    _id: "673026dpcf7eef24b6656b40",
    nombre:  "Aarongod",
    email: "aar@gmail.com",
    departamento: "509",
  }
];

const DashboardComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');


  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard de Residentes</h1>
        <p className="mt-2 text-gray-600">Gestión y visualización de todos los residentes</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center">
            <Users className="w-12 h-12 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Residentes</p>
              <p className="text-2xl font-semibold text-gray-900">{SAMPLE_DATA.length}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Actions Bar */}
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar residente..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Residente
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {SAMPLE_DATA.map((resident) => (
              <tr key={resident._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resident._id.slice(-6)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resident.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resident.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resident.departamento}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardComponent;