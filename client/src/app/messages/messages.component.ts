import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination } from '../_models/Pagination';
import { MessageService } from '../_services/message.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmService } from '../_services/confirm.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[] = [];
  pagination: Pagination;
  container = "Unread";
  pageNumber = 1;
  pageSize = 5;
  isLoading = false;

  constructor(private messageService: MessageService, private sanitizer: DomSanitizer,
    private confirmService: ConfirmService) { }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.isLoading = true;
    this.messageService.getMessages(this.pageNumber, this.pageSize,
      this.container).subscribe((response) => {
        this.messages = response.result;
        this.pagination = response.pagination;
        this.isLoading = false;
      })
  }

  deleteMessage(id: number) {
    this.confirmService.confirm("Confirm Delete message", "This cannot be reverted")
      .subscribe(result => {
        if (result) {
          this.messageService.deleteMessage(id).subscribe(() => {
            this.messages.splice(this.messages.findIndex(m => m.id == id), 1)
          });
        }
      });
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.loadMessages();
  }

}
