import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { timer } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [],
})
export class LoginComponent implements OnInit {
  isLoading: boolean = false;
  loginFormData!: FormGroup;

  constructor() {}

  ngOnInit() {
    this.loginFormData = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(8)],
      }),
    });
  }



  onLoginClicked() {
    this.isLoading = true
    console.log(this.loginFormData.value);
    setInterval(() =>  {
      this.isLoading=false;
    }, 600)

  }
}
