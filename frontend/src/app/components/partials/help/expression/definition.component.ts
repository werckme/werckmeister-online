import { Component, OnInit, Input } from '@angular/core';
import { IExpressionDef } from 'src/shared/help/expressionDefs';

@Component({
	selector: 'help-definition',
	templateUrl: './definition.component.html',
	styleUrls: ['./definition.component.scss']
})
export class ExpressionComponent implements OnInit {

	@Input()
	def: IExpressionDef;
	constructor() { }

	ngOnInit() {
	}

}
