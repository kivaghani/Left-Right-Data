import React from "react";
import axios from "axios";

function Form({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formPayload = new FormData();
    formPayload.append("spa_name", formData.spa_name);
    formData.images.forEach((image) => formPayload.append("images", image));
    formPayload.append("city", formData.city);
    formPayload.append("area", formData.area);
    formPayload.append("price", formData.price);
    formPayload.append("timing", formData.timing);
  
    const endpoint = `http://20.193.149.47:2242/spas/vendor-spa-update-test/${formData.id}`; 
  
    try {
      const response = await axios.post(endpoint, formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Submission failed.");
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Submit Spa Details</h2>
      <label>
        Spa Name:
        <input
          type="text"
          name="spa_name"
          value={formData.spa_name}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        City:
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Area:
        <input
          type="text"
          name="area"
          value={formData.area}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Price:
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Timing (e.g., "11:00 to 4:00 PM"):
        <input
          type="text"
          name="timing"
          value={formData.timing}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Images:
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          required
        />
      </label>
      <button type="submit" className="submit-button">Submit</button>
    </form>
  );
}

export default Form;
