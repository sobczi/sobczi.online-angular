import { Component, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

import { HeaderContent } from '@shared/models'

@Component({
  selector: 'app-simple-dialog',
  templateUrl: './simple-dialog.component.html',
  styleUrls: ['./simple-dialog.component.scss']
})
export class SimpleDialogComponent {
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

  handleClose (): void {
    this.dialogRef.close()
  }
}
