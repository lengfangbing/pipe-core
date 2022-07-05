/* eslint-disable no-undef */
import { createPipeCore } from '../temp/core';

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