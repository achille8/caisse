import { Dispatch, createContext, useContext, useEffect } from 'react';
import type { State, Action, Article } from '../types';
import { usePersistedReducer } from '../hooks/usePersistedReducer';
import { fetchArticles } from '../services/articleService';

const storageKey = 'Articles';

const initialState: State = {
  title1: '****************',
  title2: '****************',
  articles: [],
};

export const articlesReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'initialize':
      return {
        ...state,
        articles: action.articles.map((a: Article) => ({
          ...a,
          image: `assets/${a.image}`,
          quantity: 0,
          visible: true,
        })),
      };
    case 'add_article':
      return {
        ...state,
        articles: [
          ...state.articles,
          { name: action.name, image: action.image, visible: true, quantity: 0, price: 0 },
        ],
      };
    case 'remove_article':
      return { ...state, articles: state.articles.filter(a => a.name !== action.name) };
    case 'toggle_visibility':
      return {
        ...state,
        articles: state.articles.map(a => a.name === action.name ? { ...a, visible: !a.visible } : a),
      };
    case 'increate_quantity':
      return {
        ...state,
        articles: state.articles.map(a => a.name === action.name ? { ...a, quantity: a.quantity + 1 } : a),
      };
    case 'decreate_quantity':
      return {
        ...state,
        articles: state.articles.map(a =>
          a.name === action.name ? { ...a, quantity: Math.max(0, a.quantity - 1) } : a
        ),
      };
    case 'increate_price':
      return {
        ...state,
        articles: state.articles.map(a => a.name === action.name ? { ...a, price: a.price + 0.05 } : a),
      };
    case 'decreate_price':
      return {
        ...state,
        articles: state.articles.map(a =>
          a.name === action.name ? { ...a, price: Math.max(0, a.price - 0.05) } : a
        ),
      };
    case 'move_up': {
      const idx = state.articles.findIndex(a => a.name === action.name);
      if (idx <= 0) return state;
      const arr = [...state.articles];
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      return { ...state, articles: arr };
    }
    case 'move_down': {
      const idx = state.articles.findIndex(a => a.name === action.name);
      if (idx < 0 || idx >= state.articles.length - 1) return state;
      const arr = [...state.articles];
      [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      return { ...state, articles: arr };
    }
    case 'clear':
      return { ...state, articles: state.articles.map(a => ({ ...a, quantity: 0 })) };
    case 'set_title1':
      return { ...state, title1: action.title1 };
    case 'set_title2':
      return { ...state, title2: action.title2 };
    case 'print_ticket':
      return state;
  }
};

interface ArticleContextValue {
  articlesState: State;
  articlesDispatch: Dispatch<Action>;
}

export const ArticleContext = createContext<ArticleContextValue>({
  articlesState: initialState,
  articlesDispatch: () => null,
});

export const useArticleContext = () => useContext(ArticleContext);

export const ArticleProvider = ({ children }: { children: React.ReactNode }) => {
  const [articlesState, articlesDispatch] = usePersistedReducer(articlesReducer, initialState, storageKey);

  useEffect(() => {
    if (articlesState.articles.length !== 0) return;
    fetchArticles().then(articles => {
      articlesDispatch({ type: 'initialize', articles });
    });
  }, []);

  return (
    <ArticleContext.Provider value={{ articlesState, articlesDispatch }}>
      {children}
    </ArticleContext.Provider>
  );
};
