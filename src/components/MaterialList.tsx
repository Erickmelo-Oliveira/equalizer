import React, { useState } from 'react';
import { Search, Package, Edit3, Trash2, Filter, Grid, List, Eye, AlertTriangle, CheckCircle } from 'lucide-react';
import { Material } from '../types';

interface MaterialListProps {
  materiais: Material[];
  onDeleteMaterial: (id: string) => void;
}

export function MaterialList({ materiais, onDeleteMaterial }: MaterialListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [sortBy, setSortBy] = useState<'nome' | 'categoria' | 'custo'>('nome');
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const filteredMateriais = materiais.filter((material) =>
    (material.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
     material.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     material.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     material.fornecedor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     material.codigoInterno?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory === '' || material.categoria === selectedCategory)
  ).sort((a, b) => {
    switch (sortBy) {
      case 'nome':
        return a.nome.localeCompare(b.nome);
      case 'categoria':
        return (a.categoria || '').localeCompare(b.categoria || '');
      case 'custo':
        return b.custoPorKg - a.custoPorKg;
      default:
        return 0;
    }
  });

  const categorias = [...new Set(materiais.map(m => m.categoria).filter(Boolean))];

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      onDeleteMaterial(itemToDelete);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setItemToDelete(null);
  };

  if (materiais.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-12">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Package className="h-12 w-12 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Nenhum item cadastrado</h3>
          <p className="text-gray-600 text-lg">
            Comece cadastrando seus primeiros itens para realizar análises de precificação.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20">
      <div className="p-8 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center">
              <div className="w-3 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-4"></div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Itens Cadastrados</h3>
                <p className="text-gray-600 mt-1">{filteredMateriais.length} de {materiais.length} item(ns)</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
              className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
              title={viewMode === 'grid' ? 'Visualização em tabela' : 'Visualização em grade'}
            >
              {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome, categoria, descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md bg-white/50"
            />
          </div>
          
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md bg-white/50"
            >
              <option value="">Todas as categorias</option>
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md bg-white/50"
            >
              <option value="nome">Ordenar por Nome</option>
              <option value="categoria">Ordenar por Categoria</option>
              <option value="custo">Ordenar por Custo</option>
            </select>
          </div>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Custo/Unidade
                </th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Fornecedor
                </th>
                <th className="px-8 py-5 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-gray-100">
              {filteredMateriais.map((material) => (
                <tr key={material.id} className="hover:bg-blue-50/50 transition-all duration-200">
                  <td className="px-8 py-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mr-4 shadow-sm">
                        <Package className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{material.nome}</div>
                        {material.descricao && (
                          <div className="text-xs text-gray-600 mt-1 max-w-xs truncate">
                            {material.descricao}
                          </div>
                        )}
                        {material.codigoInterno && (
                          <div className="text-xs text-blue-600 mt-1 font-medium">
                            Código: {material.codigoInterno}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {material.categoria ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-sm">
                        {material.categoria}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-bold text-gray-900">
                      R$ {material.custoPorKg.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      por {material.unidade}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm text-gray-900 font-medium">
                      {material.fornecedor || '-'}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end space-x-3">
                      <button 
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                        title="Visualizar detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                        title="Editar item"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(material.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                        title="Excluir item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMateriais.map((material) => (
              <div key={material.id} className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Package className="h-7 w-7 text-blue-600" />
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(material.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <h4 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-blue-600 transition-colors duration-300">{material.nome}</h4>
                
                {material.descricao && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{material.descricao}</p>
                )}
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-medium">Custo:</span>
                    <span className="font-bold text-gray-900">R$ {material.custoPorKg.toFixed(2)}/{material.unidade}</span>
                  </div>
                  
                  {material.categoria && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-medium">Categoria:</span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-sm">
                        {material.categoria}
                      </span>
                    </div>
                  )}
                  
                  {material.fornecedor && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-medium">Fornecedor:</span>
                      <span className="text-sm text-gray-900 font-semibold">{material.fornecedor}</span>
                    </div>
                  )}
                  
                  {material.codigoInterno && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-medium">Código:</span>
                      <span className="text-sm font-mono text-blue-600 font-bold">{material.codigoInterno}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* Modal de Confirmação de Exclusão */}
    {itemToDelete && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform animate-in zoom-in-95 duration-300">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mr-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Confirmar Exclusão</h3>
              <p className="text-gray-600 text-sm">Esta ação não pode ser desfeita</p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-8">
            Tem certeza que deseja excluir este item? Todos os dados relacionados serão perdidos permanentemente.
          </p>
          
          <div className="flex space-x-4">
            <button
              onClick={cancelDelete}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Cancelar
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}