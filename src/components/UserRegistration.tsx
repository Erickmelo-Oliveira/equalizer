import React, { useState } from 'react';
import { User, Mail, Phone, CreditCard, Calendar, ArrowLeft, Check, Star, Crown, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface UserRegistrationProps {
  onBack: () => void;
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  idade: string;
  password: string;
  confirmPassword: string;
}

interface Plano {
  id: string;
  nome: string;
  descricao: string;
  preco_mensal: number;
  preco_anual: number;
  recursos: string[];
  limite_materiais: number;
  limite_calculos: number;
}

export function UserRegistration({ onBack, onSuccess, onSwitchToLogin }: UserRegistrationProps) {
  const [step, setStep] = useState<'form' | 'plans'>('form');
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [billingType, setBillingType] = useState<'mensal' | 'anual'>('mensal');
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    idade: '',
    password: '',
    confirmPassword: '',
  });

  const { user } = useAuth();

  const planos: Plano[] = [
    {
      id: 'gratuito',
      nome: 'Gratuito',
      descricao: 'Plano básico para começar',
      preco_mensal: 0,
      preco_anual: 0,
      recursos: ['Até 10 materiais', 'Até 50 cálculos/mês', 'Histórico básico', 'Suporte por email'],
      limite_materiais: 10,
      limite_calculos: 50,
    },
    {
      id: 'plus',
      nome: 'Equalizer Plus',
      descricao: 'Plano profissional completo',
      preco_mensal: 29.90,
      preco_anual: 299.00,
      recursos: [
        'Materiais ilimitados',
        'Cálculos ilimitados',
        'Histórico completo',
        'Relatórios avançados',
        'Exportação de dados',
        'Suporte prioritário',
        'Análises de tendências',
        'Backup automático'
      ],
      limite_materiais: -1,
      limite_calculos: -1,
    },
    {
      id: 'pro',
      nome: 'Equalizer Pro',
      descricao: 'Plano empresarial avançado',
      preco_mensal: 79.90,
      preco_anual: 799.00,
      recursos: [
        'Tudo do Plus',
        'Multi-usuários',
        'API personalizada',
        'Integrações avançadas',
        'Consultoria especializada',
        'Treinamento incluído',
        'Dashboard executivo',
        'Relatórios personalizados'
      ],
      limite_materiais: -1,
      limite_calculos: -1,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setStep('plans');
  };

  const handlePlanSelection = async (planId: string) => {
    setLoading(true);
    
    try {
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            nome: formData.nome,
            email: formData.email,
            telefone: formData.telefone,
            cpf: formData.cpf,
            idade: parseInt(formData.idade),
            plano_id: planId === 'gratuito' ? null : planId,
          });

        if (profileError) throw profileError;

        alert('Cadastro realizado com sucesso!');
        
        // Auto login after registration
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (!loginError) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      alert('Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setLoading(false);
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

  if (step === 'plans') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <button
              onClick={() => setStep('form')}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold mb-6 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar aos dados pessoais
            </button>
            
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Escolha seu Plano
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Selecione o plano que melhor atende às suas necessidades
            </p>

            <div className="flex justify-center mb-8">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-2 shadow-lg border border-white/20">
                <button
                  onClick={() => setBillingType('mensal')}
                  className={`px-6 py-3 rounded-xl font-bold transition-all ${
                    billingType === 'mensal'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Mensal
                </button>
                <button
                  onClick={() => setBillingType('anual')}
                  className={`px-6 py-3 rounded-xl font-bold transition-all ${
                    billingType === 'anual'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Anual
                  <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    -17%
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {planos.map((plano, index) => {
              const isPopular = plano.id === 'plus';
              const Icon = plano.id === 'gratuito' ? User : plano.id === 'plus' ? Star : Crown;
              
              return (
                <div
                  key={plano.id}
                  className={`relative bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border transition-all duration-300 hover:shadow-3xl hover:-translate-y-2 ${
                    isPopular 
                      ? 'border-yellow-400 ring-4 ring-yellow-400/20 scale-105' 
                      : 'border-white/30 hover:border-blue-300'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-blue-900 px-6 py-2 rounded-full text-sm font-black shadow-lg">
                        🔥 MAIS POPULAR
                      </div>
                    </div>
                  )}

                  <div className="p-8">
                    <div className="text-center mb-8">
                      <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 shadow-2xl ${
                        plano.id === 'gratuito' 
                          ? 'bg-gradient-to-br from-gray-500 to-gray-700'
                          : plano.id === 'plus'
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                          : 'bg-gradient-to-br from-purple-600 to-indigo-800'
                      }`}>
                        <Icon className="h-10 w-10 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-black text-gray-900 mb-2">
                        {plano.nome}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {plano.descricao}
                      </p>

                      <div className="mb-6">
                        <div className="text-5xl font-black text-gray-900 mb-2">
                          {plano.preco_mensal === 0 ? (
                            'Grátis'
                          ) : (
                            <>
                              R$ {billingType === 'mensal' ? plano.preco_mensal.toFixed(2) : (plano.preco_anual / 12).toFixed(2)}
                              <span className="text-lg text-gray-600 font-normal">/mês</span>
                            </>
                          )}
                        </div>
                        {plano.preco_mensal > 0 && billingType === 'anual' && (
                          <p className="text-sm text-green-600 font-bold">
                            Economize R$ {((plano.preco_mensal * 12) - plano.preco_anual).toFixed(2)} por ano
                          </p>
                        )}
                      </div>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {plano.recursos.map((recurso, idx) => (
                        <li key={idx} className="flex items-center">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 shadow-sm">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-gray-700 font-medium">{recurso}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handlePlanSelection(plano.id)}
                      disabled={loading}
                      className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 ${
                        plano.id === 'gratuito'
                          ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800'
                          : isPopular
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-blue-900 hover:from-yellow-500 hover:to-orange-600'
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processando...
                        </div>
                      ) : (
                        <>
                          {plano.id === 'gratuito' ? 'Começar Grátis' : 'Escolher Plano'}
                          <Zap className="h-5 w-5 ml-2 inline" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar ao Dashboard
          </button>
          
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            Criar Conta no Equalizer
          </h2>
          <p className="text-xl text-gray-600">
            Preencha seus dados para começar a usar o sistema
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome Completo */}
            <div>
              <label htmlFor="nome" className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                Nome Completo *
              </label>
              <div className="relative">
                <User className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm hover:shadow-md bg-white/70 text-lg font-semibold"
                  placeholder="Seu nome completo"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                Email *
              </label>
              <div className="relative">
                <Mail className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm hover:shadow-md bg-white/70 text-lg font-semibold"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            {/* Telefone */}
            <div>
              <label htmlFor="telefone" className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                Telefone *
              </label>
              <div className="relative">
                <Phone className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="tel"
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: formatPhone(e.target.value) })}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm hover:shadow-md bg-white/70 text-lg font-semibold"
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                  required
                />
              </div>
            </div>

            {/* CPF */}
            <div>
              <label htmlFor="cpf" className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                CPF *
              </label>
              <div className="relative">
                <CreditCard className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm hover:shadow-md bg-white/70 text-lg font-semibold"
                  placeholder="000.000.000-00"
                  maxLength={14}
                  required
                />
              </div>
            </div>

            {/* Idade */}
            <div>
              <label htmlFor="idade" className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                Idade *
              </label>
              <div className="relative">
                <Calendar className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="number"
                  id="idade"
                  value={formData.idade}
                  onChange={(e) => setFormData({ ...formData, idade: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm hover:shadow-md bg-white/70 text-lg font-semibold"
                  placeholder="Sua idade"
                  min="16"
                  max="120"
                  required
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                Senha *
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm hover:shadow-md bg-white/70 text-lg font-semibold"
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required
              />
            </div>

            {/* Confirmar Senha */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                Confirmar Senha *
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm hover:shadow-md bg-white/70 text-lg font-semibold"
                placeholder="Confirme sua senha"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg"
            >
              Continuar para Planos
              <ArrowLeft className="h-5 w-5 ml-2 inline rotate-180" />
            </button>
          </form>
        </div>
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 mb-4">Já tem uma conta?</p>
            <button
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:text-blue-800 font-bold transition-colors"
            >
              Fazer login
            </button>
          </div>
      </div>
    </div>
  );
}