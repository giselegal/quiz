import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Edit } from 'lucide-react';

interface EditResultPageButtonProps {
  className?: string;
}

export const EditResultPageButton: React.FC<EditResultPageButtonProps> = ({ className }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/resultado/editor');
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className={className}
      title="Editar página de resultados"
    >
      <Edit className="h-4 w-4 mr-2" />
      Editar Página
    </Button>
  );
};

export default EditResultPageButton;