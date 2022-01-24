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
    getValue(value) {
      return { ...value }
    },
    getName(value) {
      return value.name;
    },
    getAge(value) {
      return value.age;
    }
});
value
    .pipeStart()
    .getAge(age => console.log(`age is ${age}`))
    .getName(name => console.log(`name is ${name}`))
    .getValue(value => console.log(`value is ${JSON.stringify(value)}`))
    .getValue((_, update) => {
      const value = { name: 'bell-crow', age: 1 };
      update(value as typeof _);
      console.log(`change value: ${JSON.stringify(value)}`);
    })
    .getValue(value => console.log(`changed value is ${JSON.stringify(value)}`))
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
> ```typescript
> await value
>     .pipeStart() // start the pipe
>     .getValue(value => console.log(`value is ${JSON.stringify(value)}`))
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

* [ ] one process can mix multiple piece of the pipe function
* [ ] append piece of the pipe function dynamic
