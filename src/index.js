import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import store from './store';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}> {/* Wrapping with Redux Provider */}
      <BrowserRouter> {/* Wrapping with React Router */}
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);


