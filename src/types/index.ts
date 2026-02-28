export type Article = {
  name: string;
  image: string;
  visible: boolean;
  quantity: number;
  price: number;
};

export interface State {
  title1: string;
  title2: string;
  articles: Article[];
}

export type Action =
  | { type: 'initialize'; articles: Article[] }
  | { type: 'add_article'; name: string; image: string }
  | { type: 'remove_article'; name: string }
  | { type: 'toggle_visibility'; name: string }
  | { type: 'increate_quantity'; name: string }
  | { type: 'decreate_quantity'; name: string }
  | { type: 'increate_price'; name: string }
  | { type: 'decreate_price'; name: string }
  | { type: 'print_ticket' }
  | { type: 'set_title1'; title1: string }
  | { type: 'set_title2'; title2: string }
  | { type: 'clear' };
