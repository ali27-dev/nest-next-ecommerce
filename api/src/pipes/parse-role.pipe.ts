// src/common/pipes/parse-role.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Role } from '@prisma/client';

@Injectable()
export class ParseRolePipe implements PipeTransform {
  transform(value: string): Role {
    const upper = value.toUpperCase();
    if (!Object.values(Role).includes(upper as Role)) {
      throw new BadRequestException(`Invalid role: ${value}`);
    }
    return upper as Role;
  }
}
