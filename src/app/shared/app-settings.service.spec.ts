import { HttpClient } from '@angular/common/http';

import { AppSettingsService } from './app-settings.service';

describe('AppsettingsService', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let service: AppSettingsService;

  beforeEach(() => {
    service = new AppSettingsService(httpClientSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
