/* eslint-disable no-console */
import io from 'socket.io-client';

class Session {

  constructor({ url }) {
    this.url = url;
  }

  connect() {
    this.socket = io.connect(this.url);
    this.status = 'connecting';
  }

  on(...args) {
    return this.socket.on(...args);
  }

  emit(...args) {
    return this.socket.emit(...args);
  }

}

export default Session;
