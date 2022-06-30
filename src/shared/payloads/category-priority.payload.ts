import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class CategoryPriorityPayload {
  @IsNumber()
  @Min(0)
  @Max(10)
  @ApiProperty({
    minimum: 0,
    maximum: 10,
  })
  public priority: number;
}
