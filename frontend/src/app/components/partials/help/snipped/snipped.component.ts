import { Component, OnInit } from '@angular/core';
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

  constructor(protected werck: WerckService, protected backend: BackendService, protected files: FileService) {
    super(werck, backend, files);
  }

  ngOnInit() {
  }

}
