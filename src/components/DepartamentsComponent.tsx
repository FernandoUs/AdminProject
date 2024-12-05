'use client'
import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  Home,
  RefreshCw,
  Search,
  Plus,
  X,
  Loader
} from 'lucide-react';
import { Dialog } from '@headlessui/react';

interface Apartment {
  _id: string;
  floor: number;
  apartment: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
  code?: number;
}

interface NewApartmentData {
  owner: string | null;
  floor: number;
  apartment: string;
  tenantId: string;
}

const DashboardComponent = () => {
  // Core state management
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize dashboard and check for tenant ID
  useEffect(() => {
    const initializeDashboard = async () => {
      const storedTenantId = localStorage.getItem('tenantId');
      
      if (!storedTenantId) {
        window.location.href = '/login';
        return;
      }
      
      setTenantId(storedTenantId);
      setIsInitializing(false);
    };

    initializeDashboard();
  }, []);

  // Fetch data after initialization
  useEffect(() => {
    if (!isInitializing && tenantId) {
      fetchApartments();
    }
  }, [tenantId, isInitializing]);

  // Form state for new apartment
  const [newApartment, setNewApartment] = useState<NewApartmentData>({
    owner: null,
    floor: 1,
    apartment: '',
    tenantId: tenantId || '' // Will be updated when tenantId is available
  });

  // Update newApartment.tenantId when tenantId changes
  useEffect(() => {
    if (tenantId) {
      setNewApartment(prev => ({
        ...prev,
        tenantId: tenantId
      }));
    }
  }, [tenantId]);

  // Calculate stats based on actual data
  const stats = {
    total: apartments.length,
    available: apartments.filter(apt => apt.owner === null).length,
    occupied: apartments.filter(apt => apt.owner !== null).length
  };

  // API calls
  const fetchApartments = async () => {
    if (!tenantId) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:7091/apartment?tenantId=${tenantId}`);
      if (!response.ok) throw new Error('Failed to fetch apartments');
      const data = await response.json();
      setApartments(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching apartments');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshApartmentCode = async (apartmentId: string) => {
    if (!tenantId) return;

    try {
      setError(null);
      const response = await fetch('http://localhost:7091/apartment/refreshCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apartmentId,
          tenantId
        }),
      });
      
      if (!response.ok) throw new Error('Failed to refresh code');
      await fetchApartments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error refreshing code');
    }
  };

  const createApartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId) return;

    try {
      setIsSubmitting(true);
      setError(null);
      const response = await fetch('http://localhost:7091/apartment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newApartment),
      });

      if (!response.ok) throw new Error('Failed to create apartment');

      setNewApartment({
        owner: null,
        floor: 1,
        apartment: '',
        tenantId
      });
      setIsModalOpen(false);
      await fetchApartments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating apartment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isInitializing || (isLoading && apartments.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando información...</p>
        </div>
      </div>
    );
  }

  // Modal for creating new apartment
  const renderModal = () => (
    <Dialog 
      open={isModalOpen} 
      onClose={() => setIsModalOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded bg-white text-black p-6">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-medium">
              Nuevo Departamento
            </Dialog.Title>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={createApartment}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Piso
                </label>
                <input
                  type="number"
                  value={newApartment.floor}
                  onChange={(e) => setNewApartment({
                    ...newApartment,
                    floor: parseInt(e.target.value)
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Número de Departamento
                </label>
                <input
                  type="text"
                  value={newApartment.apartment}
                  onChange={(e) => setNewApartment({
                    ...newApartment,
                    apartment: e.target.value
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Crear
                </button>
              </div>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );

  // Error notification
  const renderError = () => error && (
    <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <p>{error}</p>
      <button
        onClick={() => setError(null)}
        className="absolute top-2 right-2"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );

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
          <button 
            onClick={fetchApartments}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Actualizando...' : 'Actualizar'}
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Actualización</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {apartments
              .filter(apt => 
                apt.apartment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                apt.floor.toString().includes(searchTerm)
              )
              .map((apartment) => (
                <tr key={apartment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {apartment._id.slice(-6)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {apartment.floor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {apartment.apartment}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {apartment.code || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      apartment.status === 'Disponible' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {apartment.owner ? 'Ocupado' : 'Disponible'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(apartment.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => refreshApartmentCode(apartment._id)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="Refrescar código"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for creating new apartment */}
      {renderModal()}

      {/* Error notification */}
      {renderError()}
    </div>
  );
};

export default DashboardComponent;