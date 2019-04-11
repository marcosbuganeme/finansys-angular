import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import currencyFormatter from 'currency-formatter'

import { Category, CategoryService } from '../../categories/shared';
import { Entry, EntryService } from '../../entries/shared';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  balance: any = 0
  expenseTotal: any = 0
  revenueTotal: any = 0

  expenseChartData: any
  revenueChartData: any

  chartOptions = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }

  entries: Entry[] = []
  categories: Category[] = []

  @ViewChild('year') year: ElementRef = null
  @ViewChild('mounth') mounth: ElementRef = null

  constructor(private entryService: EntryService, 
              private categoryService: CategoryService) {

  }

  ngOnInit() {

    this.categoryService
            .findAll()
            .subscribe(categories => this.categories = categories)
  }

  generateReports() {

    const year = this.year.nativeElement.value
    const mounth = this.mounth.nativeElement.value

    if(!mounth || !year)
      alert('Selecione um Mês e um Ano para gerar o relatório por periodo de data')

    else 
      this.entryService
          .findByMonthAndYear(mounth, year)
          .subscribe(this.setValues.bind(this))
  }

  private setValues(entries: Entry[]) {
    this.entries = entries
    this.calculateBalance()
    this.setChartData()
  }

  private calculateBalance() {
    let balance = 0
    let expenseTotal = 0
    let revenueTotal = 0

    this.entries
          .forEach(entry => {
            if (entry.type == 'revenue')
              revenueTotal += currencyFormatter.unformat(entry.amount, { code: 'BRL' })
            else
            expenseTotal += currencyFormatter.unformat(entry.amount, { code: 'BRL' })
          })

    balance = revenueTotal - expenseTotal

    this.expenseTotal = currencyFormatter.format(expenseTotal, { code: 'BRL'})
    this.revenueTotal = currencyFormatter.format(revenueTotal, { code: 'BRL'})
    this.balance = currencyFormatter.format(balance, { code: 'BRL'})
  }

  private setChartData() {

    this.revenueChartData = this.getChartData('revenue', 'Gráfico de Receitas', '#9CCC65')
    this.expenseChartData = this.getChartData('expense', 'Gráfico de Receitas', '#e03131')
  }

  private getChartData(entryType: string, title: string, color: string) {
    
    const chartData = []

    this.categories.forEach(category => {
      const filteredEntries = this.entries
                                    .filter(entry => (entry.categoryId == category.id) && (entry.type == entryType))

      if (filteredEntries.length > 0) {
        const totalAmount = filteredEntries
                                .reduce((total, entry) => total + currencyFormatter.unformat(entry.amount, { code: 'BRL' }), 0)

        chartData.push({
          categoryName: category.name,
          totalAmount: totalAmount
        })
      }
    })

    return {
              labels: chartData.map(item => item.categoryName),
              datasets: [{
                label: title,
                backgroundColor: color,
                data: chartData.map(item => item.totalAmount)
              }]
          }
  }
}
