import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";

interface MenuOption {
  icon: string
  label: string,
  route: string,
  subLabel: string,
}

@Component({
  selector: 'gifs-side-menu-options',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-menu-options.html',
})
export class SideMenuOptions {
  protected menuOptions = signal<MenuOption[]>([
    {
      icon: 'fa-solid fa-chart-line',
      label: 'Trending',
      subLabel: 'Top gifs',
      route: '/dashboard/trending',
    },
    {
      icon: 'fa-solid fa-magnifying-glass',
      label: 'Search',
      subLabel: 'Search gifs',
      route: '/dashboard/search',
    }
  ])
}
