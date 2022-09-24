import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  return <h1>Hello!</h1>;
};

createRoot(document.getElementById('root')!).render(<App />);
