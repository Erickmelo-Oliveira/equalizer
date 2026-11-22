import React, { useState } from 'react';
import { Plus, Package, QrCode } from 'lucide-react';
import { Material } from '../types';
import { QRCodeScanner } from './QRCodeScanner';
import { NFeProdutosList } from './NFeProdutosList';

interface MaterialFormProps {
  onAddMaterial: (material: Omit<Material, 'id' | 'createdAt'>) => void;
  onAddMultipleMaterials?: (materials: Omit<Material, 'id' | 'createdAt'>[]) => void;
}

const unidades = [
  // Peso
  { value: 'kg', label: 'Quilogramas (kg)', categoria: 'Peso' },
  { value: 'g', label: 'Gramas (g)', categoria: 'Peso' },
  { value: 'mg', label: 'Miligramas (mg)', categoria: 'Peso' },
  { value: 'ton', label: 'Toneladas (ton)', categoria: 'Peso' },
  
  // Volume
  { value: 'l', label: 'Litros (L)', categoria: 'Volume' },
  { value: 'ml', label: 'Mililitros (ml)', categoria: 'Volume' },
  
  // Comprimento
  { value: 'm', label: 'Metros (m)', categoria: 'Comprimento' },
  { value: 'cm', label: 'Centímetros (cm)', categoria: 'Comprimento' },
  { value: 'mm', label: 'Milímetros (mm)', categoria: 'Comprimento' },
  
  // Área
  { value: 'm2', label: 'Metros Quadrados (m²)', categoria: 'Área' },
  { value: 'cm2', label: 'Centímetros Quadrados (cm²)', categoria: 'Área' },
  
  // Volume/Espaço
  { value: 'm3', label: 'Metros Cúbicos (m³)', categoria: 'Volume/Espaço' },
  { value: 'cm3', label: 'Centímetros Cúbicos (cm³)', categoria: 'Volume/Espaço' },
  
  // Unidades
  { value: 'un', label: 'Unidades (un)', categoria: 'Quantidade' },
  { value: 'par', label: 'Pares (par)', categoria: 'Quantidade' },
  { value: 'dz', label: 'Dúzias (dz)', categoria: 'Quantidade' },
  { value: 'cx', label: 'Caixas (cx)', categoria: 'Quantidade' },
  { value: 'pc', label: 'Peças (pc)', categoria: 'Quantidade' },
] as const;

export function MaterialForm({ onAddMaterial, onAddMultipleMaterials }: MaterialFormProps) {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    custoPorKg: '',
    unidade: 'kg' as const,
    categoria: '',
    fornecedor: '',
    codigoInterno: '',
  });
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showNFeProdutos, setShowNFeProdutos] = useState(false);
  const [nfeData, setNFeData] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome.trim() || !formData.custoPorKg) return;

    onAddMaterial({
      nome: formData.nome.trim(),
      descricao: formData.descricao.trim() || undefined,
      custoPorKg: parseFloat(formData.custoPorKg),
      unidade: formData.unidade,
      categoria: formData.categoria.trim() || undefined,
      fornecedor: formData.fornecedor.trim() || undefined,
      codigoInterno: formData.codigoInterno.trim() || undefined,
    });

    setFormData({ 
      nome: '', 
      descricao: '',
      custoPorKg: '', 
      unidade: 'kg', 
      categoria: '',
      fornecedor: '',
      codigoInterno: ''
    });
  };

  const handleQRScanSuccess = (data: any) => {
    setNFeData(data);
    setShowQRScanner(false);
    setShowNFeProdutos(true);
  };

  const handleImportProducts = (produtos: Omit<Material, 'id' | 'createdAt'>[]) => {
    if (onAddMultipleMaterials) {
      onAddMultipleMaterials(produtos);
    } else {
      produtos.forEach(produto => onAddMaterial(produto));
    }
    setShowNFeProdutos(false);
    setNFeData(null);
  };

  return (
    <>
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20">
      <div className="p-8 border-b border-gray-100">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Cadastrar Novo Item</h3>
            <p className="text-gray-600 mt-1">Adicione materiais, produtos ou insumos para análise</p>
            <div className="mt-4">
              <button
                onClick={() => setShowQRScanner(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
              >
                <QrCode className="h-4 w-4 mr-2" />
                Importar da NFe
              </button>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* Informações Básicas */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-200 shadow-lg">
          <h4 className="text-xl font-black text-gray-800 mb-8 flex items-center">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-4 shadow-lg"></div>
            Informações Básicas
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label htmlFor="nome" className="block text-base font-black text-gray-700 mb-4 uppercase tracking-wide">
                Nome do Item *
              </label>
              <input
                type="text"
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all hover:shadow-xl bg-white/80 text-lg font-semibold"
                placeholder="Ex: Tecido de algodão premium"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="descricao" className="block text-base font-black text-gray-700 mb-4 uppercase tracking-wide">
                Descrição
              </label>
              <textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                rows={3}
                className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all resize-none hover:shadow-xl bg-white/80 text-lg"
                placeholder="Descrição detalhada do material ou produto..."
              />
            </div>

            <div>
              <label htmlFor="categoria" className="block text-base font-black text-gray-700 mb-4 uppercase tracking-wide">
                Categoria
              </label>
              <input
                type="text"
                id="categoria"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all hover:shadow-xl bg-white/80 text-lg font-semibold"
                placeholder="Ex: Têxtil, Madeira, Eletrônicos"
              />
            </div>

            <div>
              <label htmlFor="codigoInterno" className="block text-base font-black text-gray-700 mb-4 uppercase tracking-wide">
                Código Interno
              </label>
              <input
                type="text"
                id="codigoInterno"
                value={formData.codigoInterno}
                onChange={(e) => setFormData({ ...formData, codigoInterno: e.target.value })}
                className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all hover:shadow-xl bg-white/80 text-lg font-mono"
                placeholder="Ex: MAT-001, PROD-123"
              />
            </div>
          </div>
        </div>

        {/* Informações de Custo */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-200 shadow-lg">
          <h4 className="text-xl font-black text-gray-800 mb-8 flex items-center">
            <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mr-4 shadow-lg"></div>
            Informações de Custo
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <label htmlFor="custo" className="block text-base font-black text-gray-700 mb-4 uppercase tracking-wide">
                Custo por Unidade (R$) *
              </label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-black">R$</span>
                <input
                  type="number"
                  id="custo"
                  value={formData.custoPorKg}
                  onChange={(e) => setFormData({ ...formData, custoPorKg: e.target.value })}
                  className="w-full pl-12 pr-6 py-5 border-2 border-gray-200 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all hover:shadow-xl bg-white/80 text-lg font-bold"
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="unidade" className="block text-base font-black text-gray-700 mb-4 uppercase tracking-wide">
                Unidade de Medida *
              </label>
              <select
                id="unidade"
                value={formData.unidade}
                onChange={(e) => setFormData({ ...formData, unidade: e.target.value as any })}
                className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all hover:shadow-xl bg-white/80 text-lg font-semibold"
              >
                {unidades.reduce((acc, unidade) => {
                  const categoria = unidade.categoria;
                  if (!acc.find(item => item.categoria === categoria)) {
                    acc.push({ categoria, unidades: [] });
                  }
                  acc.find(item => item.categoria === categoria)?.unidades.push(unidade);
                  return acc;
                }, [] as any[]).map((grupo) => (
                  <optgroup key={grupo.categoria} label={grupo.categoria}>
                    {grupo.unidades.map((unidade: any) => (
                      <option key={unidade.value} value={unidade.value}>
                        {unidade.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="fornecedor" className="block text-base font-black text-gray-700 mb-4 uppercase tracking-wide">
                Fornecedor
              </label>
              <input
                type="text"
                id="fornecedor"
                value={formData.fornecedor}
                onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
                className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all hover:shadow-xl bg-white/80 text-lg font-semibold"
                placeholder="Nome do fornecedor"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-8 border-t-2 border-gray-200 space-x-6">
          <button
            type="button"
            onClick={() => setFormData({ 
              nome: '', 
              descricao: '',
              custoPorKg: '', 
              unidade: 'kg', 
              categoria: '',
              fornecedor: '',
              codigoInterno: ''
            })}
            className="px-10 py-5 bg-gray-100 text-gray-700 font-black rounded-2xl hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
          >
            Limpar
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black rounded-2xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 text-lg"
          >
            <Plus className="h-6 w-6 mr-3" />
            Cadastrar Item
          </button>
        </div>
      </form>
    </div>

    {/* QR Code Scanner Modal */}
    {showQRScanner && (
      <QRCodeScanner
        onScanSuccess={handleQRScanSuccess}
        onClose={() => setShowQRScanner(false)}
      />
    )}

    {/* NFe Products List Modal */}
    {showNFeProdutos && nfeData && (
      <NFeProdutosList
        nfeData={nfeData}
        onImportProducts={handleImportProducts}
        onClose={() => {
          setShowNFeProdutos(false);
          setNFeData(null);
        }}
      />
    )}
    </>
  );
}