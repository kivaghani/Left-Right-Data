
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, Star, Upload } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://20.193.149.47:2242/spas/vendor-spa-update-test';

const spaAPI = {
  get: (id) => axios.get(`${API_BASE_URL}/${id}/`),
  create: (data) => axios.post(`${API_BASE_URL}/`, data),
  update: (id, data) => axios.put(`${API_BASE_URL}/${id}/`, data),
  patch: (id, data) => axios.patch(`${API_BASE_URL}/${id}/`, data),
  delete: (id) => axios.delete(`${API_BASE_URL}/${id}/`),
};

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((current) => (current === images.length - 1 ? 0 : current + 1));
  };

  const goToPrevious = () => {
    setCurrentIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  };

  if (!images.length)
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <Upload className="w-12 h-12 text-gray-400" />
      </div>
    );

  return (
    <div className="relative group">
      <img
        src={images[currentIndex]}
        alt={`Preview ${currentIndex + 1}`}
        className="w-full h-64 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-[1.02]"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  idx === currentIndex ? 'bg-white scale-110' : 'bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const App = () => {
  const initialFormState = {
    spa_name: '',
    city: '',
    area: '',
    price: '',
    timing: '',
    images: [],
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imageUrls, setImageUrls] = useState([]);
  const [spaId, setSpaId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('id');
    if (id) {
      setSpaId(id);
      fetchSpaData(id);
    }
  }, []);

  const fetchSpaData = async (id) => {
    setLoading(true);
    try {
      const { data } = await spaAPI.get(id);
      setFormData({
        ...data,
        images: [], 
      });
      setImageUrls(data.image_urls || []);
    } catch (error) {
      alert('Error fetching spa data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: files }));
    setImageUrls(files.map(file => URL.createObjectURL(file)));
  };

  const prepareFormData = () => {
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'images') {
        formData.images.forEach(image => {
          formDataToSend.append('images', image);
        });
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });
    return formDataToSend;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = prepareFormData();
      const { data } = spaId 
        ? await spaAPI.update(spaId, formDataToSend)
        : await spaAPI.create(formDataToSend);

      if (!spaId) {
        setSpaId(data.id);
        window.history.pushState({}, '', `?id=${data.id}`);
        setFormData(initialFormState);
        setImageUrls([]);
      }

      alert(`Spa ${spaId ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handlePartialUpdate = async (fieldName, value) => {
    if (!spaId) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append(fieldName, value);
      await spaAPI.patch(spaId, formData);
      alert(`${fieldName} updated successfully`);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!spaId || !window.confirm('Are you sure you want to delete this spa?')) return;

    try {
      setLoading(true);
      await spaAPI.delete(spaId);
      alert('Spa deleted successfully');
      setFormData(initialFormState);
      setImageUrls([]);
      setSpaId('');
      window.history.pushState({}, '', window.location.pathname);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-purple-800">Spa Management Portal</h1>
        
        {loading && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              Loading...
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 bg-white rounded-xl shadow-lg p-8 backdrop-blur-sm bg-white/90">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                {spaId ? 'Edit Spa' : 'New Spa'}
                <div className="h-1 w-10 bg-purple-600 rounded-full ml-2" />
              </h2>
              {spaId && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete Spa
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Spa Name</label>
                <input
                  type="text"
                  name="spa_name"
                  value={formData.spa_name}
                  onChange={handleInputChange}
                  onBlur={(e) => spaId && handlePartialUpdate('spa_name', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    onBlur={(e) => spaId && handlePartialUpdate('city', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Area</label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    onBlur={(e) => spaId && handlePartialUpdate('area', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    onBlur={(e) => spaId && handlePartialUpdate('price', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Timing</label>
                  <input
                    type="time"
                    name="timing"
                    value={formData.timing}
                    onChange={handleInputChange}
                    onBlur={(e) => spaId && handlePartialUpdate('timing', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Images</label>
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    accept="image/*"
                    required={!spaId}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transform hover:scale-[1.02] transition-all duration-200 font-medium shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {spaId ? 'Update' : 'Submit'}
              </button>
            </form>
          </div>

          <div className="w-full md:w-1/2 bg-white rounded-xl shadow-lg p-8 backdrop-blur-sm bg-white/90">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              Preview
              <div className="h-1 w-10 bg-purple-600 rounded-full ml-2" />
            </h2>
            <div className="max-w-[400px] mx-auto">
              <div className="mb-8">
                <ImageCarousel images={imageUrls} />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-gray-800">
                  {formData.spa_name || 'The Spa'}
                </h3>
                
                <p className="text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {formData.area ? `${formData.area}, ` : ''}
                  {formData.city || 'Location'}
                </p>
                
                <div className="flex justify-between items-center py-2 border-y border-gray-100">
                  <p className="text-lg font-medium text-purple-600">
                    ₹ {formData.price || '1800'} Onwards
                  </p>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Opens {formData.timing || '11 AM - 9 PM'}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 bg-purple-50 p-3 rounded-lg">
                  <Star className="w-5 h-5 text-purple-600 fill-purple-600" />
                  <span className="font-medium">4.48</span>
                  <span className="text-gray-600">(15 reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
