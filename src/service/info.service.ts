import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators/catchError';
import { tap } from 'rxjs/operators/tap';
import { of } from 'rxjs/observable/of';
import { isEmpty } from 'lodash';

import { Router } from '@angular/router';

export type SearchType = 'album' | 'artist' | 'playlist' | 'track' | 'show' | 'episode';

export interface SearchResultType {
  [key: string]: {
    href: string;
    items: SearchResultItemType[];
    limit: number;
    next: string;
    offset: number;
    previous: null;
    total: number;
  };
}

export interface SearchResultItemType {
  external_urls: { spotify: string };
  followers: { href: any; total: number };
  genres: string[];
  href: string;
  id: string;
  images: { height: number; width: number; url: string }[];
  name: string;
  popularity: 95;
  type: SearchType;
  uri: string;
}

@Injectable()
export class InfoService {
  apiUserUrl = 'https://api.spotify.com/v1/me';
  apiAlbumsUrl = 'https://api.spotify.com/v1/me/albums';
  private user: {} = {};
  private user$: BehaviorSubject<{}>;

  private getApiSearchUrl = (query: string) =>
    `https://api.spotify.com/v1/search?q=${encodeURI(query)}&type=artist,album,playlist,track`;

  constructor(private http: HttpClient, private router: Router) {
    this.user$ = new BehaviorSubject<{}>(this.user);
  }

  public fetchUserInfo(): Observable<{}> {
    return this.http.get(this.apiUserUrl).pipe(
      tap((user: {}) => {
        this.user$.next(this.user);
      }),
      catchError(this.handleError('getSelf'))
    );
  }

  public fetchUserAlbums(): Observable<{}> {
    return this.http.get(this.apiAlbumsUrl).pipe(
      tap((user: {}) => {
        this.user$.next(this.user);
      }),
      catchError(this.handleError('getSelfAlbums'))
    );
  }

  public fetchSearchResults(query: string): Observable<{}> {
    return this.http.get(this.getApiSearchUrl(query)).pipe(
      tap((user: {}) => {
        this.user$.next(this.user);
      }),
      catchError(this.handleError('getSearchResults'))
    );
  }

  public getUserRequest() {
    return this.http.get(this.apiUserUrl);
  }

  public getUserStream(): Observable<{}> {
    return this.user$.asObservable();
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      (result as any) = error;
      return of(result as T);
    };
  }
}
