import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment.development';
import { type GiphyResponse } from '../interfaces/giphy';
import { Gif } from '../interfaces/gif';
import { GifMapper } from '../mapper/gif-mapper';
import { map, Observable, tap } from 'rxjs';

const loadHistoryFromLocalStorage = (): Record<string, Gif[]> => {
  const history = localStorage.getItem('search-history');

  if (history) {
    return JSON.parse(history) ?? [];
  }
  return {};
}

@Injectable({providedIn: 'root'})
export class GifsApi {
  private http = inject(HttpClient);
  public trendingGifs = signal<Gif[]>([]);
  private trendingGifsLoading = signal(false);
  private trendingPage = signal(0);
  private searchHistory = signal<Record<string, Gif[]>>(loadHistoryFromLocalStorage());
  public searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  public trendingGifGroup = computed(() => {
    const groups = [];

    for (let i = 0; i < this.trendingGifs().length; i += 3) {
      groups.push(this.trendingGifs().slice(i, i + 3));
    }

    return groups;
  });

  constructor(){
    this.loadTrendingGifs();
  }

  public loadTrendingGifs(): void {
    if (this.trendingGifsLoading()) return;

    this.trendingGifsLoading.set(true);

    this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 20,
        offset: this.trendingPage() * 20
      }
    }).subscribe(resp => {
      const newGifs = GifMapper.mapGiphyItemsToGifArray(resp.data);

      this.trendingGifs.update(currentGifs => [...currentGifs, ...newGifs]);
      this.trendingGifsLoading.set(false);
      this.trendingPage.update(page => page + 1);
    });
  }

  public searchGifs(query: string): Observable<Gif[]> {
    const key = query.toLowerCase();

    return this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
      params: {
        api_key: environment.giphyApiKey,
        q: query,
        limit: 20
      }
    }).pipe(
      map(resp => GifMapper.mapGiphyItemsToGifArray(resp.data)),
      tap(items => {
        this.searchHistory.update(h => ({...h, [key]: items}))
      })
    )
  }

  public getHistoryGifs(query: string): Gif[] {
    return this.searchHistory()[query] ?? [];
  }

  protected saveHistoryToLocalStorage = effect(() => {
    localStorage.setItem('search-history', JSON.stringify(this.searchHistory()));
  })
}
