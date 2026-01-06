import { effect, Injectable, signal } from '@angular/core';
import { Message } from '../models/message';
import { MLCEngine } from '@mlc-ai/web-llm';

@Injectable({ providedIn: 'root' })
export class WebLlmService {
  readonly selectedModel = signal<string>('SmolLM2-135M-Instruct-q0f16-MLC');
  readonly messages = signal<Message[]>([
    {
      role: 'system',
      content:
        "You're a smart AI assistance for a student in ENSAM Casablanca. Dont answer to questions that are not related to the course.",
    },
  ]);
  readonly reply = signal<string>('');
  readonly isReplying = signal(false);

  readonly isLoading = signal(true);
  readonly loadingProgress = signal('');

  private readonly engine = new MLCEngine({
    initProgressCallback: (progress) => {
      console.log('Model Progress', progress);
      this.loadingProgress.set(progress.text);
    },
  });

  constructor() {
    effect(() => {
      this.isLoading.set(true);
      this.engine.reload(this.selectedModel()).then(() => {
        this.isLoading.set(false);
      });
    });
  }

  async prompt(message: string) {
    if (this.isReplying()) return;
    this.isReplying.set(true);
    try {
      this.reply.set('');
      this.messages.update((messages) => [
        ...messages,
        { role: 'user', content: message },
      ]);
      const chunks = await this.engine.chat.completions.create({
        stream: true,
        messages: this.messages(),
      });
      for await (const chunk of chunks) {
        const replyPart = chunk.choices[0]?.delta.content ?? '';
        this.reply.update((reply) => reply + replyPart);
      }
      this.messages.update((messages) => [
        ...messages,
        { role: 'assistant', content: this.reply() },
      ]);
    } catch (error) {}
    this.isReplying.set(false);
  }
}
