import React, { useState } from 'react';
import { Calculator, DollarSign } from 'lucide-react';
import { Material, Calculo } from '../types';

interface CalculadoraPrecoProps {
  materiais: Material[];
  onAddCalculo: (calculo: Omit<Calculo, 'id' | 'createdAt'>) => void;
}

export function CalculadoraPreco({ materiais, onAddCalculo }: CalculadoraPrecoProps) {
  const [formData, setFormData] = useState({
    materialId: '',
    quantidade: '',
    margemLucro: '',
  });

  const [resultado, setResultado] = useState<{
    custoTotal: number;
    precoVenda: number;
  } | null>(null);

  const handleCalcular = (e: React.FormEvent) => {
    e.preventDefault();
    
    const material = materiais.find(m => m.id === formData.materialId);
    if (!material) return;

    const quantidade = parseFloat(formData.quantidade);
    const margemLucro = parseFloat(formData.margemLucro);
    
    const custoTotal = quantidade * material.custoPorKg;
    const precoVenda = custoTotal * (1 + margemLucro / 100);

    setResultado({ custoTotal, precoVenda });

    const calculo: Omit<Calculo, 'id' | 'createdAt'> = {
      materialId: material.id,
      materialNome: material.nome,
      quantidade,
      custoTotal,
      margemLucro,
      precoVenda,
    };

    onAddCalculo(calculo);
  };

  const handleReset = () => {
    setFormData({ materialId: '', quantidade: '', margemLucro: '' });
    setResultado(null);
  };

  if (materiais.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-12">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Calculator className="h-12 w-12 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Cadastre itens primeiro</h3>
          <p className="text-gray-600 text-lg">
            Para realizar análises de precificação, você precisa cadastrar itens primeiro.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Formulário de Cálculo */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20">
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <Calculator className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Análise de Precificação</h3>
              <p className="text-gray-600 mt-1">
                Configure os parâmetros para calcular o preço ideal de venda
              </p>
            </div>
          </div>
        </div>





        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Formulário */}
          <form onSubmit={handleCalcular} className="space-y-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
              <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3"></div>
                Seleção do Item
              </h4>
              <div>
                <label htmlFor="material" className="block text-sm font-bold text-gray-700 mb-3">
                  Item para Análise *
                </label>
                <select
                  id="material"
                  value={formData.materialId}
                  onChange={(e) => setFormData({ ...formData, materialId: e.target.value })}
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:shadow-md bg-white/70"
                  required
                >
                  <option value="">Selecione um item</option>
                  {materiais.map((material) => (
                    <option key={material.id} value={material.id}>
                      {material.nome} - R$ {material.custoPorKg.toFixed(2)}/{material.unidade}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
              <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mr-3"></div>
                Parâmetros de Cálculo
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="quantidade" className="block text-sm font-bold text-gray-700 mb-3">
                    Quantidade *
                  </label>
                  <input
                    type="number"
                    id="quantidade"
                    value={formData.quantidade}
                    onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:shadow-md bg-white/70"
                    placeholder="0"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="margem" className="block text-sm font-bold text-gray-700 mb-3">
                    Margem de Lucro (%) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="margem"
                      value={formData.margemLucro}
                      onChange={(e) => setFormData({ ...formData, margemLucro: e.target.value })}
                      className="w-full px-5 py-4 pr-10 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:shadow-md bg-white/70"
                      placeholder="0"
                      step="0.1"
                      min="0"
                      required
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-semibold">%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 pt-6">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Limpar
              </button>
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <Calculator className="h-5 w-5 mr-2" />
                Calcular Preço
              </button>
            </div>
          </form>

          {/* Resultado */}
          {resultado ? (
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 border border-green-200 shadow-xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Resultado da Análise</h3>
                  <p className="text-gray-600">Preço calculado com sucesso</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">Custo Total:</span>
                    <span className="text-2xl font-bold text-gray-900">
                      R$ {resultado.custoTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">Preço de Venda:</span>
                    <span className="text-4xl font-bold text-green-600">
                      R$ {resultado.precoVenda.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90 font-medium uppercase tracking-wide">Lucro Estimado</p>
                      <p className="text-2xl font-bold">
                        R$ {(resultado.precoVenda - resultado.custoTotal).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm opacity-90 font-medium uppercase tracking-wide">Margem</p>
                      <p className="text-2xl font-bold">
                        {parseFloat(formData.margemLucro)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-12 flex items-center justify-center shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <DollarSign className="h-10 w-10 text-gray-500" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Aguardando Cálculo</h4>
                <p className="text-gray-600">
                  Preencha os campos ao lado para ver o resultado da análise
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}