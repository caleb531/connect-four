import Room from './room.js';

class RoomManager {

  constructor() {
    this.roomsById = {};
  }

  openRoom() {
    let roomCode = this.obtainRoomCode();
    let room = new Room({
      players: [],
      code: roomCode
    });
    this.roomsById[roomCode] = room;
    return room;
  }

  closeRoom({ roomCode }) {
    delete this.roomsById[roomCode];
  }

  obtainRoomCode() {
    let roomCode;
    do {
      roomCode = this.generateRandomRoomCode();
    } while (this.roomsById[roomCode]);
    return roomCode;
  }

  generateRandomRoomCode() {
    let roomCode = '';
    let startIndex = 65;
    let endIndex = 90;
    for (var i = 0; i < RoomManager.roomCodeLength; i += 1) {
      roomCode += String.fromCharCode(Math.floor(startIndex + ((endIndex - startIndex + 1) * Math.random())));
    }
    return roomCode;
  }

}

// The number of characters is a given room code
RoomManager.roomCodeLength = 4;

export default RoomManager;
