import { NgModule, Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { InfoService } from '../service/info.service';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';
import { SpotifyAuthModule } from 'spotify-auth';
import { SpotifyAuthInterceptor2 } from './login/spotify-auth.interceptor';
import { SearchModuleComponent } from './search-module/search-module.component';
import { CompositionEditComponent } from './composition-edit/composition-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompositionApiService } from '../service/api/api-composition.service';
import { CompositionsComponent } from './compositions/compositions.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'compositions',
    pathMatch: 'full',
  },
  {
    path: 'compositions',
    component: CompositionsComponent,
  },
  {
    path: 'user',
    redirectTo: 'compositions',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'composition',
    component: CompositionEditComponent,
  },
  {
    path: 'composition/:id',
    component: CompositionEditComponent,
  },
  SpotifyAuthModule.authRoutes()[0],
];

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    SpotifyAuthModule.forRoot(),
    RouterModule.forRoot(routes, {
      // useHash: true
    }),
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [
    AppComponent,
    UserComponent,
    LoginComponent,
    SearchModuleComponent,
    CompositionEditComponent,
    CompositionsComponent,
  ],
  bootstrap: [AppComponent],
  exports: [],
  providers: [
    InfoService,
    CompositionApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpotifyAuthInterceptor2, //Force interception.
      multi: true,
    },
  ],
})
export class AppModule {}
