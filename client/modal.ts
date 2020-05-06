interface ModalOptions {
  title: string;
  body: string[];
  confirm?: string;
  onConfirm?: () => Promise<unknown>;
}

export default function modal(opts: ModalOptions): HTMLDivElement {
  const bg = document.createElement("div");
  bg.className = "modal__bg";
  bg.onclick = e => e.stopPropagation();

  const root = document.createElement("div");
  root.className = "modal__root";
  bg.appendChild(root);

  const head = document.createElement("h1");
  head.className = "modal__head";
  head.innerHTML = opts.title;
  root.appendChild(head);

  for (const text of opts.body) {
    const p = document.createElement("p");
    p.className = "modal__p";
    p.innerHTML = text;
    root.appendChild(p);
  }

  if (opts.confirm) {
    const button = document.createElement("button");
    button.className = "modal__confirm";
    button.innerHTML = opts.confirm;
    button.onclick = async () => {
      await opts.onConfirm!();
      document.body.removeChild(root);
      document.body.removeChild(bg);
    };
    root.appendChild(button);
  }

  document.body.appendChild(bg);

  return bg;
}
