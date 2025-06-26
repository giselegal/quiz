
import { HotmartPurchase, HotmartBuyer } from '@/types/hotmart';

export const simulateHotmartPurchase = (email: string, name: string): HotmartPurchase => {
  return {
    id: `sim-${Date.now()}`,
    event: 'PURCHASE_COMPLETE',
    version: '2.0.0',
    data: {
      purchase: {
        id: `purchase-${Date.now()}`,
        transaction: `trans-${Date.now()}`,
        payment_type: 'CREDIT_CARD',
        payment_engine: 'HOTMART',
        installments_number: 1,
        price: {
          currency_code: 'BRL',
          value: 197.00
        },
        product: {
          id: '1234567',
          name: 'Guia da Moda'
        },
        customer: {
          email,
          name
        }
      },
      buyer: {
        email,
        name,
        document: '000.000.000-00'
      } as HotmartBuyer,
      producer: {
        name: 'Gisele Galvão'
      },
      product: {
        id: '1234567',
        name: 'Guia da Moda'
      },
      offer: {
        code: 'OFFER10'
      }
    }
  };
};
