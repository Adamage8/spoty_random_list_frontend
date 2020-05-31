import { Component, OnInit } from '@angular/core';
import { ApiCompositionType, CompositionApiService } from '../../service/api/api-composition.service';
import { Observable } from 'rxjs/Observable';
import { InfoService } from '../../service/info.service';
import { AuthService, TokenService } from 'spotify-auth';
import { get } from 'lodash';

@Component({
  selector: 'app-compositions',
  templateUrl: './compositions.component.html',
  styleUrls: ['./compositions.component.css'],
})
export class CompositionsComponent implements OnInit {
  compositions: ApiCompositionType[] = [];

  constructor(
    private apiService: CompositionApiService,
    private infoService: InfoService,
    private tokenSvc: TokenService
  ) {}

  ngOnInit() {
    if (this.hasUser) {
      (this.apiService.get() as Observable<ApiCompositionType[]>).subscribe((response) => {
        this.compositions = response;
      });
    }
  }

  onSendComment = (composition: ApiCompositionType, values: { comment: string }) => {
    composition.comments.push({
      privateStatus: false,
      text: values.comment,
      userName: 'unknown',
    });
    this.apiService.update(composition).subscribe();
  };

  onDelete = (id: number) => {
    this.apiService.delete(id).subscribe();
    this.compositions = this.compositions.filter((item) => item.id !== id);
  };

  hasUser = () => {
    return !!this.tokenSvc.oAuthToken;
  };
}
