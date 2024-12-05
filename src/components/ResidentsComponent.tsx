'use client'
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  RefreshCw,
  Search,
  Loader
} from 'lucide-react';

interface Resident {
  _id: string;
  fullName: string;
  email: string;
  apartment: string;
  createdAt: string;
  updatedAt: string;
}

const ResidentsDashboard = () => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true); // New state for initial load

  useEffect(() => {
    const initializeDashboard = async () => {
      const storedTenantId = localStorage.getItem('tenantId');
      
      if (!storedTenantId) {
        window.location.href = '/login';
        return;
      }
      
      setTenantId(storedTenantId);
      setIsInitializing(false); // Mark initialization as complete
    };

    initializeDashboard();
  }, []);

  // Separate useEffect for fetching data
  useEffect(() => {
    if (!isInitializing && tenantId) {
      fetchResidents();
    }
  }, [tenantId, isInitializing]);

  const fetchResidents = async () => {
    if (!tenantId) return; // Guard clause to prevent API call without tenantId

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:7091/resident?tenantId=${tenantId}`);
      
      if (!response.ok) throw new Error('Failed to fetch residents');
      
      const data = await response.json();
      setResidents(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching residents');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredResidents = residents.filter(resident => 
    resident.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.apartment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state component
  if (isInitializing || (isLoading && residents.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard de Residentes</h1>
        <p className="mt-2 text-gray-600">Gestión y visualización de residentes del condominio</p>
      </div>

      {/* Stats Card */}
      <div className="mb-8">
        <div className="p-6 bg-white rounded-lg shadow-sm max-w-sm">
          <div className="flex items-center">
            <Users className="w-12 h-12 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Residentes</p>
              <p className="text-2xl font-semibold text-gray-900">{residents.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Actions Bar */}
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o departamento..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          onClick={fetchResidents}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      {/* Table with Loading Overlay */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden relative">
        {isLoading && residents.length > 0 && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <Loader className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        )}
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Departamento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Registro
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredResidents.map((resident) => (
              <tr key={resident._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {resident._id.slice(-6)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {resident.fullName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{resident.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{resident.apartment}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(resident.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Error Notification */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default ResidentsDashboard;