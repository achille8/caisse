import { useArticleContext } from '../context/ArticleContext';

export const ParametersPage = () => {
  const { articlesState, articlesDispatch } = useArticleContext();

  return (
    <>
      <div className="header-area">
        <div className="p-1 ps-3 textBox" style={{ minHeight: 52 }}>
          <i className="bi bi-gear me-2" style={{ fontSize: 28, color: 'var(--clr-muted)' }}></i>
          <strong>Paramètres</strong>
        </div>
      </div>

      <div className="m-4" style={{ maxWidth: 480 }}>
        <div className="mb-4">
          <p style={{ color: 'var(--clr-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            Ces titres apparaissent sur le ticket imprimé (max 16 caractères).
          </p>
        </div>

        <div className="form-group row align-items-center mb-3">
          <label htmlFor="title1" className="col-3 col-form-label">Titre 1</label>
          <div className="col">
            <input
              type="text"
              id="title1"
              maxLength={16}
              className="form-control"
              value={articlesState.title1 ?? ''}
              onChange={e => articlesDispatch({ type: 'set_title1', title1: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group row align-items-center mb-3">
          <label htmlFor="title2" className="col-3 col-form-label">Titre 2</label>
          <div className="col">
            <input
              type="text"
              id="title2"
              maxLength={16}
              className="form-control"
              value={articlesState.title2 ?? ''}
              onChange={e => articlesDispatch({ type: 'set_title2', title2: e.target.value })}
            />
          </div>
        </div>
      </div>
    </>
  );
};
