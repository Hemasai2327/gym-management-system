import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member, MemberDocument } from '../members/member.schema';

interface RevenueAggregation {
  _id: null;
  total: number;
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Member.name)
    private readonly memberModel: Model<MemberDocument>,
  ) {}

  async getSummary() {
    const totalMembers = await this.memberModel.countDocuments();

    const activeMembers = await this.memberModel.countDocuments({
      isActive: true,
      membershipEndDate: { $gte: new Date() },
    });

    const expiredMembers = await this.memberModel.countDocuments({
      membershipEndDate: { $lt: new Date() },
    });

    const revenueAgg = await this.memberModel.aggregate<RevenueAggregation>([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          total: { $sum: '$monthlyFee' },
        },
      },
    ]);

    return {
      totalMembers,
      activeMembers,
      expiredMembers,
      monthlyRevenue: revenueAgg[0]?.total ?? 0,
    };
  }
}
