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
  currentActionRoute: string
  categoryForm: FormGroup
  disableButton: boolean = false
  errorMessages: string[] = null
  category: Category = new Category()

  constructor(private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.setCurrentActionRoute()
    this.buildCategoryForm()
    this.loadCategory()
  }

  ngAfterContentChecked() {

    this.setPageTitle()
  }

  submitForm() {

    this.disableButton = true

    if (this.currentActionRoute == 'new')

      this.createCategory()

    else

      this.updateCategory()
  }

  private setCurrentActionRoute() {

    if (this.activatedRoute.snapshot.url[0].path == 'new')
      
      this.currentActionRoute = 'new'

    else

      this.currentActionRoute = 'edit'
  }

  private buildCategoryForm() {

    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    })
  }

  private loadCategory() {

    if (this.currentActionRoute == 'edit') {

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

    if (this.currentActionRoute == 'new') {

      this.pageTitle = 'Cadastro de Nova Categoria'

    } else {

      const categoryName = this.category.name || ""
      this.pageTitle = 'Editando Categoria: ' + categoryName
    }
  }

  private createCategory() {

    const category: Category = Object.assign(new Category(), this.categoryForm.value)
    this.categoryService
            .create(category)
            .subscribe(category => this.actionsForSuccess(category),
                       error => this.actionsForError(error))
  }

  private updateCategory() {

    const category: Category = Object.assign(new Category(), this.categoryForm.value)
    this.categoryService
            .update(category)
            .subscribe(category => this.actionsForSuccess(category),
                       error => this.actionsForError(error))
  }

  private actionsForSuccess(category: Category) {

    toastr.success('Solicitação processada com sucesso!')
    this.router
            .navigateByUrl('categories', { skipLocationChange: true })
            .then(() => this.router.navigate(['categories', category.id, 'edit']))
  }

  private actionsForError(error) {

    toastr.error('Ocorreu um erro ao processar a sua solicitação')
    this.disableButton = false

    if (error.status === 422)
      this.errorMessages = JSON.parse(error._body).errors

    else 
      this.errorMessages = ['Falha na comunicação com o servidor. Por favor, tente mais tarde']
  }
}