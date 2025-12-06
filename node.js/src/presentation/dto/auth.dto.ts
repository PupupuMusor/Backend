import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { CreateUserDto } from '@presentation/dto/user.dto';
import {
  Equals,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthLoginDto {
  @IsNotEmpty({ message: 'Поле password не должно быть пустым' })
  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'securePassword',
  })
  password: string;

  @IsNotEmpty({ message: 'Поле login не должно быть пустым' })
  @ApiProperty({
    description: 'Логин пользователя',
    example: 'typicalLogin',
  })
  login: string;
}

export class ChangePasswordDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'старый пароль' })
  @IsString()
  currentPassword: string;

  @IsString({ message: 'Поле newPassword должно быть строкой' })
  @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
  @MaxLength(16, { message: 'Пароль должен содержать максимум 16 символов' })
  @Matches(/^[A-Za-z0-9!=$%&'()+,\-./:;<=>?@\[\]^_{|}~`]+$/, {
    message:
      'Пароль может содержать только латинские буквы, цифры и специальные символы: != $ % & ’ ( ) + , - . / : ; < = > ? @ [ ] ^ _ { | } ~ `',
  })
  @ApiProperty({
    description: 'Новый пароль пользователя',
    example: 'securePassword',
  })
  @IsNotEmpty({ message: 'Поле newPassword не должно быть пустым' })
  @ApiProperty({
    description: 'Новый пароль',
    example: 'newPassword',
  })
  newPassword: string;
}
export class ApprovalDto {
  @IsNotEmpty({ message: 'Поле approval не должно быть пустым' })
  @IsBoolean({ message: 'Поле approval должно быть типа boolean' })
  @Equals(true, { message: 'Поле approval всегда должно быть true' })
  @ApiProperty({
    description: 'Согласие на обработку персональных данных',
  })
  approval: boolean;
}

export class AuthRegisterDto extends IntersectionType(
  CreateUserDto,
  ApprovalDto,
) {}

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'Поле email не должно быть пустым' })
  @IsEmail({}, { message: 'Поле email должно быть валидным email' })
  @ApiProperty({
    description: 'Почта для сброса',
    example: 'user@example.com',
  })
  email: string;
}

export class ConfirmResetPasswordDto extends ResetPasswordDto {
  @IsNotEmpty({ message: 'Поле code не должно быть пустым' })
  @IsString({ message: 'Поле code должно быть строкой' })
  @ApiProperty({ description: 'Код для сброса' })
  code: string;
}

export class RecoveryPasswordDto extends ResetPasswordDto {
  @IsNotEmpty({ message: 'Поле resetToken не должно быть пустым' })
  @IsString({ message: 'Поле resetToken должно быть строкой' })
  @ApiProperty({ description: 'Токен который, вернулся при вводе кода' })
  resetToken: string;

  @IsString({ message: 'Поле passwordReset должно быть строкой' })
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
  @IsNotEmpty({ message: 'Поле passwordReset не должно быть пустым' })
  @ApiProperty({
    description: 'Новый пароль',
    example: 'newPassword',
  })
  passwordReset: string;
}
