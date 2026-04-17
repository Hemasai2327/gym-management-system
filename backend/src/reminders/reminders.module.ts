import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { RemindersService } from './reminders.service';
import { MembersModule } from '../members/members.module';

@Module({
  imports: [ScheduleModule.forRoot(), MembersModule],
  providers: [RemindersService],
})
export class RemindersModule { }