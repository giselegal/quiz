
import { hotmartWebhookManager, HotmartWebhookPayload } from '../utils/hotmartWebhook';

// Simple request/response interfaces for this Vite project
interface Request {
  method: string;
  body: any;
}

interface Response {
  status: (code: number) => Response;
  json: (data: any) => Response;
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const webhookData = req.body as HotmartWebhookPayload;
    const result = await hotmartWebhookManager.processWebhook(webhookData);
    
    if (result.success) {
      res.status(200).json({ message: 'Webhook processed successfully' });
    } else {
      res.status(400).json({ message: 'Webhook processing failed', error: result.error });
    }
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
