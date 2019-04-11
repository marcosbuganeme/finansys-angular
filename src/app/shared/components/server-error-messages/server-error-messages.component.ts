import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-server-error-messages',
  templateUrl: './server-error-messages.component.html',
  styleUrls: ['./server-error-messages.component.css']
})
export class ServerErrorMessagesComponent {

  @Input('server-error-messages') serverErrorMessages: string[] = null

  constructor() { }
}