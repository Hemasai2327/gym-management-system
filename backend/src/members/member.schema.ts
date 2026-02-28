import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MemberDocument = HydratedDocument<Member>;

@Schema({ timestamps: true })
export class Member {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone: string;

  @Prop({ required: true })
  monthlyFee: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  duration: number; // months

  @Prop({ required: true })
  membershipEndDate: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
