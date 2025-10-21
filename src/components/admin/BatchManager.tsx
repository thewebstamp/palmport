"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiDownload, FiRefreshCw } from "react-icons/fi";
import Image from "next/image";

interface Batch {
  id: number;
  batch_id: string;
  title: string;
  state: string;
  manufacturer: string;
  quality: string;
  notes: string;
  manufacture_date: string;
  image_url: string;
  qr_code_url: string;
  product_name: string;
  product_id?: string;
  created_at: string;
}

interface Product {
  id: number;
  name: string;
  size: string;
}

interface FormData {
  batch_id: string;
  title: string;
  state: string;
  manufacturer: string;
  quality: string;
  notes: string;
  manufacture_date: string;
  product_id: string;
  imageBase64: string;
}

export default function BatchManager() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);

  const [formData, setFormData] = useState<FormData>({
    batch_id: '',
    title: '',
    state: '',
    manufacturer: '',
    quality: '',
    notes: '',
    manufacture_date: '',
    product_id: '',
    imageBase64: ''
  });

  useEffect(() => {
    fetchBatches();
    fetchProducts();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/batches');
      if (response.ok) {
        const data = await response.json();
        setBatches(data);
      }
    } catch (error) {
      console.error('Error fetching batches:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageBase64: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('palmport-admin-token');
      
      // Prepare data for submission
      const submitData = {
        ...formData,
        product_id: formData.product_id || null
      };

      const url = editingBatch
        ? `http://localhost:4000/api/batches/${editingBatch.id}`
        : 'http://localhost:4000/api/batches';

      const response = await fetch(url, {
        method: editingBatch ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.ok) {
        fetchBatches();
        setShowCreateModal(false);
        setEditingBatch(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving batch:', error);
      alert('Error saving batch. Check console for details.');
    }
  };

  const downloadQRCode = async (batch: Batch) => {
    try {
      const response = await fetch(batch.qr_code_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${batch.batch_id}-qrcode.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      window.open(batch.qr_code_url, '_blank');
    }
  };

  const resetForm = () => {
    setFormData({
      batch_id: '',
      title: '',
      state: '',
      manufacturer: '',
      quality: '',
      notes: '',
      manufacture_date: '',
      product_id: '',
      imageBase64: ''
    });
  };

  const handleEdit = (batch: Batch) => {
    setEditingBatch(batch);
    
    // Convert the date from ISO string to yyyy-MM-dd format
    const manufactureDate = batch.manufacture_date 
      ? new Date(batch.manufacture_date).toISOString().split('T')[0]
      : '';
    
    setFormData({
      batch_id: batch.batch_id,
      title: batch.title,
      state: batch.state,
      manufacturer: batch.manufacturer,
      quality: batch.quality,
      notes: batch.notes || '',
      manufacture_date: manufactureDate,
      product_id: batch.product_id || '',
      imageBase64: ''
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (batchId: number) => {
    if (confirm('Are you sure you want to delete this batch?')) {
      try {
        const token = localStorage.getItem('palmport-admin-token');
        const response = await fetch(`http://localhost:4000/api/batches/${batchId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          fetchBatches();
        }
      } catch (error) {
        console.error('Error deleting batch:', error);
      }
    }
  };

  const filteredBatches = batches.filter(batch =>
    batch.batch_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-[#d84727] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Batch Management</h2>
          <p className="text-gray-600">Create and manage product batches for traceability</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchBatches}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiRefreshCw size={16} />
            Refresh
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#d84727] text-white rounded-lg hover:bg-[#b3361a] transition-colors"
          >
            <FiPlus size={16} />
            Add Batch
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search batches by ID, title, or manufacturer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84727] focus:border-transparent"
        />
      </div>

      {/* Batches Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBatches.map((batch, index) => (
          <motion.div
            key={batch.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Batch Image */}
            <div className="h-48 bg-gradient-to-br from-[#fff8f2] to-[#ffe8d6] relative">
              {batch.image_url ? (
                <Image
                  src={batch.image_url}
                  alt={batch.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>

            {/* Batch Info */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2 gap-2">
                <h3 className="font-semibold text-gray-900 flex-1 min-w-0 line-clamp-2 break-words">{batch.title}</h3>
                <span className="text-xs bg-[#2f7a32] text-white px-2 py-1 rounded-full flex-shrink-0 whitespace-nowrap">
                  {batch.quality}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-2">Batch ID: {batch.batch_id}</p>
              <p className="text-sm text-gray-600 mb-2">Manufacturer: {batch.manufacturer}</p>
              <p className="text-sm text-gray-600 mb-3">State: {batch.state}</p>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {new Date(batch.manufacture_date).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(batch)}
                    className="text-[#2f7a32] hover:text-[#1e4d20]"
                  >
                    <FiEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(batch.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 size={16} />
                  </button>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      downloadQRCode(batch);
                    }}
                    className="text-[#d84727] hover:text-[#b3361a]"
                    title="Download QR Code"
                  >
                    <FiDownload size={16} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredBatches.length === 0 && (
        <div className="text-center py-12">
          <FiSearch className="mx-auto text-gray-400 text-4xl mb-4" />
          <p className="text-gray-500">No batches found matching your criteria</p>
        </div>
      )}

      {/* Create/Edit Batch Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-2xl mx-auto flex flex-col max-h-[90vh]"
          >
            {/* Modal Header - Sticky */}
            <div className="flex justify-between items-start p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
              <h3 className="text-xl font-bold text-gray-900">
                {editingBatch ? 'Edit Batch' : 'Create New Batch'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingBatch(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Batch ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.batch_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, batch_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84727] focus:border-transparent"
                      placeholder="e.g., PALM-2501-LG"
                      readOnly={!!editingBatch}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product *
                    </label>
                    <select
                      required
                      value={formData.product_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, product_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84727] focus:border-transparent"
                    >
                      <option value="">Select a product</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name} - {product.size}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batch Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84727] focus:border-transparent"
                    placeholder="e.g., Premium Palm Oil Batch 2501"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84727] focus:border-transparent"
                      placeholder="e.g., Lagos"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Manufacturer *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.manufacturer}
                      onChange={(e) => setFormData(prev => ({ ...prev, manufacturer: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84727] focus:border-transparent"
                      placeholder="e.g., Sunshine Palm Co-op"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quality Grade *
                    </label>
                    <select
                      required
                      value={formData.quality}
                      onChange={(e) => setFormData(prev => ({ ...prev, quality: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84727] focus:border-transparent"
                    >
                      <option value="">Select quality</option>
                      <option value="Grade A Premium">Grade A Premium</option>
                      <option value="Grade A">Grade A</option>
                      <option value="Grade B">Grade B</option>
                      <option value="Standard">Standard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Manufacture Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.manufacture_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, manufacture_date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84727] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batch Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84727] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84727] focus:border-transparent"
                    placeholder="Additional information about this batch..."
                  />
                </div>
              </form>
            </div>

            {/* Modal Footer - Sticky */}
            <div className="flex gap-3 p-6 border-t border-gray-200 sticky bottom-0 bg-white rounded-b-2xl">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingBatch(null);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-[#d84727] text-white rounded-lg hover:bg-[#b3361a] transition-colors"
              >
                {editingBatch ? 'Update Batch' : 'Create Batch'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}