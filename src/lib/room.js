import Poll from './poll';

class Room {
  constructor(socket, roomName) {
    this.owner = socket;
    this.voters = [];
    this.roomName = roomName;
    this.polls = {};

    socket.join(roomName);
  }

  closeRoom() {
    this.voters.forEach(voter => {
      voter.emit('room closed',
        `The room "${this.roomName}" has been closed.`
      );
      voter.leave(this.roomName);
    });
  }

  addVoter(voter) {
    this.voters.push(voter);
  }

  removeVoter(voter) {
    this.voters = this.voters
      .filter(currentVoter => currentVoter.id !== voter.id);
  }

  addPoll(poll) {
    this.polls[poll.id] = new Poll(poll);
  }

  sendPoll(question) {
    this.owner.broadcast.to(this.roomName).emit('poll inbound', {
      question,
      room: this.roomName,
    });
  }

  // TODO: send poll?
  // TODO: send results?
}

export default Room;
