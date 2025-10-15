export interface Payment {
    acceptedMethods: string[];
    commission: number;
    refundPolicy: string;
    payoutSchedule: string;
    bankDetails: {
      accountName: string;
      accountNumber: string;
      bankName: string;
    };
  }

  // Statistical Response Item
  export interface StatisticalResponse {
    day: string;
    amountForDay: number;
  }

  // Cash Flow Types
  export interface CashFlow {
    id: string;
    userId: string;
    email: string;
    role: string;
    amountAvailable: number;
    balance: number;
    createdDate: string;
    statisticalResponses: StatisticalResponse[] | null;
  }

  export interface CashFlowResponse {
    message: {
      messageCode: string;
      messageDetail: string;
    };
    errors: null;
    data: {
      content: CashFlow[];
      request: {
        page: number;
        size: number;
        sortRequest: {
          direction: string;
          field: string;
        };
      };
      totalElement: number;
    };
    success: boolean;
  }

  // Specific response type for daily cash flow endpoints
  export interface CashFlowDailyResponse {
    message: {
      messageCode: string;
      messageDetail: string;
    };
    errors: null;
    data: CashFlow;
    success: boolean;
  }

  // Withdrawal Types
  export interface Withdrawal {
    id: string;
    userId: string;
    email: string;
    role: string;
    description: string;
    amount: number;
    status: string;
    createdDate: string;
  }

  export interface WithdrawalResponse {
    message: {
      messageCode: string;
      messageDetail: string;
    };
    errors: null;
    data: {
      content: Withdrawal[];
      request: {
        page: number;
        size: number;
        sortRequest: {
          direction: string;
          field: string;
        };
      };
      totalElement: number;
    };
    success: boolean;
  }