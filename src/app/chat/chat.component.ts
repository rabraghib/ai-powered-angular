import { Component, inject, signal } from '@angular/core';
import { WebLlmService } from '../core/services/web-llm.service';
import { ChatMsgComponent } from '../chat-msg/chat-msg.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  imports: [ChatMsgComponent, FormsModule],
})
export class ChatComponent {
  readonly service = inject(WebLlmService);
  readonly messages = this.service.messages;
  readonly reply = this.service.reply;
  readonly isReplying = this.service.isReplying;
  readonly isLoading = this.service.isLoading;
  readonly loadingProgress = this.service.loadingProgress;

  readonly prompt = signal<string>('');

  onSend() {
    console.log({
      prompt: this.prompt(),
    });
    this.service.prompt(this.prompt());
    this.prompt.set('');
  }
}
