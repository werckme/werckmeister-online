import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'sorted'
})
export class SortedPipe implements PipeTransform {

  transform(value: any[], ...args: ("asc"|"desc")[]): any[] {
    const order:"asc"|"desc" = args[0] || 'asc'
    return _.orderBy(value, x => x, [order]);
  }

}
