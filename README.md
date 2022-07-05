# pipe-core
## What is pipe-core?
>process data like a pipeline
## How to use?
>the test case code
```typescript
import { createPipeCore } from '@bell-crow/pipe-core';

const _value = {
  name: 'pipe-core',
  age: 1,
  location: () => 'Asia',
  nick: {
    pipe: 1,
    core: 2
  },
  city: [1, 2, 3]
};

const customStartFunction = {
  getName (value: typeof _value) {
    return value.name;
  },
  getDoubleAge (value: typeof _value) {
    return value.age * 2;
  },
  getLocation (value: typeof _value) {
    return value.location();
  },
  getNick (value: typeof _value) {
    return value.nick;
  },
  getCity (value: typeof _value) {
    return value.city;
  },
  getValue (value: typeof _value) {
    return value;
  }
};

const valueCore = createPipeCore(_value, customStartFunction);

test('test createPipeCore case', async () => {
  await valueCore
    .pipeStart()
    .getDoubleAge(doubleAge => {
      expect(doubleAge).toBe(2);
      return doubleAge / 2;
    })
    .pipe<number>(divideAge => {
      expect(divideAge).toBe(1);
    })
    .getName(name => {
      expect(name).toBe('pipe-core');
      return 'changed-pipe-core';
    })
    .pipe<string>(changedName => {
      expect(changedName).toEqual('changed-pipe-core');
    })
    .getCity(city => {
      expect(city).toEqual([1, 2, 3]);
      return city.reverse();
    })
    .pipe<Array<number>>((changedCity, update) => {
      expect(changedCity).toEqual([3, 2, 1]);
      update({ city: [3, 2, 1] });
    })
    .getCity(city => {
      return city;
    })
    .pipe<Array<number>>(city => {
      expect(city).toEqual([3, 2, 1]);
    })
    .getLocation(location => {
      expect(location).toBe('Asia');
    })
    .pipe<unknown>((val, update) => {
      expect(val).toBeUndefined();
      update({ location: () => 'Europe' });
    })
    .getNick(nick => {
      return {
        pipe: nick.core,
        core: nick.pipe
      };
    })
    .pipe<typeof _value['nick']>((nick, update) => {
      expect(nick).toEqual({
        pipe: 2,
        core: 1
      });
      update({ nick: { pipe: 2, core: 1 } });
    })
    .pipeEnd()
    .then(val => {
      const { location, ...otherVal } = val;
      expect(location()).toBe('Europe');
      expect(otherVal).toEqual({
        name: 'pipe-core',
        age: 1,
        nick: {
          pipe: 2,
          core: 1
        },
        city: [3, 2, 1]
      });
    });
});

```

## Have any explain about the usage?
> `createPipe` is a function to create one 'pipe' value. The `pipeStart` is the pipe start and the `pipeEnd` is the pipe end.
> ```typescript
> await value
>   .pipeStart()
>   /* some process */
>   .pipeEnd();
> ```
> The first parameter is the value. The second parameter is one piece of the pipe to process this value.
> ```typescript
> createPipe({
>   name: 'crow',
>   age: 3
> }, {
>   getValue(value) {
>     return { ...value }
>   },
>   getName(value) {
>     return value.name;
>   },
>   getAge(value) {
>     return value.age;
>   }
> });
> ```
> The created pipe is one `pipeline`. We can do some process based on one piece of the pipe called `process function`.
> Every `process function` could provide two parameters. The first is the `real-time value`. The second is one function can `update the value`.
> The `process function` could provide a function called `pipe`. It would receive the return value of the `process function`. And the first `pipe`'s return value would be the parameter of the secord `pipe` function. The `pipe` also supports function to update value.
> ```typescript
> await value
>   .pipeStart() // start the pipe
>   .getValue(value => {
>       console.log(`value is ${JSON.stringify(value)}`);
>       return value.name;
>   })
>   .pipe<string>(name => console.log(`value.name is ${name}`))
>   .getValue((_, update) => {
>       // update the value, the update is synchronous
>       const value = { name: 'bell-crow', age: 1 };
>       update(value as typeof _);
>       console.log(`change value: ${JSON.stringify(value)}`);
>   })
>   .getValue(value => console.log(`changed value is ${JSON.stringify(value)}`))
>   .pipeEnd()
> ```


## TODO

* [x] one process can mix multiple piece of the pipe function
* [x] append piece of the pipe function dynamic
* [ ] more type auto support
