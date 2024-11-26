import { Dispatch, createContext, useContext, useEffect, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import * as EscPosEncoder from './esc-pos-encoder';
import { usePersistedReducer } from './hooks';
import ConfirmationModalContextProvider, { useConfirmationModalContext } from './confirm';


//import * as EscPosEncoder from module("./esc-pos-encoder'");
//var xxx = require('esc-pos-encoder');

const storageKey = 'Articles';

type Article = {
    name: string,
    image: string,
    visible: boolean,
    quantity: number,
    price: number
};

interface State {
    title1: string,
    title2: string,
    articles: Article[]
}

type Action =
    | { type: 'initialize', articles: Article[] }
    | { type: 'add_article', name: string, image: string }
    | { type: 'remove_article', name: string }
    | { type: 'toggle_visibility', name: string }
    | { type: 'increate_quantity', name: string }
    | { type: 'decreate_quantity', name: string }
    | { type: 'increate_price', name: string }
    | { type: 'decreate_price', name: string }
    | { type: 'print_ticket' }
    | { type: 'set_title1', title1: string }
    | { type: 'set_title2', title2: string }
    | { type: 'clear' }

const articlesReducer = (state: State, action: Action): State => {    
    switch (action.type) {
        case 'initialize':
            return {
                    ...state,
                    articles: action.articles.map(a => ({ ...a, image: `assets/${a.image}`, quantity: 0, visible: true }))
                };
        case 'add_article':
            return {
                    ...state,
                    articles: [
                        ...state.articles,
                        { name: action.name, image: action.image, visible: true, quantity: 0 , price: 0 }
                    ]
                };
        case 'remove_article':
            return { 
                    ...state,
                    articles: state.articles.filter(a => a.name !== action.name)
                  };
        case 'toggle_visibility':
            return {
                    ...state,
                    articles: state.articles.map(a => a.name === action.name ? { ...a, visible: !a.visible } : a)
                };
        case 'increate_quantity':
            return {
                    ...state,
                    articles: state.articles.map(a => a.name === action.name ? { ...a, quantity: a.quantity + 1 } : a)
                };
        case 'decreate_quantity':
            return {
                    ...state,
                    articles: state.articles.map(a => a.name === action.name ? { ...a, quantity: Math.max(0, a.quantity - 1) } : a)
                }; 
        case 'increate_price':
            return {
                    ...state,
                    articles: state.articles.map(a => a.name === action.name ? { ...a, price: a.price + 0.05 } : a)
                }; 
        case 'decreate_price':
            return {
                    ...state,
                    articles: state.articles.map(a => a.name === action.name ? { ...a, price: Math.max(0, a.price - 0.05) } : a)
                }; 
        case 'clear':
            return {
                    ...state,
                    articles: state.articles.map(a => ({ ...a, quantity: 0 }))
                }; 
        case 'set_title1':
            return { ...state, title1: action.title1 }; 
        case 'set_title2':
            return { ...state, title2: action.title2 }; 
        case 'print_ticket':
            return state;
    }
};

// https://dev.to/elisealcala/react-context-with-usereducer-and-typescript-4obm
const initialState: State = { title1: '****************', title2: '****************', articles: [] };

const ArticleContext = createContext<{ 
  articlesState: State; 
  articlesDispatch: Dispatch<Action>; 
}>({ 
  articlesState: initialState, 
  articlesDispatch: () => null 
});

export const useArticleContext = () => useContext(ArticleContext);

export const App = () => {
    return (
        <ConfirmationModalContextProvider>
        <ArticleProvider>
            <Navbar />
            <Routes>          
                <Route path="/" element={<ArticleXXX />} />
                <Route path="/prices" element={<Prices />} />
                <Route path="/parameters" element={<Parameters />} />
            </Routes>
        </ArticleProvider>
        </ConfirmationModalContextProvider>
    );
};

const Navbar = () => {
    return (
      <nav className="navbar navbar-expand navbar-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/"></Link>
          {/* <button className="navbar-toggler" type="button" xxxdata-bs-toggle="collapse" xxxdata-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button> */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Articles</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/prices">Prix</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/parameters">Paramètres</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
};

export const ArticleXXX = () => {
    return (
        <>
            <div className="header-area">
                <TotalLine />
            </div>
            <div className="d-flex">
                <div className="flex-fill main-area" style={{backgroundColor: "#222"}}>
                    <Deck />
                </div>
                <div className="" style={{backgroundColor: "#111"}}>
                    <ButtonBar />
                </div>
            </div>
            {/* <div>
              <div className="">
                {PrintService.PrinterName}
              </div>
            </div> */}
        </>
    );
}

const ArticleProvider = ({ children }: any) => {   
   // const [articlesState, articlesDispatch] = useReducer(articlesReducer, initialState);

    const [articlesState, articlesDispatch] = usePersistedReducer(articlesReducer, initialState, storageKey);

    useEffect(() => {   
        // const articles = getLocalStorageValue('articles');
        // if (articles) {
        //     console.log('getArticles from local storage');
        //     articlesDispatch({ type: 'initialize', articles: articles });
        // }
        // else {
            if (articlesState.articles.length !== 0) {
                return;
            }
            const get = async () => {
                const articles = await getArticles();
                setLocalStorageValue('articles', articles);
                articlesDispatch({ type: 'initialize', articles: articles });
            };
            get();
        // }
        // return () => {};
    }, []);     
    
    return (
        <ArticleContext.Provider value={{ articlesState, articlesDispatch }}>
            {children}
        </ArticleContext.Provider>
    );
};

const getArticles = async (): Promise<Article[]> => {
    const response = await fetch("prices.json");
    const data = await response.json();
    return data.map((x: Article) => ({ ...x, quantity: 0, selected: false }))
};

// const getLocalStorageValue = (key: string) => {
//     const test = localStorage.getItem(key);
//     if (!test || test === '') {
//         return null;
//     }
//     return JSON.parse(test);
// }

const setLocalStorageValue = (key: string, value: any ) => {
    localStorage.setItem(key, JSON.stringify(value));
}

const TotalLine = () => {
    const { articlesState } = useContext(ArticleContext);
    let total = articlesState.articles
      .filter(a => a.visible)
      .reduce((a, x) => a + x.quantity * x.price, 0);
    total = Math.round(total * 100) / 100;

    return (
        <div className="p-1 textBox">
            <strong>Total: {total} €</strong>
        </div>
    );
};

const Deck = () => {
    const { articlesState, articlesDispatch } = useContext(ArticleContext);

    return (
        <div className="d-flex flex-column">
            { articlesState.articles.filter(a => a.visible).map((p) => (
                <div key={p.name} className="d-flex">
                    <div className="imgBox">
                        <img className="" src={p.image}/>
                    </div>
                    <div className="buttonBox">
                        <button className="btn btn-primary bg-gradient rounded-0" onClick={_ => articlesDispatch({ type: 'increate_quantity', name: p.name }) }>
                            <i className="bi bi-plus bigIcon"></i>
                        </button>
                    </div>
                    <div className="bg-dark bg-gradient textBox quantityBox">
                        <strong>{p.quantity === 0 ? '' : p.quantity}</strong>
                    </div>
                    <div className="buttonBox">
                        <button className="btn btn-primary bg-gradient rounded-0" onClick={_ => articlesDispatch({ type: 'decreate_quantity', name: p.name }) }>
                            <i className="bi bi-dash bigIcon"></i>
                        </button>
                    </div>
                    <div className="bg-dark bg-gradient textBox bigTextBox">
                        <div className="ms-2">{p.name}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};
  
const ButtonBar = () => {
  const { articlesState, articlesDispatch } = useContext(ArticleContext);
    return (
        <div className="d-flex flex-column">
            <div className="buttonBox">
                <button className="btn btn-primary bg-gradient rounded-0" onClick={_ => 
                  PrintService.printTicket(articlesState)
                    .then(_ => articlesDispatch({ type: 'clear' }) )
                    .catch((err: any) => displayError(err))
                }>
                    <i className="bi bi-printer"></i>
                </button>
            </div>
            <div className="buttonBox">
                <button className="btn btn-danger bg-gradient rounded-0" onClick={_ => articlesDispatch({ type: 'clear' }) }>
                    <i className="bi bi-trash3"></i>
                </button>                
            </div>
            <ToastContainer />
        </div>
    );
};

class PrintService {

    private static _printCharacteristic: any = null;
    private static _connectedPrinter: any = null;

    static get PrinterName() {
      return this._printCharacteristic?.service.device.name;
    }
    
    static async printTicket(articlesState: State): Promise<void> {
        if (this._connectedPrinter && this._connectedPrinter.gatt.connected) {
            return this.print(articlesState)
              .then(() => displayMessage("Ticket imprimé"));
        } else {
            return this.initialize()
              .then(() => this.print(articlesState))
              .then(() => displayMessage("Ticket imprimé"));
        }
    }

    private static async initialize() {
        // https://github.com/NielsLeenheer/EscPosEncoder/blob/master/README.md
        var SERVICE = '000018f0-0000-1000-8000-00805f9b34fb';
        var WRITE   = '00002af1-0000-1000-8000-00805f9b34fb';  
        let localDevice: any;
        let nav: any = window.navigator;
        return nav.bluetooth.requestDevice({ filters: [{ services: [SERVICE] }] })
            .then((device: any) => { 
              localDevice = device;
              return device.gatt.connect(); 
            })
            .then((server: any) => { 
              return server.getPrimaryService(SERVICE); 
            })
            .then((service: any) => { 
              return service.getCharacteristic(WRITE); 
            })
            .then((characteristic: any) => { 
              this._connectedPrinter = localDevice;
              return this._printCharacteristic = characteristic;
            });
    }

    private static async print(articlesState: State) {
        
        let encoder: any = new EscPosEncoder.default({
            width: 42
        });
    
        const lines = [];

        lines.push(encoder
            .raw([ 0x1c, 0x2e ])
            .codepage('cp437')
            .encode());

        if (articlesState.title1 && articlesState.title1.length) {
            lines.push(encoder
                .bold(true)
                .invert(true)
                .width(3)
                .height(3)
                .line(articlesState.title1)
                .bold(false)
                .invert(false)
                .encode());    
        }

        if (articlesState.title2 && articlesState.title2.length) {
            lines.push(encoder
                .bold(true)
                .invert(true)
                .width(3)
                .height(3)
                .line(articlesState.title2)
                .bold(false)
                .invert(false)
                .encode());
        }

        lines.push(encoder
            .newline()
            .encode());
    
        lines.push(encoder
            .bold(true)
            .width(2)
            .height(2)
            .line('Qte  Article        Prix')
            .bold(false)
            .encode());

        lines.push(encoder
            .bold(true)
            .width(1)
            .height(1)
            .line('================================================')
            .bold(false)
            .encode());

        for (const article of articlesState.articles.filter(a => a.visible && a.quantity > 0)) {
            const line = rightAlignNumber(article.quantity, 2) 
                + ' ' 
                + leftAlignText(article.name, 10)
                + ' '; 
            const price = rightAlignNumber(article.quantity * article.price, 6, 2);
            lines.push(encoder
                .bold(true)
                .width(3)
                .height(3)
                .text(line)
                .width(1)
                .height(1)
                .line(price)
                .bold(false)
                .encode());
        }

        lines.push(encoder
            .bold(true)
            .width(1)
            .height(1)
            .line('================================================')
            .bold(false)
            .encode());

        const total = articlesState.articles
            .filter(a => a.quantity > 0)
            .reduce((a, b) => a + b.quantity * b.price, 0);
        const line = leftAlignText("Total", 17) + ' '; 
        const price = rightAlignNumber(total, 6, 2);
        lines.push(encoder
            .bold(true)
            .width(2)
            .height(2)
            .text(line)
            .width(2)
            .height(2)
            .line(price)
            .bold(false)
            .encode());
        lines.push(encoder
            .line('')
            .line('')
            .line('')
            .line('')
            .cut()
            .encode());
          try {
            for (const line of lines) {
                await this._printCharacteristic.writeValue(line);
            }
        }
        catch (err: any) {
            displayError(err.message);
        }
    }
}

const displayMessage = (message: string) : void => {
    toast.info(message, { theme: "dark", position: "top-left" });
};

const displayError = (message: string) : void => {
  toast.error(message, { theme: "colored", position: "top-left" });
};

function rightAlignNumber(num: number, totalWidth: number, decimals: number = 0, paddingChar = ' ') {
    const numberString = num.toFixed(decimals);
    const padding = Math.max(0, totalWidth - numberString.length);
    return paddingChar.repeat(padding) + numberString;
}

function leftAlignText(text: string, totalWidth: number, paddingChar = ' ') {
    const padding = Math.max(0, totalWidth - text.length);
    return (text + paddingChar.repeat(padding)).substring(0, totalWidth);
}

export const Prices = () => {
    const { articlesState, articlesDispatch } = useContext(ArticleContext);

    const increatePrice = (name: string): void => {
        articlesDispatch({ type: 'increate_price', name: name });
    }

    const decreatePrice = (name: string): void => {
        articlesDispatch({ type: 'decreate_price', name: name });
    }

    const toggleVisibility = (name: string): void => {
        articlesDispatch({ type: 'toggle_visibility', name: name });
    }

    const modalContext = useConfirmationModalContext();

    const removeArticle = async (name: string): Promise<void> => {
        const result = await modalContext.showConfirmation(
          'Confirer la suppression',  
          `Supprimer ${name} ?`
        );
        if (result) {
          articlesDispatch({ type: 'remove_article', name: name });
        }
    }

    const [show, setShow] = useState(false);

    const addArticle = (): void => {
      setShow(true);
    }    

    const onOk = (name: string, imgBlob: Blob): void => {
        setShow(false);
        save(name, imgBlob);
    }

    const onCancel = (): void => {
        setShow(false);
    }

    const save = async (name: string, imgBlob: Blob, ) => {
      const path = `assets/${name}.png`;
      caches.open('v1.0').then(cache => {
        const response = new Response( imgBlob, { status: 201, headers: {'Content-Type': 'png'} });
        cache.put(path, response).then(_ => {
            setTimeout(() => {
              articlesDispatch({ type: 'add_article', name: name, image: path });   
            }, 0);        
        });
      });
    }    

    return (
        <>
            <div className="header-area d-flex">
                <div className="p-1 textBox"> 
                    <strong>Prix</strong>
                </div>
                <button className="ms-auto" onClick={async _ => await addArticle()}>Ajouter</button>
            </div>

            {show && <AddArticleDialog onOk={onOk} onCancel={onCancel} />}

            <div className="flex-fill main-area" style={{backgroundColor: "#222"}}>
              {/* <div className="d-flex flex-column"> */}
                  {articlesState.articles.map(p => (
                      <div key={p.name} className={`d-flex`}>
                          <div className="imgBox">
                              <img className="" src={p.image}/>
                          </div>
                          <div className="buttonBox">
                              <button className="btn btn-primary bg-gradient rounded-0" onClick={_ => increatePrice(p.name)}>
                                  <i className="bi bi-plus bigIcon"></i>
                              </button>
                          </div>
                          <div className="bg-dark bg-gradient textBox priceBox">
                              <strong>{p.price.toFixed(2)}</strong>
                          </div>
                          <div className="buttonBox">
                              <button className="btn btn-primary bg-gradient rounded-0" onClick={_ => decreatePrice(p.name)}>
                                  <i className="bi bi-dash bigIcon"></i>
                              </button>
                          </div>
                          <div className="buttonBox">
                              <button className={"btn bg-gradient rounded-0 " + (p.visible ? "btn-success" : "btn-secondary")} onClick={_ => toggleVisibility(p.name)}>
                                  { p.visible ? <i className="bi bi-check"></i> : <i className="bi bi-x"></i> }
                              </button>
                          </div>
                          <div className="buttonBox">
                              <button className={"btn bg-gradient rounded-0 btn-danger"} onClick={async _ => await removeArticle(p.name)}>
                                  <i className="bi bi-trash3"></i>
                              </button>
                          </div>
                          <div className="bg-dark bg-gradient textBox bigTextBox">
                              <div className="ms-2">{p.name}</div>
                          </div>
                      </div>
                  ))}
              </div>
            {/* </div> */}
        </>
    );
}

export const Parameters = () => {
  const { articlesState, articlesDispatch } = useContext(ArticleContext);

  return (
      <>
      <div className="header-area">
        <div className="p-1 textBox">
            <strong>Paramètres</strong>
        </div>  
      </div> 
      <div className="m-4" style={{ width: 400 }}>

        <div className="form-group row m-2">
          <label htmlFor="name" className="col-3 col-form-label">Titre 1</label>
          <div className="col">
            <input
              type="text"
              id="title1"
              maxLength={16}
              className="form-control"
              value={articlesState.title1 || ""}
              onChange={e => articlesDispatch({ type: 'set_title1', title1: e.target.value }) }
            />
          </div>
        </div>

        <div className="form-group row m-2">
          <label htmlFor="name" className="col-3 col-form-label">Titre 2</label>
          <div className="col">
            <input
              type="text"
              id="title2"
              maxLength={16}
              className="form-control"
              value={articlesState.title2 || ""}
              onChange={e => articlesDispatch({ type: 'set_title2', title2: e.target.value }) }
            />
          </div>
        </div>

      </div>
      </>
  );
}

const AddArticleDialog = ({onOk, onCancel}: any) => {

  const [name, setName] = useState<string>('');
  const [imgUrl, setImgUrl] = useState<string>('');
  const [imgBlob, setImgBlob] = useState<Blob>();

  const handleOk = () => {
      onOk(name, imgBlob);
  };

  const handleCancel = () => {
      onCancel();
  };

  const pasteImg = async () => {
      const clipboardItems = await navigator.clipboard.read();
      const blob = await clipboardItems[0].getType('image/png');
      setImgBlob(blob);
      const data = URL.createObjectURL(blob)
      setImgUrl(data);
  }  

  return (
    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Ajouter un article</h5>
          </div>
          <div className="modal-body">
            <form className="container-fluid">
              <div className="row">
                <div className="col-4">
                    <div className="m-1 imgBox">
                        <img src={imgUrl} className='img-thumbnail' alt="" />
                    </div>
                </div>
                <div className="col">
                  <label htmlFor="image-name" className="col-form-label">Nom:</label>
                  <input type="text" className="form-control" id="image-name" maxLength={16} onChange={e => setName(e.target.value)} />
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer debug">
            <button type="button" onClick={async _ => await pasteImg()} className="btn btn-primary me-auto">Coller Image</button>
            <button type="button" onClick={handleOk} disabled={!(name.length && imgUrl.length)} className="btn btn-primary">Sauver</button>
            <button type="button" onClick={handleCancel} className="btn btn-danger" data-bs-dismiss="modal">Annuler</button>
          </div>
        </div>
      </div>
    </div>
  );
}
