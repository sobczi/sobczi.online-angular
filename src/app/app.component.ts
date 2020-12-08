import { Component } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Daniel Sobczak'
  constructor (translateService: TranslateService) {
    translateService.addLangs(['EN', 'PL'])
    translateService.setDefaultLang('EN')
    const browserLang = translateService.getBrowserLang().toLocaleUpperCase()
    const currentLanguage = browserLang.match(/EN|PL/) ? browserLang : 'EN'
    translateService.use(currentLanguage)
  }

  handleRouterActivate (): void {
    window.scroll({ behavior: 'smooth', top: 0 })
  }
}
