
function waitAsync(ms) {
    return new Promise(res => setTimeout(res, ms));
}

const HiddenClass = "hidden";
const VisibleClass = "visible";
const speechServerUrl = 'http://localhost:8889';

class Presentation {
    page = undefined;
    currentStepEl = undefined;
    steps = [];
    constructor() {
        this.setPage(1);
        $('.page, .step').addClass(HiddenClass);
        this.initSpeakElements();
    }

    appendAudioElement(parentElement, url) {
        const audioElement = $(`
        <audio style="display:none;" controls preload="auto">
            <source src="${url}">
        <audio>`);
        $(parentElement).append(audioElement);
    }

    initSpeakElements() {
        const speakElements = $('div[data-speak]');
        for(const el of speakElements) {
            const text = encodeURIComponent(el.innerText.replace(/\s+/g, ' ').trim());
            const url = `${speechServerUrl}/${text}`
            this.appendAudioElement(el, url);
        }
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

    editorNoContentWorkaround() {
        $(`div.${this.pageClass()} werckmeister-snippet`).each((i, el) => {
            el.editor.update();
        });
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
        this.editorNoContentWorkaround();
    }

    /**
     * returns number of steps of the current page
     */
    updateSteps() {
        const stepElements = $(`div.${this.pageClass()} .step`);
        const stepClasses = stepElements.map((i,x)=>x.classList.value.match(/step-\d+/));
        this.steps = Array.from(new Set(stepClasses)).sort();
    }

    playSnippet(snippetId) {
        const snippet = $(`#${snippetId}`)[0];
        if (!snippet) {
            throw new Error(`snippet not found ${snippetId}`);
        }
        snippet.startPlayer();
    }

    nextStep() {
        if (this.currentStepEl) {
            this.currentStepEl.addClass('step-ended');
        }
        const step = this.steps[0];
        this.currentStepEl = $(`div.${this.pageClass()} .${step}`);
        if (this.currentStepEl[0].dataset?.playSnippet) {
            const snippetName = this.currentStepEl[0].dataset?.playSnippet;
            this.playSnippet(snippetName);
        }
        if (this.currentStepEl[0].dataset?.speak !== undefined) {
            console.log("PLAY")
            const audioElement = $(`div.${this.pageClass()} .${step} audio`)[0];
            audioElement.play();
        }
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