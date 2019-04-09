import { Component, OnInit, AfterContentChecked } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

import { switchMap } from 'rxjs/operators'

import toastr from 'toastr'

import { Entry, EntryService } from '../shared'
import { Category, CategoryService } from '../../categories/shared';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  pageTitle: string
  currentActionRoute: string
  entryForm: FormGroup
  disableButton: boolean = false
  errorMessages: string[] = null
  entry: Entry = new Entry()
  categories: Array<Category>

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  }

  ptBR = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar'
  }

  constructor(private entryService: EntryService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private categoryService: CategoryService) { }

  ngOnInit() {

    this.setCurrentActionRoute()
    this.buildEntryForm()
    this.loadEntry()
    this.loadCategories()
  }

  ngAfterContentChecked() {

    this.setPageTitle()
  }

  submitForm() {

    this.disableButton = true

    if (this.currentActionRoute == 'new')

      this.createEntry()

    else

      this.updateEntry()
  }

  get typeOptions(): Array<any> {

    return Object
              .entries(Entry.types)
              .map(([value, text]) => {
                return { 
                    text: text, 
                    value: value
                }
              })
  }

  private setCurrentActionRoute() {

    if (this.activatedRoute.snapshot.url[0].path == 'new')
      
      this.currentActionRoute = 'new'

    else

      this.currentActionRoute = 'edit'
  }

  private buildEntryForm() {

    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ['expanse', [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]]
    })
  }

  private loadEntry() {

    if (this.currentActionRoute == 'edit') {

      this.activatedRoute
              .paramMap
              .pipe(switchMap(params => this.entryService.findById(+params.get('id'))))
              .subscribe(
                  (entry) => { 
                    this.entry = entry 
                    this.entryForm.patchValue(entry)
                  },
                  (error) => alert('Ocorreu um erro no servidor, tente mais tarde.'))
    }
  }

  private loadCategories() {

    this.categoryService
            .findAll()
            .subscribe(categories => this.categories = categories)
  }

  private setPageTitle() {

    if (this.currentActionRoute == 'new') {

      this.pageTitle = 'Cadastro de Novo Lançamento'

    } else {

      const entryName = this.entry.name || ""
      this.pageTitle = 'Editando Lançamento: ' + entryName
    }
  }

  private createEntry() {

    const entry: Entry = Object.assign(new Entry(), this.entryForm.value)
    this.entryService
            .create(entry)
            .subscribe(entry => this.actionsForSuccess(entry),
                       error => this.actionsForError(error))
  }

  private updateEntry() {

    const entry: Entry = Object.assign(new Entry(), this.entryForm.value)
    this.entryService
            .update(entry)
            .subscribe(entry => this.actionsForSuccess(entry),
                       error => this.actionsForError(error))
  }

  private actionsForSuccess(entry: Entry) {

    toastr.success('Solicitação processada com sucesso!')
    this.router
            .navigateByUrl('entries', { skipLocationChange: true })
            .then(() => this.router.navigate(['entries', entry.id, 'edit']))
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