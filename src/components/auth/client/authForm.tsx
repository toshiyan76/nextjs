import React from 'react';

export interface AuthFormProps {
  mode: 'login' | 'signup';
  onSubmit: (data: {
    email: string;
    password: string;
    name?: string;
    role: 'ADVENTURER' | 'CLIENT';
  }) => Promise<void>;
  isLoading?: boolean;
  buttonText?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ 
  mode, 
  onSubmit, 
  isLoading = false, 
  buttonText = mode === 'login' ? 'ログイン' : '登録' 
}) => {
  // 簡易的なモックフォーム実装
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = {
        email: 'mock@example.com',
        password: 'password',
        role: 'ADVENTURER' as const,
      };
      onSubmit(formData);
    }}>
      <button type="submit" disabled={isLoading}>
        {buttonText}
      </button>
    </form>
  );
};

export default AuthForm;