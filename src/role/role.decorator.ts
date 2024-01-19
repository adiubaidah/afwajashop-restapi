import { SetMetadata } from '@nestjs/common';

import { Role as RoleEnum } from '../constant';

export const Role = (role: RoleEnum) => SetMetadata('ROLE', role);
