import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';

@Component({
  selector: 'app-photo-slider',
  templateUrl: './photo-slider.component.html',
  styleUrls: ['./photo-slider.component.css']
})
export class PhotoSliderComponent implements OnInit {
  @Input() member : Member
  constructor() { }

  ngOnInit(): void {
  }
}
