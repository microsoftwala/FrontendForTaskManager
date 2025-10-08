import { Component } from '@angular/core';
import { AuthService } from '../../authService/auth-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  username: string | null = null;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit() {
    // If logged in, get username from sessionStorage
    this.auth.username$.subscribe((name) => {
      this.username = name;
    });
  }

  logout() {
    this.auth.logout();
    this.username = null;
    this.router.navigate(['/auth']);
  }

  about() {
    this.router.navigate(['/about']);
  }
}
