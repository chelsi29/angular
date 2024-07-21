import { Component, SimpleChanges } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MatTabsModule } from '@angular/material/tabs';
import { BehaviorSubject, Observable } from 'rxjs';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatIconModule, MatMenuModule, MatSidenavModule, MatListModule, RouterOutlet, MatToolbarModule, DashboardComponent, RouterModule, MatTabsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  currentUser: any
  menuOpen: boolean = false;
  sideNav: boolean = true;
  screenWidth = new BehaviorSubject<number>(window.innerWidth)
  sidenavOpened = false;
  showToggle: string | any;
  mode: string | any;
  openSidenav: boolean | any;


  constructor(private router: Router) {
    this.currentUser = localStorage.getItem('userDetails')
  }

  ngOnInit() {
    this.getScreenWidth().subscribe((width: any) => {
      if (width < 640) {
        this.showToggle = 'show';
        this.mode = 'over';
        this.openSidenav = false;
      }
      else if (width > 640) {
        this.showToggle = 'hide';
        this.mode = 'side';
        this.openSidenav = true;
      }
    });
  }



  getScreenWidth(): Observable<number> {
    return this.screenWidth.asObservable();
  }


  onSidenavChange(isOpened: boolean) {
    this.sidenavOpened = isOpened;
  }

  sideNavToggle() {
    this.sideNav = !this.sideNav
  }


  logout() {
    this.router.navigateByUrl('/login')
    localStorage.clear();
    this.currentUser = null;

  }
}