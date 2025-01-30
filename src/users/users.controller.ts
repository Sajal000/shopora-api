import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './provider/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.entity';
import { PatchUserDto } from './dto/patch-user.dto';
import { AuthType } from 'src/auth/enum/auth-type.enum';
import { Auth } from 'src/auth/decorator/auth.decorator';

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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve all users from the database' })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'The limit of entries returned per query',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description: 'The position of the page number to return',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Successfully fetched users!' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  public async getUsers(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ): Promise<User[]> {
    return this.usersService.findAll();
  }

  /**
   * Retrieve a specific user by ID
   * @param id - The ID of the user
   * @returns Promise<User>
   */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve a specific user by ID' })
  @ApiResponse({ status: 200, description: 'Successfully fetched user!' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:id')
  public async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<User> {
    return this.usersService.findById(id);
  }

  /**
   * Update user details
   * @param id - The ID of the user to update
   * @param patchUserDto - The updated user details
   * @returns Promise<User>
   */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update existing user details' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated user details!',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Patch('/:id')
  public async patch(
    @Param('id', ParseIntPipe) id: number,
    @Body() patchUserDto: PatchUserDto,
  ): Promise<User> {
    return this.usersService.patch(id, patchUserDto);
  }

  /**
   * Delete an existing user by ID
   * @param id - The ID of the user to delete
   * @returns Promise<DeleteResult>
   */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an existing user' })
  @ApiResponse({ status: 200, description: 'Successfully deleted user!' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Delete('/:id')
  public async delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete(id);
  }
}
