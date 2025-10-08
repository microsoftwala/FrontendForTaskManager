// auth-gaurd-guard.ts
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './authService/auth-service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private api: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.api.getToken();
    const role = this.api.getRole(); 
    const url = state.url;

    if (!token) {
      this.router.navigate(['/auth']);
      return false;
    }

    if (url.startsWith('/admin') && role !== 'admin') {
      this.router.navigate(['/user']);
      return false;
    }

    if (url.startsWith('/user') && role !== 'user') {
      this.router.navigate(['/admin']);
      return false;
    }

    return true;
  }
}
