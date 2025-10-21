"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiRefreshCw, FiUpload, FiX, FiTruck, FiPackage } from "react-icons/fi";
import Image from "next/image";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price: number;
  size: string;
  image_url: string;
  features: string[];
  in_stock: boolean;
}

interface ShippingSettings {
  shipping_fee: number;
  free_shipping_threshold: number;
}

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>({
    shipping_fee: 1000,
    free_shipping_threshold: 5000
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'shipping'>('products');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    size: '',
    features: '',
    in_stock: true,
    imageBase64: ''
  });

  const [shippingFormData, setShippingFormData] = useState({
    shipping_fee: '1000',
    free_shipping_threshold: '5000'
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchShippingSettings();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchShippingSettings = async () => {
    try {
      const token = localStorage.getItem('palmport-admin-token');
      const response = await fetch(`${apiUrl}/api/shipping/admin/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const settings = await response.json();
        setShippingSettings(settings);
        setShippingFormData({
          shipping_fee: settings.shipping_fee.toString(),
          free_shipping_threshold: settings.free_shipping_threshold.toString()
        });
      }
    } catch (error) {
      console.error('Error fetching shipping settings:', error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ ...prev, imageBase64: base64String }));
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, imageBase64: '' }));
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('palmport-admin-token');
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        original_price: parseFloat(formData.original_price) || null,
        features: formData.features.split(',').map(f => f.trim()).filter(f => f)
      };

      const url = editingProduct
        ? `${apiUrl}/api/products/${editingProduct.id}`
        : `${apiUrl}/api/products`;

      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        fetchProducts();
        setShowCreateModal(false);
        setEditingProduct(null);
        resetForm();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    }
  };

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('palmport-admin-token');
      const shippingData = {
        shipping_fee: parseFloat(shippingFormData.shipping_fee),
        free_shipping_threshold: parseFloat(shippingFormData.free_shipping_threshold)
      };

      const response = await fetch(`${apiUrl}/api/shipping/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(shippingData)
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message || 'Shipping settings updated successfully');
        fetchShippingSettings();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update shipping settings');
      }
    } catch (error) {
      console.error('Error updating shipping settings:', error);
      alert('Error updating shipping settings');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      original_price: '',
      size: '',
      features: '',
      in_stock: true,
      imageBase64: ''
    });
    setImagePreview(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      original_price: product.original_price?.toString() || '',
      size: product.size,
      features: product.features?.join(', ') || '',
      in_stock: product.in_stock,
      imageBase64: ''
    });
    setImagePreview(product.image_url || null);
    setShowCreateModal(true);
  };

  const handleDelete = async (productId: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('palmport-admin-token');
        const response = await fetch(`${apiUrl}/api/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          fetchProducts();
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.size.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
          <p className="text-gray-600">Manage your palm oil products and shipping settings</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchProducts}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiRefreshCw size={16} />
            Refresh
          </button>
          {activeTab === 'products' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#d84727] text-white rounded-lg hover:bg-[#b3361a] transition-colors"
            >
              <FiPlus size={16} />
              Add Product
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'products'
              ? 'border-[#d84727] text-[#d84727]'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <FiPackage className="inline w-4 h-4 mr-2" />
            Products
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'shipping'
              ? 'border-[#d84727] text-[#d84727]'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <FiTruck className="inline w-4 h-4 mr-2" />
            Shipping Settings
          </button>
        </nav>
      </div>

      {/* Products Tab Content */}
      {activeTab === 'products' && (
        <>
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name or size..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84727] focus:border-transparent"
            />
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product, index) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center min-w-0">
                            <div className="h-10 w-10 flex-shrink-0">
                              {product.image_url ? (
                                <div className="relative h-10 w-10">
                                  <Image
                                    src={product.image_url}
                                    alt={product.name}
                                    fill
                                    className="rounded-lg object-cover"
                                    sizes="40px"
                                  />
                                </div>
                              ) : (
                                <div className="h-10 w-10 bg-gradient-to-br from-[#ff6b35] to-[#d84727] rounded-lg flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">P</span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4 min-w-0 flex-1">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500 truncate">
                                {product.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.size}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>₦{product.price.toLocaleString()}</div>
                          {product.original_price && (
                            <div className="text-xs text-gray-500 line-through">
                              ₦{product.original_price.toLocaleString()}
                            </div>
                          )}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.in_stock
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {product.in_stock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-[#2f7a32] hover:text-[#1e4d20] mr-3"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <FiSearch className="mx-auto text-gray-400 text-4xl mb-4" />
                <p className="text-gray-500">No products found matching your criteria</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Shipping Tab Content */}
      {activeTab === 'shipping' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Settings</h3>
          <p className="text-gray-600 mb-6">Configure shipping fees and free shipping thresholds for your store.</p>

          <form onSubmit={handleShippingSubmit} className="space-y-6 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Standard Shipping Fee (₦)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={shippingFormData.shipping_fee}
                onChange={(e) => setShippingFormData(prev => ({ ...prev, shipping_fee: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84727] focus:border-transparent"
                placeholder="1000"
              />
              <p className="text-sm text-gray-500 mt-1">Standard shipping cost for orders</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Free Shipping Threshold (₦)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={shippingFormData.free_shipping_threshold}
                onChange={(e) => setShippingFormData(prev => ({ ...prev, free_shipping_threshold: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84727] focus:border-transparent"
                placeholder="5000"
              />
              <p className="text-sm text-gray-500 mt-1">Minimum order amount for free shipping</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Current Settings</h4>
              <p className="text-sm text-blue-700">
                • Shipping Fee: ₦{shippingSettings.shipping_fee.toLocaleString()}<br />
                • Free Shipping: Orders over ₦{shippingSettings.free_shipping_threshold.toLocaleString()}
              </p>
            </div>

            <button
              type="submit"
              className="bg-[#d84727] text-white px-6 py-2 rounded-lg hover:bg-[#b3361a] transition-colors font-medium"
            >
              Update Shipping Settings
            </button>
          </form>
        </motion.div>
      )}

      {/* Create/Edit Product Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Create New Product'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingProduct(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image
                </label>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-3 relative">
                    <div className="relative w-32 h-32 mx-auto">
                      <Image
                        src={imagePreview}
                        alt="Product preview"
                        fill
                        className="rounded-lg object-cover border"
                        sizes="128px"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* File Upload */}
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FiUpload className="w-8 h-8 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, WEBP (Max. 5MB)</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84727] focus:border-transparent"
                  placeholder="e.g., Premium Palm Oil"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84727] focus:border-transparent"
                  placeholder="Describe the product..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.size}
                    onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84727] focus:border-transparent"
                    placeholder="e.g., 1 Litre, 5 Litres"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Price (₦) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84727] focus:border-transparent"
                    placeholder="2000"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Original Price (₦)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.original_price}
                    onChange={(e) => setFormData(prev => ({ ...prev, original_price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84727] focus:border-transparent"
                    placeholder="2500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Status
                  </label>
                  <select
                    value={formData.in_stock.toString()}
                    onChange={(e) => setFormData(prev => ({ ...prev, in_stock: e.target.value === 'true' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84727] focus:border-transparent"
                  >
                    <option value="true">In Stock</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84727] focus:border-transparent"
                  placeholder="100% Natural, No Preservatives, Rich in Vitamins"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#d84727] text-white rounded-lg hover:bg-[#b3361a] transition-colors"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}