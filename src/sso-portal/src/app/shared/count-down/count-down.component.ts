import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-count-down',
  templateUrl: './count-down.component.html'
})
export class CountDownComponent implements OnInit {
  @Input() time: string;
  @Output() finished = new EventEmitter();

  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  display: string = '';

  timeStamp: number = 0;
  interval: any;

  timePattern: RegExp = /^[0-9]{2}[:][0-9]{2}[:][0-9]{2}$/;

  ngOnInit() {
    this.parseTime();
    this.startTimer();
  }

  private parseTime() {
    if (this.time !== null && this.time !== '' && this.timePattern.test(this.time)) {
      const parts = this.time.split(':');

      this.hours = Number(parts[0]);
      this.minutes = Number(parts[1]);
      this.seconds = Number(parts[2]);

      this.timeStamp = this.hours * 3600 + this.minutes * 60 + this.seconds
    }
  }

  private startTimer() {
    this.interval = setInterval(() => {
      if (this.timeStamp === 0) {
        this.finished.emit();
      } else {
        this.timeStamp--;
      }
      this.display = this.transform(this.timeStamp)
    }, 1000);
  }

  private transform(value: number): string {
    const param = {
      minimumIntegerDigits: 2,
      useGrouping: false
    };
    const hours: number = Math.floor(value / 3600);
    const minutes: number = Math.floor((value - (hours * 3600)) / 60);
    const seconds: number = Math.floor(value - hours * 3600 - minutes * 60)

    let hoursDisplay = '';

    if (this.hours !== 0) {
      hoursDisplay = hours.toLocaleString('en-US', param) + ':';
    }

    return hoursDisplay + minutes.toLocaleString('en-US', param) + ':' + seconds.toLocaleString('en-US', param);
  }
}