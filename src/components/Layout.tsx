import React, { ReactNode } from 'react';
import { Calculator, Package, History, BarChart3, Sparkles, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'materiais', label: 'Materiais', icon: Package },
  { id: 'calculo', label: 'Precificação', icon: Calculator },
  { id: 'historico', label: 'Histórico', icon: History },
];

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const { user, profile, plano, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      await signOut();
    }
  };

  const getPlanName = () => {
    if (plano) return plano.nome;
    return 'Gratuito';
  };

  const getPlanColor = () => {
    if (!plano) return 'from-gray-400 to-gray-500';
    if (plano.nome.includes('Plus')) return 'from-blue-400 to-purple-500';
    if (plano.nome.includes('Pro')) return 'from-purple-500 to-indigo-600';
    return 'from-gray-400 to-gray-500';
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 backdrop-blur-lg shadow-2xl border-b border-blue-700/30 sticky top-0 z-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18 relative">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 border border-blue-400/30">
                  <Calculator className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full animate-pulse shadow-lg flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-blue-900" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-black text-white drop-shadow-2xl bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Equalizer
                </h1>
                <p className="text-sm text-blue-100 -mt-1 font-semibold tracking-wide">Sistema Inteligente de Precificação</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-lg rounded-2xl px-4 py-2 border border-white/20 shadow-lg group">
                <User className="h-5 w-5 text-blue-100" />
                {loading ? (
                  <div className="text-right">
                    <div className="w-16 h-4 bg-white/20 rounded animate-pulse mb-1"></div>
                    <div className="w-12 h-3 bg-white/20 rounded animate-pulse"></div>
                  </div>
                ) : user && profile ? (
                  <div className="relative group">
                    <button className="text-right hover:bg-white/10 rounded-xl px-2 py-1 transition-all duration-300">
                      <p className="text-sm font-bold text-white truncate max-w-32">
                        {profile.nome.split(' ')[0]}
                      </p>
                      <span className={`text-xs bg-gradient-to-r ${getPlanColor()} text-white px-2 py-0.5 rounded-full font-bold shadow-sm`}>
                        {getPlanName()}
                      </span>
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <div className="p-4 border-b border-gray-100">
                        <p className="font-bold text-gray-900">{profile.nome}</p>
                        <p className="text-sm text-gray-600">{profile.email}</p>
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getPlanColor()} text-white shadow-sm`}>
                            {getPlanName()}
                          </span>
                        </div>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => onTabChange('perfil')}
                          className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <Settings className="h-4 w-4 mr-3 text-gray-500" />
                          Configurações
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sair da Conta
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => onTabChange('registro')}
                    className="text-right hover:bg-white/10 rounded-xl px-2 py-1 transition-all duration-300"
                  >
                    <p className="text-sm font-bold text-white">Usuário</p>
                    <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-blue-900 px-2 py-0.5 rounded-full font-bold shadow-sm">
                      Gratuito
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-blue-800/95 backdrop-blur-lg shadow-2xl border-b border-blue-600/30 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700/20 to-purple-700/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 overflow-x-auto relative">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center px-6 py-4 text-sm font-bold transition-all duration-300 whitespace-nowrap relative group rounded-t-2xl ${
                    activeTab === tab.id
                      ? 'text-white bg-gradient-to-b from-blue-600 to-blue-700 shadow-2xl border-b-4 border-yellow-400 transform -translate-y-1'
                      : 'text-blue-100 hover:text-white hover:bg-blue-700/40 hover:transform hover:-translate-y-0.5'
                  }`}
                  title={`Ir para ${tab.label}`}
                >
                  <Icon className={`h-6 w-6 mr-3 transition-all duration-300 ${
                    activeTab === tab.id ? 'scale-110 text-yellow-300' : 'group-hover:scale-105'
                  }`} />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-t-2xl"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 to-purple-500/3 rounded-3xl"></div>
        <div className="relative">
        {children}
        </div>
      </main>
    </div>
  );
}