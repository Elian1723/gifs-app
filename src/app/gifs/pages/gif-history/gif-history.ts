import { Component, computed, inject, input } from '@angular/core';
import { GifsApi } from '../../services/gifsApi';
import { GifList } from "../../components/gif-list/gif-list";

@Component({
  selector: 'app-gif-history',
  imports: [GifList],
  templateUrl: './gif-history.html',
})
export default class GifHistory {
  protected query = input.required<string>()
  protected gifsApi = inject(GifsApi);

  protected gifsByKey = computed(() => this.gifsApi.getHistoryGifs(this.query()));
}
