/* eslint-disable @typescript-eslint/ban-types */
export function applyDecorators(
  ...decorators: Array<
    ClassDecorator | MethodDecorator | PropertyDecorator | Function
  >
) {
  return <TFunction extends Function, Y>(
    target: TFunction | object,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<Y>,
  ) => {
    for (const decorator of decorators) {
      if (target instanceof Function && !descriptor) {
        (decorator as ClassDecorator)(target);
        continue;
      }

      if (!propertyKey || !descriptor) {
        continue;
      }

      (decorator as MethodDecorator | PropertyDecorator)(
        target,
        propertyKey,
        descriptor,
      );
    }
  };
}
