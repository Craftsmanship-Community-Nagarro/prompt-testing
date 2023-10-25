import { Component, ElementRef, ViewChild } from '@angular/core';
import OpenAI from 'openai';
import ChatCompletionMessageParam  from 'openai';
import { GptMessage, streamChatResponse } from './gpt';


interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
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
  isLoading = false

  onChatMessageSent(event: Event | undefined) {
    if (this.isLoading) return;
    if (event) event.preventDefault()
    if (this.chatText.trim() === "") return
    
    this.sendChatMessage()
    this.chatText = ""
  }

  async sendChatMessage() {
    this.messages.push({role:"user", content: this.chatText})

    this.isLoading = true
    const scrollingInterval = setInterval(() => {
      this.scrollToBottomOfChat();
    });
    
    const gptMessages = this.buildMessages()

    const currentAiMessage: ChatMessage = {role:"assistant", content: ""};
    this.messages.push(currentAiMessage);
    for await (const chunk of streamChatResponse(gptMessages)) {
      console.log(JSON.stringify(chunk))
      currentAiMessage.content += chunk;
    }

    setTimeout(() => clearInterval(scrollingInterval), 1000);
    this.scrollToBottomOfChat();
    this.isLoading = false
  }

  buildMessages(): GptMessage[] {
    const gptMessages: GptMessage[] = [];
    gptMessages.push(...this.messages);
    return gptMessages;
  }

  scrollToBottomOfChat() {
    this.chatHistory.nativeElement.scroll({
      top: this.chatHistory.nativeElement.scrollHeight,
    });
  }
}

