import { Analytics } from '../types';
import { mockAnalytics } from '../data/mockAnalytics';

class AnalyticsService {
  async getAnalytics(): Promise<Analytics> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAnalytics;
  }
}

export const analyticsService = new AnalyticsService();