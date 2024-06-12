import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAllUsers(limit: string, offset: string) {
    const limitNumber = parseInt(limit);
    const offsetNumber = parseInt(offset);

    const users = await this.prisma.user.findMany({
      skip: offsetNumber,
      take: limitNumber,
      include: {
        meetings: {
          orderBy: {
            start_day: 'asc',
          },
        },
      },
    });

    for (let user of users) {
      let totalMeetingDays = 0;
      const meetingDays: string[] = [];

      for (let meeting of user.meetings) {
        totalMeetingDays += meeting.end_day - meeting.start_day + 1;

        meetingDays.push(`${meeting.start_day} -> ${meeting.end_day}`);
      }

      const daysWithoutMeetings = user.days - totalMeetingDays;

      user['days_without_meetings'] =
        daysWithoutMeetings > 0 ? daysWithoutMeetings : 0;

      user['meeting_days'] = meetingDays;

      delete user.meetings;
    }

    return users;
  }
}
