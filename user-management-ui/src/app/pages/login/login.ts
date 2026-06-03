import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  // Login formundaki iki alanı burada tutuyor.
  loginData = {
    username: '',
    password: ''
  };

  errorMessage = '';

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  onLogin() {
    this.errorMessage = '';

    // Giriş başarılı olursa kullanıcı listesi ekranına geçiyor.
    this.api.login(this.loginData).subscribe({
      next: () => {
        this.router.navigate(['/users']);
      },
      error: () => {
        this.errorMessage = 'Giriş başarısız! Kullanıcı adı veya şifre hatalı.';
      }
    });
  }
}
