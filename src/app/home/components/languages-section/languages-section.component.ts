import { Component, Input } from '@angular/core'

import { Language } from '../../models/Language'

@Component({
  selector: 'app-languages-section',
  templateUrl: './languages-section.component.html',
  styleUrls: ['./languages-section.component.scss']
})
export class LanguagesSectionComponent {
  @Input() rows: Language[] = []
}
