import React from 'react';
import ReactDOM  from 'react-dom/client';
import MatrixCalculator from './componentes/CalculadorMatri';
import Hecho_en from './componentes/children';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MatrixCalculator />
    <Hecho_en>
      <h5>Made in México</h5>
    </Hecho_en>
  </React.StrictMode>
);