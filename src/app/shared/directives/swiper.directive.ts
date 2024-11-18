import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { SwiperOptions } from 'swiper/types';

@Directive({
  selector: '[appSwiper]',
  standalone: true,
})
export class SwiperDirective implements OnInit {
  private readonly swiperElement: HTMLElement;

  @Input()
  config?: SwiperOptions;

  constructor(private el: ElementRef<HTMLElement>) {
    this.swiperElement = el.nativeElement;
  }

  ngOnInit() {
    Object.assign(this.el.nativeElement, this.config);

    // @ts-ignore
    this.el.nativeElement.initialize();
  }
}
