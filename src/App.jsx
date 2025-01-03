
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, Star, Upload } from 'lucide-react';

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex(current => current === images.length - 1 ? 0 : current + 1);
  };

  const goToPrevious = () => {
    setCurrentIndex(current => current === 0 ? images.length - 1 : current - 1);
  };

  if (!images.length) return (
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
  const [formData, setFormData] = useState({
    spa_name: '',
    city: '',
    area: '',
    price: '',
    timing: '',
    images: []
  });
  const [imageUrls, setImageUrls] = useState([]);
  const [submissionCount, setSubmissionCount] = useState(0);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: files
    }));
    const urls = files.map(file => URL.createObjectURL(file));
    setImageUrls(urls);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextId = submissionCount + 1;
  
    const queryParams = new URLSearchParams({
      spa_name: formData.spa_name,
      city: formData.city,
      area: formData.area,
      price: formData.price,
      timing: formData.timing,
    }).toString();
  
    try {
      const response = await fetch(`http://20.193.149.47:2242/spas/vendor-spa-update-test/${nextId}/?${queryParams}`, {
        method: 'GET',
      });
  
      if (!response.ok) throw new Error('Submission failed');
      
      const data = await response.json();
      console.log('API Response:', data);
  
      setSubmissionCount(nextId);
      alert(`Spa details retrieved successfully with ID: ${nextId}`);
  
      setFormData({
        spa_name: '',
        city: '',
        area: '',
        price: '',
        timing: '',
        images: [],
      });
      setImageUrls([]);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-purple-800">Spa Management Portal</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 bg-white rounded-xl shadow-lg p-8 backdrop-blur-sm bg-white/90">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              Spa Details
              <div className="h-1 w-10 bg-purple-600 rounded-full ml-2" />
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Spa Name</label>
                <input
                  type="text"
                  name="spa_name"
                  value={formData.spa_name}
                  onChange={handleInputChange}
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
                    required
                  />
                </div>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transform hover:scale-[1.02] transition-all duration-200 font-medium shadow-lg shadow-purple-200"
              >
                Submit Details
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
