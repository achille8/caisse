import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";	
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-toastify/dist/ReactToastify.css';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

/*
function registerServiceWorker(): void {
    alert();
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) =>
                console.log(`Service Worker registration complete, scope: '${registration.scope}'`))
            .catch((error) =>
                console.log(`Service Worker registration failed with error: '${error}'`));
    }
}

registerServiceWorker();
*/
