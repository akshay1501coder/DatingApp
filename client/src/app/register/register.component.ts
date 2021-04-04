import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter();

  model : any = {};

  constructor(private accountService : AccountService) { }

  ngOnInit(): void {    
  }

  register(){
    this.accountService.register(this.model).subscribe((response)=>{
      //console.log(response);
      this.cancelled();
    },error=>{
      console.warn(error);
    })
  }

  cancelled(){
    this.cancelRegister.emit(false);
  }

}
