import { NgModule } from '@angular/core'
import { CommonModule, DatePipe } from '@angular/common'
import { FlexLayoutModule } from '@angular/flex-layout'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { MatSelectModule } from '@angular/material/select'
import { MatDialogModule } from '@angular/material/dialog'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatDividerModule } from '@angular/material/divider'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatMenuModule } from '@angular/material/menu'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { TranslateModule } from '@ngx-translate/core'

import {
  ConfirmDialogComponent,
  SimpleDialogComponent
} from '@shared/components'
import { AuthFacade, SharedFacade } from '@shared/facades'
import { AuthService, DialogService, SharedService } from '@shared/services'

@NgModule({
  declarations: [SimpleDialogComponent, ConfirmDialogComponent],
  imports: [
    TranslateModule,
    CommonModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatDialogModule,
    MatTooltipModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatProgressBarModule
  ],
  exports: [
    FlexLayoutModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatDialogModule,
    MatTooltipModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    TranslateModule,
    MatSlideToggleModule,
    MatMenuModule,
    CommonModule,
    MatProgressBarModule
  ],
  providers: [
    DatePipe,
    AuthFacade,
    SharedService,
    AuthService,
    SharedFacade,
    DialogService
  ]
})
export class SharedModule {}
