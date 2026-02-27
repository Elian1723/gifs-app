import { AfterViewInit, Component, ElementRef, inject, viewChild } from '@angular/core';
import { GifsApi } from '../../services/gifsApi';
import { ScrollState } from 'src/app/shared/services/scrollState';

@Component({
  selector: 'app-trending-page',
  templateUrl: './trending-page.html',
})
export default class TrendingPage implements AfterViewInit {
  protected gifsApi = inject(GifsApi);
  protected scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('scrollDiv');
  protected scrollState = inject(ScrollState);

  protected onScroll(event: Event): void {
    const scrollDiv = this.scrollDivRef()?.nativeElement;

    if (!scrollDiv) return;

    const scrollTop = scrollDiv.scrollTop;
    const clientHigh = scrollDiv.clientHeight;
    const scrollHigh = scrollDiv.scrollHeight;

    const isAtBottom = scrollTop + clientHigh + 300 >= scrollHigh;
    this.scrollState.trendingScrollState.set(scrollTop);

    if (isAtBottom) {
      this.gifsApi.loadTrendingGifs();
    }
  }

  ngAfterViewInit(): void {
    const scrollDiv = this.scrollDivRef()?.nativeElement;

    if (!scrollDiv) return;

    scrollDiv.scrollTop = this.scrollState.trendingScrollState();
  }
}
