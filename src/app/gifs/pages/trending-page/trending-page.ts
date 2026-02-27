import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { GifsApi } from '../../services/gifsApi';

@Component({
  selector: 'app-trending-page',
  templateUrl: './trending-page.html',
})
export default class TrendingPage {
  protected gifsApi = inject(GifsApi);
  protected scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('scrollDiv');

  protected onScroll(event: Event): void {
    const scrollDiv = this.scrollDivRef()?.nativeElement;

    if (!scrollDiv) return;

    const scrollTop = scrollDiv.scrollTop;
    const clientHigh = scrollDiv.clientHeight;
    const scrollHigh = scrollDiv.scrollHeight;

    const isAtBottom = scrollTop + clientHigh + 300 >= scrollHigh;

    if (isAtBottom) {
      this.gifsApi.loadTrendingGifs();
    }
  }
}
