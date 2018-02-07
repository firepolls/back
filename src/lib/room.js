import Poll from './poll';
import { log } from '../lib/util';

class Room {
  constructor(socket, roomName) {
    this.owner = socket;
    this.roomName = roomName;
    this.polls = {};

    socket.join(roomName);
  }

  addPoll(poll) {
    this.polls[poll.id] = new Poll(poll);
  }

  sendPoll(poll) {
    const room = this.roomName;
    const { question, id } = poll;
    const pollToSend = {
      question,
      id,
      room,
    };

    this.owner.broadcast.to(room)
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
}

export default Room;
