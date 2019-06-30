import Player from './player.js';
import Game from './game.js';

class Room {

  constructor({ code, players = [], game = new Game({ players }) }) {
    this.code = code;
    this.players = players;
    this.game = game;
  }

  addPlayer({ player, socket }) {
    player = new Player(player);
    this.players.push(player);
    player.socket = socket;
    socket.player = player;
    socket.join(this.code);
    return player;
  }

  getPlayerById(userId) {
    return this.players.find((player) => player.id === userId);
  }

  getFirstDisconnectedPlayer() {
    return this.players.find((player) => player.socket === null);
  }

  connectPlayer({ userId, socket }) {
    let player = this.getPlayerById(userId) || this.getFirstDisconnectedPlayer();
    if (player) {
      player.socket = socket;
      socket.player = player;
      socket.join(this.code);
    }
    return player;
  }

}

export default Room;
