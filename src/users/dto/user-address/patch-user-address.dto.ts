import { CreateUserAddressDto } from './create-user-address.dto';
import { PartialType } from '@nestjs/swagger';

export class PatchUserAddressDto extends PartialType(CreateUserAddressDto) {}
