import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';


const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex(current => current === images.length - 1 ? 0 : current + 1);
  };

  const goToPrevious = () => {
    setCurrentIndex(current => current === 0 ? images.length - 1 : current - 1);
  };

  if (!images.length) return null;

  return (
    <div className="relative">
      <img
        src={images[currentIndex]}
        alt={`Preview ${currentIndex + 1}`}
        className="w-full h-64 object-cover rounded-lg"
      />
      {images.length > 1 && (
        <>
          <button onClick={goToPrevious} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-lg hover:bg-white">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={goToNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-lg hover:bg-white">
            <ChevronRight className="w-6 h-6" />
          </button>
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
    
    try {
      const response = await fetch(`http://20.193.149.47:2242/spas/vendor-spa-update-test/${nextId}/`, {
        method: 'POST',
        body: formDataToSend
      });
      
      if (!response.ok) throw new Error('Submission failed');
      
      setSubmissionCount(nextId);
      alert(`Spa details saved successfully with ID: ${nextId}`);
      
      setFormData({
        spa_name: '',
        city: '',
        area: '',
        price: '',
        timing: '',
        images: []
      });
      setImageUrls([]);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Spa Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Spa Name</label>
                <input
                  type="text"
                  name="spa_name"
                  value={formData.spa_name}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1">Area</label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1">Timing</label>
                <input
                  type="time"
                  name="timing"
                  value={formData.timing}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1">Images</label>
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="w-full border rounded p-2"
                  accept="image/*"
                  required
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
              >
                Submit
              </button>
            </form>
          </div>
          
          <div className="w-full md:w-1/2 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Preview</h2>
            <div className="max-w-[400px] mx-auto">
              <div className="mb-6">
                <ImageCarousel images={imageUrls} />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  {formData.spa_name || 'The Spa'}
                </h3>
                
                <p className="text-gray-600">
                  {formData.area ? `${formData.area}, ` : ''}
                  {formData.city || 'Location'}
                </p>
                
                <div className="flex justify-between items-center">
                  <p className="text-lg">
                    ₹ {formData.price || '1800'} Onwards
                  </p>
                  <p className="text-gray-600">
                    Opens {formData.timing || '11 AM - 9 PM'}
                  </p>
                </div>
                
                <div className="flex items-center">
                  <span className="text-purple-600">★</span>
                  <span className="ml-1">4.48 (15 reviews)</span>
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