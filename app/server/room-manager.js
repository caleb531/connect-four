import moment from 'moment';

import Room from './room.js';

class RoomManager {

  constructor() {
    this.roomsByCode = {};
    this.inactiveRooms = new Set();
    this.pollForAbandonedRooms();
  }

  getRoom(roomCode) {
    return this.roomsByCode[roomCode];
  }

  openRoom() {
    const roomCode = this.obtainRoomCode();
    const room = new Room({
      players: [],
      code: roomCode
    });
    this.roomsByCode[roomCode] = room;
    return room;
  }

  closeRoom(room) {
    this.inactiveRooms.delete(room);
    delete this.roomsByCode[room.code];
  }

  obtainRoomCode() {
    let roomCode;
    do {
      roomCode = this.generateRandomRoomCode();
    } while (this.roomsByCode[roomCode]);
    return roomCode;
  }

  generateRandomRoomCode() {
    let roomCode = '';
    // Uppercase letters A-Z
    const startIndex = 65;
    const endIndex = 90;
    for (let i = 0; i < RoomManager.roomCodeLength; i += 1) {
      roomCode += String.fromCharCode(Math.floor(startIndex + ((endIndex - startIndex + 1) * Math.random())));
    }
    return roomCode;
  }

  markRoomAsActive(room) {
    this.inactiveRooms.delete(room);
    room.lastMarkedInactive = null;
    console.log(`room ${room.code} is active again`);
  }

  markRoomAsInactive(room) {
    room.lastMarkedInactive = Date.now();
    this.inactiveRooms.add(room);
    console.log(`room ${room.code} marked as inactive`);
  }

  // A room is considered "abandoned" if it has been inactive for more than the
  // specified period of time
  pollForAbandonedRooms() {
    setInterval(() => {
      this.inactiveRooms.forEach((room) => {
        if (room.isAbandoned()) {
          // Yes, it is safe to remove elements from a Set while iterating over
          // it; see <https://stackoverflow.com/a/28306768/560642>
          this.closeRoom(room);
          console.log(`room ${room.code} has been permanently deleted`);
        }
      });
    }, Room.abandonmentCheckInterval.asMilliseconds());
  }

}

// The number of characters is a given room code
RoomManager.roomCodeLength = 4;
// How frequently (in minutes) to check for abandoned rooms
Room.abandonmentCheckInterval = moment.duration(30, 'minutes');

// Expose a global room manager instance that can be imported from anywhere on
// the server
export const roomManager = new RoomManager();

export default RoomManager;
