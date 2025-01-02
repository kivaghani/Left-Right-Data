import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

function Preview({ formData }) {
  return (
    <div className="preview-container">
      <h2 className="preview-title">Live Preview</h2>
      <div className="preview-card">
        <h3 className="spa-name">{formData.spa_name || "Spa Name"}</h3>
        <p className="spa-detail">City: {formData.city || "City"}</p>
        <p className="spa-detail">Area: {formData.area || "Area"}</p>
        <p className="spa-detail">Price: ₹{formData.price || "Price"}</p>
        <p className="spa-detail">Timing: {formData.timing || "Timing"}</p>

        {formData.images.length > 0 && (
          <Swiper spaceBetween={20} slidesPerView={1} className="swiper-container">
            {formData.images.map((file, index) => (
              <SwiperSlide key={index}>
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index}`}
                  className="preview-image"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
}

export default Preview;
