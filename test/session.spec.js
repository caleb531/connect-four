import Emitter from 'tiny-emitter';
import Session from '../app/scripts/models/session.js';
import io from 'socket.io-client';

describe('session', function () {

  let session;
  let connect;
  let socket;

  before(function () {
    connect = sinon.stub(io, 'connect');
    socket = new Emitter();
    connect.returns(socket);
  });

  beforeEach(function () {
    session = new Session({
      url: 'http://localhost:8080',
      roomCode: 'ABCD'
    });
  });

  afterEach(function () {
    socket.off('my-event');
  });

  after(function () {
    connect.restore();
  });

  it('should initialize', function () {
    expect(session).to.have.property('url', 'http://localhost:8080');
    expect(session).to.have.property('roomCode', 'ABCD');
    expect(session).to.have.property('localPlayerId', null);
  });

  it('should not be connected by default', function () {
    expect(session).to.have.property('connected', false);
  });

  it('should not be disconnected by default', function () {
    expect(session).to.have.property('disconnected', false);
  });

  it('should connect', function () {
    session.connect();
    expect(connect).to.have.been.calledWith(session.url);
    expect(session).to.have.property('status', 'connecting');
    expect(session).to.have.property('socket', socket);
  });

  it('should queue emit until connected', function () {
    session.localPlayerId = '356cd624-2c40-465c-9f4a-91f52c2705f3';
    const callback = sinon.stub();
    socket.on('my-event', ({ foo, playerId }) => {
      expect(foo).to.equal('bar');
      expect(playerId).to.equal(session.localPlayerId);
      callback();
    });
    session.emit('my-event', { foo: 'bar' });
    expect(callback).not.to.have.been.called;
    session.connect();
    expect(callback).to.have.been.called;
  });

  it('should emit immediately if already connected', function () {
    session.localPlayerId = '356cd624-2c40-465c-9f4a-91f52c2705f3';
    const callback = sinon.stub();
    socket.on('my-event', ({ foo, playerId }) => {
      expect(foo).to.equal('bar');
      expect(playerId).to.equal(session.localPlayerId);
      callback();
    });
    session.connect();
    session.emit('my-event', { foo: 'bar' });
    expect(callback).to.have.been.called;
  });

  it('should queue listener until connected', function () {
    const callback = sinon.stub();
    session.on('my-event', ({ foo }) => {
      expect(foo).to.equal('bar');
      callback();
    });
    socket.emit('my-event', { foo: 'bar' });
    expect(callback).not.to.have.been.called;
    session.connect();
    socket.emit('my-event', { foo: 'bar' });
    expect(callback).to.have.been.called;
  });

  it('should add listener immediately if already connected', function () {
    const callback = sinon.stub();
    session.connect();
    session.on('my-event', ({ foo }) => {
      expect(foo).to.equal('bar');
      callback();
    });
    socket.emit('my-event', { foo: 'bar' });
    expect(callback).to.have.been.called;
  });

});
