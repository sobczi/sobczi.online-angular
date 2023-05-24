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
import { Clipboard } from '@angular/cdk/clipboard';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  showTickPhone = false;
  showTickEmail = false;

  constructor(private readonly clipBoard: Clipboard) {}

  readonly skillsColumns: SkillSection[][] = SkillColumns
  readonly languagesRows: Language[] = LanguageRows

  readonly experienceSection: Section = ExperienceSection
  readonly educationSection: Section = EducationSection
  readonly skillsSection: Section = SkillsSection
  readonly languageSection: Section = LanguageSection

  copyPhone(): void {
    this.showTickPhone = true;
    this.clipBoard.copy('+48531788175');
    timer(2000).pipe(take(1)).subscribe(() => this.showTickPhone = false);
  }

  copyEmail(): void {
    this.showTickEmail = true;
    this.clipBoard.copy('danielsobczak777@icloud.com');
    timer(2000).pipe(take(1)).subscribe(() => this.showTickEmail = false);
  }

  downloadCv(): void {
    window.open('/assets/CV_Daniel_Sobczak.pdf', '_blank');
  }
}
