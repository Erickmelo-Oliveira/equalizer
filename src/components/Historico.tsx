import React, { useState } from 'react';
import { Search, History, Download, Filter, Trash2 } from 'lucide-react';
import { Calculo } from '../types';

interface HistoricoProps {
  calculos: Calculo[];
  onDeleteCalculo: (id: string) => void;
}

export function Historico({ calculos, onDeleteCalculo }: HistoricoProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'value'>('date');

  const filteredCalculos = calculos
    .filter((calculo) =>
      calculo.materialNome.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return b.precoVenda - a.precoVenda;
    });

  const exportData = () => {
    const csv = [
      ['Material', 'Quantidade', 'Custo Total', 'Margem %', 'Preço Venda', 'Data'].join(','),
      ...filteredCalculos.map(calc => [
        calc.materialNome,
        calc.quantidade,
        calc.custoTotal.toFixed(2),
        calc.margemLucro.toFixed(1),
        calc.precoVenda.toFixed(2),
        new Date(calc.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historico-precificacao.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDeleteClick = (id: string, materialNome: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o cálculo de "${materialNome}"?`)) {
      onDeleteCalculo(id);
    }
  };

  if (calculos.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-12">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <History className="h-12 w-12 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Nenhum cálculo realizado</h3>
          <p className="text-gray-600 text-lg">
            Os cálculos que você realizar aparecerão aqui para consulta futura.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20">
      <div className="p-8 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-3 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-4"></div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Histórico de Cálculos</h3>
              <p className="text-gray-600 mt-1">Consulte todos os cálculos realizados</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'value')}
              className="text-sm border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:shadow-md bg-white/70"
            >
              <option value="date">Mais recente</option>
              <option value="value">Maior valor</option>
            </select>
            <button
              onClick={exportData}
              className="inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
            >
              <Download className="h-4 w-4 mr-1" />
              Exportar
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por material..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md bg-white/50"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
            <tr>
              <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Material
              </th>
              <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Quantidade
              </th>
              <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Custo Total
              </th>
              <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Margem
              </th>
              <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Preço Venda
              </th>
              <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Data
              </th>
              <th className="px-8 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/50 divide-y divide-gray-100">
            {filteredCalculos.map((calculo) => (
              <tr key={calculo.id} className="hover:bg-blue-50/50 transition-all duration-200">
                <td className="px-8 py-5 whitespace-nowrap text-sm font-bold text-gray-900">
                  {calculo.materialNome}
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-600 font-medium">
                  {calculo.quantidade}
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-sm font-semibold text-gray-900">
                  R$ {calculo.custoTotal.toFixed(2)}
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-sm">
                    {calculo.margemLucro.toFixed(1)}%
                  </span>
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-sm font-bold text-green-600">
                  R$ {calculo.precoVenda.toFixed(2)}
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-600 font-medium">
                  {new Date(calculo.createdAt).toLocaleDateString()}
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-right">
                  <button
                    onClick={() => handleDeleteClick(calculo.id, calculo.materialNome)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md group"
                    title="Excluir cálculo"
                  >
                    <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}