import { Component } from '@angular/core'
import { Links } from '../../models'

enum EXPAND_SECTIONS {
  ISPLMR = 'ISPLMR',
  ALPHTA = 'ALPHTA'
}

@Component({
  selector: 'app-experience-section',
  templateUrl: './experience-section.component.html',
  styleUrls: ['./experience-section.component.scss'],
})
export class ExperienceSectionComponent {
  currentExpanded: EXPAND_SECTIONS = EXPAND_SECTIONS.ALPHTA
  readonly sections: EXPAND_SECTIONS[] = [
    EXPAND_SECTIONS.ISPLMR,
    EXPAND_SECTIONS.ALPHTA
  ]

  get alphtaDuration (): string {
    const from = new Date('2021-01-01')
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

  handleAlphtaClick (): void {
    window.open(Links.ALPHTA)
  }

  handleExpandISPLMR (): void {
    const ISPLMR = EXPAND_SECTIONS.ISPLMR
    this.currentExpanded = this.currentExpanded === ISPLMR ? undefined : ISPLMR
  }

  handleExpandAlphta (): void {
    const alphta = EXPAND_SECTIONS.ALPHTA
    this.currentExpanded = this.currentExpanded === alphta ? undefined : alphta
  }
}
