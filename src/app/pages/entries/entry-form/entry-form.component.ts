import { Component, OnInit, AfterContentChecked } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

import { switchMap } from 'rxjs/operators'

import toastr from 'toastr'

import { Entry, EntryService } from '../shared'
import { EntriesModule } from '../entries.module';

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

  constructor(private entryService: EntryService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.setCurrentActionRoute()
    this.buildCategoryForm()
    this.loadEntry()
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

  private setCurrentActionRoute() {

    if (this.activatedRoute.snapshot.url[0].path == 'new')
      
      this.currentActionRoute = 'new'

    else

      this.currentActionRoute = 'edit'
  }

  private buildCategoryForm() {

    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [null, [Validators.required]],
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