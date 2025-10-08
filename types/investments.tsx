export type Investment = {
    id: string;
    userId: string;
    month: string;
    year: number;
    value: number;
    createdAt: string;
    updatedAt?: string;
    description?: string;
    type: TipoInvestimentoBR;
};

export enum TipoInvestimentoBR {
    RENDA_FIXA = "Renda Fixa",
    RENDA_VARIAVEL = "Renda Variável",
    TESOURO_DIRETO = "Tesouro Direto",
    CDB = "CDB",
    LCI = "LCI",
    LCA = "LCA",
    FUNDO_IMOBILIARIO = "Fundo Imobiliário",
    ACOES = "Ações",
    OUTROS = "Outros"
}


export type InvestmentBR = Investment & {
    type: TipoInvestimentoBR;
};
