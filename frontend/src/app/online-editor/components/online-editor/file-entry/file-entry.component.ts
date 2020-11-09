import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'ngwerckmeister-file-entry',
  templateUrl: './file-entry.component.html',
  styleUrls: ['./file-entry.component.scss']
})
export class FileEntryComponent implements OnInit {
  @Input()
  name: string;

  @Output()
  nameChange = new EventEmitter<string>();

  @Input()
  editMode: boolean = false;

  editName: string;

  constructor() { }

  ngOnInit() {
  }

  onEdit() {
    this.editMode = true;
    this.editName = this.name;
  }

  get normalizedName(): string {
    return this.editName
      .replace(/\//g, '')
      .trim()
      
  }

  onSubmit() {
    const newName = this.normalizedName;
    if (newName.length === 0) {
      this.onCancel();
      return;
    }
    this.editMode = false;
    this.name = newName;
    this.editName = "";
    this.nameChange.emit(this.name);
  }

  onCancel() {
    this.editMode = false;
    this.editName = "";
  }
  
}
