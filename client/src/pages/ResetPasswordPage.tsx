
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ResetPasswordPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Reset Password</h2>
      <form className="space-y-4">
        <Input type="password" placeholder="New Password" />
        <Input type="password" placeholder="Confirm Password" />
        <Button className="w-full">Reset Password</Button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
