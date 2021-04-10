import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FileUploadModule } from 'ng2-file-upload'
import { CarouselModule } from 'ngx-bootstrap/carousel';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      progressAnimation: "increasing"
    }),
    TabsModule.forRoot(),
    FileUploadModule,
    CarouselModule.forRoot(),
    BsDatepickerModule.forRoot()
  ],
  exports: [
    BsDropdownModule,
    ToastrModule,
    TabsModule,
    FileUploadModule,
    CarouselModule,
    BsDatepickerModule
  ]
})
export class SharedModule { }