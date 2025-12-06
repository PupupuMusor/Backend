// using FluentValidation;
// using LibApi.Users.DTOs.Requests;

// namespace LibApi.Users.DTOs.Configuration;

// public class RegisterUserRequestValidator : AbstractValidator<RegisterUserRequest>
// {
//     public RegisterUserRequestValidator()
//     {
//         RuleFor(x => x.Email)
//             .NotEmpty()
//             .WithMessage("Email обязателен для заполнения")
//             .EmailAddress()
//             .WithMessage("Неверный формат email")
//             .MaximumLength(64)
//             .WithMessage("Email не должен превышать 64 символа");

//         RuleFor(x => x.Password)
//             .NotEmpty()
//             .WithMessage("Пароль обязателен для заполнения")
//             .MinimumLength(8)
//             .WithMessage("Пароль должен содержать минимум 8 символов")
//             .MaximumLength(128)
//             .WithMessage("Пароль не должен превышать 128 символов")
//             .Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)")
//             .WithMessage("Пароль должен содержать хотя бы одну строчную букву, одну заглавную букву и одну цифру");

//         RuleFor(x => x.NickName)
//             .NotEmpty()
//             .WithMessage("Имя обязательно для заполнения")
//             .Length(2, 32)
//             .WithMessage("Имя должно содержать от 2 до 32 символов")
//             .Matches(@"^[a-zA-Zа-яА-ЯёЁ\s-_']+$")
//             .WithMessage("Имя может содержать только буквы, пробелы, дефисы, подчеркивания и апострофы");
//     }
// }

// public class LoginRequestValidator : AbstractValidator<LoginRequest>
// {
//     public LoginRequestValidator()
//     {
//         RuleFor(x => x.Email)
//             .NotEmpty()
//             .WithMessage("Email обязателен для заполнения")
//             .EmailAddress()
//             .WithMessage("Неверный формат email");

//         RuleFor(x => x.Password)
//             .NotEmpty()
//             .WithMessage("Пароль обязателен для заполнения")
//             .MinimumLength(8)
//             .WithMessage("Пароль должен содержать минимум 8 символов");
//     }
// }

// public class UpdateUserRequestValidator : AbstractValidator<UpdateUserRequest>
// {
//     public UpdateUserRequestValidator()
//     {
//         RuleFor(x => x.NickName)
//             .NotEmpty()
//             .WithMessage("Имя обязательно для заполнения")
//             .Length(2, 32)
//             .WithMessage("Имя должно содержать от 2 до 32 символов")
//             .Matches(@"^[a-zA-Zа-яА-ЯёЁ\s-_']+$")
//             .WithMessage("Имя может содержать только буквы, пробелы, дефисы, подчеркивания и апострофы");
//     }
// }

// public class ChangePasswordRequestValidator : AbstractValidator<ChangePasswordRequest>
// {
//     public ChangePasswordRequestValidator()
//     {
//         RuleFor(x => x.CurrentPassword)
//             .NotEmpty()
//             .WithMessage("Текущий пароль обязателен для заполнения");

//         RuleFor(x => x.NewPassword)
//             .NotEmpty()
//             .WithMessage("Новый пароль обязателен для заполнения")
//             .MinimumLength(8)
//             .WithMessage("Новый пароль должен содержать минимум 8 символов")
//             .MaximumLength(128)
//             .WithMessage("Новый пароль не должен превышать 128 символов")
//             .Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)")
//             .WithMessage("Новый пароль должен содержать хотя бы одну строчную букву, одну заглавную букву и одну цифру")
//             .NotEqual(x => x.CurrentPassword)
//             .WithMessage("Новый пароль должен отличаться от текущего");
//     }
// }

// public class ChangeEmailRequestValidator : AbstractValidator<ChangeEmailRequest>
// {
//     public ChangeEmailRequestValidator()
//     {
//         RuleFor(x => x.Email)
//             .NotEmpty()
//             .WithMessage("Email обязателен для заполнения")
//             .EmailAddress()
//             .WithMessage("Неверный формат email")
//             .MaximumLength(64)
//             .WithMessage("Email не должен превышать 64 символа");

//         RuleFor(x => x.Token)
//             .NotEmpty()
//             .WithMessage("Токен обязателен для заполнения");
//     }
// }

// public class RefreshTokenRequestValidator : AbstractValidator<RefreshTokenRequest>
// {
//     public RefreshTokenRequestValidator()
//     {
//         RuleFor(x => x.RefreshToken)
//             .NotEmpty()
//             .WithMessage("Токен обновления обязателен для заполнения");
//     }
// }

// public class CheckPasswordRequestValidator : AbstractValidator<CheckPasswordRequest>
// {
//     public CheckPasswordRequestValidator()
//     {
//         RuleFor(x => x.Password)
//             .NotEmpty()
//             .WithMessage("Пароль обязателен для заполнения");
//     }
// }

// public class CheckConfirmConfirmRequestValidator : AbstractValidator<ConfirmRequest>
// {
//     public CheckConfirmConfirmRequestValidator()
//     {
//         RuleFor(x => x.Email)
//             .NotEmpty()
//             .WithMessage("Почта обязательна для заполнения");

//         RuleFor(x => x.Token)
//             .NotEmpty()
//             .WithMessage("Токен обязателен для заполнения");
//     }
// }
