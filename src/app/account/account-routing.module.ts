import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { SettingsComponent } from '@account/views'

const routes: Routes = [
  {
    path: '**',
    component: SettingsComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {}
