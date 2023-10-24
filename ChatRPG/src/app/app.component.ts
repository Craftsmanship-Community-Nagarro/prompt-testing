import { Component, ElementRef, ViewChild } from '@angular/core';
import OpenAI from 'openai';
import ChatCompletionMessageParam  from 'openai';


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

  sendChatMessage() {
    this.messages.push({role:"user", content: this.chatText})

    this.isLoading = true
    const scrollingInterval = setInterval(() => {
      this.scrollToBottomOfChat();
    });
    
    const gptMessages = this.buildMessages()
    streamChatResponse(gptMessages)

    setTimeout(() => clearInterval(scrollingInterval), 1000);
    this.scrollToBottomOfChat();
    this.isLoading = false
  }

  buildMessages(): GptMessage[] {
    const gptMessages: GptMessage[] = [];
    gptMessages.push({role:"system", content:systemPrompt});
    gptMessages.push(...this.messages);
    return gptMessages;
  }

  scrollToBottomOfChat() {
    this.chatHistory.nativeElement.scroll({
      top: this.chatHistory.nativeElement.scrollHeight,
    });
  }
}

// This is the OpenAI GPT Integration part

const dotenv = require('dotenv');
dotenv.config();

const systemPrompt = "You are a friendly assistant."

interface GptMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const openai = new OpenAI();
async function* streamChatResponse(messages: GptMessage[]) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo', // the model can be switched here
    messages: messages,
    stream: true, // we would like to stream back each chunk, instead of waiting for the whole response message
  });
  for await (const part of stream) {
    const chunk = part.choices[0]?.delta?.content || '';
    yield chunk;
  }
}
