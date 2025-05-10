import React from 'react';
import { Card } from '@/components/ui/card';
import { ShieldCheck, LockKeyhole } from 'lucide-react';

interface SecurePurchaseElementProps {
  className?: string;
}

const SecurePurchaseElement: React.FC<SecurePurchaseElementProps> = ({ className = '' }) => {
  return (
    <div className={`flex flex-col sm:flex-row items-center justify-center gap-3 mt-3 ${className}`}>
      <div className="flex items-center gap-2 text-xs text-[#3a3a3a]/70 bg-[#f4f4f4] px-3 py-1.5 rounded-md">
        <ShieldCheck className="h-4 w-4 text-[#4CAF50]" />
        <span>Pagamento 100% Seguro</span>
      </div>
      
      <div className="flex items-center gap-2 text-xs text-[#3a3a3a]/70 bg-[#f4f4f4] px-3 py-1.5 rounded-md">
        <LockKeyhole className="h-4 w-4 text-[#4CAF50]" />
        <span>Dados Protegidos</span>
      </div>
    </div>
  );
};

export default SecurePurchaseElement;
