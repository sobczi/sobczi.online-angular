import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { HomePageComponent } from '@home/views'

const routes: Routes = [
  {
    path: '**',
    component: HomePageComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
