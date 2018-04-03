import socketIO from 'socket.io';

import Room from './room';
import { log, formatRoomName } from './util';

const state = {
  roomMap: {},
  // Anthony - roomMap: { 'roomName': [RoomObject] }
  ownerMap: {},
  // Anthony - ownerMap: { <ownerSocketId>: 'roomName' }
  voterMap: {},
  // Rob - voterMap: { <voterSocketId>: 'roomName }
};

export default (server) => {
  // Rob - Open the socket
  const io = socketIO(server);

  io.on('connection', client => {
    log('__CLIENT_CONNECT__', client.id);

    client.on('disconnect', () => {
      log('__CLIENT_DISCONNECT__', client.id);

      // Rob - if disconnecting client owns any rooms, shut down that room
      // Rob - if disconnecting client is a voter in a room, leave that room
      const ownedRoomName = state.ownerMap[client.id];
      const votingRoomName = state.voterMap[client.id];
      if (ownedRoomName) {
        log('__CLOSE_ROOM__', ownedRoomName);
        // Rob - #closeRoom() removes the room from state and kicks out all voters
        state.roomMap[ownedRoomName].closeRoom(state);
      } else if (votingRoomName) {
        log('__LEAVE_ROOM__', votingRoomName, '__CLIENT__', client.id);
        // Rob - Must send message before leaving room
        client.broadcast.to(votingRoomName).emit('voter left');
        client.leave(votingRoomName);
        delete state.voterMap[client.id];
      }
    });

    // ------------------- OWNER ------------------- \\
    client.on('create room', roomNameRaw => {
      const roomName = formatRoomName(roomNameRaw);

      if (state.roomMap[roomName]) {
        log('__CREATE_ROOM_ERROR__', roomNameRaw);
        // Rob - formatted room name already taken, send raw name back
        client.emit('room status', { type: 'create', roomName: roomNameRaw });
      } else {
        log('__CREATE_ROOM__', roomName);
        // Rob - Send back BOTH raw and formatted room name
        client.emit('room created', { roomNameRaw, roomName });
        // Rob - create the room and add info to the two maps
        state.roomMap[roomName] = new Room(client, roomName, roomNameRaw);
        state.ownerMap[client.id] = roomName;
      }
    });

    client.on('close room', () => {
      const ownedRoomName = state.ownerMap[client.id];
      log('__CLOSE_ROOM__', ownedRoomName);

      state.roomMap[ownedRoomName].closeRoom(state);
    });

    // Anthony - owner sends a poll.
    client.on('create poll', question => {
      log('__CREATE_POLL__', question);
      const roomName = state.ownerMap[client.id];
      const room = state.roomMap[roomName];
      room.addPoll(question);
      room.sendNewestPoll();
    });

    // ------------------- VOTER ------------------- \\
    client.on('join room', roomNameRaw => {
      const roomName = formatRoomName(roomNameRaw);
      const roomToJoin = state.roomMap[roomName];
      if (roomToJoin) {
        log('__JOIN_ROOM__', roomName);
        client.join(roomName);
        // Rob - Emit to everyone in the room to increment voter number
        client.broadcast.to(roomName).emit('voter joined');
        // Rob - Send full room object to new voter
        client.emit('room joined', roomToJoin.getRoomForVoter(io));
        // Rob - Add client to voterMap
        state.voterMap[client.id] = roomName;
      } else {
        log('__JOIN_ROOM_ERROR__', roomName);
        client.emit('room status', { type: 'join', roomName: roomNameRaw });
      }
    });

    // Anthony - Voter responds to poll
    client.on('vote cast', ({ vote, pollId, roomName }) => {
      log('__VOTE_CAST__', '__ROOM__', roomName, '__POLL__', pollId, '__VOTE__', vote);

      const room = state.roomMap[roomName];
      const { voteMap } = room.polls[pollId];
      const lastVote = voteMap[client.id];
      log('__LAST_VOTE__', lastVote || 'First vote');
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
      log('__LEAVE_ROOM__', roomName, '__CLIENT__', client.id);
      // Rob - Must send message before leaving room
      client.broadcast.to(roomName).emit('voter left');
      client.leave(roomName);
      delete state.voterMap[client.id];
    });
  });
};
