import { useNavigate } from 'react-router-dom';

export const useUniversalNavigation = () => {
  const navigate = useNavigate();

  const universalNavigate = (path: string) => {
    navigate(path);
  };

  return {
    navigate: universalNavigate,
    push: universalNavigate, // Alias para compatibilidade
    replace: (path: string) => navigate(path, { replace: true })
  };
};
