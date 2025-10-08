import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../authService/auth-service';

@Component({
  selector: 'app-about-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './about-page.html',
  styleUrl: './about-page.css',
})
export class AboutPage {
  username: string | null = null;
  email: string | null = null;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    // Subscribe to username observable
    this.auth.username$.subscribe((name) => {
      this.username = name;
    });

    // Get email (assuming your AuthService has a method for it)
    this.email = this.auth.getEmail();
  }
}
