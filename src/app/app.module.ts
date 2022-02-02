import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './shared/material.module';
import { CurrencyConverterComponent } from './currency-converter/currency-converter.component';
import { AppSettingsService } from './shared/app-settings.service';

export function initializeApp(appSettings: AppSettingsService) {
  return () => appSettings.load();
}
@NgModule({
  declarations: [AppComponent, CurrencyConverterComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  providers: [
    AppSettingsService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppSettingsService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
