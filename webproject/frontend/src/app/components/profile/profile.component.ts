import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  editing = false;
  savedMessage = '';
  currentUser: any = null;
  currentUserId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private storage: StorageService
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: ['']
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.currentUserId = this.currentUser.id;
      this.loadProfile();
    }
  }

  /**
   * Load profile from local storage (user-specific)
   * Use local storage for persistent user preferences
   */
  loadProfile(): void {
    if (!this.currentUserId) return;

    const storageKey = this.storage.getUserKey(this.currentUserId, 'user_profile');
    const saved = this.storage.getLocalItem<any>(storageKey);

    // Initialize with user data or saved profile
    const initial = saved || {
      fullName: this.currentUser.name || '',
      email: this.currentUser.email || '',
      phone: '',
      address: ''
    };

    this.profileForm.patchValue(initial);
  }

  toggleEdit() {
    this.editing = !this.editing;
    this.savedMessage = '';
  }

  /**
   * Save profile to local storage (user-specific)
   * Profile data is persistent across sessions
   */
  save() {
    if (this.profileForm.valid && this.currentUserId) {
      const storageKey = this.storage.getUserKey(this.currentUserId, 'user_profile');
      this.storage.setLocalItem(storageKey, this.profileForm.value);
      
      // Also update session storage for immediate access
      this.storage.setSessionItem('profile_updated', true);
      
      this.savedMessage = 'Profile saved successfully.';
      this.editing = false;
    }
  }

  logout() {
    this.authService.logout();
  }

  get f() { return this.profileForm.controls; }
}


