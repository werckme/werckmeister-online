import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ViewContainerRef, ElementRef } from '@angular/core';
@Component({
  selector: 'ngwerckmeister-file-entry',
  templateUrl: './file-entry.component.html',
  styleUrls: ['./file-entry.component.scss']
})
export class FileEntryComponent implements OnInit {

  @Input()
  canDelete = true;

  @Input()
  canEdit= true;

  editName: string;
  get charLength(): number {
    return this.editName ? this.editName.length : 0;
  }

  @Input()
  name: string;

  @Input()
  isNewFile: boolean;

  @Output()
  nameChange = new EventEmitter<string>();

  @Output()
  oncancel = new EventEmitter<void>();

  @Output()
  ondelete = new EventEmitter<void>();

  @ViewChild('input')
  input: ElementRef;

  private _editMode = false;

  @Input()
  set editMode(val: boolean) {
    this ._editMode = val;
    if (val) {
      this.editName = this.name;
      setTimeout(this.setFocus.bind(this));
    } else {
      this.editName = '';
    }
  }

  get editMode(): boolean {
    return this._editMode;
  }

  private setFocus() {
    const input: HTMLInputElement = this.input.nativeElement;
    const nameEndMatch = input.value.match(/(\.[^.]*)$/);
    if (nameEndMatch) {
      input.setSelectionRange(0, nameEndMatch.index);
    }
    input.focus();
  }

  @Input()
  pathValidator: (path: string) => boolean = () => false

  get nameHasChanged(): boolean {
    return this.isNewFile || this.name !== this.normalizedEditName;
  }

  get isValidPath(): boolean {
    if (!this.nameHasChanged) {
      return true;
    }
    const result = this.pathValidator(this.normalizedEditName);
    return result;
  }

  constructor() { }

  ngOnInit() {
  }

  onEdit() {
    this.editMode = true;
  }

  get normalizedEditName(): string {
    return this.editName
      .replace(/\//g, '')
      .trim();
  }

  onSubmit() {
    if (!this.isValidPath) {
      return;
    }
    const newName = this.normalizedEditName;
    if (newName.length === 0 || !this.nameHasChanged) {
      this.onCancel();
      return;
    }
    this.editMode = false;
    this.name = newName;
    this.editName = '';
    this.nameChange.emit(this.name);
  }

  onCancel() {
    this.editMode = false;
    this.oncancel.emit();
  }
  
  onDelete() {
    this.ondelete.emit();
  }
}
