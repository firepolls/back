// TODO: Consider emitting for each of these actions

class Room {
  constructor(socket, roomName) {
    this.owner = socket;
    this.voters = [];
    this.roomName = roomName;

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

  sendPoll(message) {
    this.owner.broadcast.to(this.roomName).emit('poll inbound', {
      message,
      room: this.roomName,
    });
  }

  // TODO: send poll?
  // TODO: send results?
}

export default Room;
