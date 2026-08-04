import { useArticleContext } from '../context/ArticleContext';

export const ParametersPage = () => {
  const { articlesState, articlesDispatch } = useArticleContext();

  const updateCashDrawerSettings = (settings: Partial<{
    cashDrawerConnected: boolean;
    cashDrawerDeviceId: number;
    cashDrawerPulseOn: number;
    cashDrawerPulseOff: number;
  }>) => {
    articlesDispatch({
      type: 'set_cash_drawer_connected',
      cashDrawerConnected: settings.cashDrawerConnected ?? !!articlesState.cashDrawerConnected,
      cashDrawerDeviceId: settings.cashDrawerDeviceId ?? articlesState.cashDrawerDeviceId,
      cashDrawerPulseOn: settings.cashDrawerPulseOn ?? articlesState.cashDrawerPulseOn,
      cashDrawerPulseOff: settings.cashDrawerPulseOff ?? articlesState.cashDrawerPulseOff,
    });
  };

  const readByteValue = (value: string) => Math.max(0, Math.min(255, Number(value) || 0));

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

        <div className="form-group row align-items-center mb-3">
          <label htmlFor="cashDrawerConnected" className="col-8 col-form-label">Tiroir-caisse connecté à l'imprimante</label>
          <div className="col">
            <input
              type="checkbox"
              id="cashDrawerConnected"
              className="form-check-input"
              checked={!!articlesState.cashDrawerConnected}
              onChange={e => updateCashDrawerSettings({ cashDrawerConnected: e.target.checked })}
            />
          </div>
        </div>

        <div className="form-group row align-items-center mb-3">
          <label htmlFor="cashDrawerDeviceId" className="col-8 col-form-label">Identifiant du périphérique tiroir-caisse</label>
          <div className="col">
            <input
              type="number"
              id="cashDrawerDeviceId"
              min={0}
              max={255}
              className="form-control"
              value={articlesState.cashDrawerDeviceId}
              onChange={e => updateCashDrawerSettings({ cashDrawerDeviceId: readByteValue(e.target.value) })}
            />
          </div>
        </div>

        <div className="form-group row align-items-center mb-3">
          <label htmlFor="cashDrawerPulseOn" className="col-8 col-form-label">Impulsion tiroir-caisse active</label>
          <div className="col">
            <input
              type="number"
              id="cashDrawerPulseOn"
              min={0}
              max={255}
              className="form-control"
              value={articlesState.cashDrawerPulseOn}
              onChange={e => updateCashDrawerSettings({ cashDrawerPulseOn: readByteValue(e.target.value) })}
            />
          </div>
        </div>

        <div className="form-group row align-items-center mb-3">
          <label htmlFor="cashDrawerPulseOff" className="col-8 col-form-label">Impulsion tiroir-caisse inactive</label>
          <div className="col">
            <input
              type="number"
              id="cashDrawerPulseOff"
              min={0}
              max={255}
              className="form-control"
              value={articlesState.cashDrawerPulseOff}
              onChange={e => updateCashDrawerSettings({ cashDrawerPulseOff: readByteValue(e.target.value) })}
            />
          </div>
        </div>

      </div>
    </>
  );
};
