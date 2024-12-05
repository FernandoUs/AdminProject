'use client'
import React, { useState, useEffect } from 'react';
import { 
  Building2,
  RefreshCw,
  Search,
  Plus,
  X,
  Loader,
  Trash2,
  Edit,
  Users
} from 'lucide-react';
import { Dialog } from '@headlessui/react';

// Define our interfaces
interface CommonArea {
  _id: string;
  name: string;
  description: string;
  capacity: number;
  status: string;
}

interface CommonAreaFormData {
  name: string;
  description: string;
  capacity: number;
  tenantId: string;
  status: string;
}

const CommonAreasDashboard = () => {
  // Core state management
  const [areas, setAreas] = useState<CommonArea[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingArea, setEditingArea] = useState<CommonArea | null>(null);

  // Form state
  const [formData, setFormData] = useState<CommonAreaFormData>({
    name: '',
    description: '',
    capacity: 1,
    tenantId: '',
    status: 'Disponible'
  });

  // Initialize dashboard
  useEffect(() => {
    const initializeDashboard = async () => {
      const storedTenantId = localStorage.getItem('tenantId');
      
      if (!storedTenantId) {
        window.location.href = '/login';
        return;
      }
      
      setTenantId(storedTenantId);
      setFormData(prev => ({ ...prev, tenantId: storedTenantId }));
      setIsInitializing(false);
    };

    initializeDashboard();
  }, []);

  // Fetch data after initialization
  useEffect(() => {
    if (!isInitializing && tenantId) {
      fetchAreas();
    }
  }, [tenantId, isInitializing]);

  // API calls
  const fetchAreas = async () => {
    if (!tenantId) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:7091/commonarea/all?tenantId=${tenantId}`);
      if (!response.ok) throw new Error('Failed to fetch common areas');
      const data = await response.json();
      setAreas(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching common areas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const url = editingArea 
        ? 'http://localhost:7091/commonarea/update'
        : 'http://localhost:7091/commonarea';

      const bodyData = editingArea
        ? { ...formData, id: editingArea._id }
        : formData;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) throw new Error(editingArea ? 'Failed to update area' : 'Failed to create area');

      setIsModalOpen(false);
      resetForm();
      await fetchAreas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving common area');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!tenantId || !window.confirm('¿Estás seguro de que deseas eliminar esta área común?')) return;

    try {
      setError(null);
      const response = await fetch(`http://localhost:7091/commonarea?id=${id}&tenantId=${tenantId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete area');
      await fetchAreas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting area');
    }
  };

  const handleEdit = (area: CommonArea) => {
    setEditingArea(area);
    setFormData({
      name: area.name,
      description: area.description,
      capacity: area.capacity,
      status: area.status,
      tenantId: tenantId || ''
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      capacity: 1,
      status: 'Disponible',
      tenantId: tenantId || ''
    });
    setEditingArea(null);
  };

  // Loading state
  if (isInitializing || (isLoading && areas.length === 0)) {
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Áreas Comunes</h1>
        <p className="mt-2 text-gray-600">Gestión y visualización de áreas comunes del condominio</p>
      </div>

      {/* Stats Card */}
      <div className="mb-8">
        <div className="p-6 bg-white rounded-lg shadow-sm max-w-sm">
          <div className="flex items-center">
            <Building2 className="w-12 h-12 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Áreas Comunes</p>
              <p className="text-2xl font-semibold text-gray-900">{areas.length}</p>
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
            placeholder="Buscar área común..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={fetchAreas}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Actualizando...' : 'Actualizar'}
          </button>
          <button 
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Área Común
          </button>
        </div>
      </div>

      {/* Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {areas
          .filter(area => 
            area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            area.description.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((area) => (
            <div 
              key={area._id} 
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{area.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(area)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Editar"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(area._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Eliminar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">{area.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="text-sm">Capacidad: {area.capacity}</span>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  area.status === 'Disponible' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {area.status}
                </span>
              </div>
            </div>
          ))
        }
      </div>

      {/* Modal */}
      <Dialog 
        open={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-medium text-gray-900">
                {editingArea ? 'Editar Área Común' : 'Nueva Área Común'}
              </Dialog.Title>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Capacidad
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="Disponible">Disponible</option>
                  <option value="No Disponible">No Disponible</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                  {editingArea ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Error Message */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
}

export default CommonAreasDashboard;