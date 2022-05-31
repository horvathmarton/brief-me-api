import { IsNumber, Max, Min } from 'class-validator';

export class CategoryPriorityPayload {
  @IsNumber()
  @Min(0)
  @Max(10)
  public priority: number;
}
