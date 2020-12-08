import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { HomeRoutingModule } from '@home/home-routing.module'
import {
  EducationSectionComponent,
  ExperienceSectionComponent,
  LanguagesSectionComponent,
  SectionHeaderComponent,
  SidePanelComponent,
  SkillsSectionComponent,
  ContactElementsComponent
} from '@home/components'
import { HomePageComponent } from '@home/views'
import { SharedModule } from '@shared/shared.module'

@NgModule({
  declarations: [
    EducationSectionComponent,
    ExperienceSectionComponent,
    LanguagesSectionComponent,
    SectionHeaderComponent,
    SidePanelComponent,
    SkillsSectionComponent,
    HomePageComponent,
    ContactElementsComponent
  ],
  imports: [CommonModule, HomeRoutingModule, SharedModule]
})
export class HomeModule {}
