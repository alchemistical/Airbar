import React from 'react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { ForgotPassword } from '../../components/auth/ForgotPassword';

export function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link"
      showBackButton={true}
      backTo="/auth/login"
    >
      <ForgotPassword />
    </AuthLayout>
  );
}

export default ForgotPasswordPage;