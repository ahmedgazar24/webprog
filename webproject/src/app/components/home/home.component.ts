import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  login(){
    window.location.href = '/login';
  }
  signup(){
    window.location.href = '/signup';
  }
  profile(){
    window.location.href = '/profile';
  }
}
