import assert from 'node:assert/strict';
import test from 'node:test';
import { advance, allowed, fresh, key, normalize } from '../app/golden/progress.ts';

test('lanterns accept only the current clue and preserve saved progress', () => {
  let state = fresh();
  assert.equal(key, 'boryeong-golden-2026-v3');
  for (const [index, clue] of ['만', '세', '보령'].entries()) {
    for (const wrong of ['패', '랭', '이', '패랭이', '만세보령', ...['만', '세', '보령'].filter(v => v !== clue)]) {
      assert.equal(advance(1, wrong, state), null);
      assert.equal(state.lanterns, index);
    }
    const next = advance(1, ` ${clue.normalize('NFD')} `, state);
    assert.deepEqual(next, {lanterns: index + 1, goods: 0, seal: false});
    assert.equal(state.lanterns, index, 'input state must not be mutated');
    state = normalize(JSON.parse(JSON.stringify(next)));
  }
  assert.equal(allowed(2, state), true);
  assert.equal(advance(1, '보령', state), null);
});

test('legacy admin answers and internal spaces cannot bypass fixed lantern clues', () => {
  const config = {mission1Answers: ['패', '랭', '이']};
  assert.equal(advance(1, '패', fresh(), config), null);
  assert.equal(advance(1, '만', fresh(), config).lanterns, 1);
  assert.equal(advance(1, '보 령', {lanterns: 2, goods: 0, seal: false}), null);
});

test('mission gates and configurable mission 2 sequence remain intact', () => {
  assert.equal(advance(2, '251', fresh()), null);
  assert.equal(allowed(3, fresh()), false);
  const state = {lanterns: 3, goods: 0, seal: false};
  assert.deepEqual(advance(2, '251', state), {...state, goods: 3});
  const config = {mission2Code: '739'};
  let sequential = state;
  for (const digit of '739') sequential = advance(2, digit, sequential, config);
  assert.deepEqual(sequential, {...state, goods: 3});
  assert.equal(allowed(3, sequential), true);
  assert.equal(allowed(4, sequential), false);
  assert.equal(allowed(4, {...sequential, seal: true}), true);
  assert.deepEqual(normalize({...sequential, seal: true}), {...sequential, seal: true});
});
