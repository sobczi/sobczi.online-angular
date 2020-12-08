import { Component, Input } from '@angular/core'

import { ContactElement } from '../../models/ContactElement'

@Component({
  selector: 'app-contact-elements',
  templateUrl: './contact-elements.component.html',
  styleUrls: ['./contact-elements.component.scss']
})
export class ContactElementsComponent {
  @Input() elements: ContactElement[] = []

  handleElementClick (element: ContactElement): void {
    if (!element.handler) {
      return
    }
    element.handler()
  }
}
