import Poll from './poll';
import { log } from '../lib/util';

class Room {
  constructor(socket, roomName, roomNameRaw) {
    this.polls = [];
    this.owner = socket;
    this.roomName = roomName;
    this.roomNameRaw = roomNameRaw;

    // Rob - Create room under the formatted roomName
    socket.join(roomName);
  }

  addPoll(question) {
    const pollId = this.polls.length;
    this.polls.push(new Poll(question, pollId));
  }

  // Rob - In order for this to work properly, this must be called AFTER Room.addPoll()
  sendNewestPoll() {
    const pollId = this.polls.length - 1;
    const poll = this.polls[pollId];
    const pollToSend = poll.packagePollForVoter();
    this.owner.broadcast.to(this.roomName)
      .emit('poll received', pollToSend);
  }

  closeRoom(state) {
    const { roomName, roomNameRaw } = this;
    this.owner.broadcast.to(roomName)
      .emit('room closed', { roomName, roomNameRaw });
    this.owner.leave(roomName);

    // Rob - remove owner from state.ownerMap
    //     - remove room from state.roomMap
    delete state.ownerMap[this.owner.id];
    delete state.roomMap[roomName];
  }

  getRoomForVoter(io) {
    // Rob - Add the current number of voters to the room
    const voters = io.sockets.adapter.rooms[this.roomName].length - 1;
    const room = Object.assign({}, this, { owner: false, voters });
    delete room.voteMap;
    return room;
  }

  addVote(pollId, vote) {
    this.polls[pollId].castVote(vote);
  }

  removeVote(pollId, vote) {
    this.polls[pollId].removeVote(vote);
  }
}

export default Room;
