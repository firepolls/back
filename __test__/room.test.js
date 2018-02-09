import Room from '../src/lib/room';

describe('Room testing', () => {
  let room = new Room(null, 'room');

  test('Room creation should return a new room object', () => {
    expect(room.polls).toEqual([]);
  });

  test('addPoll should add a poll to an existing room', () => {
    room.addPoll('test poll');
    expect(room.polls[0]).toBeTruthy();
  });

  test('addVote should increment the value of a given number in the results object', () => {
    room.addVote(0, 1);
    expect(room.polls[0].results).toEqual({
      1: 1,
      2: 0,
      3: 0,
      4: 0,
    });
  });

  test('removeVote should decrement the value of a given number in the results object', () => {
    room.removeVote(0, 1);
    expect(room.polls[0].results).toEqual({
      1: 0,
      2: 0,
      3: 0,
      4: 0,
    });
  });
});
