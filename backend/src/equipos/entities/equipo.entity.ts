import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('equipos')
export class Equipo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  codigoInventario!: string;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ length: 50 })
  tipo!: string;

  @Column({ length: 50 })
  marca!: string;

  @Column({ length: 50 })
  modelo!: string;

  @Column({ length: 100 })
  ubicacion!: string;

  @Column({ length: 20 })
  estado!: string;

  @Column({ type: 'date' })
  fechaAdquisicion!: string;

  @Column({ type: 'text', nullable: true })
  observaciones!: string | null;
}