import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

if ('serviceWorker' in navigator) {
  const swUrl = `${import.meta.env.BASE_URL}service-worker.js`;
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      console.log('SW registered, scope:', registration.scope);
    })
    .catch(err => {
      console.error('SW registration failed:', err);
    });
}
