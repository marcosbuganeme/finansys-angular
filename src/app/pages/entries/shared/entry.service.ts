import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';
import { flatMap, catchError, map } from 'rxjs/operators';

import *  as moment from 'moment'

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

  findByMonthAndYear(month, year): Observable<Entry[]> {

    return this.findAll()
                  .pipe(map(entries => this.filterByMonthAndYear(entries, month, year)))
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

  private filterByMonthAndYear(entries: Entry[], month: number, year: number) {

    return entries
              .filter(entry => {
                const entryDate = moment(entry.date, 'DD/MM/YYYY')
                const monthMatches = entryDate.month() + 1 == month
                const yearMatches = entryDate.year() == year

                if (monthMatches && yearMatches)
                  return entry
              })
  }
}