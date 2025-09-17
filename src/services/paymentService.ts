import { Payment } from '../types';
import { mockPaymentSettings } from '../data/mockPaymentSettings';

class PaymentService {
  private settings: Payment = mockPaymentSettings;

  async getPaymentSettings(): Promise<Payment> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.settings;
  }

  async updatePaymentSettings(updates: Partial<Payment>): Promise<Payment> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.settings = { ...this.settings, ...updates };
    return this.settings;
  }
}

export const paymentService = new PaymentService();