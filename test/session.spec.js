import sinon from 'sinon';
import { test, expect } from '@playwright/test';
import Emitter from 'tiny-emitter';
import Session from '../scripts/models/session.js';
import io from 'socket.io-client';

test.describe('session', async () => {
  let session;
  let connect;
  let socket;

  test.beforeAll(() => {
    connect = sinon.stub(io, 'connect');
    socket = new Emitter();
    connect.returns(socket);
  });

  test.beforeEach(async ({ page }) => {
    session = new Session({
      url: 'http://localhost:8080',
      roomCode: 'ABCD'
    });
  });

  test.afterEach(() => {
    socket.off('my-event');
  });

  test.afterAll(() => {
    connect.restore();
  });

  test('should initialize', async () => {
    expect(session).toHaveProperty('url', 'http://localhost:8080');
    expect(session).toHaveProperty('roomCode', 'ABCD');
    expect(session).toHaveProperty('localPlayerId', null);
  });

  test('should not be connected by default', async () => {
    expect(session).toHaveProperty('connected', false);
  });

  test('should not be disconnected by default', async () => {
    expect(session).toHaveProperty('disconnected', false);
  });

  test('should connect', async () => {
    session.connect();
    expect(connect).toHaveBeenCalledWith(session.url);
    expect(session).toHaveProperty('status', 'connecting');
    expect(session).toHaveProperty('socket', socket);
  });

  test('should disconnect', async () => {
    socket.disconnect = sinon.stub();
    session.connect();
    session.disconnect();
    expect(socket.disconnect).toHaveBeenCalledWith();
    delete socket.disconnect;
  });

  test('should queue emit until connected', async () => {
    session.localPlayerId = '356cd624-2c40-465c-9f4a-91f52c2705f3';
    const callback = sinon.stub();
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

  test('should emit immediately if already connected', async () => {
    session.localPlayerId = '356cd624-2c40-465c-9f4a-91f52c2705f3';
    const callback = sinon.stub();
    socket.on('my-event', ({ foo, playerId }) => {
      expect(foo).toEqual('bar');
      expect(playerId).toEqual(session.localPlayerId);
      callback();
    });
    session.connect();
    session.emit('my-event', { foo: 'bar' });
    expect(callback).toHaveBeenCalled();
  });

  test('should queue listener until connected', async () => {
    const callback = sinon.stub();
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

  test('should add listener immediately if already connected', async () => {
    const callback = sinon.stub();
    session.connect();
    session.on('my-event', ({ foo }) => {
      expect(foo).toEqual('bar');
      callback();
    });
    socket.emit('my-event', { foo: 'bar' });
    expect(callback).toHaveBeenCalled();
  });
});
