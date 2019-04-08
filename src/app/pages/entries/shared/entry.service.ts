import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';

import { Entry } from './entry.model';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private path: string = 'api/entries'

  constructor(private http: HttpClient) { }

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

    return this.http
                .post(this.path, entry)
                .pipe(catchError(this.handleError), map(this.jsonDataToEntry))
  }

  update(entry: Entry): Observable<Entry> {

    const url = `${this.path}/${entry.id}`

    return this.http
                .put(url, entry)
                .pipe(catchError(this.handleError), map(() => entry))
  }

  delete(id: number): Observable<any> {

    const url = `${this.path}/${id}`

    return this.http
                  .delete(url)
                  .pipe(catchError(this.handleError), map(null))
  }

  private jsonDataToEntries(json: any[]): Entry[] {

    const entries: Entry[] = []
    json.forEach(entry => entries.push(entry as Entry))

    return entries
  }

  private jsonDataToEntry(json: any): Entry {

    return json as Entry
  }

  private handleError(error: any): Observable<any> {

    console.log('Erro na requisição => ', error)
    return throwError(error)
  }
}