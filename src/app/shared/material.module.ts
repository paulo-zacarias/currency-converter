import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  exports: [
    MatAutocompleteModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
  ],
})
export class MaterialModule {}