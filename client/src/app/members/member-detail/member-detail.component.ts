import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { MemberService } from 'src/app/_services/member.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', { static: true }) childMemberTabs: TabsetComponent
  activeTab: TabDirective;
  member: Member;
  messages: Message[] = [];


  constructor(private memberService: MemberService, private route: ActivatedRoute,
    private messageService: MessageService) { }

  ngOnInit(): void {

    this.route.data.subscribe(data => {
      this.member = data.member;
    })

    //this.loadMember();
    this.route.queryParams.subscribe(params => {
      params.tab ? this.selectTab(params.tab) : this.selectTab(0);
    })
  }

  // loadMember() {
  //   //below 'username' parameter should match as mentioned in app-routing.module.ts
  //   this.memberService.getMember(this.route.snapshot.paramMap.get('username')).subscribe(memberdata => {
  //     this.member = memberdata
  //   })
  // }

  loadMessages() {
    this.messageService.getMessageThread(this.member.userName).subscribe(messages => {
      this.messages = messages;
    })
  }

  selectTab(tabId: number) {
    this.childMemberTabs.tabs[tabId].active = true;
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === "Messages" && this.messages.length === 0) {
      this.loadMessages();
    }
  }
}
