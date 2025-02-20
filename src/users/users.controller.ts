import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './providers/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/users.entity';
import { PatchUserDto } from './dto/patch-user.dto';
import { AuthType } from 'src/auth/enum/auth-type.enum';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { CreateUserAddressDto } from './dto/user-address/create-user-address.dto';
import { PatchUserAddressDto } from './dto/user-address/patch-user-address.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  /**
   * Create a new user
   * @param createUserDto - User data to create a new user
   * @returns Promise<User>
   */
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'Successfully created a new user!' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Auth(AuthType.None)
  @Post()
  public async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  /**
   * Retrieve all users from the database
   * @param limit - Number of users to return per request
   * @param page - Page number for paginated results
   * @returns Promise<User[]>
   */
  @Auth(AuthType.VerifiedBearer)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Retrieve all users from the database' })
  @ApiResponse({ status: 200, description: 'Successfully fetched users!' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  public async getUsers() {
    return this.usersService.findAll();
  }

  /**
   * Retrieve a specific user by ID
   * @param id - The ID of the user
   * @returns Promise<User>
   */
  @Auth(AuthType.VerifiedBearer)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Retrieve a specific user by ID' })
  @ApiResponse({ status: 200, description: 'Successfully fetched user!' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:id')
  public async getUserById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<User> {
    return this.usersService.findById(id);
  }

  /**
   * Update user details
   * @param id - The ID of the user to update
   * @param patchUserDto - The updated user details
   * @returns Promise<User>
   */
  @Auth(AuthType.VerifiedBearer)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update existing user details' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated user details!',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Patch('/:id')
  public async patch(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() patchUserDto: PatchUserDto,
  ): Promise<User> {
    return this.usersService.patch(id, patchUserDto);
  }

  /**
   * Delete an existing user by ID
   * @param id - The ID of the user to delete
   *
   */
  @Auth(AuthType.VerifiedBearer)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete an existing user' })
  @ApiResponse({ status: 200, description: 'Successfully deleted user!' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Delete('/:id')
  public async delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete(id);
  }

  /**
   * Attach address to existing user
   * @param userId
   * @param addressData
   * @returns
   */
  @Auth(AuthType.VerifiedBearer)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Attach address to existing user' })
  @ApiResponse({
    status: 200,
    description: 'Successfully attached address to user!',
  })
  @Post('/address/:userId')
  public async addAddress(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() createAddressDto: CreateUserAddressDto,
  ) {
    return this.usersService.addAddress(userId, createAddressDto);
  }

  /**
   * Update existing user's address
   * @param userId
   * @param patchUserAddressDto
   * @returns
   */
  @Auth(AuthType.VerifiedBearer)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: `Update existing user's address` })
  @ApiResponse({
    status: 200,
    description: `Successfully updated user's address!`,
  })
  @Patch('/address/:userId')
  public async patchAddress(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() patchUserAddressDto: PatchUserAddressDto,
  ) {
    return this.usersService.patchAddress(userId, patchUserAddressDto);
  }

  /**
   * Fetch address of existing user
   * @param userId
   * @returns
   */
  @Auth(AuthType.VerifiedBearer)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Fetch address of existing user' })
  @ApiResponse({
    status: 200,
    description: `Successfully fetched user's address`,
  })
  @ApiResponse({
    status: 404,
    description: `Address not found`,
  })
  @Get('/address/:userId')
  public async getAddress(
    @Query('userId', new ParseUUIDPipe()) userId: string,
  ) {
    return this.usersService.fetchAddress(userId);
  }
}
