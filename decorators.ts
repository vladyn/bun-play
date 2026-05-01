function logged(originalMethod: any, context: ClassMethodDecoratorContext) {
    const name = String(context.name);
    return function (this: any, ...args: any[]) {
        console.log(`Entering ${name}`);
        const result = originalMethod.call(this, ...args);
        console.log(`Exiting ${name}`);
        return result;
    };
}

export class Example {
    @logged
    greet(name: string) {
        console.log(`Hello, ${name}!`);
    }
}