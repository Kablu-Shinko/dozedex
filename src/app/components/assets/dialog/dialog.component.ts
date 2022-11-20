import { Component, OnInit, Inject, Input } from '@angular/core';
import {MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA} from '@angular/material/legacy-dialog';
import { DialogData, DialogFormInput } from 'src/app/interfaces/small-interfaces/small-interfaces';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async runFunction(): Promise<void>{
    var inputs: any[] = [];
    this.data.Inputs.forEach((input: DialogFormInput) => {
      inputs.push(input.Input);
    });
    var result = await this.data.Function(inputs);
    alert(result);
  }
}
