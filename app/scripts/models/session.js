/* eslint-disable no-console */
import io from 'socket.io-client';

class Session {

  constructor({ url, roomCode }) {
    this.url = url;
    this.roomCode = roomCode;
    this.localPlayerId = this.getLocalPlayerId();
  }

  connect() {
    this.socket = io.connect(this.url);
    this.status = 'connecting';
  }

  getLocalPlayerId() {
    return this.localPlayerId || sessionStorage.getItem('c4-localPlayerId');
  }

  setLocalPlayerId(localPlayerId) {
    this.localPlayerId = localPlayerId;
    return sessionStorage.setItem('c4-localPlayerId', localPlayerId);
  }

  on(eventName, callback) {
    this.socket.on(eventName, (args = {}) => {
      this.processArgs(args, callback);
    });
  }

  emit(eventName, data, callback) {
    data = Object.assign({ roomCode: this.roomCode, localPlayerId: this.localPlayerId }, data);
    this.socket.emit(eventName, data, (args = {}) => {
      this.processArgs(args, callback);
    });
  }

  processArgs(args, callback) {
    if (args.status) {
      this.status = args.status;
    }
    if (args.roomCode) {
      this.roomCode = args.roomCode;
    }
    if (args.localPlayer) {
      this.setLocalPlayerId(args.localPlayer.id);
    }
    callback(args);
  }

}

export default Session;
