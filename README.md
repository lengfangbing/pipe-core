# pipe-core
## What is pipe-core?
>process data like a pipeline
## How to use?
>the demo code
```typescript
import createPipe from '@bell-crow/pipe-core';
const value = createPipe({
  name: 'crow',
  age: 3
}, {
  getName(value) {
    return value.name;
  },
  getAge(value) {
    return value.age;
  },
  getValue(value) {
    return value;
  }
});
value
  .pipeStart()
  .getAge(age => {
    console.log(`first age is ${age}`);
    return age + 1;
  }))
.pipe<number>((age, update) => {
  console.log(`changed age is ${age}}`);
  update({ age: 99 });
})
  .getName(name => {
    console.log(`first name is ${name}`);
    return { newName: name + Date.now() };
  }))
.pipe<{ newName: string }>((name, update) => {
  console.log(`changed name is ${name.newName}`);
  update('pipe-crow');
})
  .getValue(value => console.log(`changed value is ${value}`))
  .pipeEnd()
  .then()
  .catch();
```

## Have any explain about the usage?
> `createPipe` is a function to create one 'pipe' value. The `pipeStart` is the pipe start and the `pipeEnd` is the pipe end.
> ```typescript
> await value
>     .pipeStart()
>     /* some process */
>     .pipeEnd();
> ```
> The first parameter is the value. The second parameter is one piece of the pipe to process this value.
> ```typescript
> createPipe({
>     name: 'crow',
>     age: 3
> }, {
>     getValue(value) {
>       return { ...value }
>     },
>     getName(value) {
>       return value.name;
>     },
>     getAge(value) {
>       return value.age;
>     }
> });
> ```
> The created pipe is one `pipeline`. We can do some process based on one piece of the pipe called `process function`.
> Every `process function` could provide two parameters. The first is the `real-time value`. The second is one function can `update the value`.
> The `process function` could provide a function called `pipe`. It would receive the return value of the `process function`. And the first `pipe`'s return value would be the parameter of the secord `pipe` function. The `pipe` also supports function to update value.
> ```typescript
> await value
>     .pipeStart() // start the pipe
>     .getValue(value => {
>         console.log(`value is ${JSON.stringify(value)}`);
>         return value.name;
>     })
>     .pipe<string>(name => console.log(`value.name is ${name}`))
>     .getValue((_, update) => {
>         // update the value, the update is synchronous
>         const value = { name: 'bell-crow', age: 1 };
>         update(value as typeof _);
>         console.log(`change value: ${JSON.stringify(value)}`);
>     })
>     .getValue(value => console.log(`changed value is ${JSON.stringify(value)}`))
>     .pipeEnd()
> ```


## TODO

* [x] one process can mix multiple piece of the pipe function
* [x] append piece of the pipe function dynamic
* [ ] type auto support for pipe function
