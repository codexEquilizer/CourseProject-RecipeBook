import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService){}
/*   loadedFeature = 'recipe';

  onNavigate(feature: string) {
    this.loadedFeature = feature;
  } */

  ngOnInit(): void {
      this.authService.autoLogin();
  }
}
