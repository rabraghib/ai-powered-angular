import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatComponent } from './chat/chat.component';

@Component({
  selector: 'app-root',
  template: `<app-chat></app-chat>`,
  imports: [ChatComponent],
})
export class AppComponent {}
