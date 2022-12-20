import Emitter from 'tiny-emitter';
import Session from '../scripts/models/session.js';
import io from 'socket.io-client';

describe('session', async () => {

  let session;
  let connect;
  let socket;

  beforeAll(() => {
    socket = new Emitter();
    connect = vi.spyOn(io, 'connect').mockImplementation(() => {
      return socket;
    });
  });

  beforeEach(async () => {
    session = new Session({
      url: 'http://localhost:8080',
      roomCode: 'ABCD'
    });
  });

  afterEach(() => {
    socket.off('my-event');
  });

  afterAll(() => {
    connect.restore();
  });

  it('should initialize', async () => {
    expect(session).toHaveProperty('url', 'http://localhost:8080');
    expect(session).toHaveProperty('roomCode', 'ABCD');
    expect(session).toHaveProperty('localPlayerId', null);
  });

  it('should not be connected by default', async () => {
    expect(session).toHaveProperty('connected', false);
  });

  it('should not be disconnected by default', async () => {
    expect(session).toHaveProperty('disconnected', false);
  });

  it('should connect', async () => {
    session.connect();
    expect(connect).toHaveBeenCalledWith(session.url);
    expect(session).toHaveProperty('status', 'connecting');
    expect(session).toHaveProperty('socket', socket);
  });

  it('should disconnect', async () => {
    socket.disconnect = vi.fn();
    session.connect();
    session.disconnect();
    expect(socket.disconnect).toHaveBeenCalledWith();
    delete socket.disconnect;
  });

  it('should queue emit until connected', async () => {
    session.localPlayerId = '356cd624-2c40-465c-9f4a-91f52c2705f3';
    const callback = vi.fn();
    socket.on('my-event', ({ foo, playerId }) => {
      expect(foo).toEqual('bar');
      expect(playerId).toEqual(session.localPlayerId);
      callback();
    });
    session.emit('my-event', { foo: 'bar' });
    expect(callback).not.toHaveBeenCalled();
    session.connect();
    expect(callback).toHaveBeenCalled();
  });

  it('should emit immediately if already connected', async () => {
    session.localPlayerId = '356cd624-2c40-465c-9f4a-91f52c2705f3';
    const callback = vi.fn();
    socket.on('my-event', ({ foo, playerId }) => {
      expect(foo).toEqual('bar');
      expect(playerId).toEqual(session.localPlayerId);
      callback();
    });
    session.connect();
    session.emit('my-event', { foo: 'bar' });
    expect(callback).toHaveBeenCalled();
  });

  it('should queue listener until connected', async () => {
    const callback = vi.fn();
    session.on('my-event', ({ foo }) => {
      expect(foo).toEqual('bar');
      callback();
    });
    socket.emit('my-event', { foo: 'bar' });
    expect(callback).not.toHaveBeenCalled();
    session.connect();
    socket.emit('my-event', { foo: 'bar' });
    expect(callback).toHaveBeenCalled();
  });

  it('should add listener immediately if already connected', async () => {
    const callback = vi.fn();
    session.connect();
    session.on('my-event', ({ foo }) => {
      expect(foo).toEqual('bar');
      callback();
    });
    socket.emit('my-event', { foo: 'bar' });
    expect(callback).toHaveBeenCalled();
  });

});
