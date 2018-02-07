import socketIO from 'socket.io';

import { log } from './util';
import Room from './room';

const state = {
  roomMap: {},
  // Anthony - roomMap: { 'roomName': [RoomObject]}
  ownerMap: {},
  // Anthony - ownerMap: { 'ownerSocketId': 'roomName'}
};

export default server => {
  const options = {
    origins: process.env.CORS_ORIGIN,
  };

  // Rob - Only allow connections from OUR front end when in production
  const io = process.env.DEBUG === 'true' ?
    socketIO(server) : socketIO(server, options);

  io.on('connection', client => {
    log(`Client connected: ${client.id}`);

    client.on('disconnect', () => {
      log(`Client disconnected: ${client.id}`);

      // Rob - if disconnecting client owns any rooms, shut down that room
      const ownedRoom = state.ownerMap[client.id];
      if (ownedRoom) {
        state.roomMap[ownedRoom].closeRoom();
        // TODO: change the owners and rooms maps so it is gone
      }
    });

    client.on('create room', roomName => {
      if (state.roomMap[roomName]) {
        log('Type: Create', 'Room name: ', roomName, 'Status: Conflict');
        // Rob - Note that "Create" must be capital
        client.emit('room status', { type: 'create', roomName });
      } else {
        client.emit('room created', roomName);
        // Rob - create the room and add to info to the two maps
        state.roomMap[roomName] = new Room(client, roomName);
        state.ownerMap[client.id] = roomName;
        client.join(roomName);
        log('socket.io ROOOOOOMS', io.sockets.adapter.rooms);
        log('STATEEEEEEEE', state);
      }
    });

    client.on('join room', roomName => {
      const roomToJoin = state.roomMap[roomName];
      if (roomToJoin) {
        // TODO: add check to make sure we are not already in the room
        client.emit('room joined', roomName);
        // TODO: on client side this must dispatch set state for room
        client.join(roomName);
        roomToJoin.addVoter(client);
        log('STATEEEEEEEE', state);
        log(state.roomMap[roomName].voters.map(voter => voter.id));
      } else {
        client.emit('room not found', `The room name "${roomName}" does not exist.`);
      }
    });

    // Anthony - owner sends a poll.
    client.on('create poll', poll => {
      const roomName = state.ownerMap[client.id];
      if (roomName) {
        const room = state.roomMap[roomName];
        room.addPoll(poll);
        room.sendPoll(poll);
        log(state.roomMap[roomName]);
      }
    });

    // Anthony - Voter responds to poll
    client.on('poll response', poll => {
      log('poll response', poll);
      // Anthony - Extracting vote, id and room from poll
      const { vote, id, room } = poll;
      // Anthony - CurrentRoom variable gets set as the current room
      const currentRoom = state.roomMap[room];
      // Anthony - Owner variable gets set as the owner of the current room
      const owner = currentRoom.owner;
      // Anthony - currentPoll variable gets set as the current poll by id
      const currentPoll = currentRoom.polls[id];
      // Anthony - sends the vote back to
      currentPoll.castVote(vote);
      owner.emit('poll result', currentPoll);
    });
  });
};
