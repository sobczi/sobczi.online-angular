import { Component, Input } from '@angular/core'

import { Section } from '../../models/Section'

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss']
})
export class SectionHeaderComponent {
  @Input() section: Section
}
