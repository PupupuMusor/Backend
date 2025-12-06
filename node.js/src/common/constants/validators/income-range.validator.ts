import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'incomeRange', async: false })
export class IncomeRangeConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const object = args.object as any;
    const incomeStart = object.incomeStart;
    const incomeFinish = object.incomeFinish;

    if (incomeStart != undefined && incomeFinish != undefined) {
      return incomeStart <= incomeFinish;
    }

    return true;
  }

  defaultMessage() {
    return 'Нижняя граница уровня дохода должна быть меньше или равна верхней границе уровня дохода';
  }
}
