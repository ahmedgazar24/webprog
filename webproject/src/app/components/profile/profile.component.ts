import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  profileForm: FormGroup;
  editing = false;
  savedMessage = '';

  constructor(private fb: FormBuilder) {
    let saved = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      saved = JSON.parse(localStorage.getItem('app_profile') || 'null');
    }
    const initial = saved || { fullName: 'John Doe', email: 'johndoe@example.com', phone: '', address: '' };
    this.profileForm = this.fb.group({
      fullName: [initial.fullName, [Validators.required, Validators.minLength(3)]],
      email: [initial.email, [Validators.required, Validators.email]],
      phone: [initial.phone],
      address: [initial.address]
    });
  }

  toggleEdit() {
    this.editing = !this.editing;
    this.savedMessage = '';
  }

  save() {
    if (this.profileForm.valid) {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('app_profile', JSON.stringify(this.profileForm.value));
      }
      this.savedMessage = 'Profile saved locally.';
      this.editing = false;
    }
  }

  get f() { return this.profileForm.controls; }
}
