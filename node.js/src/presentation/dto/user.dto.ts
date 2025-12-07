import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Поле email должно быть валидным email' })
  @MaxLength(60, { message: 'Значение должно содержать не более 60 символов' })
  @ApiProperty({
    description: 'Электронная почта пользователя',
    example: 'user@example.com',
  })
  email: string;

  @IsNotEmpty({ message: 'Поле login не должно быть пустым' })
  @MinLength(8, { message: 'Логин должен содержать минимум 8 символов' })
  @MaxLength(32, { message: 'Логин должен содержать максимум 32 символа' })
  @Matches(/^[A-Za-z0-9_-]+$/, {
    message:
      'Логин может содержать только латинские буквы, цифры, символы "_" и "-"',
  })
  @IsString({ message: 'Поле login должно быть строкой' })
  @ApiProperty({
    description: 'Логин пользователя',
    example: 'typicalLogin',
  })
  login: string;

  @IsString({ message: 'Поле fullName должно быть строкой' })
  @MinLength(3, { message: 'Полное имя должно быть длинее 3 символов' })
  @MaxLength(150, { message: 'Полное имя должно быть  короче 150 символов' })
  @Matches(/^[A-Za-zА-Яа-яЁёIVX\-\s'.,()]+$/u, {
    message:
      'Полное имя содержит недопустимые символы. Разрешены буквы, дефис, пробел, апостроф, точка, запятая, круглые скобки и римские цифры (I, V, X).',
  })
  @ApiProperty({
    description: 'Полное имя пользователя',
    example: 'Иван Иванов',
  })
  fullName: string;

  @ApiProperty({ description: 'ID офиса' })
  @IsUUID()
  officeId: string;

  @ApiProperty({})
  @IsNumber()
  scores: number;
}

export class ResponseUserDto {
  @ApiProperty({ description: 'ID теста' })
  @IsUUID()
  id: string;

  @IsEmail({}, { message: 'Поле email должно быть валидным email' })
  @MaxLength(60, { message: 'Значение должно содержать не более 60 символов' })
  @ApiProperty({
    description: 'Электронная почта пользователя',
    example: 'user@example.com',
  })
  email: string;

  @IsNotEmpty({ message: 'Поле login не должно быть пустым' })
  @MinLength(8, { message: 'Логин должен содержать минимум 8 символов' })
  @MaxLength(32, { message: 'Логин должен содержать максимум 32 символа' })
  @Matches(/^[A-Za-z0-9_-]+$/, {
    message:
      'Логин может содержать только латинские буквы, цифры, символы "_" и "-"',
  })
  @IsString({ message: 'Поле login должно быть строкой' })
  @ApiProperty({
    description: 'Логин пользователя',
    example: 'typicalLogin',
  })
  login: string;

  @IsString({ message: 'Поле fullName должно быть строкой' })
  @MinLength(3, { message: 'Полное имя должно быть длинее 3 символов' })
  @MaxLength(150, { message: 'Полное имя должно быть  короче 150 символов' })
  @Matches(/^[A-Za-zА-Яа-яЁёIVX\-\s'.,()]+$/u, {
    message:
      'Полное имя содержит недопустимые символы. Разрешены буквы, дефис, пробел, апостроф, точка, запятая, круглые скобки и римские цифры (I, V, X).',
  })
  @ApiProperty({
    description: 'Полное имя пользователя',
    example: 'Иван Иванов',
  })
  fullName: string;

  @ApiProperty({ description: 'ID офиса' })
  @IsUUID()
  officeId: string;
}
