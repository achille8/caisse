import { useState } from 'react';

interface AddArticleDialogProps {
  onOk: (name: string, imgBlob: Blob) => void;
  onCancel: () => void;
}

export const AddArticleDialog = ({ onOk, onCancel }: AddArticleDialogProps) => {
  const [name, setName] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [imgBlob, setImgBlob] = useState<Blob | undefined>();

  const searchOnWeb = () => {
    const query = name.trim() || 'boisson';
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`,
      '_blank'
    );
  };

  const pasteImg = async () => {
    const clipboardItems = await navigator.clipboard.read();
    const blob = await clipboardItems[0].getType('image/png');
    setImgBlob(blob);
    setImgUrl(URL.createObjectURL(blob));
  };

  const handleOk = () => {
    if (name.length && imgBlob) {
      onOk(name, imgBlob);
    }
  };

  return (
    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.75)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-plus-circle me-2"></i>Ajouter un article
            </h5>
          </div>
          <div className="modal-body d-flex flex-column gap-3">

            <div>
              <label htmlFor="google-image-search" className="col-form-label">Nom de l'article</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  id="google-image-search"
                  placeholder="ex: canette coca fond transparent"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoFocus
                />
                <button
                  type="button"
                  className="btn btn-outline-warning"
                  title="Rechercher une image sur Google Images"
                  onClick={searchOnWeb}
                >
                  <i className="bi bi-search me-1"></i>Google Images
                </button>
              </div>
            </div>

            {/* Step 2 — Search + paste */}
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-info flex-fill"
                title="Coller une image depuis le presse-papiers"
                onClick={pasteImg}
              >
                <i className="bi bi-clipboard-image me-1"></i>Coller Image
              </button>
            </div>

            <small style={{ color: 'var(--clr-muted)' }}>
              Trouvez l'image, <em>long click → Copier l'image</em>, puis cliquez « Coller Image ».
            </small>

            {/* Step 3 — Preview */}
            <div className="d-flex justify-content-center">
              <div style={{
                width: 120, height: 120,
                border: '2px dashed var(--clr-border-bright)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--clr-bg-700)',
                overflow: 'hidden',
              }}>
                {imgUrl
                  ? <img src={imgUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <i className="bi bi-image" style={{ fontSize: 40, color: 'var(--clr-muted)' }}></i>
                }
              </div>
            </div>

          </div>
          <div className="modal-footer">
            <button
              type="button"
              onClick={handleOk}
              disabled={!(name.length && imgUrl.length)}
              className="btn btn-primary me-auto"
            >
              <i className="bi bi-check-lg me-1"></i>Sauver
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-danger"
            >
              <i className="bi bi-x-lg me-1"></i>Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
