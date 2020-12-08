import { Component } from '@angular/core'

import { Section, SkillSection, Language } from '@home/models'
import {
  ExperienceSection,
  EducationSection,
  SkillsSection,
  LanguageSection,
  SkillColumns,
  LanguageRows
} from '@home/templates'

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  readonly skillsColumns: SkillSection[][] = SkillColumns
  readonly languagesRows: Language[] = LanguageRows

  readonly experienceSection: Section = ExperienceSection
  readonly educationSection: Section = EducationSection
  readonly skillsSection: Section = SkillsSection
  readonly languageSection: Section = LanguageSection
}
