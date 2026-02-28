import { useRef } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ArticleProvider } from './context/ArticleContext';
import ConfirmationModalContextProvider from './components/ConfirmModal';
import { AppNavbar } from './components/AppNavbar';
import { UpdateBanner } from './components/UpdateBanner';
import { ArticlesPage } from './pages/ArticlesPage';
import { PricesPage } from './pages/PricesPage';
import { ParametersPage } from './pages/ParametersPage';

export const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const orderedRoutes = ['/', '/prices', '/parameters'];

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.changedTouches[0];
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) {
      return;
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartXRef.current;
    const deltaY = touch.clientY - touchStartYRef.current;

    touchStartXRef.current = null;
    touchStartYRef.current = null;

    if (Math.abs(deltaX) < 60 || Math.abs(deltaX) <= Math.abs(deltaY)) {
      return;
    }

    if (location.pathname === '/parameters' && deltaX < 0) {
      navigate('/prices');
      return;
    }

    const currentIndex = orderedRoutes.indexOf(location.pathname);
    if (currentIndex === -1) {
      return;
    }

    if (deltaX < 0 && currentIndex < orderedRoutes.length - 1) {
      navigate(orderedRoutes[currentIndex + 1]);
      return;
    }

    if (deltaX > 0 && currentIndex > 0) {
      navigate(orderedRoutes[currentIndex - 1]);
    }
  };

  const handleTouchCancel = () => {
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  return (
    <ConfirmationModalContextProvider>
      <ArticleProvider>
        <AppNavbar />
        <UpdateBanner />
        <div
          className="gesture-page-area"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
        >
          <Routes>
            <Route path="/" element={<ArticlesPage />} />
            <Route path="/prices" element={<PricesPage />} />
            <Route path="/parameters" element={<ParametersPage />} />
          </Routes>
        </div>
      </ArticleProvider>
    </ConfirmationModalContextProvider>
  );
};
