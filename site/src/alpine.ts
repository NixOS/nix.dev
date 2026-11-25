import type { Alpine } from "alpinejs";

const tocStore = {
  open: false,
  toggle() {
    this.open = !this.open;
  },
};

export default (alpine: Alpine) => {
  alpine.store("toc", tocStore);
};
