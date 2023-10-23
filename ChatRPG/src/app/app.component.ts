import { Component, ElementRef, ViewChild } from '@angular/core';

export class ChatMessage {
  author: string;
  message: string;

  constructor(author: string, message: string) {
      this.author = author
      this.message = message
  }
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  @ViewChild('chatHistory') chatHistory: ElementRef<HTMLInputElement>
  title = 'ChatRPG';
  messages: ChatMessage[] = [];
  chatText = ""

  onChatMessageSent(event: Event | undefined) {
    if (event) event.preventDefault()
    if (this.chatText.trim() === "") return
    
    this.messages.push({author:"You", message: this.chatText})
    this.messages.push({author:"AI", message: "Interesting, I'm not sure."})
    this.chatText = ""
    const scrollingInterval = setInterval(() => {
      this.chatHistory.nativeElement.scroll({
        top: this.chatHistory.nativeElement.scrollHeight,
        // behavior: 'smooth'
      });
    });
  }
}
