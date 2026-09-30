import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { TokenStorageService } from '../../services/token-storage';

@Component({
  selector: 'app-login-page',
  standalone: false,
  styleUrl: './login-page.css',
  templateUrl: './login-page.html',
})
export class LoginPageComponent {
  form = { username: '', password: '' };
  error = '';
  constructor(private auth: AuthService, private tokenStorage: TokenStorageService, private router: Router, private cd: ChangeDetectorRef) {}

  onSubmit() {
    this.auth.login(this.form.username, this.form.password).subscribe({
      next: d => {
        this.tokenStorage.saveToken(d.id_token);
        this.tokenStorage.saveUser(d.id, d.userName);
        this.router.navigate(['/']);
      },
      error: () => { this.error = 'Invalid credentials. Try again, player.'; this.cd.markForCheck(); }
    });
  }
}
