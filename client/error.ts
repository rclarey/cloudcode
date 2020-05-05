import modal from "./modal";

export function fatalError(socket: WebSocket): void {
  socket.onclose = null;
  if (
    socket.readyState !== socket.CLOSED &&
    socket.readyState !== socket.CLOSING
  ) {
    socket.close();
  }

  for (const elem of document.body.children) {
    document.body.removeChild(elem);
  }

  modal({
    title: "Error!",
    body: [
      "Something unexpected went wrong!",
      "You can try refreshing the page to fix it."
    ]
  });
}

export async function networkError(p: Promise<void>): Promise<void> {
  const m = modal({
    title: "Lost connection!",
    body: ["Attempting to reconnect..."]
  });
  await p;
  document.body.removeChild(m);
}
