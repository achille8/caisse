import { Route, Routes } from 'react-router-dom';
import { ArticleProvider } from './context/ArticleContext';
import ConfirmationModalContextProvider from './components/ConfirmModal';
import { AppNavbar } from './components/AppNavbar';
import { UpdateBanner } from './components/UpdateBanner';
import { ArticlesPage } from './pages/ArticlesPage';
import { PricesPage } from './pages/PricesPage';
import { ParametersPage } from './pages/ParametersPage';

export const App = () => {
  return (
    <ConfirmationModalContextProvider>
      <ArticleProvider>
        <AppNavbar />
        <UpdateBanner />
        <Routes>
          <Route path="/" element={<ArticlesPage />} />
          <Route path="/prices" element={<PricesPage />} />
          <Route path="/parameters" element={<ParametersPage />} />
        </Routes>
      </ArticleProvider>
    </ConfirmationModalContextProvider>
  );
};
