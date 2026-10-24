import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';
import { Equipo } from './entities/equipo.entity';

@Injectable()
export class EquiposService {
  constructor(
    @InjectRepository(Equipo)
    private readonly equiposRepository: Repository<Equipo>,
  ) {}

  create(createEquipoDto: CreateEquipoDto) {
    const equipo = this.equiposRepository.create(createEquipoDto);
    return this.equiposRepository.save(equipo);
  }

  findAll() {
    return this.equiposRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const equipo = await this.equiposRepository.findOneBy({ id });
    if (!equipo) {
      throw new NotFoundException(`Equipo con id ${id} no encontrado`);
    }
    return equipo;
  }

  async update(id: number, updateEquipoDto: UpdateEquipoDto) {
    const equipo = await this.findOne(id);
    Object.assign(equipo, updateEquipoDto);
    return this.equiposRepository.save(equipo);
  }

  async remove(id: number) {
    const equipo = await this.findOne(id);
    await this.equiposRepository.remove(equipo);
    return { message: `Equipo con id ${id} eliminado` };
  }
}