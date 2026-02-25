import { Component, inject, signal } from '@angular/core';
import { GifList } from "../../components/gif-list/gif-list";
import { GifsApi } from '../../services/gifsApi';
import { Gif } from '../../interfaces/gif';

@Component({
  selector: 'app-search-page',
  imports: [GifList],
  templateUrl: './search-page.html',
})
export default class SearchPage {
  protected gifApi = inject(GifsApi);
  protected gifs = signal<Gif[]>([]);

  protected onSearch(query: string){
    this.gifApi.searchGifs(query).subscribe(resp => {
      this.gifs.set(resp);
    });
  }
}
