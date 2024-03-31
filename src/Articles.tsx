import { Dispatch, createContext, useContext, useEffect, useReducer } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import * as EscPosEncoder from './esc-pos-encoder';
//import * as EscPosEncoder from module("./esc-pos-encoder'");
//var xxx = require('esc-pos-encoder');

type Article = {
    name: string,
    image: string,
    visible: boolean,
    quantity: number,
    price: number
};

interface State {
  articles: Article[]
}

type Action =
    | { type: 'initialize', articles: Article[] }
    | { type: 'add_article', name: string; image: string }
    | { type: 'toggle_visibility', name: string }
    | { type: 'increate_quantity', name: string }
    | { type: 'decreate_quantity', name: string }
    | { type: 'print_ticket' }

const articlesReducer = (state: State, action: Action): State => {    
  switch (action.type) {
    case 'initialize':
      return {
        ...state,
        articles: action.articles,
    };
    case 'add_article':
      return {
        ...state,
        articles: [
          ...state.articles,
          { name: action.name, image: action.image, visible: true, quantity: 0 , price: 0 },
        ],
    };
    case 'toggle_visibility':
      return {
        ...state,
        articles: state.articles.map((article) =>
          article.name === action.name
            ? { ...article, visible: !article.visible }
            : article,
        ),
    };
    case 'increate_quantity':
    case 'decreate_quantity':
        const delta = action.type === 'decreate_quantity' ? -1 : 1;
        return {
            ...state,
            articles: state.articles.map((article) =>
                article.name === action.name ? { ...article, quantity: article.quantity + delta } : article,
        ),
    };    
    case 'print_ticket':
        return state;
  }
};

// https://dev.to/elisealcala/react-context-with-usereducer-and-typescript-4obm
const initialState: State = { articles: [] };

const ArticleContext = createContext<{ articlesState: State; articlesDispatch: Dispatch<Action>; }>({ articlesState: initialState, articlesDispatch: () => null });

export const useArticleContext = () => useContext(ArticleContext);

const getArticles = async (): Promise<Article[]> => {
    const response = await fetch("prices.json");
    const data = await response.json();
    return data.map((x: Article) => ({ ...x, quantity: 0, selected: false }))
};

export const App = () => {
    return (
        <div className="App">
          <header className="xxxcontainer-fluid">
            <div className="">
              <Routes>          
                <Route path="/" element={<ArticleXXX />} />
                <Route path="/xxx" element={<ArticleXXX />} />
              </Routes>
            </div>
          </header>
        </div>
    );
};

export const ArticleXXX = () => {
    return (
        <ArticleProvider>
            <div className="">
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
        </ArticleProvider>
    );
}

const ArticleProvider = ({ children }: any) => {   
    const [articlesState, articlesDispatch] = useReducer(articlesReducer, initialState);

    useEffect(() => {   
        const get = async () => {
            const articles = await getArticles();
            console.log('getArticles');
            articlesDispatch({ type: 'initialize', articles: articles });
        };
        get();      
        // return () => {};
    }, []);   

    return (
        <ArticleContext.Provider value={{ articlesState, articlesDispatch }}>
            {children}
        </ArticleContext.Provider>
    );
};


const TotalLine = () => {
    const { articlesState } = useContext(ArticleContext);
    const total = articlesState.articles.reduce((a, x) => a + x.quantity * x.price, 0);

    return (
        <div className="m-1 textBox">
            <strong>Total: {total} €</strong>
        </div>
    );
};

const Deck = () => {
    const { articlesState, articlesDispatch } = useContext(ArticleContext);

    return (
        <div className="d-flex flex-column">
            { articlesState.articles.map((p) => (
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
    const notify = (message: string) => toast(message, { theme: "dark" });
    return (
        <div className="d-flex flex-column">
            <div className="m-1 buttonBox">
                {/* <button className="btn btn-primary bg-gradient rounded-0" onClick={_ => appCommand$.next({ name: 'print' } as AppCommand) }> */}
                <button className="btn btn-primary bg-gradient rounded-0" onClick={_ => print() }>
                    <i className="bi bi-printer-fill"></i>
                </button>
            </div>
            <button onClick={_ => notify("Wow so easy 3!")}>Notify!</button>
            <ToastContainer />
        </div>
    );
};

const print = () => {
	
    var SERVICE = '000018f0-0000-1000-8000-00805f9b34fb';
    var WRITE   = '00002af1-0000-1000-8000-00805f9b34fb';   
    
    // https://github.com/NielsLeenheer/EscPosEncoder/blob/master/README.md
        let encoder: any = new EscPosEncoder.default({
            width: 42
        });
    
        let array01 = encoder
            .raw([ 0x1c, 0x2e ])
            .codepage('cp437')
            .encode();
    
        let array02 = encoder
            .width(4)
            .height(4)
            .line('123456789012')
            .width(3)
            .height(3)
            .line('1234567890123456')
            .encode();
    
        let array03 = encoder
            .width(2)
            .height(2)
            .line('123456789012345678901234')
            .width(1)
            .height(1)	
            .line('123456789012345678901234567890123456789012345678')
            .encode();
    
        let array04 = encoder
            .size('normal')
            .line('123456789012345678901234567890123456789012345678') //ok
            .encode();
    
        let array05 = encoder
            .size('small')
            .line('123456789012345678901234567890123456789012345678901234567890123')
            .size('normal')
            .newline()
            .newline()
            .newline()
            .encode();
        
        let nav: any = window.navigator;
        let printCharacteristic: any = null;

        if (printCharacteristic == null) {
            nav.bluetooth.requestDevice({ filters: [{ services: [SERVICE] }] })
                .then((device: any) => device.gatt.connect())
                .then((server: any) => server.getPrimaryService(SERVICE))
                .then((service: any) => service.getCharacteristic(WRITE))
                .then((characteristic: any) => printCharacteristic = characteristic)
                .then(() => {
                    printCharacteristic.writeValue(array01)
                        .then(() => printCharacteristic.writeValue(array02))
                        .then(() => printCharacteristic.writeValue(array03))
                        .then(() => printCharacteristic.writeValue(array04))
                        .then(() => printCharacteristic.writeValue(array05))
                    ;
                })
                .catch((err: any) => alert(err));
        }
        else {
            printCharacteristic.writeValue(array01)
                .then(() => printCharacteristic.writeValue(array02))
                .then(() => printCharacteristic.writeValue(array03))
                .then(() => printCharacteristic.writeValue(array04))
                .then(() => printCharacteristic.writeValue(array05))
            ;
        }
};
