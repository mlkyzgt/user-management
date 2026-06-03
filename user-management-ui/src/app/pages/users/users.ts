import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, User, UserPayload } from '../../services/api';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html'
})
export class UsersComponent implements OnDestroy {

  // Ekranda kullandığım liste, seçili kullanıcı ve form durumları.
  users: User[] = [];
  selectedUser: User | null = null;
  errorMessage = '';
  successMessage = '';
  notification: { type: 'success' | 'error'; message: string } | null = null;
  isEditing = false;
  isLoadingUsers = false;
  searchTerm = '';
  roleFilter = 'ALL';
  private notificationTimeout: ReturnType<typeof setTimeout> | null = null;

  formData: UserPayload = this.getEmptyForm();

  constructor(
    private api: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.loadUsers();
  }

  ngOnDestroy() {
    // Sayfadan çıkarken açık kalan bildirim zamanlayıcısı varsa temizlenir.
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }
  }

  get currentUser() {
    return this.api.getCurrentUser();
  }

  get isAdmin() {
    return this.api.isAdmin();
  }

  get filteredUsers() {
    const search = this.searchTerm.trim().toLowerCase();

    // Arama ve rol filtresi aynı anda uygulanıyor.
    return this.users.filter((user) => {
      const username = user.username?.toLowerCase() ?? '';
      const fullName = user.full_name?.toLowerCase() ?? '';

      const matchesSearch =
        !search ||
        username.includes(search) ||
        fullName.includes(search) ||
        String(user.id).includes(search);

      const matchesRole = this.roleFilter === 'ALL' || user.role === this.roleFilter;

      return matchesSearch && matchesRole;
    });
  }

  loadUsers() {
    this.errorMessage = '';
    this.isLoadingUsers = true;

    // Sayfa açıldığında ve işlemlerden sonra kullanıcı listesini tekrar çekiyor.
    this.api.getUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.isLoadingUsers = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoadingUsers = false;
        this.showNotification('error', this.getErrorMessage(err, 'Kullanıcı listesi alınamadı.'));
        this.cdr.detectChanges();
      }
    });
  }

  showDetails(user: User) {
    if (!this.isAdmin) {
      return;
    }

    // Detay endpointi sadece admin için açık olduğu için kontrolü burada da yaptım.
    this.api.getUser(user.id).subscribe({
      next: (res) => {
        this.selectedUser = res;
        this.showNotification('success', 'Kullanıcı detayı getirildi.');
      },
      error: (err) => {
        this.showNotification('error', this.getErrorMessage(err, 'Kullanıcı detayı alınamadı.'));
      }
    });
  }

  startCreate() {
    this.isEditing = false;
    this.selectedUser = null;
    this.formData = this.getEmptyForm();
    this.clearMessages();
  }

  startEdit(user: User) {
    this.isEditing = true;
    this.selectedUser = user;

    // Şifre boş bırakılırsa backend mevcut şifreyi koruyor.
    this.formData = {
      username: user.username,
      password: '',
      full_name: user.full_name,
      role: user.role
    };
    this.clearMessages();
  }

  saveUser() {
    this.clearMessages();

    // Frontend tarafında basit zorunlu alan kontrolü.
    if (!this.formData.username || !this.formData.full_name || !this.formData.role) {
      this.showNotification('error', 'Kullanıcı adı, ad-soyad ve rol zorunludur.');
      return;
    }

    if (!this.isEditing && !this.formData.password) {
      this.showNotification('error', 'Yeni kullanıcı için şifre zorunludur.');
      return;
    }

    if (this.isEditing && this.selectedUser) {
      const payload = { ...this.formData };

      // Güncellemede şifre girilmediyse payload içinden çıkarıyor.
      if (!payload.password) {
        delete payload.password;
      }

      this.api.updateUser(this.selectedUser.id, payload).subscribe({
        next: () => {
          this.startCreate();
          this.showNotification('success', 'Kullanıcı güncellendi.');
          this.loadUsers();
        },
        error: (err) => {
          this.showNotification('error', this.getErrorMessage(err, 'Kullanıcı güncellenemedi.'));
        }
      });

      return;
    }

    this.api.createUser(this.formData).subscribe({
      next: () => {
        this.startCreate();
        this.showNotification('success', 'Kullanıcı eklendi.');
        this.loadUsers();
      },
      error: (err) => {
        this.showNotification('error', this.getErrorMessage(err, 'Kullanıcı eklenemedi.'));
      }
    });
  }

  deleteUser(user: User) {
    // Yanlışlıkla silmeyi engellemek için kullanıcıdan onay alıyor.
    const confirmed = confirm(`${user.username} kullanıcısı silinsin mi?`);

    if (!confirmed) {
      return;
    }

    this.clearMessages();

    this.api.deleteUser(user.id).subscribe({
      next: () => {
        this.showNotification('success', 'Kullanıcı silindi.');
        this.loadUsers();
      },
      error: (err) => {
        this.showNotification('error', this.getErrorMessage(err, 'Kullanıcı silinemedi.'));
      }
    });
  }

  logout() {
    this.api.logout();
    this.router.navigate(['/login']);
  }

  clearFilters() {
    this.searchTerm = '';
    this.roleFilter = 'ALL';
  }

  exportToExcel() {
    const users = this.filteredUsers;

    if (users.length === 0) {
      this.showNotification('error', 'Dışa aktarılacak kullanıcı bulunamadı.');
      return;
    }

    // Excel'e ekrandaki filtrelenmiş kullanıcı listesini aktarıyor.
    const rows = users.map((user) => `
      <tr>
        <td>${this.escapeExcelCell(user.id)}</td>
        <td>${this.escapeExcelCell(user.username)}</td>
        <td>${this.escapeExcelCell(user.full_name)}</td>
        <td>${this.escapeExcelCell(user.role)}</td>
      </tr>
    `).join('');

    const workbook = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:x="urn:schemas-microsoft-com:office:excel"
            xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="UTF-8" />
          <style>
            table { border-collapse: collapse; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 12px; }
            th { background: #f1f5f9; font-weight: 700; }
          </style>
        </head>
        <body>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Kullanıcı Adı</th>
                <th>Ad-Soyad</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([workbook], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `kullanicilar-${new Date().toISOString().slice(0, 10)}.xls`;
    link.click();
    URL.revokeObjectURL(url);

    this.showNotification('success', `${users.length} kullanıcı Excel dosyasına aktarıldı.`);
  }

  private getEmptyForm(): UserPayload {
    return {
      username: '',
      password: '',
      full_name: '',
      role: 'USER'
    };
  }

  private clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private showNotification(type: 'success' | 'error', message: string) {
    this.notification = { type, message };

    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }

    this.notificationTimeout = setTimeout(() => {
      this.notification = null;
      this.notificationTimeout = null;
      this.cdr.detectChanges();
    }, 3200);
  }

  private getErrorMessage(error: any, fallback: string): string {
    const backendMessage = error?.error?.message;

    if (Array.isArray(backendMessage)) {
      return `${fallback} ${backendMessage.join(' ')}`;
    }

    if (typeof backendMessage === 'string') {
      return `${fallback} ${backendMessage}`;
    }

    return fallback;
  }

  private escapeExcelCell(value: string | number): string {
    // Excel çıktısında özel karakterler tabloyu bozmasın diye temizliyor.
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
