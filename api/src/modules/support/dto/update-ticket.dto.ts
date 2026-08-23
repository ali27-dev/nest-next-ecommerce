import { IsEnum } from 'class-validator';
import { TicketStatus } from '@prisma/client';

export class UpdateTicketStatusDto {
  @IsEnum(TicketStatus, {
    message: 'status must be OPEN, IN_PROGRESS, RESOLVED, or CLOSED',
  })
  status: TicketStatus;
}
