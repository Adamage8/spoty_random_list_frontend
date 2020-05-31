import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

export interface ApiCompositionItemType {
  id: number;
  spotifyId: string;
  searchName: string;
  percent: number;
}

export interface CommentType {
  id?: number;
  text: string;
  userName: string;
  replyTo?: number;
  privateStatus: boolean;
}

export interface ApiCompositionType {
  id: number;
  name: string;
  numberOfItems: number;
  compositionItems: ApiCompositionItemType[];
  comments: CommentType[];
}

@Injectable()
export class CompositionApiService {
  constructor(private http: HttpClient) {}

  get = (id: string = ''): Observable<ApiCompositionType> | Observable<ApiCompositionType[]> => {
    if (id) {
      return this.http
        .get<ApiCompositionType>('http://localhost:8080/compositions/' + id)
        .pipe(map((response) => response));
    }
    return this.http.get<ApiCompositionType[]>('http://localhost:8080/compositions/').pipe(map((response) => response));
  };

  update = (composition: Partial<ApiCompositionType>) => {
    const { id, ...data } = composition;
    if (id === 0) {
      return this.http.post('http://localhost:8080/compositions/', data);
    } else {
      return this.http.patch('http://localhost:8080/compositions/' + id, data);
    }
  };

  delete = (id: number) => {
    return this.http.delete(`http://localhost:8080/compositions/${id}`);
  };
}
