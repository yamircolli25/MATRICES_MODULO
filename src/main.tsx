import React from 'react';
import ReactDOM  from 'react-dom/client';
import MatrixCalculator from './componentes/CalculadorMatri';
import CALCULADORA from './componentes/children';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MatrixCalculator />
    <CALCULADORA>
      <h5>CALCULADORA DE MATRICES</h5>
    </CALCULADORA>
  </React.StrictMode>
);