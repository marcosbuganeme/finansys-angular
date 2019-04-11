import { HttpClient } from '@angular/common/http'

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { BaseResourceModel } from '../models/base-resource.model';
import { Injector } from '@angular/core';

export abstract class BaseResourceService<T extends BaseResourceModel> {

    protected http: HttpClient

    constructor(protected path: string, 
                protected injector: Injector,
                protected jsonDataToResourceFn: (jsonData: any) => T) {

        this.http = injector.get(HttpClient)
    }

    findAll(): Observable<T[]> {

        return this.http
                    .get(this.path)
                    .pipe(map(this.jsonDataToResources.bind(this)),
                          catchError(this.handleError))
    }

    findById(id: number): Observable<T> {

        const url = `${this.path}/${id}`

        return this.http
                    .get(url)
                    .pipe(map(this.jsonDataToResource.bind(this)),
                          catchError(this.handleError))
    }

    create(resource: T): Observable<T> {

        return this.http
                    .post(this.path, resource)
                    .pipe(map(this.jsonDataToResource.bind(this)),
                          catchError(this.handleError))
    }

    update(resource: T): Observable<T> {

        const url = `${this.path}/${resource.id}`

        return this.http
                    .put(url, resource)
                    .pipe(map(() => resource),
                          catchError(this.handleError))
    }

    delete(id: number): Observable<any> {

        const url = `${this.path}/${id}`

        return this.http
                    .delete(url)
                    .pipe(map(null),
                          catchError(this.handleError))
    }

    protected jsonDataToResources(json: any[]): T[] {

        const resources: T[] = []
        json.forEach(resource => resources.push(this.jsonDataToResourceFn(resource)))

        return resources
    }

    protected jsonDataToResource(json: any): T {

        return this.jsonDataToResourceFn(json)
    }

    protected handleError(error: any): Observable<any> {

        console.log('Erro na requisição => ', error)
        return throwError(error)
    }
}