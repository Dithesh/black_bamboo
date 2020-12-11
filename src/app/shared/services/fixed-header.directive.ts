import {
    AfterViewInit,
    Directive,
    ElementRef,
    OnChanges,
    SimpleChanges
  } from '@angular/core';
  
  @Directive({
    selector: '[fixedHeader]',
  })
  export class FixedHeaderDirective implements OnChanges, AfterViewInit {
    inputElement;
    baseTableElement;
  
    constructor(public el: ElementRef) {
      this.inputElement = el.nativeElement;
      this.baseTableElement = this.inputElement.children[0];
      
      this.cloneHeader();
    }
  
    ngOnChanges(changes: SimpleChanges): void {
    }

    ngAfterViewInit() {
        console.log(this.inputElement.querySelector('table'));
    }

    cloneHeader() {
        // let cloneTableHeader = this.baseTableElement.find('thead')
    }
  
  }