import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Member, MemberSchema } from '../members/member.schema';
import { MembersModule } from '../members/members.module';

@Module({
  imports: [
    MembersModule, // 👈 REQUIRED
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
