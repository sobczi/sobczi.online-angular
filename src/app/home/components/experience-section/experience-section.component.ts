import { animate, style, transition, trigger } from '@angular/animations'
import { Component } from '@angular/core'

import { Links } from '../../models'

enum EXPAND_SECTIONS {
  ISPLMR = 'ISPLMR'
}

@Component({
  selector: 'app-experience-section',
  templateUrl: './experience-section.component.html',
  styleUrls: ['./experience-section.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 }))
      ]),
      transition(':leave', [
        // :leave is alias to '* => void'
        animate(500, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ExperienceSectionComponent {
  currentExpanded: EXPAND_SECTIONS = EXPAND_SECTIONS.ISPLMR
  readonly sections: EXPAND_SECTIONS[] = [EXPAND_SECTIONS.ISPLMR]

  get ISPLMRDuration (): string {
    const from = new Date('2019-03-01')
    const now = new Date()
    let monthDiff = (from.getFullYear() - now.getFullYear()) * 12
    monthDiff -= now.getMonth()
    monthDiff += from.getMonth()
    monthDiff = Math.abs(monthDiff)

    const yearDiff = Math.floor(monthDiff / 12)
    if (monthDiff >= 12) {
      monthDiff = monthDiff % 12
    }

    const yearString = yearDiff >= 1 ? `${yearDiff}y` : ''
    const monthString = monthDiff ? `${monthDiff}m` : ''
    return `${yearString} ${monthString}`
  }

  expandStatus (section: EXPAND_SECTIONS): string {
    return section === this.currentExpanded ? 'expand_less' : 'expand_more'
  }

  handleEuroMedisClick (): void {
    window.open(Links.EUROMEDIS)
  }

  handleEclinicClick (): void {
    window.open(Links.ECLINIC)
  }

  handleExpandISPLMR (): void {
    const ISPLMR = EXPAND_SECTIONS.ISPLMR
    this.currentExpanded = this.currentExpanded === ISPLMR ? undefined : ISPLMR
  }
}
