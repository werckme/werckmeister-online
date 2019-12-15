import { EditorSheetViewModel } from './sheet.model';

export class EditorTutorialModel extends EditorSheetViewModel {
    editorMode: string = "snippet";
    async startHighlighter() {
        if (this.werck.mainSheet.sourceId !== this.file.sourceId) {
            return;
        }
        super.startHighlighter();
    }
    stopHighlighter() {
        if (this.werck.mainSheet.sourceId !== this.file.sourceId) {
            return;
        }
        super.stopHighlighter();
        this.editor.clearMarkers();
        this.markerManager = null;
    }
}