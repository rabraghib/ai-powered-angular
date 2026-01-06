import { Component, input } from '@angular/core';
import { Message } from '../core/models/message';

@Component({
  selector: 'app-chat-msg',
  templateUrl: './chat-msg.component.html',
})
export class ChatMsgComponent {
  readonly message = input.required<Message>();
}
