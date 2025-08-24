import React from 'react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { SignUpForm } from '../../components/auth/SignUpForm';

export function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of travelers and senders worldwide"
      showBackButton={true}
      backTo="/"
    >
      <SignUpForm />
    </AuthLayout>
  );
}

export default RegisterPage;