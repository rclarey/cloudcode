const { FuseBox } = require("fuse-box");
const fuse = FuseBox.init({
  homeDir: ".",
  output: "../dist/$name.js"
});
fuse.bundle("main").instructions(`> main.ts`);

fuse.run();
