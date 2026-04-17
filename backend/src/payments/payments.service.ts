import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment, PaymentDocument } from './payment.schema';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) {}

  async create(data: { memberId: string; memberName: string; amount: number; status?: string }) {
    const payment = new this.paymentModel({
      memberId: new Types.ObjectId(data.memberId),
      memberName: data.memberName,
      amount: data.amount,
      status: data.status || 'Paid',
    });
    return payment.save();
  }

  findAll() {
    return this.paymentModel.find().sort({ paymentDate: -1 });
  }

  findByMember(memberId: string) {
    return this.paymentModel.find({ memberId: new Types.ObjectId(memberId) }).sort({ paymentDate: -1 });
  }
}
