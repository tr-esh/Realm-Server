import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ReadingsContextProvider } from './context/ReadingContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ReadingsContextProvider>
      <App />
    </ReadingsContextProvider>
);