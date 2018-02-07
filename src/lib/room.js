import Poll from './poll';
import { log } from '../lib/util';

class Room {
  constructor(socket, roomName) {
    this.owner = socket;
    this.roomName = roomName;
    this.polls = [];

    socket.join(roomName);
  }

  addPoll(question) {
    this.polls.push(new Poll(question));
  }

  sendNewestPoll() {
    const pollIndex = this.polls.length - 1;
    // Rob - In order for this to work properly, this must be called AFTER Room.addPoll()
    const pollToSend = Object.assign({}, this.polls[pollIndex], { id: pollIndex });
    this.owner.broadcast.to(this.roomName)
      .emit('poll received', pollToSend);
  }

  closeRoom(state) {
    this.owner.broadcast.to(this.roomName)
      .emit('room closed', this.roomName);
    this.owner.leave(this.roomName);

    // Rob - remove owner from state.ownerMap
    //     - remove room from state.roomMap
    delete state.ownerMap[this.owner.id];
    delete state.roomMap[this.roomName];
  }

  getRoomForVoter(io) {
    const voters = io.sockets.adapter.rooms[this.roomName].length - 1;
    return Object.assign({}, this, { owner: false, voters });
  }

  addVote(pollId, vote) {
    this.polls[pollId].castVote(vote);
  }

  removeVote(pollId, vote) {
    this.polls[pollId].removeVote(vote);
  }
}

export default Room;
