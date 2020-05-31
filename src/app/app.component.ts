import { Component, OnInit } from '@angular/core';
import { AuthService, TokenService } from 'spotify-auth';
import { InfoService } from '../service/info.service';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators/filter';
import { get } from 'lodash';

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  constructor(
    private infoSvc: InfoService,
    private tokenSvc: TokenService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.authorizedStream.pipe(filter((x) => x)).subscribe(() => {
      this.router.navigate(['compositions']);
    });
  }

  public logout(): void {
    this.tokenSvc.clearToken();
    this.router.navigate(['login']);
  }
}
