import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../userService/user-service';

@Component({
  selector: 'app-password-reset-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './password-reset-component.html',
  styleUrl: './password-reset-component.css',
})
export class PasswordResetComponent {
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  message = '';
  id: number = 0;

  constructor(private userService: UserService) {}

  ngOnInit() {
    const storedId = sessionStorage.getItem('id');
    this.id = storedId ? Number(storedId) : 0;
  }

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.message = 'New passwords do not match!';
      return;
    }

    this.userService.updateUserPassword(this.id, this.confirmPassword).subscribe({
      next: (res: any) => {
        this.message = res.message;
        console.log('Message After Update:', this.message);
      },
      error: (err) => console.log('Error Updating in password', err),
    });
  }
}
