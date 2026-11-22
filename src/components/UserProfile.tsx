import React, { useState } from 'react';
import { User, Mail, Phone, CreditCard, Calendar, Save, ArrowLeft, Crown, Star, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

interface UserProfileProps {
  onBack: () => void;
}

export function UserProfile({ onBack }: UserProfileProps) {
  const { user, profile, plano, loading } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nome: profile?.nome || '',
    telefone: profile?.telefone || '',
    cpf: profile?.cpf || '',
    idade: profile?.idade?.toString() || '',
  });

  const handleSave = async () => {
    if (!user || !profile) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          nome: formData.nome,
          telefone: formData.telefone,
          cpf: formData.cpf,
          idade: parseInt(formData.idade),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      alert('Perfil atualizado com sucesso!');
      setEditing(false);
      window.location.reload(); // Reload to update the profile data
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const getPlanIcon = () => {
    if (!plano) return User;
    if (plano.nome.includes('Plus')) return Star;
    if (plano.nome.includes('Pro')) return Crown;
    return User;
  };

  const getPlanColor = () => {
    if (!plano) return 'from-gray-500 to-gray-700';
    if (plano.nome.includes('Plus')) return 'from-blue-500 to-purple-600';
    if (plano.nome.includes('Pro')) return 'from-purple-600 to-indigo-800';
    return 'from-gray-500 to-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Erro ao carregar perfil do usuário.</p>
        </div>
      </div>
    );
  }

  const PlanIcon = getPlanIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar ao Dashboard
          </button>
          
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            Meu Perfil
          </h2>
          <p className="text-xl text-gray-600">
            Gerencie suas informações pessoais e plano
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações do Plano */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8">
              <div className="text-center">
                <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 shadow-2xl bg-gradient-to-br ${getPlanColor()}`}>
                  <PlanIcon className="h-10 w-10 text-white" />
                </div>
                
                <h3 className="text-2xl font-black text-gray-900 mb-2">
                  {plano?.nome || 'Plano Gratuito'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {plano?.descricao || 'Plano básico para começar'}
                </p>

                {plano && (
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Materiais:</span>
                      <span className="font-bold text-gray-900">
                        {plano.limite_materiais === -1 ? 'Ilimitado' : plano.limite_materiais}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Cálculos:</span>
                      <span className="font-bold text-gray-900">
                        {plano.limite_calculos === -1 ? 'Ilimitado' : `${plano.limite_calculos}/mês`}
                      </span>
                    </div>
                  </div>
                )}

                <button className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <Zap className="h-4 w-4 mr-2 inline" />
                  Upgrade de Plano
                </button>
              </div>
            </div>
          </div>

          {/* Informações Pessoais */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Informações Pessoais</h3>
                  <p className="text-gray-600 mt-1">Gerencie seus dados pessoais</p>
                </div>
                <button
                  onClick={() => editing ? handleSave() : setEditing(true)}
                  disabled={saving}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : editing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </>
                  ) : (
                    'Editar'
                  )}
                </button>
              </div>

              <div className="space-y-6">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      value={editing ? formData.nome : profile.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all shadow-sm bg-white/70 text-lg font-semibold ${
                        editing 
                          ? 'border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 hover:shadow-md' 
                          : 'border-gray-100 bg-gray-50/50 cursor-not-allowed'
                      }`}
                      disabled={!editing}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="email"
                      value={profile.email}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-xl bg-gray-50/50 cursor-not-allowed text-lg font-semibold text-gray-600"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">O email não pode ser alterado</p>
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    Telefone
                  </label>
                  <div className="relative">
                    <Phone className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="tel"
                      value={editing ? formData.telefone : (profile.telefone || '')}
                      onChange={(e) => setFormData({ ...formData, telefone: formatPhone(e.target.value) })}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all shadow-sm bg-white/70 text-lg font-semibold ${
                        editing 
                          ? 'border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 hover:shadow-md' 
                          : 'border-gray-100 bg-gray-50/50 cursor-not-allowed'
                      }`}
                      disabled={!editing}
                      maxLength={15}
                    />
                  </div>
                </div>

                {/* CPF */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    CPF
                  </label>
                  <div className="relative">
                    <CreditCard className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      value={editing ? formData.cpf : (profile.cpf || '')}
                      onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all shadow-sm bg-white/70 text-lg font-semibold ${
                        editing 
                          ? 'border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 hover:shadow-md' 
                          : 'border-gray-100 bg-gray-50/50 cursor-not-allowed'
                      }`}
                      disabled={!editing}
                      maxLength={14}
                    />
                  </div>
                </div>

                {/* Idade */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    Idade
                  </label>
                  <div className="relative">
                    <Calendar className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="number"
                      value={editing ? formData.idade : (profile.idade?.toString() || '')}
                      onChange={(e) => setFormData({ ...formData, idade: e.target.value })}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all shadow-sm bg-white/70 text-lg font-semibold ${
                        editing 
                          ? 'border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 hover:shadow-md' 
                          : 'border-gray-100 bg-gray-50/50 cursor-not-allowed'
                      }`}
                      disabled={!editing}
                      min="16"
                      max="120"
                    />
                  </div>
                </div>

                {editing && (
                  <div className="flex space-x-4 pt-6">
                    <button
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          nome: profile?.nome || '',
                          telefone: profile?.telefone || '',
                          cpf: profile?.cpf || '',
                          idade: profile?.idade?.toString() || '',
                        });
                      }}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50"
                    >
                      {saving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="mt-8">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Informações da Conta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Data de Cadastro</label>
                <p className="text-gray-900 font-semibold">
                  {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Última Atualização</label>
                <p className="text-gray-900 font-semibold">
                  {new Date(profile.updated_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}