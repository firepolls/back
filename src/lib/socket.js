import socketIO from 'socket.io';
import { log } from './util';
import Room from './room';

const state = {
  rooms: {},
  owners:{},
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
      const ownedRoom = state.owners[client.id];
      if (ownedRoom) {
        state.rooms[ownedRoom].closeRoom(); 
        // TODO: change the owners nad rooms maps so it is gone
      }
    });
    
    client.on('create room', roomName => {
      if (state.rooms[roomName]) {
        client.emit('room conflict', roomName);
      } else {
        client.emit('room created', `You have just created the room "${roomName}".`);
        // TODO: on client side this must dispatch set state for room
        // TODO: add check to make sure you don't already own a room
        // Rob - create the room and add to info to the two maps
        state.rooms[roomName] = new Room(client, roomName);
        state.owners[client.id] = roomName;
        client.join(roomName);
        log('socket.io ROOOOOOMS', io.sockets.adapter.rooms);
        log('STATEEEEEEEE', state);
      }
    });
    
    client.on('join room', roomName => {
      const roomToJoin = state.rooms[roomName];
      if (roomToJoin) {
        // TODO: add check to make sure we are not already in the room
        client.emit('room joined', roomName);
        // TODO: on client side this must dispatch set state for room
        client.join(roomName);
        roomToJoin.addVoter(client);
        log('STATEEEEEEEE', state);
        log(state.rooms[roomName].voters.map(voter => voter.id));
      } else {
        client.emit('room not found', `The room name "${roomName}" does not exist.`);
      }
    });

    client.on('send message', message => {
      const ownedRoom = state.owners[client.id];
      if (ownedRoom) {
        state.rooms[ownedRoom].sendPoll(message); 
      }
    });

    client.on('poll response', data => {
      console.log('data', data);
      console.log(state.rooms);
      
      
      const owner = state.rooms[data.room].owner;
      owner.emit('poll result', data.responseToPoll);
    });
  });
};
