import React, { useState } from "react";
import Form from "./components/Form";
import Preview from "./components/Preview";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    spa_name: "",
    city: "",
    area: "",
    price: "",
    timing: "",
    images: [],
    id: 1,
  });

  return (
    <div className="app-container">
      <div className="left-section">
        <Form formData={formData} setFormData={setFormData} />
      </div>
      <div className="right-section">
        <Preview formData={formData} />
      </div>
    </div>
  );
}

export default App;
