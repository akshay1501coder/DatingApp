import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})
export class TextInputComponent implements ControlValueAccessor {
  @Input() label : string;
  @Input() type = 'text';

  //below we are injecting ngControl received from other components
  constructor(@Self() public ngControl : NgControl) { 
    this.ngControl.valueAccessor = this; //with this we can access this component when
    //used from other component  
    //console.warn(this.ngControl.valueAccessor);
  }

  writeValue(obj: any): void {    
  }

  registerOnChange(fn: any): void {  
  }

  registerOnTouched(fn: any): void {  
  }

}
