import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonateComponent } from './donate/donate.component';


/**
 * exists to embed an external form (such as the paypal form), without having angluar mangeling the form logik
 */
@NgModule({
  declarations: [
    DonateComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [DonateComponent]
})
export class ExternalModule { }
