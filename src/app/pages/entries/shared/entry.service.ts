import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';

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

    return this.categoryService
                  .findById(entry.categoryId)
                  .pipe(flatMap(category => { 
                                      entry.category = category
                                      return super.create(entry)
                                })
                  )
  }

  update(entry: Entry): Observable<Entry> {

    return this.categoryService
                  .findById(entry.categoryId)
                  .pipe(flatMap(category => { 
                                    entry.category = category
                                    return super.update(entry)
                                })
                  )
  }

  protected jsonDataToResources(json: any[]): Entry[] {

    const entries: Entry[] = []
    json.forEach(element => {
      const entry = Entry.fromJson(element)
      entries.push(entry)
    })

    return entries
  }

  protected jsonDataToResource(json: any): Entry {

    return Entry.fromJson(json)
  }
}