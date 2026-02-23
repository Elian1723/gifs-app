import { Component, computed, signal } from '@angular/core';
import { environment } from '@environments/environment.development';

@Component({
  selector: 'gifs-side-menu-header',
  imports: [],
  templateUrl: './side-menu-header.html',
})
export class SideMenuHeader {
  protected envs = computed(() => environment);
}
