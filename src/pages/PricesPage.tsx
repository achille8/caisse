import { useState } from 'react';
import { useArticleContext } from '../context/ArticleContext';
import { useConfirmationModalContext } from '../components/ConfirmModal';
import { AddArticleDialog } from '../components/AddArticleDialog';

export const PricesPage = () => {
  const { articlesState, articlesDispatch } = useArticleContext();
  const modalContext = useConfirmationModalContext();
  const [showAdd, setShowAdd] = useState(false);

  const increasePrice = (name: string) => articlesDispatch({ type: 'increate_price', name });
  const decreasePrice = (name: string) => articlesDispatch({ type: 'decreate_price', name });
  const toggleVisibility = (name: string) => articlesDispatch({ type: 'toggle_visibility', name });
  const moveUp = (name: string) => articlesDispatch({ type: 'move_up', name });
  const moveDown = (name: string) => articlesDispatch({ type: 'move_down', name });

  const removeArticle = async (name: string) => {
    const result = await modalContext.showConfirmation(
      'Confirmer la suppression',
      `Supprimer « ${name} » ?`
    );
    if (result) {
      articlesDispatch({ type: 'remove_article', name });
    }
  };

  const handleAddOk = async (name: string, imgBlob: Blob) => {
    setShowAdd(false);
    const path = `assets/${name}.png`;
    const cache = await caches.open('caisse-v2.0.0');
    const response = new Response(imgBlob, { status: 201, headers: { 'Content-Type': 'image/png' } });
    await cache.put(path, response);
    articlesDispatch({ type: 'add_article', name, image: path });
  };

  return (
    <>
      <div className="prices-header">
        <div className="p-1 textBox">
          <i className="bi bi-tag me-2" style={{ fontSize: 28 }}></i>
          <strong>Prix</strong>
        </div>
        <button className="btn-add ms-auto me-2" onClick={() => setShowAdd(true)}>
          <i className="bi bi-plus-lg me-1"></i>Ajouter
        </button>
      </div>

      {showAdd && (
        <AddArticleDialog
          onOk={handleAddOk}
          onCancel={() => setShowAdd(false)}
        />
      )}

      <div className="flex-fill main-area">
        {articlesState.articles.map(p => (
          <div key={p.name} className="d-flex article-row">
            <div className="imgBox">
              <img src={p.image} alt={p.name} />
            </div>
            <div className="buttonBox">
              <button
                className="btn btn-primary bg-gradient rounded-0"
                onClick={() => increasePrice(p.name)}
              >
                <i className="bi bi-plus bigIcon"></i>
              </button>
            </div>
            <div className="textBox priceBox">
              <strong>{p.price.toFixed(2)}</strong>
            </div>
            <div className="buttonBox">
              <button
                className="btn btn-primary bg-gradient rounded-0"
                onClick={() => decreasePrice(p.name)}
              >
                <i className="bi bi-dash bigIcon"></i>
              </button>
            </div>
            <div className="buttonBox">
              <button
                className={`btn bg-gradient rounded-0 ${p.visible ? 'btn-success' : 'btn-secondary'}`}
                onClick={() => toggleVisibility(p.name)}
                title={p.visible ? 'Masquer' : 'Afficher'}
              >
                <i className={`bi ${p.visible ? 'bi-check-lg' : 'bi-x-lg'}`}></i>
              </button>
            </div>
            <div className="buttonBox">
              <button
                className="btn btn-danger bg-gradient rounded-0"
                onClick={() => removeArticle(p.name)}
                title="Supprimer"
              >
                <i className="bi bi-trash3"></i>
              </button>
            </div>
            <div className="reorderStack">
              <button
                className="btn btn-info bg-gradient rounded-0 reorderBtn"
                onClick={() => moveUp(p.name)}
                title="Monter"
              >
                <i className="bi bi-chevron-up"></i>
              </button>
              <button
                className="btn btn-info bg-gradient rounded-0 reorderBtn"
                onClick={() => moveDown(p.name)}
                title="Descendre"
              >
                <i className="bi bi-chevron-down"></i>
              </button>
            </div>
            <div className="textBox bigTextBox">
              <span>{p.name}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
