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