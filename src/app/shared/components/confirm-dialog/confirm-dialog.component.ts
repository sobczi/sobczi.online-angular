import { Component, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

import { SimpleDialogComponent } from '@shared/components'
import { HeaderContent } from '@shared/models'

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  get header (): string {
    return this.data.header
  }

  get content (): string {
    return this.data.content
  }

  constructor (
    private readonly dialogRef: MatDialogRef<SimpleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: HeaderContent
  ) {}

  handleConfirm (): void {
    this.dialogRef.close({ accepted: true })
  }

  handleReject (): void {
    this.dialogRef.close({ accepted: false })
  }
}
