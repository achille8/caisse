import { createContext, useContext } from "react";
import { BehaviorSubject, map, combineLatestWith, ReplaySubject, shareReplay } from "rxjs";

export interface Article {
  name: string;
  image: string;
  price: number;
  quantity: number;
  selected: boolean;
}

export interface ArticleUpdateCommand {
    name: string;
    selected: null | boolean;
    increaseQuantity: null | boolean;
    decreaseQuantity: null | boolean;
}

export interface AppCommand {
    name: string;
}

const rawArticleList$ = new BehaviorSubject<Article[]>([]);

const updateArticle$ = new BehaviorSubject<ArticleUpdateCommand>({} as ArticleUpdateCommand);

const appCommand$ = new ReplaySubject<AppCommand>();

appCommand$.subscribe((xxx) =>
    {
        console.log('appCommand$', xxx);
    }
);

const articleList$ = rawArticleList$.pipe(
    combineLatestWith(updateArticle$),
    map(([articleList, articleUpdateCommand]) => {
        let article = articleList.find(x => x.name === articleUpdateCommand.name);
        if (article && articleUpdateCommand.increaseQuantity) {
            article.quantity++;
        }
        else if (article && articleUpdateCommand.decreaseQuantity) {
            article.quantity = article.quantity === 0 ? 0 : article.quantity - 1;
        }
        else if (article && articleUpdateCommand.selected) {
            article.selected = ! article.selected;
        }
        return articleList.map(x => x); // mute array to trigger UI refresh
    }),
    shareReplay(1)
);

const ArticleContext = createContext({
    articleList$,
    updateArticle$,
    appCommand$
});

export const useArticleContext = () => useContext(ArticleContext);

export const ArticleProvider = ({ children }: any) => (
  <ArticleContext.Provider
    value={{
        articleList$,
        updateArticle$,
        appCommand$
    }}
  >
    {children}
  </ArticleContext.Provider>
);

fetch("prices.json")
    .then(res => res.json())
    .then(data => data.map((x: Article) => ({ ...x, quantity: 0, selected: false })))
    .then(data => rawArticleList$.next(data));