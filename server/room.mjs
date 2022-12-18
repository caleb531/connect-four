import moment from 'moment';

import Player from './player.mjs';
import Game from './game.mjs';

class Room {

  constructor({ code, players = [], game = new Game({ players }) }) {
    this.code = code;
    this.players = players;
    this.game = game;
    // The date/time the room was last seen completely empty (i.e. both players
    // were disconnected)
    this.lastMarkedInactive = null;
  }

  addPlayer({ player, socket }) {
    player = new Player(player);
    this.players.push(player);
    player.socket = socket;
    socket.player = player;
    player.room = this;
    socket.room = this;
    socket.join(this.code);
    return player;
  }

  getPlayerById(playerId) {
    return this.players.find((player) => player.id === playerId);
  }

  getFirstDisconnectedPlayer() {
    return this.players.find((player) => player.socket === null);
  }

  connectPlayer({ playerId, socket }) {
    const player = this.getPlayerById(playerId) || this.getFirstDisconnectedPlayer();
    if (player) {
      player.socket = socket;
      socket.player = player;
      socket.room = this;
      socket.join(this.code);
    }
    return player;
  }

  // Broadcast to all players in the room
  broadcast(eventName, data) {
    this.players.forEach((player) => {
      if (player !== this) {
        player.emit(eventName, player.injectLocalPlayer(data));
      }
    });
  }

  // Return true if all players are currently disconnected from the room;
  // otherwise, return false
  isEmpty() {
    return this.players.every((player) => player.socket === null);
  }

  // Return true if the room has been empty for the specified amount of time (or
  // longer); otherwise, return false
  isAbandoned() {
    return moment(this.lastMarkedInactive)
      .add(Room.abandonmentThreshold)
      .isSameOrBefore(moment());
  }

}

// The number of minutes a room can be inactive before it is considered
// abandoned (and thus subject to automatic deletion by the RoomManager)
Room.abandonmentThreshold = moment.duration(10, 'minutes');

export default Room;
