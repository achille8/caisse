import { Dispatch, createContext, useContext, useEffect, useReducer } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

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
    const { articlesDispatch } = useContext(ArticleContext);

    const notify = (message: string) => toast(message, { theme: "dark" });
    return (
        <div className="d-flex flex-column">
            <div className="m-1 buttonBox">
                {/* <button className="btn btn-primary bg-gradient rounded-0" onClick={_ => appCommand$.next({ name: 'print' } as AppCommand) }> */}
                <button className="btn btn-primary bg-gradient rounded-0" onClick={_ => articlesDispatch({ type: 'print_ticket' }) }>
                    <i className="bi bi-printer-fill"></i>
                </button>
            </div>
            <button onClick={_ => notify("Wow so easy 3!")}>Notify!</button>
            <ToastContainer />
        </div>
    );
};
