import sinon from 'sinon';
import { test, expect } from '@playwright/test';
import Emitter from 'tiny-emitter';
import Session from '../app/scripts/models/session.js';
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

  test.beforeEach(() => {
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
    expect(session).to.have.property('url', 'http://localhost:8080');
    expect(session).to.have.property('roomCode', 'ABCD');
    expect(session).to.have.property('localPlayerId', null);
  });

  test('should not be connected by default', async () => {
    expect(session).to.have.property('connected', false);
  });

  test('should not be disconnected by default', async () => {
    expect(session).to.have.property('disconnected', false);
  });

  test('should connect', async () => {
    session.connect();
    expect(connect).to.have.been.calledWith(session.url);
    expect(session).to.have.property('status', 'connecting');
    expect(session).to.have.property('socket', socket);
  });

  test('should disconnect', async () => {
    socket.disconnect = sinon.stub();
    session.connect();
    session.disconnect();
    expect(socket.disconnect).to.have.been.calledWith();
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
    expect(callback).not.to.have.been.called;
    session.connect();
    expect(callback).to.have.been.called;
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
    expect(callback).to.have.been.called;
  });

  test('should queue listener until connected', async () => {
    const callback = sinon.stub();
    session.on('my-event', ({ foo }) => {
      expect(foo).toEqual('bar');
      callback();
    });
    socket.emit('my-event', { foo: 'bar' });
    expect(callback).not.to.have.been.called;
    session.connect();
    socket.emit('my-event', { foo: 'bar' });
    expect(callback).to.have.been.called;
  });

  test('should add listener immediately if already connected', async () => {
    const callback = sinon.stub();
    session.connect();
    session.on('my-event', ({ foo }) => {
      expect(foo).toEqual('bar');
      callback();
    });
    socket.emit('my-event', { foo: 'bar' });
    expect(callback).to.have.been.called;
  });

});
