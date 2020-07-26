import {Directive, ElementRef, forwardRef, HostListener, Input, OnInit} from '@angular/core';
import {MAT_INPUT_VALUE_ACCESSOR} from '@angular/material/input';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Directive({
  selector: 'input[matInputCommified]',
  providers: [
    {provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: NumberFormatterDirective},
    {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NumberFormatterDirective),
        multi: true,
    }
  ]
})
export class NumberFormatterDirective implements OnInit {

  private _value: string | null;
  @Input('format') format="int";
  @Input('talign') align="right";

  constructor(private elementRef: ElementRef<HTMLInputElement>, private decimalPipe: DecimalPipe
  ) {}

  ngOnInit() {
      this.elementRef.nativeElement.style.textAlign=this.align;
      this.elementRef.nativeElement.style.paddingRight=(this.align == 'right')?'10px':'0px';
  }


  get value(): string | null {
    return this._value;
  }

  @Input('value')
  set value(value: string | null) {
    this._value = value;
    this.formatValue(value);
  }

  private formatValue(value: string | null) {
    if (value !== null && value != '' && value != undefined) { 
      this.elementRef.nativeElement.value = this.numberWithCommas(value);
    } else {
      this.elementRef.nativeElement.value = '';
    }
  }

  numberWithCommas(value) {
      if(this.format == 'currency') {
        return this.decimalPipe.transform(value, '1.2', 'en-IN')
      }else{
        return Number(value.toString()).toLocaleString('en-IN');
      }
  }

  
  private unFormatValue() {
    const value = this.elementRef.nativeElement.value;
    this._value = value.replace(/[^\d.-]/g, '');
    if (value) {
      this.elementRef.nativeElement.value = this._value;
    } else {
      this.elementRef.nativeElement.value = '';
    }
  }

    @HostListener('input', ['$event.target.value'])
    onInput(value) {
        const initalValue = this.elementRef.nativeElement.value;
        let regx = /[^0-9.]*/g;
        if(this.format == 'int') {
            regx = /[^0-9]*/g;
        }
        this.elementRef.nativeElement.value = initalValue.replace(regx, '');
        if ( initalValue !== this.elementRef.nativeElement.value) {
            event.stopPropagation();
        }  
        this._value = value.replace(/[^\d.-]/g, '');
        this._onChange(this._value);
    }

    @HostListener('blur')
    _onBlur() {
        this.formatValue(this._value); // add commas
    }

    @HostListener('focus')
    onFocus() {
        this.unFormatValue(); // remove commas for editing purpose
    }

    _onChange(value: any): void {
    }
  
    writeValue(value: any) {
        this._value = value;
        this.formatValue(this._value); // format Value
    }

    registerOnChange(fn: (value: any) => void) {
    this._onChange = fn;
    }

    registerOnTouched() {
    }

}