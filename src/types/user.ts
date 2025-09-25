export interface UserProfile {
  id: string;
  createdDate: string;
  updatedDate: string;
  nickName: string | null;
  fullName: string;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  avatar: string;
  gender: string;
  addresses: any[];
  information: string | null;
  bankNo: string;
  accountNo: string;
  bankName: string;
  qrCode: string;
  userId: string;
  username: string;
}
