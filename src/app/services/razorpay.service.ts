import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

declare var Razorpay: any;

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  handler: (response: any) => void;
  modal: {
    ondismiss: () => void;
  };
}

@Injectable({
  providedIn: 'root'
})
export class RazorpayService {
  constructor() {
    this.loadRazorpayScript();
  }

  private loadRazorpayScript(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof Razorpay !== 'undefined') {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }

  async createOrder(amount: number, donorName: string, email: string, phone: string): Promise<any> {
    // In production, you would call your Firebase Function to create an order
    // For now, we'll create a mock order ID
    // Firebase Function will handle the actual Razorpay API call
    
    return {
      orderId: 'order_' + Date.now(),
      amount: amount * 100, // Convert to paise
      currency: 'INR'
    };
  }

  async openCheckout(
    amount: number,
    orderId: string,
    donorName: string,
    email: string,
    phone: string,
    onSuccess: (response: any) => void,
    onDismiss: () => void
  ): Promise<void> {
    await this.loadRazorpayScript();

    const options: RazorpayOptions = {
      key: environment.razorpay.keyId,
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      name: 'UTTHARANDHRA SABARIMALA',
      description: 'Donation to Temple',
      order_id: orderId,
      prefill: {
        name: donorName,
        email: email,
        contact: phone
      },
      theme: {
        color: '#ff6b35'
      },
      handler: onSuccess,
      modal: {
        ondismiss: onDismiss
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }

  verifyPayment(orderId: string, paymentId: string, signature: string): boolean {
    // In production, verification should be done on the server side (Firebase Function)
    // This is just a placeholder
    return true;
  }
}
