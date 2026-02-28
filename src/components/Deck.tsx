import { useArticleContext } from '../context/ArticleContext';

export const Deck = () => {
  const { articlesState, articlesDispatch } = useArticleContext();

  return (
    <div className="d-flex flex-column">
      {articlesState.articles.filter(a => a.visible).map(p => (
        <div key={p.name} className="d-flex article-row">
          <div className="imgBox">
            <img src={p.image} alt={p.name} />
          </div>
          <div className="buttonBox">
            <button
              className="btn btn-primary bg-gradient rounded-0"
              onClick={() => articlesDispatch({ type: 'increate_quantity', name: p.name })}
            >
              <i className="bi bi-plus bigIcon"></i>
            </button>
          </div>
          <div className={`textBox quantityBox${p.quantity > 0 ? ' quantity-active' : ''}`}>
            <strong>{p.quantity === 0 ? '' : p.quantity}</strong>
          </div>
          <div className="buttonBox">
            <button
              className="btn btn-primary bg-gradient rounded-0"
              onClick={() => articlesDispatch({ type: 'decreate_quantity', name: p.name })}
            >
              <i className="bi bi-dash bigIcon"></i>
            </button>
          </div>
          <div className="textBox bigTextBox">
            <span>{p.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
