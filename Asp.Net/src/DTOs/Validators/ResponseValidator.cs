// using FluentValidation;
// using LibApi.Users.DTOs.Responses;

// namespace LibApi.Users.DTOs.Configuration;

// public class UserResponseValidator : AbstractValidator<UserResponse>
// {
//     public UserResponseValidator()
//     {
//         RuleFor(x => x.Id)
//             .NotEmpty()
//             .WithMessage("Id пользователя обязателен");

//         RuleFor(x => x.Email)
//             .NotEmpty()
//             .WithMessage("Email обязателен")
//             .EmailAddress()
//             .WithMessage("Неверный формат email")
//             .MaximumLength(64)
//             .WithMessage("Email не должен превышать 64 символа");

//         RuleFor(x => x.NickName)
//             .NotEmpty()
//             .WithMessage("Имя обязательно")
//             .Length(2, 64)
//             .WithMessage("Имя должно содержать от 2 до 32 символов")
//             .Matches(@"^[a-zA-Zа-яА-ЯёЁ\s-_']+$")
//             .WithMessage("Имя содержит недопустимые символы");


//         RuleFor(x => x.CreatedAt)
//             .NotEmpty()
//             .WithMessage("Дата создания обязательна")
//             .LessThanOrEqualTo(DateTime.UtcNow)
//             .WithMessage("Дата создания не может быть в будущем");
//     }
// }

// public class AuthResponseValidator : AbstractValidator<AuthResponse>
// {
//     public AuthResponseValidator()
//     {
//         RuleFor(x => x.AccessToken)
//             .NotEmpty()
//             .WithMessage("Токен доступа обязателен");

//         RuleFor(x => x.RefreshToken)
//             .NotEmpty()
//             .WithMessage("Токен обновления обязателен");

//         RuleFor(x => x.UserResponse)
//             .NotNull()
//             .WithMessage("Данные пользователя обязательны")
//             .SetValidator(new UserResponseValidator());
//     }
// }