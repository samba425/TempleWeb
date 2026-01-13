import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <app-navbar *ngIf="!isAdminRoute"></app-navbar>
    <router-outlet></router-outlet>
    <app-footer *ngIf="!isAdminRoute"></app-footer>
    <button 
      *ngIf="showScrollButton" 
      class="scroll-to-top" 
      (click)="scrollToTop()"
      mat-fab
      color="primary"
      aria-label="Scroll to top">
      <mat-icon>keyboard_arrow_up</mat-icon>
    </button>
  `,
  styles: [`
    .scroll-to-top {
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 999;
      background: linear-gradient(135deg, #d4975f, #ffd89b) !important;
      color: #1a1612 !important;
      box-shadow: 0 4px 20px rgba(212, 151, 95, 0.4);
      transition: all 0.3s ease;
      animation: fadeInUp 0.3s ease;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 30px rgba(212, 151, 95, 0.6);
      }

      mat-icon {
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
      }
    }

    @media (max-width: 768px) {
      .scroll-to-top {
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;

        mat-icon {
          font-size: 1.5rem;
          width: 1.5rem;
          height: 1.5rem;
        }
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class AppComponent {
  title = 'UTTHARANDHRA SABARIMALA';
  showScrollButton = false;
  isAdminRoute = false;

  constructor(private router: Router) {
    // Check if current route is admin
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isAdminRoute = event.url.startsWith('/admin');
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollButton = window.pageYOffset > 300;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
