
// Utilidade para integração com webhook do Hotmart

export interface HotmartWebhookPayload {
  event: string;
  webhook_id: string;
  timestamp: string;
  data: {
    transaction?: {
      id: string;
    };
    buyer?: {
      email: string;
      name: string;
    };
    product?: {
      id: string;
      name: string;
    };
  };
}

interface UserData {
  quiz_results?: any;
  funnel_step?: string;
  page_url?: string;
  timestamp?: number;
  name?: string;
  quizStarted?: boolean;
}

// Manager para webhook do Hotmart
export const hotmartWebhookManager = {
  isEnabled: () => {
    return process.env.NODE_ENV === 'production';
  },

  processWebhook: async (payload: HotmartWebhookPayload) => {
    try {
      console.log('[Hotmart] Processing webhook:', payload.event);
      
      // Process different webhook events
      switch (payload.event) {
        case 'PURCHASE_APPROVED':
          console.log('[Hotmart] Purchase approved:', payload.data.transaction?.id);
          break;
        case 'PURCHASE_REFUNDED':
          console.log('[Hotmart] Purchase refunded:', payload.data.transaction?.id);
          break;
        default:
          console.log('[Hotmart] Unknown event:', payload.event);
      }

      return { success: true };
    } catch (error) {
      console.error('[Hotmart] Error processing webhook:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
};

// Função para armazenar dados do usuário para correlação futura
export const storeUserForHotmart = (email: string, data: UserData) => {
  if (!email || !hotmartWebhookManager.isEnabled()) {
    console.log('[Hotmart] Webhook disabled or missing email');
    return;
  }

  const userData = {
    ...data,
    timestamp: Date.now(),
    email
  };

  // Armazenar no localStorage para correlação futura
  try {
    localStorage.setItem(`hotmart_user_${email}`, JSON.stringify(userData));
    console.log('[Hotmart] User data stored for correlation:', email);
  } catch (error) {
    console.error('[Hotmart] Error storing user data:', error);
  }
};
