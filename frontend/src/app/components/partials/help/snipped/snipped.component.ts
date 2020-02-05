import { Component, OnInit, ElementRef } from '@angular/core';
import { TutorialsnippetComponent } from '../tutorialsnippet/tutorialsnippet.component';
import { WerckService } from 'src/app/services/werck.service';
import { BackendService } from 'src/app/services/backend.service';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'snipped',
  templateUrl: './snipped.component.html',
  styleUrls: ['./snipped.component.scss']
})
export class SnippedComponent extends TutorialsnippetComponent implements OnInit {

  constructor(werck: WerckService, backend: BackendService, files: FileService) {
    super(werck, backend, files);
  }

  ngOnInit() {
  }

}
