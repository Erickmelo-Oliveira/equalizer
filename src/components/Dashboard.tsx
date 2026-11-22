import React from 'react';
import { Package, Calculator, TrendingUp, DollarSign, Trash2, AlertTriangle, ArrowRight, Plus, BarChart } from 'lucide-react';
import { Material, Calculo } from '../types';

interface DashboardProps {
  materiais: Material[];
  calculos: Calculo[];
  onDeleteCalculo: (id: string) => void;
}

export function Dashboard({ materiais, calculos, onDeleteCalculo }: DashboardProps) {
  const stats = {
    totalMateriais: materiais.length,
    totalCalculos: calculos.length,
    lucroMedio: calculos.length > 0 ? calculos.reduce((acc, calc) => acc + calc.margemLucro, 0) / calculos.length : 0,
    valorTotalVendas: calculos.reduce((acc, calc) => acc + calc.precoVenda, 0),
  };

  const recentCalculos = calculos.slice(-5).reverse();

  const handleDeleteClick = (id: string, materialNome: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o cálculo de "${materialNome}"?`)) {
      onDeleteCalculo(id);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, description, isEmpty }: any) => (
    <div className="bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-2">{title}</p>
          <p className="text-4xl font-black text-gray-900 mb-1 group-hover:scale-105 transition-transform duration-300">{value}</p>
          {description && <p className="text-xs text-gray-500 font-medium">{description}</p>}
        </div>
        <div className={`p-5 rounded-3xl ${color} shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative`}>
          <Icon className="h-10 w-10 text-white relative z-10" />
          <div className="absolute inset-0 bg-white/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
      {isEmpty && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Comece agora:</p>
          <button className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-full font-bold hover:shadow-lg transition-all duration-300 flex items-center">
            <Plus className="h-3 w-3 mr-1" />
            Adicionar
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-24 translate-x-24 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-20 -translate-x-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-yellow-400/20 rounded-full animate-bounce delay-500"></div>
        <div className="absolute top-1/4 right-1/3 w-6 h-6 bg-pink-400/20 rounded-full animate-bounce delay-700"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="relative">
          <div className="flex items-center mb-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center mr-6 shadow-2xl hover:scale-105 transition-transform duration-300 border border-white/30">
              <Calculator className="h-12 w-12 text-white" />
            </div>
            <div>
              <h2 className="text-5xl font-black mb-3 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                Bem-vindo ao Equalizer
              </h2>
              <p className="text-blue-100 text-xl font-semibold tracking-wide">Sistema Inteligente de Precificação</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <p className="text-blue-50 text-xl leading-relaxed font-light mb-4">
              Gerencie seus itens, analise custos e calcule preços de venda com precisão profissional.
            </p>
            <p className="text-white text-xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Transforme dados em decisões estratégicas para seu negócio.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions - Only show if no data */}
      {stats.totalMateriais === 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-200 shadow-xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <ArrowRight className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Comece sua jornada agora!</h3>
            <p className="text-gray-600 text-lg mb-6">
              Cadastre seu primeiro item para começar a usar o sistema de precificação.
            </p>
            <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
              <Plus className="h-5 w-5 mr-2" />
              Cadastrar Primeiro Item
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard
          title="Total de Itens"
          value={stats.totalMateriais}
          description={stats.totalMateriais === 0 ? "Nenhum item cadastrado" : "itens cadastrados"}
          icon={Package}
          color="bg-gradient-to-br from-blue-500 to-blue-700"
          isEmpty={stats.totalMateriais === 0}
        />
        <StatCard
          title="Análises Realizadas"
          value={stats.totalCalculos}
          description={stats.totalCalculos === 0 ? "Nenhuma análise feita" : "análises de preço"}
          icon={Calculator}
          color="bg-gradient-to-br from-emerald-500 to-green-700"
          isEmpty={stats.totalCalculos === 0}
        />
        <StatCard
          title="Margem Média"
          value={stats.lucroMedio > 0 ? `${stats.lucroMedio.toFixed(1)}%` : "0%"}
          description={stats.lucroMedio === 0 ? "Sem dados de margem" : "margem de lucro"}
          icon={TrendingUp}
          color="bg-gradient-to-br from-purple-500 to-violet-700"
        />
        <StatCard
          title="Total em Vendas"
          value={stats.valorTotalVendas > 0 ? `R$ ${stats.valorTotalVendas.toFixed(2)}` : "R$ 0,00"}
          description={stats.valorTotalVendas === 0 ? "Nenhuma venda calculada" : "valor total estimado"}
          icon={DollarSign}
          color="bg-gradient-to-br from-orange-500 to-red-600"
        />
      </div>

      {/* Performance Insights - Only show if there's data */}
      {stats.totalCalculos > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-200 shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <BarChart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Insights de Performance</h3>
              <p className="text-gray-600">Análise dos seus dados de precificação</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/30">
              <h4 className="font-bold text-gray-800 mb-2">Produto Mais Analisado</h4>
              <p className="text-2xl font-bold text-blue-600">
                {calculos.length > 0 ? calculos[calculos.length - 1].materialNome : '-'}
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/30">
              <h4 className="font-bold text-gray-800 mb-2">Maior Margem</h4>
              <p className="text-2xl font-bold text-green-600">
                {calculos.length > 0 ? `${Math.max(...calculos.map(c => c.margemLucro)).toFixed(1)}%` : '0%'}
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/30">
              <h4 className="font-bold text-gray-800 mb-2">Maior Venda</h4>
              <p className="text-2xl font-bold text-purple-600">
                R$ {calculos.length > 0 ? Math.max(...calculos.map(c => c.precoVenda)).toFixed(2) : '0,00'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Calculations */}
      {recentCalculos.length > 0 && (
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30">
          <div className="p-10 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-4 h-10 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-5 shadow-lg"></div>
              <div>
                <h3 className="text-3xl font-black text-gray-900">Análises Recentes</h3>
                <p className="text-gray-600 mt-2 text-lg">Últimos 5 cálculos de precificação realizados</p>
              </div>
            </div>
          </div>
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                <tr>
                  <th className="px-10 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-10 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider">
                    Quantidade
                  </th>
                  <th className="px-10 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider">
                    Preço de Venda
                  </th>
                  <th className="px-10 py-6 text-left text-sm font-black text-gray-700 uppercase tracking-wider">
                    Margem
                  </th>
                  <th className="px-10 py-6 text-right text-sm font-black text-gray-700 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/60 divide-y divide-gray-100">
                {recentCalculos.map((calculo) => (
                  <tr key={calculo.id} className="hover:bg-blue-50/70 transition-all duration-300 hover:shadow-lg">
                    <td className="px-10 py-6 whitespace-nowrap text-base font-bold text-gray-900">
                      {calculo.materialNome}
                    </td>
                    <td className="px-10 py-6 whitespace-nowrap text-base text-gray-700 font-semibold">
                      {calculo.quantidade}
                    </td>
                    <td className="px-10 py-6 whitespace-nowrap text-base font-black text-green-600">
                      R$ {calculo.precoVenda.toFixed(2)}
                    </td>
                    <td className="px-10 py-6 whitespace-nowrap">
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-black bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 shadow-lg border border-green-200">
                        {calculo.margemLucro.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-10 py-6 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDeleteClick(calculo.id, calculo.materialNome)}
                        className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl group hover:scale-110"
                        title="Excluir cálculo"
                      >
                        <Trash2 className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}