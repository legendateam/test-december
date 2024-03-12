import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { LevelEnum, RoleEnum } from '../enums';
import { ApiProperty } from '@nestjs/swagger';
import { ProgrammingLanguageEnum } from '../../programming-language/enums';
import { TechnologyEnum } from '../../technology/enums';
import {PaginationDto} from "../../../dtos";

export class FilterVacancyDto extends PaginationDto {
  @IsEnum(RoleEnum)
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ enum: RoleEnum })
  role?: RoleEnum

  @IsEnum(LevelEnum)
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ enum: LevelEnum })
  level?: LevelEnum

  @IsEnum(ProgrammingLanguageEnum)
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ enum: ProgrammingLanguageEnum })
  programmingLanguages?: ProgrammingLanguageEnum;

  @IsEnum(TechnologyEnum)
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ enum: TechnologyEnum })
  technologies?: TechnologyEnum;
}