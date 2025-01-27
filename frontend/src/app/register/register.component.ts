import { Component } from '@angular/core';
import {FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true

})
export class RegisterComponent {
  user = {
    login: '',
    password: ''
  };
  
  onSubmit = (userForm: NgForm) => {
    console.log(userForm.value)
  }
}
