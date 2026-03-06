import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { SelectStreamProvider } from './ContextApi/SelectStreamApiContext';
// import { FilterJobsProvider } from './ContextApi/FiltersJobsList';
import { Provider } from 'react-redux';
import ConfigureStore from './Redux/Store/Store';

import './index.css';
import "animate.css/animate.compat.css"
import 'aos/dist/aos.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Provider store={ConfigureStore}>
        <App />
      </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
