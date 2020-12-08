import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AdminDemoGuard, LoggedGuard, NotLoggedGuard } from '@shared/guards'

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('@home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'guest',
    loadChildren: () => import('@guest/guest.module').then(m => m.GuestModule),
    canActivate: [NotLoggedGuard]
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('@account/account.module').then(m => m.AccountModule),
    canActivate: [LoggedGuard]
  },
  {
    path: 'pomodoro',
    loadChildren: () =>
      import('@pomodoro/pomodoro.module').then(m => m.PomodoroModule),
    canActivate: [LoggedGuard]
  },
  {
    path: 'invoices',
    loadChildren: () =>
      import('@invoices/invoices.module').then(m => m.InvoicesModule),
    canActivate: [LoggedGuard]
  },
  {
    path: 'account',
    loadChildren: () =>
      import('@account/account.module').then(m => m.AccountModule),
    canActivate: [LoggedGuard]
  },
  {
    path: 'management',
    loadChildren: () =>
      import('@management/management.module').then(m => m.ManagementModule),
    canActivate: [LoggedGuard, AdminDemoGuard]
  },
  {
    path: '**',
    loadChildren: () => import('@home/home.module').then(m => m.HomeModule)
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
