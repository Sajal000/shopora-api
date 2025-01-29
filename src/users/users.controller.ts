import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './provider/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.entity';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    /**
     * Inject usersService
     */
    private readonly usersService: UserService,
  ) {}

  /**
   * Create a new user
   * @param createUserDto
   * @returns
   */

  @ApiOperation({
    summary: 'Creating a new user',
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully created a new user!',
  })
  @Post()
  public create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Get all users
   * @param limit
   * @param page
   * @returns
   */

  @ApiOperation({
    summary: 'Retrieve all users in database',
  })
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
    description:
      'The position of the page number that you want the API to return',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched users!',
  })
  @Get()
  public getUsers(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) // eslint-disable-next-line @typescript-eslint/no-unused-vars
    limit: number | undefined,
    @Query('page', new DefaultValuePipe(10), ParseIntPipe) // eslint-disable-next-line @typescript-eslint/no-unused-vars
    page: number | undefined,
  ): Promise<User[]> {
    return this.usersService.findAll();
  }
}
