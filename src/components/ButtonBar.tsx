import { ToastContainer } from 'react-toastify';
import { useArticleContext } from '../context/ArticleContext';
import { PrintService } from '../services/PrintService';
import { displayError } from '../utils/formatting';

export const ButtonBar = () => {
  const { articlesState, articlesDispatch } = useArticleContext();

  const handlePrintSingleTicket = () => {
    PrintService.printTicket(articlesState, false)
      .then(() => articlesDispatch({ type: 'clear' }))
      .catch((err: unknown) => displayError(String(err)));
  };

  const handlePrintMultiTickets = () => {
    PrintService.printTicket(articlesState, true)
      .then(() => articlesDispatch({ type: 'clear' }))
      .catch((err: unknown) => displayError(String(err)));
  };

  const handleClear = () => {
    articlesDispatch({ type: 'clear' });
  };

  return (
    <div className="d-flex flex-column sidebar">
      <div className="buttonBox">
        <button
          className="btn btn-primary bg-gradient rounded-0"
          onClick={handlePrintSingleTicket}
          title="Imprimer le ticket"
        >
          <i className="bi bi-printer"></i>
        </button>
      </div>

      <div className="buttonBox">
        <button
          className="btn btn-primary bg-gradient rounded-0"
          onClick={handlePrintMultiTickets}
          title="Imprimer le ticket"
        >
          <i className="bi bi-bookmarks"></i>
        </button>
      </div>

      <div className="buttonBox">
        <button
          className="btn btn-danger bg-gradient rounded-0"
          onClick={handleClear}
          title="Effacer les quantités"
        >
          <i className="bi bi-trash3"></i>
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};
