import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'arraybuffer',
      });

      // Convertir la respuesta binaria a base64
      const arrayBufferView = new Uint8Array(response.data);
      const blob = new Blob([arrayBufferView], { type: 'image/png' });
      const base64Image = await blobToBase64(blob);
      setImageSrc(`data:image/png;base64,${base64Image}`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Función para convertir Blob a base64
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return (
    <div>
      <h1>Upload CSV File and Display Image</h1>
      <form onSubmit={handleFormSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>

      {imageSrc && <img src={imageSrc} alt="Generated Plot" style={{ marginTop: '20px' }} />}
    </div>
  );
};

export default App;
