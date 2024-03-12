import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { VacancyEntity } from '../entity/vacancy';
import { CreateNewVacancyDto, UpdateOneVacancyDto, VacancyResponseDto } from '../dtos';
import { FilterVacancyDto } from '../dtos/filter-vacancy.dto';

@Injectable()
export class VacancyService {
  constructor(@InjectRepository(VacancyEntity)
  private readonly vacancyRepository: Repository<VacancyEntity>) {
  }
  public async createOne(createNewVacancyDto: CreateNewVacancyDto): Promise<VacancyResponseDto> {
    const vacancyEntity = await this.vacancyRepository.create(createNewVacancyDto);
    return await this.vacancyRepository.save(vacancyEntity);
  }

  public async getAll(query: FilterVacancyDto): Promise<VacancyResponseDto[]> {
    const limit = query.limit ?? 20;
    const page = query.page ?? 1;
    const skip = limit * (page - 1);

    const queryBuilder: SelectQueryBuilder<VacancyEntity> = this.vacancyRepository.createQueryBuilder('vacancy');

    if (query.role) {
      queryBuilder.andWhere('vacancy.role = :role', { role: query.role });
    }

    if (query.level) {
      queryBuilder.andWhere('vacancy.level = :level', { level: query.level });
    }

    if (query.technologies) {
      queryBuilder.leftJoin('vacancy.technologies', 'technology')
        .andWhere('technology.name IN (:...technologies)', { technologies: [query.technologies] });
    }

    if (query.programmingLanguages) {
      queryBuilder.leftJoin('vacancy.programmingLanguages', 'programmingLanguage')
        .andWhere('programmingLanguage.name IN (:...programmingLanguages)', { programmingLanguages: [query.programmingLanguages] });
    }

    return await queryBuilder
      .skip(skip)
      .take(limit)
      .leftJoinAndSelect('vacancy.company', 'company')
      .leftJoinAndSelect('vacancy.programmingLanguages', 'programmingLanguages')
      .leftJoinAndSelect('vacancy.technologies', 'technologies')
      .getMany();
  }

  public async updateOne(id: number, updateOneVacancyDto: UpdateOneVacancyDto): Promise<VacancyResponseDto> {
    await this.vacancyRepository.update({ id }, updateOneVacancyDto);
    return await this.vacancyRepository.findOne({ where: { id } });
  }

  public async deleteOne(id: number): Promise<void> {
    await this.vacancyRepository.delete({ id });
  }
}