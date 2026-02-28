import { useEffect, useState } from 'react';

export const UpdateBanner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const sw = navigator.serviceWorker;
    if (!sw) return;

    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'SW_UPDATED') {
        setShow(true);
      }
    };

    sw.addEventListener('message', handler);
    return () => sw.removeEventListener('message', handler);
  }, []);

  if (!show) return null;

  return (
    <div className="update-banner">
      <i className="bi bi-arrow-clockwise me-2" style={{ fontSize: '1.2rem' }}></i>
      <span>Une nouvelle version est disponible.</span>
      <button onClick={() => window.location.reload()}>
        Mettre à jour
      </button>
      <button className="btn-dismiss" onClick={() => setShow(false)} title="Fermer">
        ✕
      </button>
    </div>
  );
};
