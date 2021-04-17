import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MemberService } from 'src/app/_services/member.service';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceHubService } from 'src/app/_services/presence-hub.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs', { static: true }) childMemberTabs: TabsetComponent;
  activeTab: TabDirective;
  member: Member;
  messages: Message[] = [];
  user: User;

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    public presenceService: PresenceHubService,
    private accountService: AccountService,
    private router: Router
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      this.user = user;
    });

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.member = data.member;
    });

    //this.loadMember();
    this.route.queryParams.subscribe((params) => {
      params.tab ? this.selectTab(params.tab) : this.selectTab(0);
    });
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();//to stop the hub if someone moved out of this component
  }

  // loadMember() {
  //   //below 'username' parameter should match as mentioned in app-routing.module.ts
  //   this.memberService.getMember(this.route.snapshot.paramMap.get('username')).subscribe(memberdata => {
  //     this.member = memberdata
  //   })
  // }

  loadMessages() {
    this.messageService
      .getMessageThread(this.member.userName)
      .subscribe((messages) => {
        console.log(messages);
        this.messages = messages;
      });
  }

  selectTab(tabId: number) {
    this.childMemberTabs.tabs[tabId].active = true;
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.messages.length === 0) {
      //this.loadMessages();
      this.messageService.createHubConnection(this.user, this.member.userName);
    } else {
      this.messageService.stopHubConnection();
    }
  }
}
