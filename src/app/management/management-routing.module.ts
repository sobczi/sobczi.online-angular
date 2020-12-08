import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { ManageComponent } from '@management/views'

const routes: Routes = [
  {
    path: '**',
    component: ManageComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule {}
