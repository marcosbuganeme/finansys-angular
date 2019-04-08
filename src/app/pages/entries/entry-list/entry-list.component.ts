import { Component, OnInit } from '@angular/core';

import { Entry, EntryService } from '../shared'

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class CategoryListComponent implements OnInit {

  entries: Entry[] = []

  constructor(private entryService: EntryService) { }

  ngOnInit() {

    this.entryService
            .findAll()
            .subscribe(entries => this.entries = entries, error => alert('erro ao retornar lista'))
  }

  delete(entry) {

    let mustDelete = confirm('Deseja realmente excluir esse item ?')

    if (mustDelete) {
 
      this.entryService
              .delete(entry.id)
              .subscribe(() => this.entries = this.entries.filter(element => element != entry), 
                        () => alert('erro ao tentar excluir'))
    }
  }
}