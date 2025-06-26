
export interface HotmartBuyer {
  email: string;
  name: string;
  document: string;
}

export interface HotmartPurchase {
  id: string;
  event: string;
  version: string;
  data: {
    purchase: {
      id: string;
      transaction: string;
      payment_type: string;
      payment_engine: string;
      installments_number: number;
      price: {
        currency_code: string;
        value: number;
      };
      product: {
        id: string;
        name: string;
      };
      customer: {
        email: string;
        name: string;
      };
    };
    buyer: HotmartBuyer;
    producer: {
      name: string;
    };
    product: {
      id: string;
      name: string;
    };
    offer: {
      code: string;
    };
  };
}
