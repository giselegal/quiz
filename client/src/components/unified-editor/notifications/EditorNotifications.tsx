
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Check, Info, AlertCircle } from 'lucide-react';

interface EditorNotificationProps {
  type: 'info' | 'warning' | 'success';
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}

export const EditorNotification: React.FC<EditorNotificationProps> = ({
  type,
  title,
  message,
  actionText,
  onAction,
  onDismiss
}) => {
  const getIcon = () => {
    switch (type) {
      case 'info': return <Info className="h-4 w-4" />;
      case 'warning': return <AlertCircle className="h-4 w-4" />;
      case 'success': return <Check className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };
  
  const getVariant = () => {
    switch (type) {
      case 'info': return 'default';
      case 'warning': return 'destructive';
      case 'success': return 'default';
      default: return 'default';
    }
  };
  
  return (
    <Alert variant={getVariant()} className="mb-4">
      <div className="flex items-start">
        <div className="mr-2 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1">
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
          
          {actionText && onAction && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onAction}
              className="mt-2"
            >
              {actionText}
            </Button>
          )}
        </div>
        {onDismiss && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0" 
            onClick={onDismiss}
          >
            &times;
          </Button>
        )}
      </div>
    </Alert>
  );
};

export const EditorNotifications: React.FC = () => {
  const [notifications, setNotifications] = React.useState<EditorNotificationProps[]>([
    {
      type: 'info',
      title: 'Editor Unificado',
      message: 'Bem-vindo ao editor unificado de quiz e páginas. As alterações no quiz serão refletidas nas páginas de resultado e vendas.',
      actionText: 'Entendi',
      onAction: () => setNotifications(prev => prev.filter(n => n.title !== 'Editor Unificado')),
    }
  ]);
  
  if (notifications.length === 0) return null;
  
  return (
    <div className="fixed bottom-4 right-4 w-80 z-50 space-y-2">
      {notifications.map((notification, index) => (
        <EditorNotification 
          key={index}
          {...notification}
          onDismiss={notification.onDismiss || (() => 
            setNotifications(prev => prev.filter((_, i) => i !== index))
          )}
        />
      ))}
    </div>
  );
};
