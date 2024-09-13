import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MainApp from './MainApp'; // Імпортуємо ваш компонент MainApp
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MainApp /> {/* Використовуємо MainApp замість App */}
  </React.StrictMode>
);

// Якщо ви хочете розпочати вимірювання продуктивності у вашій програмі, передайте функцію
// для запису результатів (наприклад: reportWebVitals(console.log))
// або надішліть на аналітичну кінцеву точку. Детальніше: https://bit.ly/CRA-vitals
reportWebVitals();
