// Global definitions for webpack module federation

declare global {
  interface Window {
    // Module federation exposes containers on the window object
    [key: string]: any;

    // Webpack shared scopes for module federation
    __webpack_share_scopes__: {
      default: any;
    };

    // Webpack init sharing function used in module federation
    __webpack_init_sharing__: (scope: string) => Promise<void>;
  }
}

// Used to make the file a module
export {};
