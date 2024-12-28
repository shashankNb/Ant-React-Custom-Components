export interface TParams {
    context: string;
    lKey: string;
    rKey: string;
    type: 'INNER' | 'LEFT' | 'RIGHT'
}

export interface IAlias {
    table: string;
    column: string;
    alias: string;
}

export interface IFilter {
    field: string;
    operator: string;
    value: number | string;
}

export interface IPagination {
    page: number,
    limit: number
}

export interface ISort {
    field: string;
    order: 'ASC' | 'DESC'
}

export interface IRequestBody {
    cols?: string[];
    context: string;
    alias?: IAlias[];
    tParams: TParams[];
    filters: IFilter[];
    sorts: ISort;
    pagination?: IPagination

}