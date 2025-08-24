import React from 'react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { ResetPassword } from '../../components/auth/ResetPassword';

export function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Set new password"
      subtitle="Your new password must be different from previous passwords"
      showBackButton={true}
      backTo="/auth/login"
    >
      <ResetPassword />
    </AuthLayout>
  );
}

export default ResetPasswordPage;