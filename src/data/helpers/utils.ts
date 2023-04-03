export class Utils {

  static zeroToUndefined<Type>(value: Type) {
    return (value == "0") ? undefined : value;
  }

  static isEmpty(value: string | undefined) {
    return (value === undefined || value == null || value.trim().length === 0);
  }
}
