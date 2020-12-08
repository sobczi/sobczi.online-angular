import { Component, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

import { HeaderContent } from '@core/models'
import { SimpleDialogComponent } from '@shared/components'

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  constructor (
    public dialogRef: MatDialogRef<SimpleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HeaderContent
  ) {}

  handleConfirm (): void {
    this.dialogRef.close({ accepted: true })
  }

  handleReject (): void {
    this.dialogRef.close({ accepted: false })
  }
}
