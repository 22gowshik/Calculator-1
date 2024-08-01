import React, { useState } from 'react';
import { evaluate, matrix, Complex } from 'mathjs';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [mode, setMode] = useState('standard'); // Toggle between standard, matrix, and complex modes
  
  const [polar, setPolar] = useState({ r: '0', theta: '0' });
  const [rectangular, setRectangular] = useState({ x: '0', y: '0' });
  
  const [degrees, setDegrees] = useState('0');
  const [radians, setRadians] = useState('0');
  // States for matrix inputs
  const [matrix2x2AInputs, setMatrix2x2AInputs] = useState(['', '', '', '']);
  const [matrix2x2BInputs, setMatrix2x2BInputs] = useState(['', '', '', '']);
  const [matrix3x3AInputs, setMatrix3x3AInputs] = useState(Array(9).fill(''));
  const [matrix3x3BInputs, setMatrix3x3BInputs] = useState(Array(9).fill(''));
  const [matrix1x2AInputs, setMatrix1x2AInputs] = useState(['', '']);
  const [matrix1x2BInputs, setMatrix1x2BInputs] = useState(['', '']);
  const [complexA, setComplexA] = useState('0');
  const [complexB, setComplexB] = useState('0');

  const handleButtonClick = (value) => {
    if (display === '0' && value !== '.') {
      setDisplay(value);
    } else {
      setDisplay(display + value);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setMatrix2x2AInputs(['', '', '', '']);
    setMatrix2x2BInputs(['', '', '', '']);
    setMatrix3x3AInputs(Array(9).fill(''));
    setMatrix3x3BInputs(Array(9).fill(''));
    setMatrix1x2AInputs(['', '']);
    setMatrix1x2BInputs(['', '']);
    setComplexA('0');
    setComplexB('0');
  };

  const handleErase = () => {
    setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
  };
  const polarToRectangular = (r, theta) => {
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    return { x, y };
  };
  
  const rectangularToPolar = (x, y) => {
    const r = Math.sqrt(x * x + y * y);
    const theta = Math.atan2(y, x);
    return { r, theta };
  };
  
  const degreesToRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };
  
  const radiansToDegrees = (radians) => {
    return radians * (180 / Math.PI);
  };

  const handleCalculate = () => {
    try {
      let result;
      if (mode === 'matrix') {
        const matrixAValues = matrix2x2AInputs.map(input => parseFloat(input) || 0);
        const matrixBValues = matrix2x2BInputs.map(input => parseFloat(input) || 0);
        const matrixA = matrix([[matrixAValues[0], matrixAValues[1]], [matrixAValues[2], matrixAValues[3]]]);
        const matrixB = matrix([[matrixBValues[0], matrixBValues[1]], [matrixBValues[2], matrixBValues[3]]]);

        let expression = display
          .replace(/matrixA/g, matrixA.toString())
          .replace(/matrixB/g, matrixB.toString());

        expression = expression
          .replace(/add/g, '+')
          .replace(/subtract/g, '-')
          .replace(/multiply/g, '*');

        result = evaluate(expression);
      } else if (mode === 'matrix3x3') {
        const matrixAValues = matrix3x3AInputs.map(input => parseFloat(input) || 0);
        const matrixBValues = matrix3x3BInputs.map(input => parseFloat(input) || 0);
        const matrixA = matrix([
          [matrixAValues[0], matrixAValues[1], matrixAValues[2]],
          [matrixAValues[3], matrixAValues[4], matrixAValues[5]],
          [matrixAValues[6], matrixAValues[7], matrixAValues[8]]
        ]);
        const matrixB = matrix([
          [matrixBValues[0], matrixBValues[1], matrixBValues[2]],
          [matrixBValues[3], matrixBValues[4], matrixBValues[5]],
          [matrixBValues[6], matrixBValues[7], matrixBValues[8]]
        ]);

        let expression = display
          .replace(/matrixA/g, matrixA.toString())
          .replace(/matrixB/g, matrixB.toString());

        expression = expression
          .replace(/add/g, '+')
          .replace(/subtract/g, '-')
          .replace(/multiply/g, '*');

        result = evaluate(expression);
      } else if (mode === 'matrix1x2') {
        const matrixAValues = matrix1x2AInputs.map(input => parseFloat(input) || 0);
        const matrixBValues = matrix1x2BInputs.map(input => parseFloat(input) || 0);
        const matrixA = matrix([matrixAValues]);
        const matrixB = matrix([matrixBValues]);

        let expression = display
          .replace(/matrixA/g, matrixA.toString())
          .replace(/matrixB/g, matrixB.toString());

        expression = expression
          .replace(/add/g, '+')
          .replace(/subtract/g, '-')
          .replace(/multiply/g, '*');

        result = evaluate(expression);
      } else if (mode === 'complex') {
        const [realA, imagA] = complexA.split('+').map(part => part.replace('i', ''));
        const [realB, imagB] = complexB.split('+').map(part => part.replace('i', ''));

        const complexAValue = new Complex(parseFloat(realA || 0), parseFloat(imagA || 0));
        const complexBValue = new Complex(parseFloat(realB || 0), parseFloat(imagB || 0));

        let expression = display
          .replace(/complexA/g, complexAValue.toString())
          .replace(/complexB/g, complexBValue.toString());

        expression = expression
          .replace(/add/g, '+')
          .replace(/subtract/g, '-')
          .replace(/multiply/g, '*');

        result = evaluate(expression);
      }else if (mode === 'trignometry') {
        // Handle trigonometric functions
        let expression = display
          .replace(/sin/g, 'sin')
          .replace(/cos/g, 'cos')
          .replace(/tan/g, 'tan')
          .replace(/csc/g, 'csc')
          .replace(/sec/g, 'sec')
          .replace(/cot/g, 'cot');
  
        // Replace power operator ^ with ** for mathjs compatibility
        expression = expression.replace(/\^/g, '**');
  
        result = evaluate(expression);
  
      } 
      else if (mode === 'polar') {
        const { r, theta } = polar;
        const { x, y } = polarToRectangular(parseFloat(r), parseFloat(theta));
        setRectangular({ x: x.toString(), y: y.toString() });
        result = `x: ${x}, y: ${y}`;
      } else if (mode === 'rectangular') {
        const { x, y } = rectangular;
        const { r, theta } = rectangularToPolar(parseFloat(x), parseFloat(y));
        setPolar({ r: r.toString(), theta: theta.toString() });
        result = `r: ${r}, θ: ${theta}`;
      } 
      else if (mode === 'degree-radian') {
      // Handle degree to radian conversion
      if (display.includes('degToRad')) {
        const degreesValue = parseFloat(display.replace('degToRad(', '').replace(')', ''));
        result = degreesToRadians(degreesValue);
      } 
      // Handle radian to degree conversion
      else if (display.includes('radToDeg')) {
        const radiansValue = parseFloat(display.replace('radToDeg(', '').replace(')', ''));
        result = radiansToDegrees(radiansValue);
      } 
      else {
        result = evaluate(display);
      }
    } else {
      result = evaluate(display);
    }
    setDisplay(result.toString());
  } catch (error) {
    setDisplay('Error');
  }
  };

  const toggleMode = () => {
    const nextMode = mode === 'standard' ? 'matrix' :
                   mode === 'matrix' ? 'matrix1x2' :
                   mode === 'matrix1x2' ? 'matrix3x3' :
                   mode === 'matrix3x3' ? 'complex' :
                   mode === 'complex' ? 'trignometry' :
                   mode === 'trignometry' ? 'polar' :
                   mode === 'polar' ? 'rectangular' :
                   mode === 'rectangular' ? 'degree-radian' :
                   'standard';

  setMode(nextMode);
  handleClear();
  };

  const handleMatrixInputChange = (matrix, index, value) => {
    if (matrix === '2x2A') {
      const newMatrixAInputs = [...matrix2x2AInputs];
      newMatrixAInputs[index] = value;
      setMatrix2x2AInputs(newMatrixAInputs);
    } else if (matrix === '2x2B') {
      const newMatrixBInputs = [...matrix2x2BInputs];
      newMatrixBInputs[index] = value;
      setMatrix2x2BInputs(newMatrixBInputs);
    } else if (matrix === '1x2A') {
      const newMatrixAInputs = [...matrix1x2AInputs];
      newMatrixAInputs[index] = value;
      setMatrix1x2AInputs(newMatrixAInputs);
    } else if (matrix === '1x2B') {
      const newMatrixBInputs = [...matrix1x2BInputs];
      newMatrixBInputs[index] = value;
      setMatrix1x2BInputs(newMatrixBInputs);
    } else if (matrix === '3x3A') {
      const newMatrixAInputs = [...matrix3x3AInputs];
      newMatrixAInputs[index] = value;
      setMatrix3x3AInputs(newMatrixAInputs);
    } else if (matrix === '3x3B') {
      const newMatrixBInputs = [...matrix3x3BInputs];
      newMatrixBInputs[index] = value;
      setMatrix3x3BInputs(newMatrixBInputs);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="bg-gray-800 text-white p-4 rounded-t-md">
        <input
          type="text"
          value={display}
          readOnly
          className="w-full bg-gray-800 text-white text-right text-2xl outline-none"
        />
      </div>
      {mode === 'matrix' && (
        <div className="p-4 bg-gray-700 rounded-md">
          <h2 className="text-lg text-white mb-2">Matrix 2x2 A</h2>
          <div className="grid grid-cols-2 gap-2">
            {matrix2x2AInputs.map((value, index) => (
              <input
                key={index}
                type="number"
                value={value}
                onChange={(e) => handleMatrixInputChange('2x2A', index, e.target.value)}
                className="p-2 bg-gray-600 text-white rounded"
              />
            ))}
          </div>
          <h2 className="text-lg text-white mt-4 mb-2">Matrix 2x2 B</h2>
          <div className="grid grid-cols-2 gap-2">
            {matrix2x2BInputs.map((value, index) => (
              <input
                key={index}
                type="number"
                value={value}
                onChange={(e) => handleMatrixInputChange('2x2B', index, e.target.value)}
                className="p-2 bg-gray-600 text-white rounded"
              />
            ))}
          </div>
        </div>
      )}
      {mode === 'matrix3x3' && (
        <div className="p-4 bg-gray-700 rounded-md">
          <h2 className="text-lg text-white mb-2">Matrix 3x3 A</h2>
          <div className="grid grid-cols-3 gap-2">
            {matrix3x3AInputs.map((value, index) => (
              <input
                key={index}
                type="number"
                value={value}
                onChange={(e) => handleMatrixInputChange('3x3A', index, e.target.value)}
                className="p-2 bg-gray-600 text-white rounded"
              />
            ))}
          </div>
          <h2 className="text-lg text-white mt-4 mb-2">Matrix 3x3 B</h2>
          <div className="grid grid-cols-3 gap-2">
            {matrix3x3BInputs.map((value, index) => (
              <input
                key={index}
                type="number"
                value={value}
                onChange={(e) => handleMatrixInputChange('3x3B', index, e.target.value)}
                className="p-2 bg-gray-600 text-white rounded"
              />
            ))}
          </div>
        </div>
      )}
      {mode === 'matrix1x2' && (
        <div className="p-4 bg-gray-700 rounded-md">
          <h2 className="text-lg text-white mb-2">Matrix 1x2 A</h2>
          <div className="grid grid-cols-2 gap-2">
            {matrix1x2AInputs.map((value, index) => (
              <input
                key={index}
                type="number"
                value={value}
                onChange={(e) => handleMatrixInputChange('1x2A', index, e.target.value)}
                className="p-2 bg-gray-600 text-white rounded"
              />
            ))}
          </div>
          <h2 className="text-lg text-white mt-4 mb-2">Matrix 1x2 B</h2>
          <div className="grid grid-cols-2 gap-2">
            {matrix1x2BInputs.map((value, index) => (
              <input
                key={index}
                type="number"
                value={value}
                onChange={(e) => handleMatrixInputChange('1x2B', index, e.target.value)}
                className="p-2 bg-gray-600 text-white rounded"
              />
            ))}
          </div>
        </div>
      )}
      {mode === 'complex' && (
        <div className="p-4 bg-gray-700 rounded-md">
          <h2 className="text-lg text-white mb-2">Complex Number A</h2>
          <input
            type="text"
            value={complexA}
            onChange={(e) => setComplexA(e.target.value)}
            className="p-2 bg-gray-600 text-white rounded w-full"
          />
          <h2 className="text-lg text-white mt-4 mb-2">Complex Number B</h2>
          <input
            type="text"
            value={complexB}
            onChange={(e) => setComplexB(e.target.value)}
            className="p-2 bg-gray-600 text-white rounded w-full"
          />
        </div>
      )}
      {mode === 'polar' && (
  <div className="p-4 bg-gray-700 rounded-md">
    <h2 className="text-lg text-white mb-2">Polar Coordinates</h2>
    <input
      type="number"
      placeholder="r"
      value={polar.r}
      onChange={(e) => setPolar({ ...polar, r: e.target.value })}
      className="p-2 bg-gray-600 text-white rounded w-full mb-2"
    />
    <input
      type="number"
      placeholder="θ (in radians)"
      value={polar.theta}
      onChange={(e) => setPolar({ ...polar, theta: e.target.value })}
      className="p-2 bg-gray-600 text-white rounded w-full"
    />
  </div>
)}

{mode === 'rectangular' && (
  <div className="p-4 bg-gray-700 rounded-md">
    <h2 className="text-lg text-white mb-2">Rectangular Coordinates</h2>
    <input
      type="number"
      placeholder="x"
      value={rectangular.x}
      onChange={(e) => setRectangular({ ...rectangular, x: e.target.value })}
      className="p-2 bg-gray-600 text-white rounded w-full mb-2"
    />
    <input
      type="number"
      placeholder="y"
      value={rectangular.y}
      onChange={(e) => setRectangular({ ...rectangular, y: e.target.value })}
      className="p-2 bg-gray-600 text-white rounded w-full"
    />
  </div>
)}
{mode === 'degree-radian' && (
  <div className="p-4 bg-gray-700 rounded-md">
    <h2 className="text-lg text-white mb-2">Degrees to Radians</h2>
    <input
      type="number"
      placeholder="Degrees"
      value={degrees}
      onChange={(e) => setDegrees(e.target.value)}
      className="p-2 bg-gray-600 text-white rounded w-full mb-2"
    />
    <button onClick={() => setDisplay(`degToRad(${degrees})`)} className="p-2 bg-gray-800 text-white rounded">
      Convert to Radians
    </button>
    <h2 className="text-lg text-white mt-4 mb-2">Radians to Degrees</h2>
    <input
      type="number"
      placeholder="Radians"
      value={radians}
      onChange={(e) => setRadians(e.target.value)}
      className="p-2 bg-gray-600 text-white rounded w-full mb-2"
    />
    <button onClick={() => setDisplay(`radToDeg(${radians})`)} className="p-2 bg-gray-800 text-white rounded">
      Convert to Degrees
    </button>
  </div>
)}
      <div className="grid grid-cols-4 gap-2 mt-4 ">
        <button onClick={() => handleButtonClick('7')} className="p-2 bg-gray-600 text-white rounded">7</button>
        <button onClick={() => handleButtonClick('8')} className="p-2 bg-gray-600 text-white rounded">8</button>
        <button onClick={() => handleButtonClick('9')} className="p-2 bg-gray-600 text-white rounded">9</button>
        <button onClick={() => handleButtonClick('/')} className="p-2 bg-gray-600 text-white rounded">/</button>
        <button onClick={() => handleButtonClick('4')} className="p-2 bg-gray-600 text-white rounded">4</button>
        <button onClick={() => handleButtonClick('5')} className="p-2 bg-gray-600 text-white rounded">5</button>
        <button onClick={() => handleButtonClick('6')} className="p-2 bg-gray-600 text-white rounded">6</button>
        <button onClick={() => handleButtonClick('*')} className="p-2 bg-gray-600 text-white rounded">x</button>
        <button onClick={() => handleButtonClick('1')} className="p-2 bg-gray-600 text-white rounded">1</button>
        <button onClick={() => handleButtonClick('2')} className="p-2 bg-gray-600 text-white rounded">2</button>
        <button onClick={() => handleButtonClick('3')} className="p-2 bg-gray-600 text-white rounded">3</button>
        <button onClick={() => handleButtonClick('-')} className="p-2 bg-gray-600 text-white rounded">-</button>
        <button onClick={() => handleButtonClick('0')} className="p-2 bg-gray-600 text-white rounded">0</button>
        <button onClick={() => handleButtonClick('.')} className="p-2 bg-gray-600 text-white rounded">.</button>
        <button onClick={() => handleButtonClick('+')} className="p-2 bg-gray-600 text-white rounded">+</button>
        <button onClick={handleCalculate} className="p-2 bg-blue-600 text-white rounded">=</button>
        <button onClick={() => handleButtonClick('(')} className="p-2 bg-gray-600 text-white rounded ">(</button>
          <button onClick={() => handleButtonClick(')')} className="p-2 bg-gray-600 text-white rounded ">)</button>
        <button onClick={handleClear} className="p-2 bg-red-600 text-white rounded">C</button>
        <button onClick={handleErase} className="p-2 bg-yellow-600 text-white rounded">⌫</button>
        <button onClick={() => handleButtonClick('pi')} className="p-2 bg-gray-600 text-white rounded">pi</button>
        <button onClick={() => handleButtonClick('log(')} className="p-2 bg-gray-600 text-white rounded">log</button>
        <button onClick={() => handleButtonClick('sqrt(')} className="p-2 bg-gray-600 text-white rounded">sqrt</button>
        <button onClick={toggleMode} className="p-2 bg-green-600 text-white rounded">Mode</button>
           {/* Matrix 2x2 Mode Buttons */}
           {mode === 'matrix' && (
          <>
            <button onClick={() => handleButtonClick('matrixA')} className="bg-gray-800 text-white p-2 rounded-lg text-sm">MatrixA</button>
            <button onClick={() => handleButtonClick('matrixB')} className="bg-gray-800 text-white p-2 rounded-lg text-sm">MatrixB</button>
          </>
        )}
        
        {/* Matrix 3x3 Mode Buttons */}
        {mode === 'matrix3x3' && (
          <>
            <button onClick={() => handleButtonClick('matrixA')} className="bg-gray-800 text-white p-2 rounded-lg text-sm">MatrixA</button>
            <button onClick={() => handleButtonClick('matrixB')} className="bg-gray-800 text-white p-2 rounded-lg text-sm">MatrixB</button>
          </>
        )}
        {/* Matrix 2x1 Mode Buttons */}
        {mode === 'matrix1x2' && (
          <>
            <button onClick={() => handleButtonClick('matrixA')} className="bg-gray-800 text-white p-2 rounded-lg text-sm">MatrixA</button>
            <button onClick={() => handleButtonClick('matrixB')} className="bg-gray-800 text-white p-2 rounded-lg text-sm">MatrixB</button>
          </>
        )}
        {/* Complex Mode Buttons */}
        {mode === 'complex' && (
          <>
            <button onClick={() => handleButtonClick('i')} className="bg-gray-800 text-white p-2 rounded-lg text-sm">i</button>
            <button onClick={() => handleButtonClick('(')} className="bg-gray-800 text-white p-2 rounded-lg text-sm">(</button>
            <button onClick={() => handleButtonClick(')')} className="bg-gray-800 text-white p-2 rounded-lg text-sm">)</button>
            <button onClick={() => handleCalculate()} className="bg-gray-800 text-white p-2 rounded-lg text-sm">=</button>
          </>
        )}
        {mode === 'trignometry' && (
          <>
           <button onClick={() => handleButtonClick('sin(')} className="p-2 bg-gray-600 text-white rounded">sin</button>
            <button onClick={() => handleButtonClick('cos(')} className="p-2 bg-gray-600 text-white rounded">cos</button>
            <button onClick={() => handleButtonClick('tan(')} className="p-2 bg-gray-600 text-white rounded">tan</button>
            <button onClick={() => handleButtonClick('csc(')} className="p-2 bg-gray-600 text-white rounded">cosec</button>
            <button onClick={() => handleButtonClick('sec(')} className="p-2 bg-gray-600 text-white rounded">sec</button>
            <button onClick={() => handleButtonClick('cot(')} className="p-2 bg-gray-600 text-white rounded">cot</button>
            <button onClick={() => handleButtonClick('%')} className="p-2 bg-gray-600 text-white rounded">%</button>
          </>
        )}
        {mode === 'polar' && (
         <button onClick={() => handleCalculate()} className="p-2 bg-gray-800 text-white rounded">Convert to Rectangular</button>
        )}
       {mode === 'rectangular' && (
         <button onClick={() => handleCalculate()} className="p-2 bg-gray-800 text-white rounded">Convert to Polar</button>
       )}
      </div>
    </div>
  );
};

export default Calculator;
