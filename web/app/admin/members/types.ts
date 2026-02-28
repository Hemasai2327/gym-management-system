export interface Member {
  _id: string;
  name: string;
  email: string;
  phone: string;

  startDate: string;
  duration: number;
  membershipEndDate: string;

  monthlyFee: number;
  isActive: boolean;
}
