import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { ReactiveFormsModule } from '@angular/forms'

import { BreadCrumbComponent } from './components/bread-crumb/bread-crumb.component';
import { PageHeaderComponent } from './components/page-header/page-header.component'

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  declarations: [BreadCrumbComponent, PageHeaderComponent],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    BreadCrumbComponent,
    PageHeaderComponent
  ]
})
export class SharedModule { }
