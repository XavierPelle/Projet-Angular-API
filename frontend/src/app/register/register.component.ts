import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true

})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  constructor(private authService: AuthService) {}

  register(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.authService.register(this.email, this.password).subscribe({
      next: () => {
        this.successMessage = 'Inscription réussie. Vous pouvez maintenant vous connecter.';
        this.errorMessage = '';
      },
      error: (error: any) => {
        this.errorMessage = 'Erreur lors de l\'inscription : ' + error.error.message;
        this.successMessage = '';
      },
    });
  }
}
