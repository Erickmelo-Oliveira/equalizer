import { ReactNode } from 'react';
import { Calculator, Package, History, BarChart3, Sparkles } from 'lucide-react';

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