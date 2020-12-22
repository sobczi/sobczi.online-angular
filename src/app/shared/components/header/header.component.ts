import { Component } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

import { AuthFacade } from '@auth/facades'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  currentLanguage: string

  get languages (): string[] {
    return this.translateService.getLangs()
  }

  constructor (
    private readonly authFacade: AuthFacade,
    private readonly translateService: TranslateService
  ) {
    const browserLang = translateService.getBrowserLang().toLocaleUpperCase()
    const currentLanguage = browserLang.match(/EN|PL/) ? browserLang : 'EN'
    this.currentLanguage = currentLanguage
  }

  handleLanguageChange (): void {
    this.translateService.use(this.currentLanguage)
  }

  handleLogout (): void {
    this.authFacade.dispatchLogoutRequest()
  }
}
