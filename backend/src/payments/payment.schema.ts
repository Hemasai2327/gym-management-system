import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'Member', required: true })
  memberId: Types.ObjectId;

  @Prop({ required: true })
  memberName: string; // Storing for easier display without populating

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'Paid' })
  status: string;

  @Prop({ default: Date.now })
  paymentDate: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
