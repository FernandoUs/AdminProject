"use client"
import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Home,
  RefreshCw,
  Search,
  Plus
} from 'lucide-react';

const SAMPLE_DATA = [
  {
    _id: "673044c940c2ad04dc3fb1e5",
    floor: 1,
    apartment: "112",
    status: "Disponible",
    createdAt: "2024-11-10T05:29:45.863Z",
    updatedAt: "2024-11-13T02:46:53.832Z",
  },
  {
    _id: "673045ab40c2ad04dc3fb1e9",
    floor: 1,
    apartment: "107",
    status: "Ocupado",
    createdAt: "2024-11-10T05:33:31.585Z",
    updatedAt: "2024-11-10T05:33:31.585Z",
  }
];

const DashboardComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const stats = {
    total: SAMPLE_DATA.length,
    available: SAMPLE_DATA.filter(apt => apt.status === 'Disponible').length,
    occupied: SAMPLE_DATA.filter(apt => apt.status === 'Ocupado').length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard de Departamentos</h1>
        <p className="mt-2 text-gray-600">Gestión y visualización de departamentos</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center">
            <Building2 className="w-12 h-12 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Departamentos</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center">
            <Home className="w-12 h-12 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Disponibles</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.available}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center">
            <Users className="w-12 h-12 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ocupados</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.occupied}</p>
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
            placeholder="Buscar departamento..."
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
            Nuevo Departamento
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Piso</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Actualización</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {SAMPLE_DATA.map((apartment) => (
              <tr key={apartment._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{apartment._id.slice(-6)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{apartment.floor}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{apartment.apartment}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    apartment.status === 'Disponible' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {apartment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(apartment.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardComponent;