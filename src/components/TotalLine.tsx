import { useArticleContext } from '../context/ArticleContext';

export const TotalLine = () => {
  const { articlesState } = useArticleContext();
  let total = articlesState.articles
    .filter(a => a.visible)
    .reduce((acc, a) => acc + a.quantity * a.price, 0);
  total = Math.round(total * 100) / 100;

  const hasItems = articlesState.articles.some(a => a.visible && a.quantity > 0);

  return (
    <div className="d-flex align-items-center p-1 ps-3 textBox header-area" style={{ minHeight: 52 }}>
      <i className="bi bi-receipt me-2" style={{ fontSize: 28, color: 'var(--clr-muted)' }}></i>
      <strong style={{ fontSize: 32 }}>
        Total:{' '}
        <span style={{ color: hasItems ? 'var(--clr-accent)' : 'var(--clr-text)' }}>
          {total.toFixed(2)} €
        </span>
      </strong>
    </div>
  );
};
