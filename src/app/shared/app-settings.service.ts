import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAppSettings } from './app-settings.model';

@Injectable({
  providedIn: 'root',
})
export class AppSettingsService {
  appSettings!: IAppSettings;
  constructor(private http: HttpClient) {}

  load() {
    return this.http
      .get('/assets/settings/app-settings.json')
      .toPromise()
      .then((settings: any) => {
        this.appSettings = settings;
      });
  }

  get apiUrl(): string {
    return this.appSettings.apiUrl;
  }

  get apiKey(): string {
    return this.appSettings.apiKey;
  }
}
