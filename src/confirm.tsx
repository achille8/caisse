import React, {useContext, useRef, useState} from "react";

type UseModalShowReturnType = {
    show: boolean;
    setShow: (value: boolean) => void;
    onHide: () => void;
}

const useModalShow = (): UseModalShowReturnType => {
    const [show, setShow] = useState(false);
    const handleOnHide = () => setShow(false);
    return {
        show,
        setShow,
        onHide: handleOnHide,
    }
};

type ModalContextType = {
    showConfirmation: (title: string, message: string | JSX.Element) => Promise<boolean>;
};

type ConfirmationModalContextProviderProps = {
    children: React.ReactNode
}

const ConfirmationModalContext = React.createContext<ModalContextType>({} as ModalContextType);

const ConfirmationModalContextProvider: React.FC<ConfirmationModalContextProviderProps> = (props) => {
    const {show, setShow, onHide} = useModalShow();
    const [content, setContent] = useState<{ title: string, message: string | JSX.Element} | null>();
    const resolver = useRef<Function>();

    // const handleShow = (title: string, message: string | JSX.Element): Promise<boolean> => {
    //     setContent({ title, message });
    //     setShow(true);
    //     return new Promise(function (resolve) {
    //         resolver.current = resolve; // save promise resolver in persistant variable
    //     });
    // };

    const modalContext: ModalContextType = {
        showConfirmation: (title: string, message: string | JSX.Element): Promise<boolean> => {
          setContent({ title, message });
          setShow(true);
          return new Promise(function (resolve) {
              resolver.current = resolve; // save promise resolver in persistant variable
          });
      }
    };

    const handleOk = () => {
        resolver.current && resolver.current(true); // pass true to saved promise resolver
        onHide();
    };

    const handleCancel = () => {
        resolver.current && resolver.current(false); // pass false to saved promise resolver
        onHide();
    };

    return (
        <ConfirmationModalContext.Provider value={modalContext}>  
            {
              content &&
              <div className="modal" style={{ display: show ? 'block' : 'none' }}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">{content.title}</h5>
                    </div>
                    <div className="modal-body">
                      {content.message}
                    </div>
                    <div className="modal-footer">
                      <button type="button" onClick={handleCancel} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button type="button" onClick={handleOk} className="btn btn-primary">Save</button>
                    </div>
                  </div>
                </div>
              </div>
            }
            {props.children}
        </ConfirmationModalContext.Provider>
    )
};

const useConfirmationModalContext = (): ModalContextType => useContext(ConfirmationModalContext);

export { useModalShow, useConfirmationModalContext }
export default ConfirmationModalContextProvider;
