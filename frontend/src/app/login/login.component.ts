import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  login(): void {
    console.log("test");
    if (this.loginForm.valid) {
      console.log('test2')
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe(
        (response:any) => {
          this.authService.saveToken(response.token);
          //this.router.navigate(['/account']);
          console.log("ares connexion")
        },
        (error:any) => {
          console.error('Erreur de connexion', error);
        }
      );
    }
  }
  
  toRegister(): void {
    this.router.navigate(['/register']);
  }
}
