import { BrowserModule, DomSanitizer } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatIconRegistry } from '@angular/material/icon'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { StoreModule } from '@ngrx/store'
import { routerReducer } from '@ngrx/router-store'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { ServiceWorkerModule } from '@angular/service-worker'
import { EffectsModule } from '@ngrx/effects'

import { Icons } from '@assets/constants'
import { environment } from '@env/environment'
import { SharedModule } from '@shared/shared.module'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'

function httpLoaderFactory (http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http)
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    HttpClientModule,
    StoreModule.forRoot({
      router: routerReducer
    }),
    EffectsModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    })
  ],
  exports: [SharedModule],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor (
    private registry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    Icons.forEach(icon =>
      this.registry.addSvgIcon(
        icon.name,
        this.domSanitizer.bypassSecurityTrustResourceUrl(icon.path)
      )
    )
  }
}
