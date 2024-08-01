import React, { useState } from 'react';

const ModeToggleButton = () => {
  const modes = ['standard', 'matrix', 'matrix2x1', 'matrix3x3'];
  
  const [mode, setMode] = useState(modes[0]);

  const toggleMode = () => {
    const currentIndex = modes.indexOf(mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setMode(modes[nextIndex]);
  };

  const getButtonText = () => {
    switch (mode) {
      case 'standard':
        return 'Matrix 2x2 Mode';
      case 'matrix':
        return 'Matrix 2x1 Mode';
      case 'matrix2x1':
        return 'Matrix 3x3 Mode';
      case 'matrix3x3':
        return 'Complex Mode';
      default:
        return 'Standard Mode';
    }
  };

  return (
    <button 
      onClick={toggleMode} 
      className="bg-gray-900 text-white p-2 rounded-lg col-span-4 text-sm"
    >
      {getButtonText()}
    </button>
  );
};

export default ModeToggleButton;
