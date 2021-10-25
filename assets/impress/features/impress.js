
function waitAsync(ms) {
    return new Promise(res => setTimeout(res, ms));
}

const HiddenClass = "hidden";
const VisibleClass = "visible";

class Presentation {
    page = undefined;
    currentStepEl = undefined;
    steps = [];
    constructor() {
        this.setPage(1);
        $('.page, .step').addClass(HiddenClass);
    }

    next() {
        const numberOfSteps = this.steps.length;
        if (numberOfSteps === 0) {
            this.setPage(this.page + 1);
            return;
        }
        this.nextStep();
    }

    pageClass() {
        return `page-${this.page}`;
    }

    pageElement() {
        return $(`div.${this.pageClass()}`);
    }

    hide(el) {
        el.addClass(HiddenClass);
    }

    show(el) {
        el.removeClass(HiddenClass);
        el.addClass(VisibleClass);
    }

    async setPage(pageNr) {
        this.currentStepEl = undefined;
        const body = $(document.body);
        if (this.page !== undefined) {
            this.hide(this.pageElement());
            body.removeClass(this.pageClass());
        }
        this.page = pageNr;
        body.attr('class', '');
        body.addClass(this.pageClass());
        await waitAsync(100);
        this.show(this.pageElement());
        this.updateSteps();
    }

    /**
     * returns number of steps of the current page
     */
    updateSteps() {
        const stepElements = $(`div.${this.pageClass()} .step`);
        const stepClasses = stepElements.map((i,x)=>x.classList.value.match(/step-\d+/));
        this.steps = Array.from(new Set(stepClasses)).sort();
    }

    nextStep() {
        if (this.currentStepEl) {
            this.currentStepEl.addClass('step-ended');
        }
        const step = this.steps[0];
        this.currentStepEl = $(`div.${this.pageClass()} .${step}`);
        this.show(this.currentStepEl);
        $(document.body).addClass(step);        
        this.steps.splice(0, 1);
    }
}


$(()=>{
    const presentation  = new Presentation();
    $(document).keyup(ev => {
        if (ev.key === 'ArrowRight') {
            presentation.next();
        }
    });
});