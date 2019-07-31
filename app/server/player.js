import uuidv4 from 'uuid/v4';

class Player {

  /* eslint-disable no-shadow */
  constructor({ name, color, socket, score = 0 }) {
    // A unique identifier for this player; this only needs to be unique within
    // the scope of a room
    this.id = uuidv4();
    // The current socket associated with this player; this will be updated by
    // the server when the socket is disconnected
    this.socket = socket;
    // The name of the player as entered by the user
    this.name = name;
    // The user-defined color of the user as defined by the client
    this.color = color;
    // The player's total number of wins across all games
    this.score = score;
    // The last winner submitted by the player to the server; a value of null
    // either means that the player has never submitted a winner, or that the
    // last game ended in a tie
    this.lastSubmittedWinner = null;
    // The last reason this player was disconnected
    this.lastDisconnectReason = null;
    // The most recent reaction sent by this player
    this.lastReaction = null;
  }

  get connected() {
    return this.socket !== null;
  }

  // Emit an event to this player only if they are currently connected;
  // otherwise, do nothing
  emit(eventName, data) {
    if (this.socket) {
      this.socket.emit(eventName, data);
    }
  }

  // Broadcast an event to all players in the room other than this player
  broadcast(eventName, data) {
    if (this.room) {
      this.room.players.forEach((player) => {
        player.emit(eventName, player.injectLocalPlayer(data));
      });
    }
  }

  // Inject a reference to this player (assumed to be the local player) into the
  // given data object
  injectLocalPlayer(data) {
    return Object.assign(data, { localPlayer: this });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      score: this.score,
      connected: this.connected,
      lastDisconnectReason: this.lastDisconnectReason,
      lastReaction: this.lastReaction
    };
  }

}

export default Player;
