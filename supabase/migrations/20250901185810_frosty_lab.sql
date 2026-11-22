/*
  # Sistema de Usuários e Planos do Equalizer

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `nome` (text, nome completo)
      - `email` (text, email do usuário)
      - `telefone` (text, telefone de contato)
      - `cpf` (text, CPF do usuário)
      - `idade` (integer, idade do usuário)
      - `plano_id` (uuid, referência ao plano contratado)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `planos`
      - `id` (uuid, primary key)
      - `nome` (text, nome do plano)
      - `descricao` (text, descrição do plano)
      - `preco_mensal` (decimal, preço mensal)
      - `preco_anual` (decimal, preço anual)
      - `recursos` (jsonb, lista de recursos)
      - `limite_materiais` (integer, limite de materiais)
      - `limite_calculos` (integer, limite de cálculos por mês)
      - `ativo` (boolean, se o plano está ativo)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Add policies for reading available plans
*/

-- Create planos table first
CREATE TABLE IF NOT EXISTS planos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  descricao text,
  preco_mensal decimal(10,2) NOT NULL DEFAULT 0,
  preco_anual decimal(10,2) NOT NULL DEFAULT 0,
  recursos jsonb DEFAULT '[]'::jsonb,
  limite_materiais integer DEFAULT 10,
  limite_calculos integer DEFAULT 50,
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text NOT NULL,
  email text NOT NULL,
  telefone text,
  cpf text,
  idade integer,
  plano_id uuid REFERENCES planos(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE planos ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for planos (everyone can read active plans)
CREATE POLICY "Anyone can read active plans"
  ON planos
  FOR SELECT
  USING (ativo = true);

-- Policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Insert default plans
INSERT INTO planos (nome, descricao, preco_mensal, preco_anual, recursos, limite_materiais, limite_calculos) VALUES
(
  'Gratuito',
  'Plano básico para começar',
  0,
  0,
  '["Até 10 materiais", "Até 50 cálculos/mês", "Histórico básico", "Suporte por email"]'::jsonb,
  10,
  50
),
(
  'Equalizer Plus',
  'Plano profissional completo',
  29.90,
  299.00,
  '["Materiais ilimitados", "Cálculos ilimitados", "Histórico completo", "Relatórios avançados", "Exportação de dados", "Suporte prioritário", "Análises de tendências", "Backup automático"]'::jsonb,
  -1,
  -1
),
(
  'Equalizer Pro',
  'Plano empresarial avançado',
  79.90,
  799.00,
  '["Tudo do Plus", "Multi-usuários", "API personalizada", "Integrações avançadas", "Consultoria especializada", "Treinamento incluído", "Dashboard executivo", "Relatórios personalizados"]'::jsonb,
  -1,
  -1
);