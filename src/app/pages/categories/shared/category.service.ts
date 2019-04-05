import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';

import { Category } from './category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private path: string = 'api/v1/categories'

  constructor(private http: HttpClient) { }

  findAll(): Observable<Category[]> {

    return this.http
                .get(this.path)
                .pipe(catchError(this.handleError), map(this.jsonDataToCategories))
  }

  findById(id: number): Observable<Category> {

    const url = `${this.path}/${id}`

    return this.http
                .get(url)
                .pipe(catchError(this.handleError), map(this.jsonDataToCategory))
  }

  create(category: Category): Observable<Category> {

    return this.http
                .post(this.path, category)
                .pipe(catchError(this.handleError), map(this.jsonDataToCategory))
  }

  update(category: Category): Observable<Category> {

    const url = `${this.path}/${category.id}`

    return this.http
                .put(this.path, category)
                .pipe(catchError(this.handleError), map(() => category))
  }

  delete(id: number): Observable<any> {

    const url = `${this.path}/${id}`

    return this.http
                  .delete(url)
                  .pipe(catchError(this.handleError), map(null))
  }

  private jsonDataToCategories(json: any[]): Category[] {

    const categories: Category[] = []
    json.forEach(category => categories.push(category as Category))

    return categories
  }

  private jsonDataToCategory(json: any): Category {

    return json as Category
  }

  private handleError(error: any): Observable<any> {

    console.log('Erro na requisição => ', error)
    return throwError(error)
  }
}