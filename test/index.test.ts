/* eslint-disable no-undef */
import { createPipeCore } from '../src/core';

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

const sleep = async (time = 3000) => new Promise<void>(resolve => {
  setTimeout(() => resolve(), time);
});

test('test async process', async () => {
  const valueCore = createPipeCore(_value, customStartFunction);
  let a = 0;
  await valueCore
    .getName(async name => {
      a++;
      await sleep();
      return `changed ${name}`;
    })
    .pipe<string>(name => {
      expect(a).toBe(1);
      a++;
      expect(name).toBe('changed pipe-core');
    })
    .getValue(value => {
      expect(a).toBe(2);
      const { location, ...val } = value;
      expect(val).toEqual({
        name: 'pipe-core',
        age: 1,
        nick: {
          pipe: 1,
          core: 2
        },
        city: [1, 2, 3]
      });
    })
    .pipeEnd();
});

test('test setValue process', async () => {
  const valueCore = createPipeCore(_value, customStartFunction);
  let a = 0;
  await valueCore
    .getName(async name => {
      a++;
      await sleep();
      return `changed ${name}`;
    })
    .pipe<string>(name => {
      expect(a).toBe(1);
      a++;
      expect(name).toBe('changed pipe-core');
    })
    .getValue((value, _, set) => {
      expect(a).toBe(2);
      const { location, ...val } = value;
      expect(val).toEqual({
        name: 'pipe-core',
        age: 1,
        nick: {
          pipe: 1,
          core: 2
        },
        city: [1, 2, 3]
      });
      set({ age: 100, name: 'set age' });
    })
    .pipeEnd();

  await valueCore
    .getName(name => {
      expect(name).toBe('set age');
    })
    .getDoubleAge(age => {
      expect(age).toBe(200);
    })
    .pipe((_, __, set) => {
      set({ age: 1 });
    })
    .pipeEnd()
    .then(value => {
      const { location, ...val } = value;
      expect(val).toEqual({
        name: 'set age',
        age: 1,
        nick: {
          pipe: 1,
          core: 2
        },
        city: [1, 2, 3]
      });
    });
});

test('test empty value core', async () => {
  const valueCore = createPipeCore(_value);

  await valueCore
    .pipeEnd()
    .then(value => {
      const { location, ...val } = value;
      expect(val).toEqual({
        name: 'pipe-core',
        age: 1,
        nick: {
          pipe: 1,
          core: 2
        },
        city: [1, 2, 3]
      });
    });
});

test('test use piece pipe core process', async () => {
  const valueCore = createPipeCore(_value, customStartFunction);
  // 计数器
  let count = 0;
  await valueCore
    .getName(name => {
      count++;
      expect(name).toBe('pipe-core');
      return name;
    })
    .pipe<string>((name, piecePipe, set) => {
      expect(count).toBe(1);
      count++;
      set({ name: 'new pipe-core' });
      piecePipe
        .getName(() => {
          expect(count).toBe(2);
          count++;
        });
    })
    .getValue((_, piecePipe) => {
      expect(count).toBe(3);
      count++;
      piecePipe
        .getName(name => {
          expect(count).toBe(4);
          count++;
          expect(name).toBe('new pipe-core');
          return name;
        })
        .pipe<string>((name, piecePipe) => {
          expect(count).toBe(5);
          count++;
          piecePipe
            .getName(_name => {
              expect(count).toBe(6);
              count++;
              return _name;
            })
            .pipe<string>((_name, _, set) => {
              expect(count).toBe(7);
              count++;
              set({ name: 'pipe-core' });
            });
        });
    })
    .getName(name => {
      expect(count).toBe(8);
      count++;
      expect(name).toBe('pipe-core');
    })
    .pipeEnd()
    .then(value => {
      expect(count).toBe(9);
      const { location, ...rest } = value;
      expect(rest).toEqual({
        name: 'pipe-core',
        age: 1,
        nick: {
          pipe: 1,
          core: 2
        },
        city: [1, 2, 3]
      });
    });
});

test('test createPipeCore case', async () => {
  const valueCore = createPipeCore(_value, customStartFunction);

  await valueCore
    .getDoubleAge(doubleAge => {
      expect(doubleAge).toBe(2);
      return doubleAge / 2;
    })
    .pipe<number>(divideAge => {
      expect(divideAge).toBe(1);
    })
    .getDoubleAge(doubleAge => {
      expect(doubleAge).toBe(2);
    })
    .getName(name => {
      expect(name).toBe('pipe-core');
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
    .pipe<Array<number>>((changedCity, _, update) => {
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
    .pipe<unknown>((val, _, update) => {
      expect(val).toBeUndefined();
      update({ location: () => 'Europe' });
    })
    .getNick(nick => {
      return {
        pipe: nick.core,
        core: nick.pipe
      };
    })
    .pipe<typeof _value['nick']>((nick, _, update) => {
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
