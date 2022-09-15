import m from "mithril";
import classNames from "../classnames.js";
import DashboardControlsComponent from "./dashboard-controls.js";

// The area of the game UI consisting of game UI controls and status messages
class DashboardComponent {
  view({ attrs: { game, session, roomCode } }) {
    return m(
      "div#game-dashboard",
      {
        class: classNames({
          "prompting-for-input": session.status === "newPlayer",
        }),
      },
      [
        m(
          "p#game-message",

          session.status === "connecting"
            ? "Connecting to server..."
            : session.status === "roomNotFound"
            ? [
                "This room does not exist",
                m("br"),
                "or has been closed by the host.",
              ]
            : session.status === "closingRoom" ||
              session.status === "closedRoom"
            ? "Closing room..."
            : session.status === "leavingRoom" ||
              session.status === "decliningNewGame" ||
              session.status === "declinedNewGame"
            ? "Leaving room..."
            : session.disconnected
            ? "Lost connection. Trying to reconnect..."
            : // If the other player disconnects
            session.disconnectedPlayer &&
              session.disconnectedPlayer.lastDisconnectReason ===
                "newGameDeclined"
            ? `${session.disconnectedPlayer.name} has declined to play again.`
            : session.disconnectedPlayer
            ? `${session.disconnectedPlayer.name} has disconnected.`
            : // If the other player reconnects
            session.reconnectedPlayer
            ? `${session.reconnectedPlayer.name} has reconnected.`
            : // If the current player needs to enter a name
            session.status === "newPlayer"
            ? m("label[for=new-player-name]", "Enter your player name:")
            : // If the local player has requested a new game
            session.status === "requestingNewGame"
            ? `Asking ${
                game.getOtherPlayer(game.requestingPlayer).name
              } to play again...`
            : // Inform the other player if a player requests a new game
            session.status === "newGameRequested"
            ? `${game.requestingPlayer.name} asks to play again.`
            : // If user has not started any game yet
            game.players.length === 0
            ? "Connect4 with a Twist"
            : // If a game is in progress
            game.currentPlayer
            ? `${game.currentPlayer.name}, your turn!`
            : // If a player wins the game
            game.winner
            ? `${game.winner.name} wins! Play again?`
            : // If the grid is completely full
            game.grid.checkIfFull()
            ? "We'll call it a draw! Play again?"
            : // If the user just chose a number of players for the game to be started
            !session.socket && game.type !== null
            ? "Which player should start first?"
            : // If either player ends the game early
            roomCode && game.requestingPlayer
            ? `${game.requestingPlayer.name} has ended the game.`
            : session.status === "waitingForPlayers"
            ? "Waiting for other player..."
            : // Otherwise, if game was ended manually by the user
              "Game ended. Play again?"
        ),

        m(DashboardControlsComponent, { game, session, roomCode }),
      ]
    );
  }
}

export default DashboardComponent;
