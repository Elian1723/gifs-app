import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment.development';
import { type GiphyResponse } from '../interfaces/giphy';
import { Gif } from '../interfaces/gif';
import { GifMapper } from '../mapper/gif-mapper';
import { map, Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class GifsApi {
  private http = inject(HttpClient);
  public trendingGifs = signal<Gif[]>([]);
  private trendingGifsLoading = signal(false);

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
    return this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
      params: {
        api_key: environment.giphyApiKey,
        q: query,
        limit: 20
      }
    }).pipe(
      map(({data}) => data),
      map(giphyItems => GifMapper.mapGiphyItemsToGifArray(giphyItems))
    )
  }
}
