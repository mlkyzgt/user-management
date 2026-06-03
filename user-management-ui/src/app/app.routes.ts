import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { UsersComponent } from './pages/users/users';
import { authGuard } from './auth-guard';

// Sayfa geçişleri burada tanımlı. Kullanıcı ekranı token olmadan açılmıyor.
export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UsersComponent, canActivate: [authGuard] }
];
