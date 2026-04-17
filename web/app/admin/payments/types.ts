export interface Payment {
  _id: string;
  memberId: string;
  memberName: string;
  amount: number;
  status: string;
  paymentDate: string;
  createdAt: string;
}
