
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
      <form className="space-y-4">
        <Input type="email" placeholder="Enter your email" />
        <Button className="w-full">Send Reset Link</Button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
