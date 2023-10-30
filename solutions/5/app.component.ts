import { Component, ElementRef, ViewChild } from '@angular/core';
import { streamChatResponse } from './gptApi';
import { Character, ChatMessage } from './models';
import { buildPromptMessages } from './promptBuilder';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  @ViewChild('chatHistory') chatHistory: ElementRef<HTMLInputElement>
  @ViewChild('characterSettigns', { static: true }) characterSettignsDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('characterAction', { static: true }) characterActionDialog!: ElementRef<HTMLDialogElement>;
  title = 'ChatRPG';
  messages: ChatMessage[] = [];
  chatText = "";
  isLoading = false;
  currentCharacter: Character = {
    name: "Frodo Baggings",
    description: "He is a content and unassuming hobbit. He enjoys a quiet life and is known for his kindness and simplicity, as well as his strong friendship with Samwise Gamgee.",
    exampleSentences: `I'm just a simple hobbit, but I'll do my best to carry out this task.
Sam, my dear friend, we must stay true to our purpose and see this journey through to the end.
I wish none of this had happened, but it's not for us to decide. All we have to decide is what to do with the time that is given us.
`,
scenario: "Frodo is walking alone on a road leading to the city of Bree."
  }
  characterExitedConversation = false;

  async onChatMessageSent(event: Event | undefined) {
    if (this.isLoading) return;
    if (this.characterExitedConversation) {
      this.characterActionDialog.nativeElement.showModal();
      return;
    }
    if (this.chatText.trim() === "") return
    if (event) event.preventDefault()

    const scrollingInterval = setInterval(() => {
      this.scrollToBottomOfChat();
    });
    this.isLoading = true

    try {
      await this.sendChatMessage()
    }
    catch(error: any){
      console.log("Unexpected error: " + error.message);
      throw error;
    }
    finally {
      setTimeout(() => clearInterval(scrollingInterval), 1000);
      this.scrollToBottomOfChat();
      this.isLoading = false
    }
  }

  async sendChatMessage() {
    this.messages.push({role:"user", content: this.chatText})

    const responseAiMessage: ChatMessage = {role:"assistant", content: ""};
    this.messages.push(responseAiMessage);
    
    const promptMessages = buildPromptMessages(this.messages, this.currentCharacter)

    const actionSignal = "[CHAT_RPG_ACTION]"
    let aiMessageText = ""
    this.chatText = ""
    for await (const chunk of streamChatResponse(promptMessages)) {
      console.log(JSON.stringify(chunk))
      aiMessageText += chunk;
      if(actionSignal.startsWith(aiMessageText)) {
        continue;
      }
      responseAiMessage.content += chunk;
    }
    if(aiMessageText == actionSignal){
      this.characterExitedConversation = true;
      this.characterActionDialog.nativeElement.showModal();
    }
  }

  scrollToBottomOfChat() {
    this.chatHistory.nativeElement.scroll({
      top: this.chatHistory.nativeElement.scrollHeight,
    });
  }

  showDialog() {
    this.characterSettignsDialog.nativeElement.showModal();
  }
}

