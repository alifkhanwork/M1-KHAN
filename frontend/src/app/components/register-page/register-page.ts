import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register-page',
  standalone: false,
  styleUrl: './register-page.css',
  templateUrl: './register-page.html',
})
export class RegisterPageComponent {
  form = { userName: '', password: '', firstName: '', lastName: '' };
  error = '';
  constructor(private auth: AuthService, private router: Router, private cd: ChangeDetectorRef) {}

  onSubmit() {
    this.auth.register(this.form).subscribe({
      next: () => this.router.navigate(['/login']),
      error: e => { this.error = typeof e.error === 'string' ? e.error : 'Could not register.'; this.cd.markForCheck(); }
    });
  }
}
