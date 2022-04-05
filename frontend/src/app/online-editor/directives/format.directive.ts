import { DecimalPipe } from '@angular/common';
import { Directive, OnInit, ElementRef, forwardRef, Input, HostListener, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[wmFormat]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FormatDirective),
    multi: true
  }]
})
export class FormatDirective implements ControlValueAccessor {
  private _input: HTMLInputElement;
  private _onChange;
  private _isUserEditing: boolean = false;

  constructor(
    private _renderer: Renderer2,
    private _inputRef: ElementRef,
    private decimalPipe: DecimalPipe
  ) {
    this._input = this._inputRef.nativeElement;
    this._input.type = 'text'; // Must be 'text' to work with different formats
  }

  @Input() wmFormat: string;

  public writeValue(value: any): void {
    this._renderer.setProperty(this._input, 'value', this._formatValue(value));
  }

  public registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    //TODO: Implement registerOnTouched
  }

  public setDisabledState(isDisabled: boolean) {
    this._renderer.setProperty(this._inputRef.nativeElement, 'disabled', isDisabled);
  }

  @HostListener('input', ['$event.target.value'])
  input(value) {
    if (!this._isUserEditing)
      this._onChange(this._parseValue(value));
  }

  private _formatValue(value: any): string {
    let formattedValue: string = '';
    value = Number.parseFloat(value) || 0;
    if (value !== undefined && value !== null && value !== '') {
      formattedValue = this.decimalPipe.transform(value, this.wmFormat);
    }
    return formattedValue;
  }

  private _parseValue(value: string): number {
    return Number.parseFloat(value) || 0;
  }

  private _parseFormat(value: string): string {
    return this._parseValue(value).toString();
  }

  @HostListener('blur', ["$event.target.value"])
  onBlur(value) {
    let formattedValue: string = this._formatValue(value);
    this._isUserEditing = false;
    this._onChange(this._parseValue(formattedValue));
    this._input.value = formattedValue;
  }

  @HostListener('focus', ['$event.target.value'])
  onFocus(value) {
    this._isUserEditing = true;
    this._input.value = this._parseFormat(value);
  }
}