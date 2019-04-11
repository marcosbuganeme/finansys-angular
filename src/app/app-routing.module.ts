import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: '/reports', pathMatch: 'full' },
    { path: 'reports', loadChildren: './pages/reports/reports.module#ReportsModule' },
    { path: 'entries', loadChildren: './pages/entries/entries.module#EntriesModule' },
    { path: 'categories', loadChildren: './pages/categories/categories.module#CategoriesModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
