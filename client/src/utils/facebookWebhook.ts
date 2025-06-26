
/**
 * Gerenciador de Webhook do Facebook
 * Processa webhooks recebidos do Facebook para tracking avançado
 */

interface FacebookWebhookManager {
  processWebhook: (data: any) => Promise<{ success: boolean; error?: string }>;
  validateWebhook: (signature: string, body: string) => boolean;
  sendConversionsAPI: (eventData: any) => Promise<boolean>;
}

class FacebookWebhookManagerImpl implements FacebookWebhookManager {
  private appSecret: string;
  private accessToken: string;
  private pixelId: string;

  constructor() {
    // Usar configurações do pixelManager
    this.appSecret = process.env.FACEBOOK_APP_SECRET || "";
    this.accessToken = process.env.FACEBOOK_ACCESS_TOKEN || "";
    this.pixelId = this.getCurrentPixelId();
  }

  private getCurrentPixelId(): string {
    // Usar o sistema existente de detecção de pixel
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.includes('/quiz-descubra-seu-estilo')) {
        return '1038647624890676'; // Pixel B
      }
    }
    return '1311550759901086'; // Pixel A (default)
  }

  async processWebhook(data: any): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('[Facebook Webhook Manager] Processando webhook:', data);

      if (!data.entry || !Array.isArray(data.entry)) {
        return { success: false, error: 'Invalid webhook structure' };
      }

      for (const entry of data.entry) {
        await this.processEntry(entry);
      }

      return { success: true };
    } catch (error) {
      console.error('[Facebook Webhook Manager] Erro:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  private async processEntry(entry: any) {
    console.log('[Facebook Webhook Manager] Processando entry:', entry.id);

    if (entry.changes) {
      for (const change of entry.changes) {
        await this.processChange(change);
      }
    }

    // Armazenar dados localmente para analytics
    this.storeWebhookData(entry);
  }

  private async processChange(change: any) {
    console.log('[Facebook Webhook Manager] Processando change:', change.field);

    switch (change.field) {
      case 'leadgen':
        await this.processLeadGen(change.value);
        break;
      case 'conversions':
        await this.processConversions(change.value);
        break;
      case 'feed':
        await this.processFeed(change.value);
        break;
      default:
        console.log(`[Facebook Webhook Manager] Campo desconhecido: ${change.field}`);
        break;
    }
  }

  private async processLeadGen(value: any) {
    console.log('[Facebook Webhook Manager] Lead gerado:', value);
    
    // Enviar para Conversions API
    await this.sendConversionsAPI({
      event_name: 'Lead',
      event_time: Math.floor(Date.now() / 1000),
      user_data: {
        em: value.email_hash || '',
        ph: value.phone_hash || ''
      },
      custom_data: {
        leadgen_id: value.leadgen_id,
        value: 0,
        currency: 'BRL'
      }
    });
  }

  private async processConversions(value: any) {
    console.log('[Facebook Webhook Manager] Conversão processada:', value);
    
    // Processar dados de conversão
    await this.sendConversionsAPI({
      event_name: 'Purchase',
      event_time: Math.floor(Date.now() / 1000),
      user_data: value.user_data || {},
      custom_data: {
        conversion_id: value.conversion_id,
        value: value.value || 47,
        currency: 'BRL'
      }
    });
  }

  private async processFeed(value: any) {
    console.log('[Facebook Webhook Manager] Feed atualizado:', value);
    // Processar mudanças no feed de anúncios
  }

  validateWebhook(signature: string, body: string): boolean {
    try {
      if (!this.appSecret) {
        console.warn('[Facebook Webhook Manager] App Secret não configurado');
        return true; // Permitir em desenvolvimento
      }

      // Implementar validação HMAC SHA256
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', this.appSecret)
        .update(body)
        .digest('hex');

      return signature === `sha256=${expectedSignature}`;
    } catch (error) {
      console.error('[Facebook Webhook Manager] Erro na validação:', error);
      return false;
    }
  }

  async sendConversionsAPI(eventData: any): Promise<boolean> {
    try {
      if (!this.accessToken || !this.pixelId) {
        console.warn('[Facebook Webhook Manager] Credenciais não configuradas para Conversions API');
        return false;
      }

      const conversionsUrl = `https://graph.facebook.com/v18.0/${this.pixelId}/events`;
      
      const payload = {
        data: [eventData],
        access_token: this.accessToken
      };

      console.log('[Facebook Webhook Manager] Enviando para Conversions API:', payload);

      const response = await fetch(conversionsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('[Facebook Webhook Manager] Evento enviado com sucesso:', result);
        return true;
      } else {
        console.error('[Facebook Webhook Manager] Erro ao enviar evento:', result);
        return false;
      }
    } catch (error) {
      console.error('[Facebook Webhook Manager] Erro na Conversions API:', error);
      return false;
    }
  }

  private storeWebhookData(entry: any) {
    try {
      const webhookEvents = JSON.parse(localStorage.getItem('facebook_webhook_events') || '[]');
      webhookEvents.push({
        ...entry,
        timestamp: new Date().toISOString(),
        processed_at: Date.now()
      });

      // Manter apenas os últimos 100 eventos
      if (webhookEvents.length > 100) {
        webhookEvents.splice(0, webhookEvents.length - 100);
      }

      localStorage.setItem('facebook_webhook_events', JSON.stringify(webhookEvents));
    } catch (error) {
      console.error('[Facebook Webhook Manager] Erro ao armazenar dados:', error);
    }
  }
}

export const facebookWebhookManager = new FacebookWebhookManagerImpl();

export default facebookWebhookManager;
