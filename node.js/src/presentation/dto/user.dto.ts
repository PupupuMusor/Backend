import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  @IsEnum(Role, {
    message:
      'Роль пользователя может иметь значения только: ' + Object.values(Role),
  })
  @ApiProperty({
    description: 'Роль пользователя',
    enum: Role,
    example: Role.ADMIN,
  })
  role: Role;

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

  @IsEmail({}, { message: 'Поле email должно быть валидным email' })
  @MaxLength(60, { message: 'Значение должно содержать не более 60 символов' })
  @ApiProperty({
    description: 'Электронная почта пользователя',
    example: 'user@example.com',
  })
  email: string;

  @IsString({ message: 'Поле password должно быть строкой' })
  @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
  @MaxLength(16, { message: 'Пароль должен содержать максимум 16 символов' })
  @Matches(/^[A-Za-z0-9!=$%&'()+,\-./:;<=>?@\[\]^_{|}~`]+$/, {
    message:
      'Пароль может содержать только латинские буквы, цифры и специальные символы: != $ % & ’ ( ) + , - . / : ; < = > ? @ [ ] ^ _ { | } ~ `',
  })
  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'securePassword',
  })
  password: string;
}

export class ResponseUserDto {
  @ApiProperty({ description: 'ID теста' })
  @IsUUID()
  id: string;

  @IsEnum(Role, {
    message:
      'Роль пользователя может иметь значения только: ' + Object.values(Role),
  })
  @ApiProperty({
    description: 'Роль пользователя',
    enum: Role,
    example: Role.ADMIN,
  })
  role: Role;

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

  @IsEmail({}, { message: 'Поле email должно быть валидным email' })
  @MaxLength(60, { message: 'Значение должно содержать не более 60 символов' })
  @ApiProperty({
    description: 'Электронная почта пользователя',
    example: 'user@example.com',
  })
  email: string;
}

export class ResponseUserScoreDto {
  @ApiProperty({ description: 'ID теста' })
  @IsUUID()
  id: string;

  @IsEnum(Role, {
    message:
      'Роль пользователя может иметь значения только: ' + Object.values(Role),
  })
  @ApiProperty({
    description: 'Роль пользователя',
    enum: Role,
    example: Role.ADMIN,
  })
  role: Role;

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

  @IsEmail({}, { message: 'Поле email должно быть валидным email' })
  @MaxLength(60, { message: 'Значение должно содержать не более 60 символов' })
  @ApiProperty({
    description: 'Электронная почта пользователя',
    example: 'user@example.com',
  })
  email: string;
}

export class UpdateUserDto {
  @IsOptional({ message: 'Поле  email не обязательное' })
  @ValidateIf(
    (object: UpdateUserDto) =>
      object.email !== undefined &&
      object.email !== null &&
      object.email !== '',
  )
  @IsEmail({}, { message: 'Поле email должно быть валидным email' })
  @MaxLength(60, { message: 'Значение должно содержать не более 60 символов' })
  @ApiProperty({
    description: 'Электронная почта пользователя',
    example: 'user@example.com',
    required: false,
  })
  email?: string;
}
