import Poll from '../src/lib/poll';

describe('poll testing', () => {
  let poll = new Poll('test poll', 123);

  test('Poll creation should return a new poll object', () => {
    expect(poll.pollId).toEqual(123);
    expect(poll.voteMap).toEqual({});
    expect(poll.question).toEqual('test poll');
  });

  test('packagePollForVoter should return an object with information', () => {
    let packagedPoll = poll.packagePollForVoter();
    expect(packagedPoll.pollId).toEqual(123);
    expect(packagedPoll.results).toEqual({
      1: 0,
      2: 0,
      3: 0,
      4: 0,
    });
    expect(packagedPoll.question).toEqual('test poll');
  });

  test('castVote should increment the value of a property in the results object based on a number from 1 to 4', () => {
    poll.castVote(1);
    expect(poll.results).toEqual({
      1: 1,
      2: 0,
      3: 0,
      4: 0,
    });
  });

  test('removeVote should decrement the value of a property in the results object based on a number from 1 to 4', () => {
    poll.removeVote(1);
    expect(poll.results).toEqual({
      1: 0,
      2: 0,
      3: 0,
      4: 0,
    });
  });
});
