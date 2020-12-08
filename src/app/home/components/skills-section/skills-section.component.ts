import { Component, Input } from '@angular/core'
import { SkillSection } from '../../models/SkillSection'

@Component({
  selector: 'app-skills-section',
  templateUrl: './skills-section.component.html',
  styleUrls: ['./skills-section.component.scss']
})
export class SkillsSectionComponent {
  @Input() columns: SkillSection[][] = []
}
