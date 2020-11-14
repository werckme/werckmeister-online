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

  private _editMode = false;

  @Input()
  set editMode(val: boolean) {
    this ._editMode = val;
    if (val) {
      this.editName = this.name;
    } else {
      this.editName = "";
    }
  }

  get editMode(): boolean {
    return this._editMode;
  }

  @Input()
  isValidPath: (path: string, newPath: string) => boolean = ()=>false;

  editName: string;

  constructor() { }

  ngOnInit() {
  }

  onEdit() {
    this.editMode = true;
  }

  get normalizedEditName(): string {
    return this.editName
      .replace(/\//g, '')
      .trim()
      
  }

  onSubmit() {
    if (!this.isValidPath(this.name, this.normalizedEditName)) {
      return;
    }
    const newName = this.normalizedEditName;
    const anyChanges = newName !== this.name;
    if (newName.length === 0 || !anyChanges) {
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
  }
  
}
