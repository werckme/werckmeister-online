import * as _ from 'lodash';
const ScrollBlockClass = "cdk-global-scrollblock"; // the same class is used by ant for modal

export function setScrollLock(val: boolean) {
  const html = document.getElementsByTagName("html")[0];
  if (!html) {
    throw new Error("root html not found");
  }
  if (val) {
    html.classList.add(ScrollBlockClass)
  } else {
    html.classList.remove(ScrollBlockClass)
  }
}

export class AnchorScrollSpy {
  headings: Element[];
  currentHeading: Element;
  constructor(private container: HTMLElement) {
    console.log(container);
    window.onscroll = this.onScroll.bind(this);
    this.headings = _(this.container.querySelectorAll(`h2[id]`))
      .value()
    ;
    console.log(this.container.querySelectorAll(`h2[id]`)[5]);
  }

  findHeading() {
    const heading = _(this.headings).findLast(x=>x.getBoundingClientRect().top < this.container.offsetTop);
    return heading;
  }

  
  onScroll() {
    const heading = this.findHeading();
    if (!heading) {
      return;
    }
    if (this.currentHeading === heading) {
      return;
    }
    this.currentHeading = heading;
    console.log(heading.id)
  }
}