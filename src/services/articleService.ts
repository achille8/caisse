import type { Article } from '../types';

export async function fetchArticles(): Promise<Article[]> {
  const response = await fetch('prices.json');
  const data: Article[] = await response.json();
  return data.map(x => ({ ...x, quantity: 0, visible: true }));
}
