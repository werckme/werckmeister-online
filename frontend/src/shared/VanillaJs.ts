import * as _ from 'lodash';
const ScrollBlockClass = "cdk-global-scrollblock"; // the same class is used by ant for modal

const scrollSpyOffsetPx = 25;

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
  onScrolledToAnchor: (anchor: Element) => void = () => {};
  constructor(private container: HTMLElement) {
    const maxHeadingLevel = 5;
    window.onscroll = _.debounce(this.onScroll.bind(this), 200);
    this.headings = _(_.range(1, maxHeadingLevel + 1))
      .map(level => Array.from(this.container.querySelectorAll(`h${level}[id]`)))
      .flatten()
      .orderBy(heading => (heading as HTMLElement).offsetTop)
      .value()
    ;
  }

  findHeading() {
    const heading = _(this.headings).findLast(x => x.getBoundingClientRect().top < this.container.offsetTop + scrollSpyOffsetPx);
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
    this.onScrolledToAnchor(heading);
  }
}
