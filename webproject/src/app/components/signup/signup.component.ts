import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  submitted = false;
  successMessage = '';

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['student', Validators.required]
    }, { validators: this.passwordsMatch });
  }

  passwordsMatch(group: FormGroup) {
    const p = group.get('password')?.value;
    const c = group.get('confirmPassword')?.value;
    return p === c ? null : { mismatch: true };
  }

  onSubmit() {
    this.submitted = true;
    this.successMessage = '';
    if (this.signupForm.valid) {
      const payload = { ...this.signupForm.value };
      delete payload.confirmPassword;
      // Simulate save - store in localStorage so component is standalone
      if (typeof window !== 'undefined' && window.localStorage) {
        const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
        users.push({ id: Date.now(), ...payload });
        localStorage.setItem('mock_users', JSON.stringify(users));
      }
      this.successMessage = 'Signup successful! You can now login.';
      this.signupForm.reset({ role: 'student' });
      this.submitted = false;
    }
  }

  get f() { return this.signupForm.controls; }
}
