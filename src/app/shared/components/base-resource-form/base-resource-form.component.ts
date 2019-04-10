import { Component, OnInit, AfterContentChecked, Injector } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

import { switchMap } from 'rxjs/operators'

import toastr from 'toastr'

import { BaseResourceModel } from '../../models/base-resource.model'
import { BaseResourceService } from '../../services/base-resource.service'

export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {
 
    pageTitle: string
    resourceForm: FormGroup
    currentActionRoute: string
    disableButton: boolean = false
    errorMessages: string[] = null

    protected router: Router
    protected formBuilder: FormBuilder
    protected activatedRoute: ActivatedRoute

    constructor(public resource: T,
                protected injector: Injector,
                protected jsonDataToResourceFn: (json: any) => T,
                protected baseResourceService: BaseResourceService<T>) { 

        this.router = this.injector.get(Router)
        this.formBuilder = this.injector.get(FormBuilder)
        this.activatedRoute = this.injector.get(ActivatedRoute)
    }

    ngOnInit() {

        this.setCurrentActionRoute()
        this.buildResourceForm()
        this.loadResource()
    }

    ngAfterContentChecked() {

        this.setPageTitle()
    }

    protected abstract buildResourceForm(): void

    submitForm() {

        this.disableButton = true

        if (this.currentActionRoute == 'new')

            this.createResource()

        else

            this.updateResource()
    }

    protected setCurrentActionRoute() {

        if (this.activatedRoute.snapshot.url[0].path == 'new')

            this.currentActionRoute = 'new'

        else

            this.currentActionRoute = 'edit'
    }

    protected loadResource() {

        if (this.currentActionRoute == 'edit') {
            this.activatedRoute
                    .paramMap
                    .pipe(switchMap(params => this.baseResourceService.findById(+params.get('id'))))
                    .subscribe(
                        (resource) => { 

                            this.resource = resource 
                            this.resourceForm.patchValue(resource)

                        }, (error) => alert('Ocorreu um erro no servidor, tente mais tarde.'))
        }
    }

    protected setPageTitle() {

        if (this.currentActionRoute == 'new')
            this.pageTitle = this.creationPageTitle()
        else
            this.pageTitle = this.editionPageTitle()
    }

    protected creationPageTitle(): string {
        return 'Novo'
    }

    protected editionPageTitle(): string {
        return 'Edição'
    }

    protected createResource() {

        const resource: T = this.jsonDataToResourceFn(this.resourceForm.value)
        this.baseResourceService
                .create(resource)
                .subscribe(resource => this.actionsForSuccess(resource),
                            error => this.actionsForError(error))
    }

    protected updateResource() {

        const resource: T = this.jsonDataToResourceFn(this.resourceForm.value)
        this.baseResourceService
                .update(resource)
                .subscribe(resource => this.actionsForSuccess(resource),
                            error => this.actionsForError(error))
    }

    protected actionsForSuccess(resource: T) {

        const baseComponentPath: string = this.activatedRoute.snapshot.parent.url[0].path
        this.router
            .navigateByUrl(baseComponentPath, { skipLocationChange: true })
            .then(() => this.router.navigate([baseComponentPath, resource.id, 'edit']))

        toastr.success('Solicitação processada com sucesso!')
    }

    protected actionsForError(error) {

        toastr.error('Ocorreu um erro ao processar a sua solicitação')
        this.disableButton = false

        if (error.status === 422)
            this.errorMessages = JSON.parse(error._body).errors

        else 
            this.errorMessages = ['Falha na comunicação com o servidor. Por favor, tente mais tarde']
    }
}