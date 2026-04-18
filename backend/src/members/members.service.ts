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
      paymentMode: dto.paymentMode || 'Cash',
    });

    return member.save();
  }

  async findAll(status?: string, page: number = 1, limit: number = 10) {
    const query: any = {};
    const today = new Date();

    if (status === 'active') {
      query.membershipEndDate = { $gte: today };
    } else if (status === 'expired') {
      query.membershipEndDate = { $lt: today };
    } else if (status === 'expiring') {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      query.membershipEndDate = { $lte: nextWeek, $gte: today };
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.memberModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.memberModel.countDocuments(query)
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  findOne(id: string) {
    return this.memberModel.findById(id);
  }

  findActive() {
    return this.memberModel.find({ membershipEndDate: { $gte: new Date() } });
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

  async cleanupOldMembers(): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90);

    const result = await this.memberModel.deleteMany({
      membershipEndDate: { $lt: cutoffDate }
    });

    return result.deletedCount;
  }

  async exportCsv(): Promise<string> {
    const members = await this.memberModel.find().lean();
    if (members.length === 0) return '';
    
    // Create header
    const keys = ['Name', 'Email', 'Phone', 'StartDate', 'EndDate', 'Status'];
    const rows = members.map(m => {
      const isExp = m.membershipEndDate < new Date();
      const status = isExp ? 'Expired' : 'Active';
      // Basic escaping handling for CSV
      return [
        `"${m.name || ''}"`,
        `"${m.email || ''}"`,
        `"${m.phone || ''}"`,
        `"${m.startDate ? new Date(m.startDate).toISOString().substring(0, 10) : ''}"`,
        `"${m.membershipEndDate ? new Date(m.membershipEndDate).toISOString().substring(0, 10) : ''}"`,
        `"${status}"`
      ].join(',');
    });
    
    return [keys.join(','), ...rows].join('\n');
  }
}
