import socketIO from 'socket.io';

import Room from './room';
import { log } from './util';

const state = {
  roomMap: {},
  // Anthony - roomMap: { 'roomName': [RoomObject] }
  ownerMap: {},
  // Anthony - ownerMap: { <ownerSocketId>: 'roomName' }
  voterMap: {},
  // Rob - voterMap { <voterSocketId>: 'roomName }
};

export default (server) => {
  // Rob - Open the socket
  const io = socketIO(server);

  io.on('connection', client => {
    log('__CLIENT_CONNECT__', client.id);

    client.on('disconnect', () => {
      log('__CLIENT_DISCONNECT__', client.id);

      // Rob - if disconnecting client owns any rooms, shut down that room
      const ownedRoomName = state.ownerMap[client.id];
      const votingRoomName = state.voterMap[client.id];
      if (ownedRoomName) {
        state.roomMap[ownedRoomName].closeRoom(state);
      } else if (votingRoomName) {
        // Rob - Must send message before leaving room
        client.broadcast.to(votingRoomName).emit('voter left');
        client.leave(votingRoomName);
        delete state.voterMap[client.id];
        log('__LEAVE_ROOM__', votingRoomName, '__CLIENT__', client.id);
      }
    });

    // ------------------- OWNER ------------------- \\
    client.on('create room', roomName => {
      if (state.roomMap[roomName]) {
        log('__CREATE_ROOM_ERROR__', roomName);
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
      log('__CLOSE_ROOM__', ownedRoomName);
    });

    // Anthony - owner sends a poll.
    client.on('create poll', question => {
      const roomName = state.ownerMap[client.id];
      const room = state.roomMap[roomName];
      room.addPoll(question);
      room.sendNewestPoll();
      log('__CREATE_POLL__', question);
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
        // Rob - Add client to voterMap
        state.voterMap[client.id] = roomName;
        log('__JOIN_ROOM__', roomName);
      } else {
        log('__JOIN_ROOM_ERROR__', roomName);
        client.emit('room status', { type: 'join', roomName });
      }
    });

    // Anthony - Voter responds to poll
    client.on('vote cast', ({ vote, pollId, roomName }) => {
      log('__VOTE_CAST__', '__ROOM__', roomName, '__POLL__', pollId, '__VOTE__', vote);

      const room = state.roomMap[roomName];
      const { voteMap } = room.polls[pollId];
      const lastVote = voteMap[client.id];
      log('LAST_VOTE:', lastVote);
      if (lastVote) {
        room.removeVote(pollId, lastVote);
        io.in(roomName).emit('vote decrement', { pollId, lastVote });
      }
      // Rob - update the vote count and tell others to update
      room.addVote(pollId, vote);
      io.in(roomName).emit('vote increment', { pollId, vote });
      voteMap[client.id] = vote;
    });

    client.on('leave room', roomName => {
      // Rob - Must send message before leaving room
      client.broadcast.to(roomName).emit('voter left');
      client.leave(roomName);
      delete state.voterMap[client.id];
      log('__LEAVE_ROOM__', roomName, '__CLIENT__', client.id);
    });
  });
};
