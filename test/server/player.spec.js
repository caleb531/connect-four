import { test, expect } from '@playwright/test';
import sinon from 'sinon';
import Player from '../../app/server/player.js';

test.describe('server player', async () => {

  test('should initialize with arguments', async () => {
    const socket = sinon.stub();
    const player = new Player({
      name: 'Caleb',
      color: 'green',
      socket
    });
    expect(player).to.have.property('name', 'Caleb');
    expect(player).to.have.property('color', 'green');
    expect(player).to.have.property('socket', socket);
    expect(player).to.have.property('score', 0);
    expect(player).to.have.property('lastSubmittedWinner', null);
    expect(player).to.have.property('lastDisconnectReason', null);
    expect(player).to.have.property('lastReaction', null);
  });

  test('should generate valid v4 UUID', async () => {
    const player = new Player({
      name: 'Caleb',
      color: 'green',
      socket: null
    });
    expect(player.id).to.match(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);
  });

  test('should know when socket is connected', async () => {
    const socket = sinon.stub();
    const player = new Player({
      name: 'Caleb',
      color: 'green',
      socket
    });
    expect(player).to.have.property('connected', true);
  });

  test('should know when socket is not connected', async () => {
    const player = new Player({
      name: 'Caleb',
      color: 'green',
      socket: null
    });
    expect(player).to.have.property('connected', false);
  });

  test('should emit a server event for this player only', async () => {
    const socket = sinon.stub({
      emit: () => {/* noop */}
    });
    const player = new Player({
      name: 'Caleb',
      color: 'green',
      socket
    });
    player.emit('my-event', { foo: 'bar' });
    expect(socket.emit).to.have.been.calledWith('my-event', { foo: 'bar' });
  });

  test('should broadcast a server event to all players', async () => {
    const socket = sinon.stub({
      emit: () => {/* noop */}
    });
    const localPlayer = new Player({
      name: 'Caleb',
      color: 'green',
      socket
    });
    const players = [
      new Player({ color: 'blue', name: 'Bob' }),
      localPlayer
    ];
    localPlayer.room = { players };
    localPlayer.broadcast('my-event', { foo: 'bar' });
    expect(socket.emit).to.have.been.calledWith('my-event', {
      foo: 'bar',
      localPlayer
    });
  });

  test('should serialize as JSON', async () => {
    const socket = sinon.stub();
    const player = new Player({
      name: 'Caleb',
      color: 'green',
      socket
    });
    const json = player.toJSON();
    expect(json).to.have.property('id');
    expect(json).to.have.property('name', 'Caleb');
    expect(json).to.have.property('color', 'green');
    expect(json).to.have.property('connected', true);
    expect(json).to.have.property('lastDisconnectReason', null);
    expect(json).to.have.property('lastReaction', null);
  });

});
