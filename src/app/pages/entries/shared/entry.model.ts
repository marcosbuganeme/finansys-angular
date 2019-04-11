import { BaseResourceModel } from '../../../shared/models/base-resource.model'
import { Category } from '../../categories/shared';

export class Entry extends BaseResourceModel {

    constructor(public id?: number,
                public name?: string,
                public description?: string,
                public type?: string,
                public amount?: string,
                public date?: string,
                public paid?: boolean,
                public categoryId?: number,
                public category?: Category) {

        super()
    }

    static types = { 
        expense: 'Despesa',
        revenue: 'Receita'
    }

    static fromJson(json: any): Entry {

        return Object.assign(new Entry(), json)
    }

    get paidText(): string {

        return this.paid ? 'Pago' : 'Pendente'
    }
}