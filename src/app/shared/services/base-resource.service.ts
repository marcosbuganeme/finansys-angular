import { HttpClient } from '@angular/common/http'

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { BaseResourceModel } from '../models/base-resource.model';
import { Injector } from '@angular/core';

export abstract class BaseResourceService<T extends BaseResourceModel> {

    protected http: HttpClient

    constructor(protected path: string, 
                protected injector: Injector) {

                    this.http = injector.get(HttpClient)
    }

    findAll(): Observable<T[]> {

        return this.http
                    .get(this.path)
                    .pipe(catchError(this.handleError), map(this.jsonDataToResources))
    }

    findById(id: number): Observable<T> {

        const url = `${this.path}/${id}`

        return this.http
                    .get(url)
                    .pipe(catchError(this.handleError), map(this.jsonDataToResource))
    }

    create(resource: T): Observable<T> {

        return this.http
                    .post(this.path, resource)
                    .pipe(catchError(this.handleError), map(this.jsonDataToResource))
    }

    update(resource: T): Observable<T> {

        const url = `${this.path}/${resource.id}`

        return this.http
                    .put(url, resource)
                    .pipe(catchError(this.handleError), map(() => resource))
    }

    delete(id: number): Observable<any> {

        const url = `${this.path}/${id}`

        return this.http
                    .delete(url)
                    .pipe(catchError(this.handleError), map(null))
    }

    protected jsonDataToResources(json: any[]): T[] {

        const resources: T[] = []
        json.forEach(resource => resources.push(resource as T))

        return resources
    }

    protected jsonDataToResource(json: any): T {

        return json as T
    }

    protected handleError(error: any): Observable<any> {

        console.log('Erro na requisição => ', error)
        return throwError(error)
    }
}