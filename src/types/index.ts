export interface Material {
  id: string;
  nome: string;
  descricao?: string;
  custoPorKg: number;
  unidade: 'kg' | 'g' | 'mg' | 'ton' | 'l' | 'ml' | 'm' | 'm2' | 'm3' | 'cm' | 'cm2' | 'cm3' | 'mm' | 'un' | 'par' | 'dz' | 'cx' | 'pc';
  categoria?: string;
  fornecedor?: string;
  codigoInterno?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Calculo {
  id: string;
  materialId: string;
  materialNome: string;
  quantidade: number;
  custoTotal: number;
  margemLucro: number;
  precoVenda: number;
  createdAt: Date;
}

export interface DashboardStats {
  totalMateriais: number;
  totalCalculos: number;
  lucroMedio: number;
  valorTotalVendas: number;
}

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  idade?: number;
  plano_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Plano {
  id: string;
  nome: string;
  descricao?: string;
  preco_mensal: number;
  preco_anual: number;
  recursos: string[];
  limite_materiais: number;
  limite_calculos: number;
  ativo: boolean;
  created_at: Date;
}

export interface NFeProduto {
  codigo: string;
  descricao: string;
  ncm: string;
  cfop: string;
  unidade: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  origem: string;
  cst: string;
}

export interface NFeData {
  chave: string;
  numero: string;
  serie: string;
  dataEmissao: string;
  cnpjEmitente: string;
  nomeEmitente: string;
  produtos: NFeProduto[];
  valorTotal: number;
}

export interface QRCodeData {
  chNFe: string;
  nVersao: string;
  tpAmb: string;
  cDest?: string;
  dhEmi: string;
  vNF: string;
  vICMS: string;
  digVal: string;
  cIdToken: string;
}