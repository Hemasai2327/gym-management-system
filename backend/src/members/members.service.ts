import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member, MemberDocument } from './member.schema';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectModel(Member.name)
    private readonly memberModel: Model<MemberDocument>,
  ) {}

  async create(dto: CreateMemberDto) {
    const start = new Date(dto.startDate);
    const expiry = new Date(start);
    expiry.setMonth(expiry.getMonth() + dto.duration);

    const member = new this.memberModel({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      monthlyFee: dto.monthlyFee,
      startDate: start,
      duration: dto.duration,
      membershipEndDate: expiry,
      isActive: expiry >= new Date(),
    });

    return member.save();
  }

  findAll() {
    return this.memberModel.find().sort({ createdAt: -1 });
  }

  findOne(id: string) {
    return this.memberModel.findById(id);
  }

  findActive() {
    return this.memberModel.find({ isActive: true });
  }

  findExpired() {
    return this.memberModel.find({
      membershipEndDate: { $lt: new Date() },
    });
  }

  findExpiringSoon() {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    return this.memberModel.find({
      membershipEndDate: { $lte: nextWeek, $gte: new Date() },
    });
  }

  async update(id: string, dto: UpdateMemberDto) {
    const { membershipEndDate, startDate, ...rest } = dto;

    const updateData: Partial<Member> = { ...rest };

    if (startDate) {
      updateData.startDate = new Date(startDate);
    }

    if (membershipEndDate) {
      updateData.membershipEndDate = new Date(membershipEndDate);
    }

    const updated = await this.memberModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) throw new NotFoundException('Member not found');
    return updated;
  }

  async remove(id: string) {
    const res = await this.memberModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Member not found');
    return { success: true };
  }
}
