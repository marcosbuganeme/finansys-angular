import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';

import { Entry } from './entry.model';
import { CategoryService } from '../../categories/shared';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private path: string = 'api/entries'

  constructor(private http: HttpClient,
              private categoryService: CategoryService) { }

  findAll(): Observable<Entry[]> {

    return this.http
                .get(this.path)
                .pipe(catchError(this.handleError), map(this.jsonDataToEntries))
  }

  findById(id: number): Observable<Entry> {

    const url = `${this.path}/${id}`

    return this.http
                .get(url)
                .pipe(catchError(this.handleError), map(this.jsonDataToEntry))
  }

  create(entry: Entry): Observable<Entry> {

    return this.categoryService
                  .findById(entry.categoryId)
                  .pipe(flatMap(category => { 
                                  entry.category = category

                                  return this.http
                                              .post(this.path, entry)
                                              .pipe(catchError(this.handleError), map(this.jsonDataToEntry))
                                  }
                                )
                  )
  }

  update(entry: Entry): Observable<Entry> {

    const url = `${this.path}/${entry.id}`

    return this.categoryService
                    .findById(entry.categoryId)
                    .pipe(flatMap(category => { 
                                  entry.category = category

                                  return this.http
                                                .put(url, entry)
                                                .pipe(catchError(this.handleError), map(() => entry))
                                })
                    )
  }

  delete(id: number): Observable<any> {

    const url = `${this.path}/${id}`

    return this.http
                  .delete(url)
                  .pipe(catchError(this.handleError), map(null))
  }

  private jsonDataToEntries(json: any[]): Entry[] {

    const entries: Entry[] = []
    json.forEach(element => {
      const entry = Object.assign(new Entry(), element)
      entries.push(entry)
    })

    return entries
  }

  private jsonDataToEntry(json: any): Entry {

    return Object.assign(new Entry(), json)
  }

  private handleError(error: any): Observable<any> {

    console.log('Erro na requisição => ', error)
    return throwError(error)
  }
}