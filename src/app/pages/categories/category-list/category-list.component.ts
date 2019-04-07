import { Component, OnInit } from '@angular/core';

import { Category, CategoryService } from '../shared'

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  categories: Category[] = []

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {

    this.categoryService
            .findAll()
            .subscribe(categories => this.categories = categories, error => alert('erro ao retornar lista'))
  }

  delete(category) {

    let mustDelete = confirm('Deseja realmente excluir esse item ?')

    if (mustDelete) {
 
      this.categoryService
              .delete(category.id)
              .subscribe(() => this.categories = this.categories.filter(element => element != category), 
                        () => alert('erro ao tentar excluir'))
    }
  }
}