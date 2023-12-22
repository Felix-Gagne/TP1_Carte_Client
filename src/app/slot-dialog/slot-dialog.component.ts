import { Component, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface DialogData {
  allSlots: any[];
  totalSlots: number;
}

@Component({
  selector: 'app-slot-dialog',
  templateUrl: './slot-dialog.component.html',
  styleUrls: ['./slot-dialog.component.css'] 
})
export class SlotDialogComponent implements AfterViewInit {
  @ViewChild('dialogContent') dialogContent: ElementRef | undefined;
  constructor(
    public dialogRef: MatDialogRef<SlotDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    lightVisibility = false;
    
  onClose(): void {
    this.dialogRef.close();
  }

  ngAfterViewInit() {
    if(this.dialogContent!= undefined){
      const contentWidth = this.dialogContent.nativeElement.offsetWidth;
      const desiredWidth = contentWidth + 80;
      this.dialogRef.updateSize(`${desiredWidth}px`); // Update dialog size
    }
  }
}
