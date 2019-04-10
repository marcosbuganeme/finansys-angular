import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';
import { flatMap, catchError } from 'rxjs/operators';

import { Entry } from './entry.model';
import { CategoryService } from '../../categories/shared';

import { BaseResourceService } from 'src/app/shared/services/base-resource.service';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

  constructor(protected injector: Injector,
              private categoryService: CategoryService) { 

    super('api/entries', injector, Entry.fromJson)
  }

  create(entry: Entry): Observable<Entry> {

    return this.setAndSendToServer(entry, super.create.bind(this))
  }

  update(entry: Entry): Observable<Entry> {

    return this.setAndSendToServer(entry, super.update.bind(this))
  }

  private setAndSendToServer(entry: Entry, sendFn: any): Observable<Entry> {

    return this.categoryService
                  .findById(entry.categoryId)
                  .pipe(flatMap(category => { 
                                      entry.category = category
                                      return sendFn(entry)
                                }
                        ), catchError(this.handleError)
                  )
  }
}