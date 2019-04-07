import { Component, OnInit, AfterContentChecked } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

import { switchMap } from 'rxjs/operators'

import toastr from 'toastr'

import { Category, CategoryService } from '../shared'
import { CategoriesModule } from '../categories.module';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  pageTitle: string
  currentAction: string // rota
  categoryForm: FormGroup
  category: Category = new Category() // objeto a ser trabalhado
  submittingForm: boolean = false // desabilitar o botão de enviar
  serverErrorMessages: string[] = null //mensagens retornadas do servidor

  constructor(private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.setCurrentAction()
    this.buildCategoryForm()
    this.loadCategory()
  }

  ngAfterContentChecked() {
    this.setPageTitle()
  }

  private setCurrentAction() {

    if (this.activatedRoute.snapshot.url[0].path == 'new')
      this.currentAction = 'new'

    else
      this.currentAction = 'edit'
  }

  private buildCategoryForm() {

    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    })
  }

  private loadCategory() {

    if (this.currentAction == 'edit') {

      this.activatedRoute
              .paramMap
              .pipe(switchMap(params => this.categoryService.findById(+params.get('id'))))
              .subscribe(
                  (category) => { 
                    this.category = category 
                    this.categoryForm.patchValue(category)
                  },
                  (error) => alert('Ocorreu um erro no servidor, tente mais tarde.'))
    }
  }

  private setPageTitle() {

    if (this.currentAction == 'new') {

      this.pageTitle = 'Cadastro de Nova Categoria'

    } else {

      const categoryName = this.category.name + ""
      this.pageTitle = 'Editando Categoria: ' + categoryName
    }

  }
}