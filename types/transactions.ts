export enum TransactionTypeEnum {
  DEPOSIT = "deposit",
  TRANSFER = "transfer",
}

export interface Transaction {
  type: TransactionTypeEnum;
  amount: number;
  createdAt: string;
  id?: string;
  userId?: string;
  fileUrl?: string;
  category?: string;
  description?: string;
  updatedAt?: string;
  receiptBase64?: string;
}

export enum TransactionCategoryEnum {
  ALIMENTACAO = "Alimentação",
  TRANSPORTE = "Transporte",
  LAZER = "Lazer",
  RENDA = "Renda",
  MORADIA = "Moradia",
  SAUDE = "Saúde",
  EDUCACAO = "Educação",
}

export const categoryKeywords: Record<TransactionCategoryEnum, string[]> = {
  [TransactionCategoryEnum.ALIMENTACAO]: [
    "mercado",
    "supermercado",
    "padaria",
    "ifood",
  ],
  [TransactionCategoryEnum.TRANSPORTE]: [
    "uber",
    "99",
    "ônibus",
    "carro",
    "gasolina",
    "metrô",
    "trem",
    "passagem",
    "pedágio",
    "combustível",
  ],
  [TransactionCategoryEnum.LAZER]: [
    "cinema",
    "netflix",
    "spotify",
    "prime video",
    "show",
    "bar",
    "balada",
    "festa",
    "teatro",
    "parque",
  ],
  [TransactionCategoryEnum.RENDA]: [
    "salário",
    "pix recebido",
    "depósito",
    "transferência recebida",
    "freela",
    "rendimento",
    "pagamento cliente",
  ],
  [TransactionCategoryEnum.MORADIA]: [
    "aluguel",
    "condomínio",
    "luz",
    "água",
    "internet",
    "energia",
    "telefone",
    "manutenção",
    "iptu",
  ],
  [TransactionCategoryEnum.SAUDE]: [
    "farmácia",
    "remédio",
    "consulta",
    "hospital",
    "exame",
    "laboratório",
    "clínica",
    "plano de saúde",
  ],
  [TransactionCategoryEnum.EDUCACAO]: [
    "escola",
    "faculdade",
    "curso",
    "livro",
    "plataforma online",
    "ead",
    "idiomas",
    "material escolar",
  ],
};
