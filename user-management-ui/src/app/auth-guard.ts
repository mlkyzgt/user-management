import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiService } from './services/api';

// Token yoksa kullanıcıyı login ekranına geri gönderiyor.
export const authGuard: CanActivateFn = (route, state) => {
  const apiService = inject(ApiService);
  const router = inject(Router);

  if (apiService.currentUserToken()) {
    return true;
  } else {
    router.navigate(['/login']); 
    return false;
  }
};
