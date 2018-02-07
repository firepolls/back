import socketIO from 'socket.io';

import Room from './room';
import { log } from './util';

const state = {
  roomMap: {},
  // Anthony - roomMap: { 'roomName': [RoomObject]}
  ownerMap: {},
  // Anthony - ownerMap: { 'ownerSocketId': 'roomName'}
};

export default (server) => {
  const options = {
    origins: process.env.CORS_ORIGIN,
  };

  // Rob - Only allow connections from OUR front end when in production
  const io = process.env.DEBUG === 'true' ?
    socketIO(server) : socketIO(server, options);

  io.on('connection', client => {
    log('__CLIENT_CONNECT__', client.id);

    client.on('disconnect', () => {
      log('__CLIENT_DISCONNECT__', client.id);

      // Rob - if disconnecting client owns any rooms, shut down that room
      const ownedRoomName = state.ownerMap[client.id];
      if (ownedRoomName) {
        state.roomMap[ownedRoomName].closeRoom(state);
      }
      // TODO: Rob - if in a room, need to emit an update to all involved
    });

    // ------------------- OWNER ------------------- \\
    client.on('create room', roomName => {
      if (state.roomMap[roomName]) {
        log('__ERROR__ Type: Create', 'Room name: ', roomName, 'Status: Conflict');
        // Rob - Send error status back to client
        client.emit('room status', { type: 'create', roomName });
      } else {
        log('__CREATE_ROOM__', roomName);
        client.emit('room created', roomName);
        // Rob - create the room and add info to the two maps
        state.roomMap[roomName] = new Room(client, roomName);
        state.ownerMap[client.id] = roomName;
      }
    });

    client.on('close room', () => {
      const ownedRoomName = state.ownerMap[client.id];
      state.roomMap[ownedRoomName].closeRoom(state);
    });

    // Anthony - owner sends a poll.
    client.on('create poll', question => {
      const roomName = state.ownerMap[client.id];
      const room = state.roomMap[roomName];
      room.addPoll(question);
      room.sendNewestPoll();
      log('__CREATE_POLL__');
    });

    // ------------------- VOTER ------------------- \\
    client.on('join room', roomName => {
      const roomToJoin = state.roomMap[roomName];
      if (roomToJoin) {
        client.join(roomName);
        // Rob - Emit to everyone in the room to increment voter number
        client.broadcast.to(roomName).emit('voter joined');
        // Rob - Send full room object to new voter
        client.emit('room joined', roomToJoin.getRoomForVoter(io));
        log('__CLIENT_JOINED_ Room:', roomName);
      } else {
        log('__JOIN_ERROR__', roomName, 'Not Found');
        client.emit('room status', { type: 'join', roomName });
      }
    });

    // Anthony - Voter responds to poll
    client.on('poll response', poll => {
      log('__POLL_RESPONSE__', poll);
      // Anthony - Extracting vote, id and room from poll
      const { vote, id, roomName } = poll;
      // Anthony - room variable gets set as the current room
      const room = state.roomMap[roomName];
      // Anthony - Owner variable gets set as the owner of the current room
      const owner = room.owner;

      // Anthony - sends the vote back to
      room.addVote(id, vote);
      owner.emit('poll vote increment', { id, vote });
    });

    client.on('leave room', roomName => {
      // Rob - Must send message before leaving room
      client.broadcast.to(roomName).emit('voter left');
      client.leave(roomName);
      log('__LEAVE_ROOM__', roomName, 'Client:', client.id);
    });
  });
};
