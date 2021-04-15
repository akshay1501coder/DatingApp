import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-test-modal',
  templateUrl: './test-modal.component.html',
  styleUrls: ['./test-modal.component.css']
})
export class TestModalComponent implements OnInit {
  title: string;
  closeBtnName: string;
  list: any[] = [];
  
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }

}
