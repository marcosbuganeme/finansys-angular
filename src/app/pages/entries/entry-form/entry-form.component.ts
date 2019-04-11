import { Component, OnInit, Injector } from '@angular/core'
import { Validators } from '@angular/forms'

import { Entry, EntryService } from '../shared'
import { Category, CategoryService } from '../../categories/shared';
import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-form/base-resource-form.component';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent extends BaseResourceFormComponent<Entry> implements OnInit {

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

  constructor(protected injector: Injector,
              protected entryService: EntryService,
              protected categoryService: CategoryService) {

    super(new Entry(), injector, Entry.fromJson, entryService)
  }

  ngOnInit() {

    super.ngOnInit()
    this.loadCategories()
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

  protected buildResourceForm() {

    this.resourceForm = this.formBuilder.group({
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

  protected creationPageTitle(): string {

    return "Cadastro de Novo Lançamento"
  }

  protected editionPageTitle(): string {

    const entryName = this.resource.name || ''
    return 'Editando Lançamento: ' + entryName
  }

  private loadCategories() {

    this.categoryService
            .findAll()
            .subscribe(categories => this.categories = categories)
  }
}