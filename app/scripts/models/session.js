/* eslint-disable no-console */
import io from 'socket.io-client';

class Session {

  constructor({ url, roomCode }) {
    this.url = url;
    this.roomCode = roomCode;
    this.localPlayerId = this.getLocalPlayerId();
    // Keep a queue of emit() or on() calls that are made before the socket can
    // connect; when the socket connects, run all calls pushed to the queue
    this.callQueue = [];
  }

  connect() {
    this.socket = io.connect(this.url);
    this.status = 'connecting';
    this.executeCallQueue();
  }

  disconnect() {
    this.socket.disconnect();
  }

  get connected() {
    return this.socket ? this.socket.connected : false;
  }

  get disconnected() {
    return this.socket ? this.socket.disconnected : false;
  }

  executeCallQueue() {
    this.callQueue.forEach(({ method, args }) => {
      this[method](...args);
    });
    this.callQueue.length = 0;
  }

  getLocalPlayerId() {
    return this.localPlayerId || sessionStorage.getItem('c4-localPlayerId');
  }

  setLocalPlayerId(localPlayerId) {
    this.localPlayerId = localPlayerId;
    return sessionStorage.setItem('c4-localPlayerId', localPlayerId);
  }

  on(eventName, callback) {
    if (this.socket) {
      this.socket.on(eventName, (args = {}) => {
        this.processArgs(args, callback);
      });
    } else {
      this.callQueue.push({ method: 'on', args: [eventName, callback] });
    }
  }

  emit(eventName, data = {}, callback) {
    if (this.socket) {
      data = Object.assign({ roomCode: this.roomCode, playerId: this.localPlayerId }, data);
      this.socket.emit(eventName, data, (args = {}) => {
        this.processArgs(args, callback);
      });
    } else {
      this.callQueue.push({ method: 'emit', args: [eventName, data, callback] });
    }
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
    if (callback) {
      callback(args);
    }
  }

}

export default Session;
