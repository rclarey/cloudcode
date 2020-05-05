import editor from "./editor";
import modal from "./modal";
import { genId } from "./util";

function docId(): string | null {
  const re = /\?doc=(?<id>[^&]*)/;
  return re.exec(location.search)?.groups?.id ?? null;
}

function render(): void {
  const id = docId();
  if (!id) {
    modal({
      title: "Welcome!",
      body: [
        'Cloudcode was mostly built as a functional example for my <a href="https://github.com/rclarey/simple-ot">operational transform library</a>, however it <i>is</i> useful for quickly creating a shareable document that can be collaboratively edited, for a video call with your team for example.',
        "<b>WARNING:</b> documents are only stored in memory on the server, so there is no guarantee that they will be persisted once all clients disconnect. Do not rely on Cloudcode to persist your documents."
      ],
      confirm: "Create a new document",
      onConfirm: async () => {
        const newId = genId();
        location.search = `doc=${newId}`;
        editor(newId);
      }
    });
  } else {
    editor(id);
  }
}

render();
