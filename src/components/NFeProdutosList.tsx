import React, { useState } from 'react';
import { Package, Check, X, CreditCard as Edit3, FileText, Building, Calendar } from 'lucide-react';
import { NFeProduto, NFeData, Material } from '../types';

interface NFeProdutosListProps {
  nfeData: NFeData;
  onImportProducts: (produtos: Omit<Material, 'id' | 'createdAt'>[]) => void;
  onClose: () => void;
}

export function NFeProdutosList({ nfeData, onImportProducts, onClose }: NFeProdutosListProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editedProducts, setEditedProducts] = useState<{ [key: string]: Partial<NFeProduto> }>({});

  const handleProductToggle = (codigo: string) => {
    setSelectedProducts(prev => 
      prev.includes(codigo) 
        ? prev.filter(p => p !== codigo)
        : [...prev, codigo]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === nfeData.produtos.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(nfeData.produtos.map(p => p.codigo));
    }
  };

  const handleEditProduct = (codigo: string) => {
    setEditingProduct(codigo);
  };

  const handleSaveEdit = (codigo: string) => {
    setEditingProduct(null);
  };

  const handleEditChange = (codigo: string, field: string, value: string) => {
    setEditedProducts(prev => ({
      ...prev,
      [codigo]: {
        ...prev[codigo],
        [field]: value
      }
    }));
  };

  const getProductData = (produto: NFeProduto) => {
    const edited = editedProducts[produto.codigo];
    return { ...produto, ...edited };
  };

  const handleImport = () => {
    const produtosParaImportar = nfeData.produtos
      .filter(produto => selectedProducts.includes(produto.codigo))
      .map(produto => {
        const produtoData = getProductData(produto);
        
        return {
          nome: produtoData.descricao,
          descricao: `Importado da NFe ${nfeData.numero} - NCM: ${produtoData.ncm}`,
          custoPorKg: produtoData.valorUnitario,
          unidade: mapUnidade(produtoData.unidade),
          categoria: 'Importado NFe',
          fornecedor: nfeData.nomeEmitente,
          codigoInterno: produtoData.codigo,
        } as Omit<Material, 'id' | 'createdAt'>;
      });

    onImportProducts(produtosParaImportar);
  };

  const mapUnidade = (unidadeNFe: string): Material['unidade'] => {
    const mapeamento: { [key: string]: Material['unidade'] } = {
      'KG': 'kg',
      'G': 'g',
      'L': 'l',
      'ML': 'ml',
      'M': 'm',
      'CM': 'cm',
      'UN': 'un',
      'PC': 'pc',
      'CX': 'cx',
      'DZ': 'dz',
      'PAR': 'par'
    };
    
    return mapeamento[unidadeNFe.toUpperCase()] || 'un';
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Produtos da NFe</h3>
                <p className="text-gray-600 text-sm">Selecione os produtos para importar</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* NFe Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-blue-600 mr-2" />
                <div>
                  <p className="text-gray-600">NFe</p>
                  <p className="font-bold text-gray-900">{nfeData.numero}/{nfeData.serie}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Building className="h-4 w-4 text-blue-600 mr-2" />
                <div>
                  <p className="text-gray-600">Emitente</p>
                  <p className="font-bold text-gray-900">{nfeData.nomeEmitente}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                <div>
                  <p className="text-gray-600">Data</p>
                  <p className="font-bold text-gray-900">
                    {new Date(nfeData.dataEmissao).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Package className="h-4 w-4 text-blue-600 mr-2" />
                <div>
                  <p className="text-gray-600">Valor Total</p>
                  <p className="font-bold text-green-600">R$ {nfeData.valorTotal.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-gray-900">
              Produtos ({nfeData.produtos.length})
            </h4>
            <button
              onClick={handleSelectAll}
              className="text-sm bg-blue-100 text-blue-700 px-4 py-2 rounded-xl hover:bg-blue-200 transition-all font-medium"
            >
              {selectedProducts.length === nfeData.produtos.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
            </button>
          </div>

          <div className="space-y-3">
            {nfeData.produtos.map((produto) => {
              const produtoData = getProductData(produto);
              const isSelected = selectedProducts.includes(produto.codigo);
              const isEditing = editingProduct === produto.codigo;

              return (
                <div
                  key={produto.codigo}
                  className={`border-2 rounded-2xl p-4 transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start flex-1">
                      <button
                        onClick={() => handleProductToggle(produto.codigo)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center mr-4 mt-1 transition-all ${
                          isSelected
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {isSelected && <Check className="h-4 w-4 text-white" />}
                      </button>

                      <div className="flex-1">
                        {isEditing ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={produtoData.descricao}
                              onChange={(e) => handleEditChange(produto.codigo, 'descricao', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Descrição do produto"
                            />
                            <div className="grid grid-cols-3 gap-3">
                              <input
                                type="number"
                                value={produtoData.valorUnitario}
                                onChange={(e) => handleEditChange(produto.codigo, 'valorUnitario', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Valor unitário"
                                step="0.01"
                              />
                              <input
                                type="text"
                                value={produtoData.unidade}
                                onChange={(e) => handleEditChange(produto.codigo, 'unidade', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Unidade"
                              />
                              <input
                                type="text"
                                value={produtoData.codigo}
                                onChange={(e) => handleEditChange(produto.codigo, 'codigo', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Código"
                              />
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h5 className="font-bold text-gray-900 mb-2">{produtoData.descricao}</h5>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Código</p>
                                <p className="font-medium text-gray-900">{produtoData.codigo}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Quantidade</p>
                                <p className="font-medium text-gray-900">{produtoData.quantidade} {produtoData.unidade}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Valor Unitário</p>
                                <p className="font-medium text-green-600">R$ {produtoData.valorUnitario.toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Valor Total</p>
                                <p className="font-bold text-green-600">R$ {produtoData.valorTotal.toFixed(2)}</p>
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              NCM: {produtoData.ncm} | CFOP: {produtoData.cfop}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {isEditing ? (
                        <button
                          onClick={() => handleSaveEdit(produto.codigo)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-all"
                          title="Salvar alterações"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditProduct(produto.codigo)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="Editar produto"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{selectedProducts.length}</span> de{' '}
              <span className="font-medium">{nfeData.produtos.length}</span> produtos selecionados
            </div>
            <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleImport}
                disabled={selectedProducts.length === 0}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Importar {selectedProducts.length} Produto{selectedProducts.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}