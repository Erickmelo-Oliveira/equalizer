import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { MaterialForm } from './components/MaterialForm';
import { MaterialList } from './components/MaterialList';
import { CalculadoraPreco } from './components/CalculadoraPreco';
import { Historico } from './components/Historico';
import { UserRegistration } from './components/UserRegistration';
import { LoginForm } from './components/LoginForm';
import { UserProfile } from './components/UserProfile';
import { useAuth } from './hooks/useAuth';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Material, Calculo } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [materiais, setMateriais] = useLocalStorage<Material[]>('materiais', []);
  const [calculos, setCalculos] = useLocalStorage<Calculo[]>('calculos', []);
  const { user, loading } = useAuth();

  const handleAddMaterial = (materialData: Omit<Material, 'id' | 'createdAt'>) => {
    const newMaterial: Material = {
      ...materialData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setMateriais(prev => [...prev, newMaterial]);
  };

  const handleAddMultipleMaterials = (materialsData: Omit<Material, 'id' | 'createdAt'>[]) => {
    const newMaterials: Material[] = materialsData.map(materialData => ({
      ...materialData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    setMateriais(prev => [...prev, ...newMaterials]);
  };

  const handleDeleteMaterial = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este material?')) {
      setMateriais(prev => prev.filter(material => material.id !== id));
    }
  };

  const handleAddCalculo = (calculoData: Omit<Calculo, 'id' | 'createdAt'>) => {
    const newCalculo: Calculo = {
      ...calculoData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };
    setCalculos(prev => [...prev, newCalculo]);
  };

  const handleDeleteCalculo = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cálculo?')) {
      setCalculos(prev => prev.filter(calculo => calculo.id !== id));
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard materiais={materiais} calculos={calculos} onDeleteCalculo={handleDeleteCalculo} />;
      case 'materiais':
        return (
          <div className="space-y-8">
            <MaterialForm 
              onAddMaterial={handleAddMaterial} 
              onAddMultipleMaterials={handleAddMultipleMaterials}
            />
            <MaterialList materiais={materiais} onDeleteMaterial={handleDeleteMaterial} />
          </div>
        );
      case 'calculo':
        return <CalculadoraPreco materiais={materiais} onAddCalculo={handleAddCalculo} />;
      case 'historico':
        return <Historico calculos={calculos} onDeleteCalculo={handleDeleteCalculo} />;
      case 'registro':
        if (user) {
          setActiveTab('dashboard');
          return null;
        }
        return authMode === 'register' ? (
          <UserRegistration 
            onBack={() => setActiveTab('dashboard')} 
            onSuccess={() => setActiveTab('dashboard')}
            onSwitchToLogin={() => setAuthMode('login')}
          />
        ) : (
          <LoginForm
            onBack={() => setActiveTab('dashboard')}
            onSuccess={() => setActiveTab('dashboard')}
            onSwitchToRegister={() => setAuthMode('register')}
          />
        );
      case 'perfil':
        if (!user) {
          setActiveTab('registro');
          return null;
        }
        return (
          <UserProfile 
            onBack={() => setActiveTab('dashboard')} 
          />
        );
      default:
        return <Dashboard materiais={materiais} calculos={calculos} onDeleteCalculo={handleDeleteCalculo} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;