import type { Alpine } from "alpinejs";

const navStore = {
  open: false,
  toggle() {
    this.open = !this.open;
  },
};

const tocStore = {
  open: false,
  toggle() {
    this.open = !this.open;
  },
};

export default (alpine: Alpine) => {
  alpine.store("nav", navStore);
  alpine.store("toc", tocStore);
};
