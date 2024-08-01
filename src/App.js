import React from 'react';
import Calculator from './Calculator';
import './App.css'; // Ensure TailwindCSS is imported

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-1000">
      <Calculator />
    </div>
  );
}

export default App;
