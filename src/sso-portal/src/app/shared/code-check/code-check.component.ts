import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-code-check',
  templateUrl: './code-check.component.html',
  styleUrls: ['./code-check.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CodeCheckComponent implements OnInit, OnDestroy {
  @Input() count: number = 5;
  @Input() disabled: boolean = false;
  @Input() result: FormControl = undefined;
  @Input() resetSubject: Subject<any>;
  @ViewChild('codeFields') codeFields: ElementRef<HTMLElement>;

  inputs: Array<number>;
  digitPattern: RegExp = /^[0-9]$/;

  constructor() { }

  ngOnInit(): void {
    this.resetSubject.subscribe(e => {
      this.reset();
    });
    this.inputs = new Array<number>(this.count);
    this.result = this.result === undefined ? new FormControl() : this.result;
  }

  ngOnDestroy() {
    this.resetSubject.unsubscribe();
  }

  onKeyDown(event, index) {
    if (this.digitPattern.test(event.key)) {
      if (event.target.value !== '') {
        this.inputs[index] = undefined;
      }
    }
  }

  onKeyUp(event, index) {
    let next;

    if (this.digitPattern.test(event.key)) {
      next = this.codeFields.nativeElement.querySelector(`#code-field-${index + 1}`);

      if (next == null) {
        next = document.getElementById('code-submit');
      }
    }

    if (event.code === 'Backspace') {
      next = this.codeFields.nativeElement.querySelector(`#code-field-${index - 1}`);
    }

    if (next == null) {
      return;
    }
    else {
      this.updateResult();
      next.focus();
    }
  }

  onDigitInput(event) {
    if (!this.digitPattern.test(event.data)) {
      event.srcElement.value = '';
    }
    else {
      event.srcElement.value = event.data;
    }
  }

  onPaste(event, index) {
    let clipboardData, onlyDigits, pastedData;
    event.stopPropagation();
    event.preventDefault();
    clipboardData = event.clipboardData;
    onlyDigits = clipboardData.getData('text/plain').match(/\d+/g);
    pastedData = onlyDigits?.join('').slice(-this.count).split('');

    if (pastedData !== undefined) {
      for (let i = 0; i < pastedData.length - index; i++) {
        this.inputs[i + index] = pastedData[i];
      }
      this.updateResult();
    }
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  private updateResult() {
    this.result.patchValue(this.inputs.join(''));
  }

  private reset() {
    this.inputs = new Array<number>(this.count);
  }
}
