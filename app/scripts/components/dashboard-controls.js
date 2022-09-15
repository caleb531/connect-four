import m from "mithril";
import ClipboardJS from "clipboard";

class DashboardControlsComponent {
  oninit({ attrs: { game, session } }) {
    this.game = game;
    this.session = session;
  }

  // Prepare game players by creating new players (if necessary) and deciding
  // which player has the starting move
  setPlayers(gameType) {
    if (this.game.players.length > 0) {
      // Reset new games before choosing number of players (no need to reset
      // the very first game)
      this.game.resetGame();
    }
    this.game.setPlayers(gameType);
  }

  startGame(newStartingPlayer) {
    this.game.startGame({
      startingPlayer: newStartingPlayer,
    });
    if (window.ga) {
      // ga('send', 'pageview');
    }
    if (window.gtag) {
      // gtag('event', 'page_view');
    }
  }

  endGame(roomCode) {
    if (roomCode) {
      // The local player ID and room code will be automatically passed by the
      // session.emit() function
      this.session.emit("end-game");
    } else {
      this.game.endGame();
    }
  }

  returnToHome() {
    this.session.disconnect();
    // Redirect to homepage and clear all app state
    window.location.href = "/";
  }

  closeRoom() {
    this.session.status = "closingRoom";
    this.session.emit("close-room", {}, () => {
      this.returnToHome();
    });
  }

  declineNewGame() {
    this.session.status = "decliningNewGame";
    this.session.emit("decline-new-game", {}, () => {
      this.returnToHome();
    });
  }

  leaveRoom() {
    this.session.status = "leavingRoom";
    this.returnToHome();
  }

  promptToStartOnlineGame() {
    this.session.status = "newPlayer";
    this.setPlayers({ gameType: "online" });
  }

  setNewPlayerName(inputEvent) {
    this.newPlayerName = inputEvent.target.value.trim();
    inputEvent.redraw = false;
  }

  submitNewPlayer(submitEvent, roomCode) {
    submitEvent.preventDefault();
    if (roomCode) {
      this.addNewPlayerToGame(roomCode);
    } else {
      this.startOnlineGame();
    }
  }

  addNewPlayerToGame(roomCode) {
    this.session.status = "connecting";
    const submittedPlayer = { name: this.newPlayerName, color: "blue" };
    this.session.emit(
      "add-player",
      { roomCode, player: submittedPlayer },
      ({ game, localPlayer }) => {
        this.game.restoreFromServer({ game, localPlayer });
        m.redraw();
      }
    );
  }

  startOnlineGame() {
    this.session.connect();
    // Construct a placeholder player with the name we entered and the default
    // first player color
    const submittedPlayer = { name: this.newPlayerName, color: "red" };
    // Request a new room and retrieve the room code returned from the server
    this.session.emit(
      "open-room",
      { player: submittedPlayer },
      ({ roomCode, game, localPlayer }) => {
        this.game.restoreFromServer({ game, localPlayer });
        m.route.set(`/room/${roomCode}`);
      }
    );
    if (window.ga) {
      ga("send", "pageview");
    }
    if (window.gtag) {
      gtag("event", "page_view");
    }
  }

  requestNewOnlineGame() {
    this.session.status = "connecting";
    this.session.emit(
      "request-new-game",
      { winner: this.game.winner },
      ({ localPlayer }) => {
        if (this.session.status === "requestingNewGame") {
          this.game.requestingPlayer = localPlayer;
        }
        m.redraw();
      }
    );
  }

  configureCopyControl({ dom }) {
    this.shareLinkCopier = new ClipboardJS(dom);
  }

  view({ attrs: { roomCode } }) {
    return m("div#dashboard-controls", [
      // Prompt a player to enter their name when starting an online game, or
      // when joining an existing game for the first time; the 'action'
      // attribute on the <form> element is necessary to show the Go button on
      // iOS keyboards
      this.session.status === "newPlayer"
        ? m(
            "form[action]",
            {
              onsubmit: (submitEvent) =>
                this.submitNewPlayer(submitEvent, roomCode),
            },
            [
              m("input[type=text][autocomplete=off]#new-player-name", {
                name: "new-player-name",
                autofocus: true,
                required: true,
                oninput: (inputEvent) => this.setNewPlayerName(inputEvent),
              }),
              m("button[type=submit]", roomCode ? "Join Game" : "Start Game"),
            ]
          )
        : this.session.status === "waitingForPlayers"
        ? [
            m("div#share-controls", [
              m("input[type=text][readonly]#share-link", {
                value: window.location.href,
                onclick: ({ target }) => target.select(),
              }),
              m(
                "button#copy-share-link",
                {
                  "data-clipboard-text": window.location.href,
                  oncreate: ({ dom }) => this.configureCopyControl({ dom }),
                },
                "Copy"
              ),
            ]),
            // If P1 is still waiting for players, offer P1 the option to close
            // room
            m("button.warn", { onclick: () => this.closeRoom() }, "Close Room"),
          ]
        : // If game is in progress, allow user to end game at any time
        this.game.inProgress &&
          this.session.status !== "watchingGame" &&
          !this.session.disconnected
        ? m(
            "button.warn",
            {
              onclick: () => this.endGame(roomCode),
            },
            "End Game"
          )
        : // If online game is not in progress, allow user to leave room
        !this.game.inProgress &&
          this.session.status !== "watchingGame" &&
          !this.session.disconnected &&
          this.session.disconnectedPlayer
        ? m(
            "button.warn",
            {
              onclick: () => this.leaveRoom(),
            },
            "Leave Room"
          )
        : // If room does not exist, allow user to return to app home
        this.session.status === "roomNotFound"
        ? m(
            "button",
            {
              onclick: () => this.returnToHome(),
            },
            "Return to Home"
          )
        : // If an online game is not in progress (i.e. it was ended early, or there
        // is a winner/tie), allow the user to play again
        this.session.socket &&
          this.game.players.length === 2 &&
          this.session.status !== "connecting" &&
          this.session.status !== "watchingGame" &&
          !this.session.disconnectedPlayer &&
          !this.session.reconnectedPlayer &&
          !this.session.disconnected
        ? [
            // Play Again / Yes
            m(
              "button",
              {
                onclick: () => this.requestNewOnlineGame(),
                disabled: this.session.status === "requestingNewGame",
              },
              this.session.status === "newGameRequested"
                ? "Yes!"
                : this.session.status === "requestingNewGame"
                ? "Pending"
                : "Play Again"
            ),

            // No Thanks
            this.session.status !== "requestingNewGame"
              ? m(
                  "button.warn",
                  {
                    onclick: () => this.declineNewGame(),
                    disabled: this.session.status === "requestingNewGame",
                  },
                  this.session.status === "newGameRequested"
                    ? "Nah"
                    : this.session.status !== "requestingNewGame"
                    ? "No Thanks"
                    : null
                )
              : null,
          ]
        : !this.session.socket
        ? [
            // If number of players has been chosen, ask user to choose starting player
            this.game.type !== null
              ? this.game.players.map((player) => {
                  return m(
                    "button",
                    {
                      onclick: () => this.startGame(player),
                    },
                    player.name
                  );
                })
              : // Select a number of human players
                [
                  m(
                    "button",
                    {
                      onclick: () => this.setPlayers({ gameType: "1P" }),
                    },
                    "Local"
                  ),
                  m(
                    "button",
                    {
                      onclick: () => this.promptToStartOnlineGame(),
                    },
                    "Create"
                  ),
                  m(
                    "button",
                    {
                      onclick: () => this.promptToStartOnlineGame(),
                    },
                    "Join"
                  ),
                ],
          ]
        : null,
    ]);
  }
}

export default DashboardControlsComponent;
