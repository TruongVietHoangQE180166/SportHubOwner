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