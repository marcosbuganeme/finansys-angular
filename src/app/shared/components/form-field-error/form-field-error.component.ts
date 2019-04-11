import { Component, Input } from '@angular/core'
import { FormControl } from '@angular/forms'

@Component({
  selector: 'app-form-field-error',
  template: `
    <p class="text-danger">
      {{ errorMessage }}
    </p>
  `,
  styleUrls: ['./form-field-error.component.css']
})
export class FormFieldErrorComponent {

  @Input('form-control') formControl: FormControl

  constructor() { }

  public get errorMessage(): string | null {

    if (this.mustShowMessageError())

      return this.showMessage()

    else 
      return null
  }

  private mustShowMessageError():boolean {

    return this.isInvalid() && this.isTouched()
  }

  private isInvalid(): boolean {

    return this.formControl.invalid
  }

  private isTouched():boolean {

    return this.formControl.touched
  }

  private showMessage(): string | null {

    if (this.formControl.errors.required)

      return 'Dado Obrigatório!'

    if (this.formControl.errors.email)

      return 'Email em Formato Inválido!'
    else
      if (this.formControl.errors.minlength) {

        const requiredLength = this.formControl.errors.minlength.requiredLength
        return `Deve conter no mínimo ${requiredLength} caracteres!`
    }
    else
      if (this.formControl.errors.maxlength) {

        const requiredLength = this.formControl.errors.maxlength.requiredLength
        return `Deve conter no máximo ${requiredLength} caracteres!`
    }
  }
}