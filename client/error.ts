import modal from "./modal.ts";

export function fatalError(socket: WebSocket): void {
  socket.onclose = null;
  if (
    socket.readyState !== socket.CLOSED &&
    socket.readyState !== socket.CLOSING
  ) {
    socket.close();
  }

  const everything: HTMLElement[] = document.body.children as any;
  for (const elem of everything) {
    document.body.removeChild(elem);
  }

  modal({
    title: "Error!",
    body: [
      "Something unexpected went wrong!",
      "You can try refreshing the page to fix it.",
    ],
  });
}

export async function networkError(p: Promise<void>): Promise<void> {
  const m = modal({
    title: "Lost connection!",
    body: ["Attempting to reconnect..."],
  });
  await p;
  document.body.removeChild(m);
}
