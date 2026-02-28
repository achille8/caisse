import React, { useContext, useRef, useState } from 'react';

type ModalContextType = {
  showConfirmation: (title: string, message: string | React.ReactNode) => Promise<boolean>;
};

const ConfirmationModalContext = React.createContext<ModalContextType>({} as ModalContextType);

export const useConfirmationModalContext = (): ModalContextType => useContext(ConfirmationModalContext);

const ConfirmationModalContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [show, setShow] = useState(false);
  const [content, setContent] = useState<{ title: string; message: string | React.ReactNode } | null>(null);
  const resolver = useRef<(value: boolean) => void>();

  const showConfirmation = (title: string, message: string | React.ReactNode): Promise<boolean> => {
    setContent({ title, message });
    setShow(true);
    return new Promise(resolve => {
      resolver.current = resolve;
    });
  };

  const handleOk = () => {
    resolver.current?.(true);
    setShow(false);
  };

  const handleCancel = () => {
    resolver.current?.(false);
    setShow(false);
  };

  return (
    <ConfirmationModalContext.Provider value={{ showConfirmation }}>
      {content && (
        <div className="modal" style={{ display: show ? 'block' : 'none', backgroundColor: 'rgba(0,0,0,0.75)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{content.title}</h5>
              </div>
              <div className="modal-body">{content.message}</div>
              <div className="modal-footer">
                <button type="button" onClick={handleCancel} className="btn btn-secondary">
                  Annuler
                </button>
                <button type="button" onClick={handleOk} className="btn btn-primary">
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {children}
    </ConfirmationModalContext.Provider>
  );
};

export default ConfirmationModalContextProvider;
