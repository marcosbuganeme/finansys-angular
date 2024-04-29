import { Component, OnInit, Directive } from '@angular/core';

import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

@Directive()
export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  resources: T[] = []

  constructor(private baseResourceService: BaseResourceService<T>) { }

  ngOnInit() {

    this.baseResourceService
            .findAll()
            .subscribe(resources => this.resources = resources.sort((firstResource, secondResource) => secondResource.id - firstResource.id), 
                       error => alert('erro ao retornar lista'))
  }

  delete(resource: T) {

    let mustDelete = confirm('Deseja realmente excluir esse item ?')

    if (mustDelete) {
 
      this.baseResourceService
              .delete(resource.id)
              .subscribe(() => this.resources = this.resources.filter(element => element != resource), 
                        () => alert('erro ao tentar excluir'))
    }
  }
}