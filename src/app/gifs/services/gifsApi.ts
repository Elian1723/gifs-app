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
  private searchHistory = signal<Record<string, Gif[]>>(loadHistoryFromLocalStorage());
  public searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  constructor(){
    this.loadTrendingGifs();
  }

  public loadTrendingGifs(): void {
    this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 20
      }
    }).subscribe(resp => {
      const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
      this.trendingGifs.set(gifs);
      this.trendingGifsLoading.set(false);
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
