import { Component } from '@angular/core'

import { ContactElement, BasicData } from '@home/models'
import { ContactSection } from '@home/templates'

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent {
  readonly contactElements: ContactElement[] = ContactSection
  get currentPosition (): string {
    return BasicData.currentPosition
  }

  get fullName (): string {
    return BasicData.fullName
  }
}
