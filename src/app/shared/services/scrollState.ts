import { Injectable, signal } from '@angular/core';

@Injectable({providedIn: 'root'})
export class ScrollState {
  public trendingScrollState = signal(0);
}
