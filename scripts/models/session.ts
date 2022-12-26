/* eslint-disable no-console */
import io from 'socket.io-client';
import { ServerPlayer } from './player.d';

type CallQueueEvent =
  | {
      method: 'on';
      args: Parameters<Session['on']>;
    }
  | {
      method: 'emit';
      args: Parameters<Session['emit']>;
    };

class Session {
  url: string;
  roomCode: string | null;
  localPlayerId: string | null;
  localPlayer: ServerPlayer | null;
  callQueue: CallQueueEvent[];
  socket?: ReturnType<typeof io>;
  status?: string;
  constructor({ url, roomCode }: Pick<Session, 'url' | 'roomCode'>) {
    this.url = url;
    this.roomCode = roomCode;
    this.localPlayerId = this.getLocalPlayerId();
    // Keep a queue of emit() or on() calls that are made before the socket can
    // connect; when the socket connects, run all calls pushed to the queue
    this.callQueue = [];
  }

  connect() {
    this.socket = io(this.url);
    this.status = 'connecting';
    this.executeCallQueue();
  }

  disconnect() {
    this.socket?.disconnect();
  }

  get connected() {
    return this.socket ? this.socket.connected : false;
  }

  get disconnected() {
    return this.socket ? this.socket.disconnected : false;
  }

  executeCallQueue() {
    this.callQueue.forEach(({ method, args }) => {
      this[method].apply(this, args);
    });
    this.callQueue.length = 0;
  }

  getLocalPlayerId() {
    if (this.localPlayerId) {
      return this.localPlayerId;
    } else if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem('c4-localPlayerId');
    } else {
      return null;
    }
  }

  setLocalPlayerId(localPlayerId: string | null) {
    this.localPlayerId = localPlayerId;
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('c4-localPlayerId', String(localPlayerId));
    }
  }

  on(eventName: string, callback: (args: any) => void) {
    if (this.socket) {
      this.socket.on(eventName, (args = {}) => {
        this.processArgs(args, callback);
      });
    } else {
      this.callQueue.push({ method: 'on', args: [eventName, callback] });
    }
  }

  emit(eventName: string, data: object = {}, callback?: () => void) {
    if (this.socket) {
      data = Object.assign(
        { roomCode: this.roomCode, playerId: this.localPlayerId },
        data
      );
      this.socket.emit(eventName, data, (args = {}) => {
        this.processArgs(args, callback);
      });
    } else {
      this.callQueue.push({
        method: 'emit',
        args: [eventName, data, callback]
      });
    }
  }

  processArgs(
    args: Partial<Pick<Session, 'localPlayer' | 'status' | 'roomCode'>>,
    callback: (args: any) => void
  ) {
    if (args.status) {
      this.status = args.status;
    }
    if (args.roomCode) {
      this.roomCode = args.roomCode;
    }
    if (args.localPlayer) {
      this.setLocalPlayerId(args.localPlayer.id);
      this.localPlayer = args.localPlayer;
    }
    if (callback) {
      callback(args);
    }
  }
}

export default Session;
