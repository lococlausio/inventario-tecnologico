import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export const ESTADOS = ['Disponible', 'En uso', 'Mantención', 'Baja'] as const;

export class CreateEquipoDto {
  @IsString()
  @MinLength(3, { message: 'El código de inventario debe tener al menos 3 caracteres' })
  codigoInventario!: string;

  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  nombre!: string;

  @IsString()
  @IsNotEmpty({ message: 'El tipo es obligatorio' })
  tipo!: string;

  @IsString()
  @IsNotEmpty({ message: 'La marca es obligatoria' })
  marca!: string;

  @IsString()
  @IsNotEmpty({ message: 'El modelo es obligatorio' })
  modelo!: string;

  @IsString()
  @IsNotEmpty({ message: 'La ubicación es obligatoria' })
  ubicacion!: string;

  @IsIn(ESTADOS, {
    message: 'El estado debe ser: Disponible, En uso, Mantención o Baja',
  })
  estado!: string;

  @IsDateString({ strict: true }, { message: 'La fecha de adquisición no es válida (use AAAA-MM-DD)' })
  fechaAdquisicion!: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}