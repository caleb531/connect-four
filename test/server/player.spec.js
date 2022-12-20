import Player from '../../server/player.js';

describe('server player', async () => {

  it('should initialize with arguments', async () => {
    const socket = {};
    const player = new Player({
      name: 'Caleb',
      color: 'green',
      socket
    });
    expect(player).toHaveProperty('name', 'Caleb');
    expect(player).toHaveProperty('color', 'green');
    expect(player).toHaveProperty('socket', socket);
    expect(player).toHaveProperty('score', 0);
    expect(player).toHaveProperty('lastSubmittedWinner', null);
    expect(player).toHaveProperty('lastDisconnectReason', null);
    expect(player).toHaveProperty('lastReaction', null);
  });

  it('should generate valid v4 UUID', async () => {
    const player = new Player({
      name: 'Caleb',
      color: 'green',
      socket: null
    });
    expect(player.id).toMatch(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);
  });

  it('should know when socket is connected', async () => {
    const socket = {};
    const player = new Player({
      name: 'Caleb',
      color: 'green',
      socket
    });
    expect(player).toHaveProperty('connected', true);
  });

  it('should know when socket is not connected', async () => {
    const player = new Player({
      name: 'Caleb',
      color: 'green',
      socket: null
    });
    expect(player).toHaveProperty('connected', false);
  });

  it('should emit a server event for this player only', async () => {
    const socket = { emit: vi.fn() };
    const player = new Player({
      name: 'Caleb',
      color: 'green',
      socket
    });
    player.emit('my-event', { foo: 'bar' });
    expect(socket.emit).toHaveBeenCalledWith('my-event', { foo: 'bar' });
  });

  it('should broadcast a server event to all players', async () => {
    const socket = { emit: vi.fn() };
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
    expect(socket.emit).toHaveBeenCalledWith('my-event', {
      foo: 'bar',
      localPlayer
    });
  });

  it('should serialize as JSON', async () => {
    const socket = {};
    const player = new Player({
      name: 'Caleb',
      color: 'green',
      socket
    });
    const json = player.toJSON();
    expect(json).toHaveProperty('id');
    expect(json).toHaveProperty('name', 'Caleb');
    expect(json).toHaveProperty('color', 'green');
    expect(json).toHaveProperty('connected', true);
    expect(json).toHaveProperty('lastDisconnectReason', null);
    expect(json).toHaveProperty('lastReaction', null);
  });

});
