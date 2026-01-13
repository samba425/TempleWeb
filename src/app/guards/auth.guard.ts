import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    // Wait for Firebase auth to initialize
    const user = await this.authService.waitForAuth();
    
    if (user) {
      return true;
    }
    
    this.router.navigate(['/admin/login']);
    return false;
  }
}
