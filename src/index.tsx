import ReactDOM from 'react-dom/client'
import { App } from './Articles'
import './index.css'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";	
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

function registerServiceWorker(): void {
  
  console.log(`>>>>>>>>>>>>>>>>>>>>>> registerServiceWorker`);

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) =>
                console.log(`Service Worker registration complete, scope: '${registration.scope}'`))
            .catch((error) =>
                console.log(`Service Worker registration failed with error: '${error}'`));
    }
}

registerServiceWorker();
