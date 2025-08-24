import React from 'react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { SignInForm } from '../../components/auth/SignInForm';

export function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Airbar account"
      showBackButton={true}
      backTo="/"
    >
      <SignInForm />
    </AuthLayout>
  );
}

export default LoginPage;