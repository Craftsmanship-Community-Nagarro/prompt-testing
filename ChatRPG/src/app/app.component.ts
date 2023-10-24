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
    this.chatText = ""
    const scrollingInterval = setInterval(() => {
      this.scrollToBottomOfChat();
    });
    
    this.fakeStreamingResponse("Interesting, I'm not sure.")

    setTimeout(() => clearInterval(scrollingInterval), 1000);
    this.scrollToBottomOfChat();
  }

  scrollToBottomOfChat() {
    this.chatHistory.nativeElement.scroll({
      top: this.chatHistory.nativeElement.scrollHeight,
    });
  }

  async fakeStreamingResponse(text: string) {
    const currentMessage = new ChatMessage("AI", "");
    this.messages.push(currentMessage);

    const wordsArray = text.split(' ')

    for (const word of wordsArray) {
      await this.wait(100) // simulate streaming response
      currentMessage.message += word + " "
    }
  }

  wait(ms: number): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
