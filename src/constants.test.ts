import {
  TIME_TIL_CHOICE_REVEAL,
  QUESTION_ANSWER_TIME
} from './constants';

describe('Constants', () => {
  describe('TIME_TIL_CHOICE_REVEAL', () => {
    it('should be 5000ms', () => {
      expect(TIME_TIL_CHOICE_REVEAL).toBe(5000);
    });
  });

  describe('QUESTION_ANSWER_TIME', () => {
    it('should be 20000ms', () => {
      expect(QUESTION_ANSWER_TIME).toBe(20000);
    });
  });
});