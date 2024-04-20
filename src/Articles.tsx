import { Dispatch, createContext, useContext, useEffect } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import * as EscPosEncoder from './esc-pos-encoder';
import { usePersistedReducer } from './hooks';
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
    | { type: 'add_article', name: string; image: string }
    | { type: 'toggle_visibility', name: string }
    | { type: 'increate_quantity', name: string }
    | { type: 'decreate_quantity', name: string }
    | { type: 'increate_price', name: string }
    | { type: 'decreate_price', name: string }
    | { type: 'print_ticket' }
    | { type: 'clear' }

const articlesReducer = (state: State, action: Action): State => {    
    switch (action.type) {
        case 'initialize':
            return {
                    ...state,
                    articles: action.articles.map(a => ({ ...a, quantity: 0, visible: true }))
                };
        case 'add_article':
            return {
                    ...state,
                    articles: [
                        ...state.articles,
                        { name: action.name, image: action.image, visible: true, quantity: 0 , price: 0 }
                    ]
                };
        case 'toggle_visibility':
            return {
                    ...state,
                    articles: state.articles.map((a) => a.name === action.name ? { ...a, visible: !a.visible } : a)
                };
        case 'increate_quantity':
            return {
                    ...state,
                    articles: state.articles.map((a) => a.name === action.name ? { ...a, quantity: a.quantity + 1 } : a)
                };
        case 'decreate_quantity':
            return {
                    ...state,
                    articles: state.articles.map((a) => a.name === action.name ? { ...a, quantity: Math.max(0, a.quantity - 1) } : a)
                }; 
        case 'increate_price':
            return {
                    ...state,
                    articles: state.articles.map((a) => a.name === action.name ? { ...a, price: a.price + 0.05 } : a)
                }; 
        case 'decreate_price':
            return {
                    ...state,
                    articles: state.articles.map((a) => a.name === action.name ? { ...a, price: Math.max(0, a.price - 0.05) } : a)
                }; 
        case 'clear':
            return {
                    ...state,
                    articles: state.articles.map((a) => ({ ...a, quantity: 0 }))
                }; 
        case 'print_ticket':
            return state;
    }
};

// https://dev.to/elisealcala/react-context-with-usereducer-and-typescript-4obm
const initialState: State = { title1: '', title2: '', articles: [] };

const ArticleContext = createContext<{ articlesState: State; articlesDispatch: Dispatch<Action>; }>({ articlesState: initialState, articlesDispatch: () => null });

export const useArticleContext = () => useContext(ArticleContext);

export const App = () => {
    return (
        <ArticleProvider>
            <Navbar />
            <Routes>          
                <Route path="/" element={<ArticleXXX />} />
                <Route path="/prices" element={<Prices />} />
            </Routes>
        </ArticleProvider>
    );
};

const Navbar = () => {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark navbar-xs">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/"></Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Articles</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/prices">Prix</Link>
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
            <div className="total-area">
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
            console.log('getArticles', articlesState, initialState);
            if (articlesState.articles.length !== 0) {
                return;
            }
            console.log('getArticles get');
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
    const total = articlesState.articles.filter(a => a.visible).reduce((a, x) => a + x.quantity * x.price, 0);

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
                <div key={p.name} className={`d-flex`}>
                    <div className="m-1 imgBox">
                        <img className="" src={`assets/${p.image}`}/>
                    </div>
                    <div className="m-1 buttonBox">
                        <button className="btn btn-primary bg-gradient rounded-0" onClick={_ => articlesDispatch({ type: 'increate_quantity', name: p.name }) }>
                            <i className="bi bi-plus bigIcon"></i>
                        </button>
                    </div>
                    <div className="m-1 bg-dark bg-gradient textBox quantityBox">
                        <strong>{p.quantity === 0 ? '' : p.quantity}</strong>
                    </div>
                    <div className="m-1 buttonBox">
                        <button className="btn btn-primary bg-gradient rounded-0" onClick={_ => articlesDispatch({ type: 'decreate_quantity', name: p.name }) }>
                            <i className="bi bi-dash bigIcon"></i>
                        </button>
                    </div>
                    <div className="m-1 bg-dark bg-gradient textBox bigTextBox">
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
            <div className="m-1 buttonBox">
                <button className="btn btn-success bg-gradient rounded-0" onClick={_ => PrintService.printTicket(articlesState) }>
                    <i className="bi bi-printer"></i>
                </button>
            </div>
            <div className="m-1 buttonBox">
                <button className="btn btn-warning bg-gradient rounded-0" onClick={_ => articlesDispatch({ type: 'clear' }) }>
                    <i className="bi bi-trash3"></i>
                </button>                
            </div>
            <ToastContainer />
        </div>
    );
};

class PrintService {

    private static printCharacteristic: any = null;

    static get PrinterName() {
      return this.printCharacteristic?.service.device.name;
    }
    
    static async printTicket(articlesState: State) {
        if (this.printCharacteristic) {
            this.print(articlesState)
              .then(() => displayMessage("Ticket imprimé"))
              .catch((err: any) => displayError(err));
        } else {
            this.initialize()
              .then(() => this.print(articlesState))
              .then(() => displayMessage("Ticket imprimé"))
              .catch((err: any) => displayError(err));
        }
    }

    private static async initialize() {
        // https://github.com/NielsLeenheer/EscPosEncoder/blob/master/README.md
        var SERVICE = '000018f0-0000-1000-8000-00805f9b34fb';
        var WRITE   = '00002af1-0000-1000-8000-00805f9b34fb';  
        let nav: any = window.navigator;

        return nav.bluetooth.requestDevice({ filters: [{ services: [SERVICE] }] })
            .then((device: any) => { 
              return device.gatt.connect(); 
            })
            .then((server: any) => { 
              return server.getPrimaryService(SERVICE); 
            })
            .then((service: any) => { 
              return service.getCharacteristic(WRITE); 
            })
            .then((characteristic: any) => { 
              return this.printCharacteristic = characteristic;
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
                .line(leftAlignText(articlesState.title1, 12))
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
                .line(leftAlignText(articlesState.title2, 12))
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
            .line('Qté  Article        Prix')
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
            const price = rightAlignNumber(article.price, 6, 2);
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

// 4   12    1
// 3   16    1.5   3
// 2   24    2
// 1   48    4     9 6
        lines.push(encoder
            .newline()
            .newline()
            .newline()
            .encode());
        try {
            for (const line of lines) {
                await this.printCharacteristic.writeValue(line);
            }
        }
        catch (err: any) {
            displayError(err.message);
        }
    }
}

const displayMessage = (message: string) : void => {
    toast.info(message, { theme: "dark" });
};

const displayError = (message: string) : void => {
  toast.error(message, { theme: "colored" });
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

    return (
        <>
        <div className="total-area">
          <div className="p-1 textBox">
              <strong>Prix</strong>
          </div>  
        </div>          
        <div className="flex-fill main-area" style={{backgroundColor: "#222"}}>
          <div className="d-flex flex-column">
              {articlesState.articles.map((p) => (
                  <div key={p.name} className={`d-flex`}>
                      <div className="m-1 imgBox">
                          <img className="" src={`assets/${p.image}`}/>
                      </div>
                      <div className="m-1 buttonBox">
                          <button className="btn btn-primary bg-gradient rounded-0" onClick={_ => articlesDispatch({ type: 'increate_price', name: p.name }) }>
                              <i className="bi bi-plus bigIcon"></i>
                          </button>
                      </div>
                      <div className="m-1 bg-dark bg-gradient textBox priceBox">
                          <strong>{p.price.toFixed(2)}</strong>
                      </div>
                      <div className="m-1 buttonBox">
                          <button className="btn btn-primary bg-gradient rounded-0" onClick={_ => articlesDispatch({ type: 'decreate_price', name: p.name }) }>
                              <i className="bi bi-dash bigIcon"></i>
                          </button>
                      </div>
                      <div className="m-1 buttonBox">
                          <button className={"btn bg-gradient rounded-0 " + (p.visible ? "btn-success" : "btn-secondary")} onClick={_ => articlesDispatch({ type: 'toggle_visibility', name: p.name }) }>
                              { p.visible ? <i className="bi bi-check"></i> : <i className="bi bi-x"></i> }
                          </button>
                      </div>
                      <div className="m-1 bg-dark bg-gradient textBox bigTextBox">
                          <div className="ms-2">{p.name}</div>
                      </div>
                  </div>
              ))}
          </div>
        </div>
        </>
    );
}