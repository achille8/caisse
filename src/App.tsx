import { useObservableState } from "observable-hooks";
import { AppCommand, ArticleProvider, ArticleUpdateCommand, useArticleContext } from "./store";
import {
    Route,
    Link,
    useParams,
    BrowserRouter as Router,
    Routes,
    Outlet
} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

/* https://stackoverflow.com/questions/68076831/react-router-full-page-for-nested-route */
function App() {
    return (
      <Router>
        <Routes>
          <Route path="*" element={ <ItemsList/> } />
          <Route path="tabs" element={ <TabMenu /> }>
            <Route path="tab1" element={ <Link to="/tabs"> RETURN </Link> } />
            <Route path="tab2" element={ <Tab2 /> } />
            <Route path="*"    element={ <Tab3 /> } />
          </Route>
          <Route path="details/elements/:elementNumber" element={ <ElementDetails /> }/>
        </Routes>
      </Router>
    );
}
  
const ItemsList = () => {    
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

const TotalLine = () => {
    const { articleList$ } = useArticleContext();
    const list = useObservableState(articleList$, []);
    const total = list.reduce((a, x) => a + x.quantity * x.price, 0);

    return (
    <div className="m-1 textBox">
        <strong>Total: {total} €</strong>
    </div>
    );
};

// const Search = () => {
//     const { search$ } = useArticle();

//     return (
//         <div>
//             <input type="text" onChange={(e) => search$.next(e.target.value)} />
//         </div>
//     );
// };

const Deck = () => {
    const { articleList$, updateArticle$ } = useArticleContext();
    const list = useObservableState(articleList$, []);
    return (
    <div className="d-flex flex-column">
        {list.map((p) => (
            <div key={p.name} className={`d-flex`}>
                <div className="m-1 imgBox">
                    <img className="" src={`assets/${p.image}`}/>
                </div>
                <div className="m-1 buttonBox">
                    <button className="btn btn-primary bg-gradient rounded-0" onClick={_ => updateArticle$.next({ name: p.name, increaseQuantity: true } as ArticleUpdateCommand) }>
                        <i className="bi bi-plus bigIcon"></i>
                    </button>
                </div>
                <div className="m-1 bg-dark bg-gradient textBox quantityBox">
                    <strong>{p.quantity === 0 ? '' : p.quantity}</strong>
                </div>
                <div className="m-1 buttonBox">
                    <button className="btn btn-primary rounded-0" onClick={_ => updateArticle$.next({ name: p.name, decreaseQuantity: true } as ArticleUpdateCommand) }>
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
    const { appCommand$ } = useArticleContext();
    const notify = (message: string) => toast(message, { theme: "dark" });
    return (
    <div className="d-flex flex-column">
        <div className="m-1 buttonBox">
            <button className="btn btn-primary bg-gradient rounded-0" onClick={_ => appCommand$.next({ name: 'print' } as AppCommand) }>
                <i className="bi bi-printer-fill"></i>
            </button>
        </div>
        <button onClick={_ => notify("Wow so easy 3!")}>Notify!</button>
        <button onClick={_ => xxx()}>FILE</button>
        <ToastContainer />
    </div>
    );
};

const xxx = async () => {
    const root = await navigator.storage.getDirectory();
    const fileHandle = await root.getFileHandle('Untitled.txt', { create: true });
    const dirHandle = await root.getDirectoryHandle('New Folder', { create: true });
    await root.removeEntry('Old Stuff', { recursive: true });
    const file = await fileHandle.getFile();
    const url = URL.createObjectURL(file);
    console.log(dirHandle, url);
    //img.src = url;
}

const TabMenu = () => (
    <>
      <Link to="/tabs/tab1">Tab1</Link>&nbsp;
      <Link to="/tabs/tab2">Tab2</Link>&nbsp;
      <Link to="/tabs/tab3">Tab3</Link>
      <br />
      <Outlet/>
    </>
);
 
const Tab2 = () => {
    return (
      <>
        <h1> Tab 2 </h1>
        <Link to="/details/elements/2"> Goto Details 2</Link>
      </>
    );
};

const Tab3 = () => {
    return (
      <>
        <h1> Tab 3 </h1>
        <Link to="/details/elements/3"> Goto Details 3</Link>
      </>
    );
};
  
function ElementDetails() {
    let { elementNumber } = useParams();
    return (
      <>
        <p>
          Element Details {elementNumber}{" "}
        </p>
        <Link to="/"> Start Over </Link>
      </>
    );
}
  
export default App;
 