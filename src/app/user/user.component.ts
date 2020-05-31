import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { InfoService } from '../../service/info.service';
import { isEmpty } from 'lodash';
import { TokenService } from 'spotify-auth';
import { switchMap } from 'rxjs/operators/switchMap';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'user-info',
  template: `
    <div *ngIf="hasUser()">
      <pre>{{ jUser }}</pre>
    </div>
  `,
  styles: [``],
})
export class UserComponent implements OnInit, OnDestroy {
  public constructor(private infoSvc: InfoService, private tokenSvc: TokenService) {}
  public user: {} = {};
  private stream: Subscription | null = null;

  ngOnDestroy(): void {
    if (this.stream) {
      this.stream.unsubscribe();
    }
  }

  ngOnInit(): void {
    const stream = this.tokenSvc.authTokens.pipe(
      switchMap((x) => {
        return this.infoSvc.fetchUserInfo();
      })
    );
    this.stream = stream.subscribe((x) => (this.user = x));
  }

  public hasUser(): boolean {
    return !isEmpty(this.user);
  }

  public get jUser(): {} {
    return JSON.stringify(this.user, null, 2);
  }
}
