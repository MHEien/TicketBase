var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value,
      })
    : (obj[key] = value);
var __require = /* @__PURE__ */ ((x3) =>
  typeof require !== "undefined"
    ? require
    : typeof Proxy !== "undefined"
      ? new Proxy(x3, {
          get: (a3, b2) => (typeof require !== "undefined" ? require : a3)[b2],
        })
      : x3)(function (x3) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x3 + '" is not supported');
});
var __commonJS = (cb, mod) =>
  function __require2() {
    return (
      mod ||
        (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod),
      mod.exports
    );
  };
var __export2 = (target, all3) => {
  for (var name in all3)
    __defProp(target, name, { get: all3[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === "object") || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (
  (target = mod != null ? __create(__getProtoOf(mod)) : {}),
  __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule
      ? __defProp(target, "default", { value: mod, enumerable: true })
      : target,
    mod,
  )
);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj)) throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};

// ../../../../node_modules/next/dist/shared/lib/i18n/detect-domain-locale.js
var require_detect_domain_locale = __commonJS({
  "../../../../node_modules/next/dist/shared/lib/i18n/detect-domain-locale.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "detectDomainLocale", {
      enumerable: true,
      get: function () {
        return detectDomainLocale;
      },
    });
    function detectDomainLocale(domainItems, hostname, detectedLocale) {
      if (!domainItems) return;
      if (detectedLocale) {
        detectedLocale = detectedLocale.toLowerCase();
      }
      for (const item of domainItems) {
        var _item_domain, _item_locales;
        const domainHostname =
          (_item_domain = item.domain) == null
            ? void 0
            : _item_domain.split(":", 1)[0].toLowerCase();
        if (
          hostname === domainHostname ||
          detectedLocale === item.defaultLocale.toLowerCase() ||
          ((_item_locales = item.locales) == null
            ? void 0
            : _item_locales.some(
                (locale) => locale.toLowerCase() === detectedLocale,
              ))
        ) {
          return item;
        }
      }
    }
  },
});

// ../../../../node_modules/next/dist/shared/lib/router/utils/remove-trailing-slash.js
var require_remove_trailing_slash = __commonJS({
  "../../../../node_modules/next/dist/shared/lib/router/utils/remove-trailing-slash.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "removeTrailingSlash", {
      enumerable: true,
      get: function () {
        return removeTrailingSlash;
      },
    });
    function removeTrailingSlash(route) {
      return route.replace(/\/$/, "") || "/";
    }
  },
});

// ../../../../node_modules/next/dist/shared/lib/router/utils/parse-path.js
var require_parse_path = __commonJS({
  "../../../../node_modules/next/dist/shared/lib/router/utils/parse-path.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "parsePath", {
      enumerable: true,
      get: function () {
        return parsePath;
      },
    });
    function parsePath(path) {
      const hashIndex = path.indexOf("#");
      const queryIndex = path.indexOf("?");
      const hasQuery =
        queryIndex > -1 && (hashIndex < 0 || queryIndex < hashIndex);
      if (hasQuery || hashIndex > -1) {
        return {
          pathname: path.substring(0, hasQuery ? queryIndex : hashIndex),
          query: hasQuery
            ? path.substring(queryIndex, hashIndex > -1 ? hashIndex : void 0)
            : "",
          hash: hashIndex > -1 ? path.slice(hashIndex) : "",
        };
      }
      return {
        pathname: path,
        query: "",
        hash: "",
      };
    }
  },
});

// ../../../../node_modules/next/dist/shared/lib/router/utils/add-path-prefix.js
var require_add_path_prefix = __commonJS({
  "../../../../node_modules/next/dist/shared/lib/router/utils/add-path-prefix.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "addPathPrefix", {
      enumerable: true,
      get: function () {
        return addPathPrefix;
      },
    });
    var _parsepath = require_parse_path();
    function addPathPrefix(path, prefix) {
      if (!path.startsWith("/") || !prefix) {
        return path;
      }
      const { pathname, query, hash } = (0, _parsepath.parsePath)(path);
      return "" + prefix + pathname + query + hash;
    }
  },
});

// ../../../../node_modules/next/dist/shared/lib/router/utils/add-path-suffix.js
var require_add_path_suffix = __commonJS({
  "../../../../node_modules/next/dist/shared/lib/router/utils/add-path-suffix.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "addPathSuffix", {
      enumerable: true,
      get: function () {
        return addPathSuffix;
      },
    });
    var _parsepath = require_parse_path();
    function addPathSuffix(path, suffix) {
      if (!path.startsWith("/") || !suffix) {
        return path;
      }
      const { pathname, query, hash } = (0, _parsepath.parsePath)(path);
      return "" + pathname + suffix + query + hash;
    }
  },
});

// ../../../../node_modules/next/dist/shared/lib/router/utils/path-has-prefix.js
var require_path_has_prefix = __commonJS({
  "../../../../node_modules/next/dist/shared/lib/router/utils/path-has-prefix.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "pathHasPrefix", {
      enumerable: true,
      get: function () {
        return pathHasPrefix;
      },
    });
    var _parsepath = require_parse_path();
    function pathHasPrefix(path, prefix) {
      if (typeof path !== "string") {
        return false;
      }
      const { pathname } = (0, _parsepath.parsePath)(path);
      return pathname === prefix || pathname.startsWith(prefix + "/");
    }
  },
});

// ../../../../node_modules/next/dist/shared/lib/router/utils/add-locale.js
var require_add_locale = __commonJS({
  "../../../../node_modules/next/dist/shared/lib/router/utils/add-locale.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "addLocale", {
      enumerable: true,
      get: function () {
        return addLocale;
      },
    });
    var _addpathprefix = require_add_path_prefix();
    var _pathhasprefix = require_path_has_prefix();
    function addLocale(path, locale, defaultLocale, ignorePrefix) {
      if (!locale || locale === defaultLocale) return path;
      const lower = path.toLowerCase();
      if (!ignorePrefix) {
        if ((0, _pathhasprefix.pathHasPrefix)(lower, "/api")) return path;
        if (
          (0, _pathhasprefix.pathHasPrefix)(lower, "/" + locale.toLowerCase())
        )
          return path;
      }
      return (0, _addpathprefix.addPathPrefix)(path, "/" + locale);
    }
  },
});

// ../../../../node_modules/next/dist/shared/lib/router/utils/format-next-pathname-info.js
var require_format_next_pathname_info = __commonJS({
  "../../../../node_modules/next/dist/shared/lib/router/utils/format-next-pathname-info.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "formatNextPathnameInfo", {
      enumerable: true,
      get: function () {
        return formatNextPathnameInfo;
      },
    });
    var _removetrailingslash = require_remove_trailing_slash();
    var _addpathprefix = require_add_path_prefix();
    var _addpathsuffix = require_add_path_suffix();
    var _addlocale = require_add_locale();
    function formatNextPathnameInfo(info) {
      let pathname = (0, _addlocale.addLocale)(
        info.pathname,
        info.locale,
        info.buildId ? void 0 : info.defaultLocale,
        info.ignorePrefix,
      );
      if (info.buildId || !info.trailingSlash) {
        pathname = (0, _removetrailingslash.removeTrailingSlash)(pathname);
      }
      if (info.buildId) {
        pathname = (0, _addpathsuffix.addPathSuffix)(
          (0, _addpathprefix.addPathPrefix)(
            pathname,
            "/_next/data/" + info.buildId,
          ),
          info.pathname === "/" ? "index.json" : ".json",
        );
      }
      pathname = (0, _addpathprefix.addPathPrefix)(pathname, info.basePath);
      return !info.buildId && info.trailingSlash
        ? !pathname.endsWith("/")
          ? (0, _addpathsuffix.addPathSuffix)(pathname, "/")
          : pathname
        : (0, _removetrailingslash.removeTrailingSlash)(pathname);
    }
  },
});

// ../../../../node_modules/next/dist/shared/lib/get-hostname.js
var require_get_hostname = __commonJS({
  "../../../../node_modules/next/dist/shared/lib/get-hostname.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "getHostname", {
      enumerable: true,
      get: function () {
        return getHostname;
      },
    });
    function getHostname(parsed, headers2) {
      let hostname;
      if (
        (headers2 == null ? void 0 : headers2.host) &&
        !Array.isArray(headers2.host)
      ) {
        hostname = headers2.host.toString().split(":", 1)[0];
      } else if (parsed.hostname) {
        hostname = parsed.hostname;
      } else return;
      return hostname.toLowerCase();
    }
  },
});

// ../../../../node_modules/next/dist/shared/lib/i18n/normalize-locale-path.js
var require_normalize_locale_path = __commonJS({
  "../../../../node_modules/next/dist/shared/lib/i18n/normalize-locale-path.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "normalizeLocalePath", {
      enumerable: true,
      get: function () {
        return normalizeLocalePath;
      },
    });
    var cache2 = /* @__PURE__ */ new WeakMap();
    function normalizeLocalePath(pathname, locales) {
      if (!locales)
        return {
          pathname,
        };
      let lowercasedLocales = cache2.get(locales);
      if (!lowercasedLocales) {
        lowercasedLocales = locales.map((locale) => locale.toLowerCase());
        cache2.set(locales, lowercasedLocales);
      }
      let detectedLocale;
      const segments = pathname.split("/", 2);
      if (!segments[1])
        return {
          pathname,
        };
      const segment = segments[1].toLowerCase();
      const index = lowercasedLocales.indexOf(segment);
      if (index < 0)
        return {
          pathname,
        };
      detectedLocale = locales[index];
      pathname = pathname.slice(detectedLocale.length + 1) || "/";
      return {
        pathname,
        detectedLocale,
      };
    }
  },
});

// ../../../../node_modules/next/dist/shared/lib/router/utils/remove-path-prefix.js
var require_remove_path_prefix = __commonJS({
  "../../../../node_modules/next/dist/shared/lib/router/utils/remove-path-prefix.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "removePathPrefix", {
      enumerable: true,
      get: function () {
        return removePathPrefix;
      },
    });
    var _pathhasprefix = require_path_has_prefix();
    function removePathPrefix(path, prefix) {
      if (!(0, _pathhasprefix.pathHasPrefix)(path, prefix)) {
        return path;
      }
      const withoutPrefix = path.slice(prefix.length);
      if (withoutPrefix.startsWith("/")) {
        return withoutPrefix;
      }
      return "/" + withoutPrefix;
    }
  },
});

// ../../../../node_modules/next/dist/shared/lib/router/utils/get-next-pathname-info.js
var require_get_next_pathname_info = __commonJS({
  "../../../../node_modules/next/dist/shared/lib/router/utils/get-next-pathname-info.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "getNextPathnameInfo", {
      enumerable: true,
      get: function () {
        return getNextPathnameInfo;
      },
    });
    var _normalizelocalepath = require_normalize_locale_path();
    var _removepathprefix = require_remove_path_prefix();
    var _pathhasprefix = require_path_has_prefix();
    function getNextPathnameInfo(pathname, options) {
      var _options_nextConfig;
      const { basePath, i18n, trailingSlash } =
        (_options_nextConfig = options.nextConfig) != null
          ? _options_nextConfig
          : {};
      const info = {
        pathname,
        trailingSlash:
          pathname !== "/" ? pathname.endsWith("/") : trailingSlash,
      };
      if (
        basePath &&
        (0, _pathhasprefix.pathHasPrefix)(info.pathname, basePath)
      ) {
        info.pathname = (0, _removepathprefix.removePathPrefix)(
          info.pathname,
          basePath,
        );
        info.basePath = basePath;
      }
      let pathnameNoDataPrefix = info.pathname;
      if (
        info.pathname.startsWith("/_next/data/") &&
        info.pathname.endsWith(".json")
      ) {
        const paths = info.pathname
          .replace(/^\/_next\/data\//, "")
          .replace(/\.json$/, "")
          .split("/");
        const buildId = paths[0];
        info.buildId = buildId;
        pathnameNoDataPrefix =
          paths[1] !== "index" ? "/" + paths.slice(1).join("/") : "/";
        if (options.parseData === true) {
          info.pathname = pathnameNoDataPrefix;
        }
      }
      if (i18n) {
        let result = options.i18nProvider
          ? options.i18nProvider.analyze(info.pathname)
          : (0, _normalizelocalepath.normalizeLocalePath)(
              info.pathname,
              i18n.locales,
            );
        info.locale = result.detectedLocale;
        var _result_pathname;
        info.pathname =
          (_result_pathname = result.pathname) != null
            ? _result_pathname
            : info.pathname;
        if (!result.detectedLocale && info.buildId) {
          result = options.i18nProvider
            ? options.i18nProvider.analyze(pathnameNoDataPrefix)
            : (0, _normalizelocalepath.normalizeLocalePath)(
                pathnameNoDataPrefix,
                i18n.locales,
              );
          if (result.detectedLocale) {
            info.locale = result.detectedLocale;
          }
        }
      }
      return info;
    }
  },
});

// ../../../../node_modules/next/dist/server/web/next-url.js
var require_next_url = __commonJS({
  "../../../../node_modules/next/dist/server/web/next-url.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "NextURL", {
      enumerable: true,
      get: function () {
        return NextURL;
      },
    });
    var _detectdomainlocale = require_detect_domain_locale();
    var _formatnextpathnameinfo = require_format_next_pathname_info();
    var _gethostname = require_get_hostname();
    var _getnextpathnameinfo = require_get_next_pathname_info();
    var REGEX_LOCALHOST_HOSTNAME =
      /(?!^https?:\/\/)(127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)/;
    function parseURL(url, base) {
      return new URL(
        String(url).replace(REGEX_LOCALHOST_HOSTNAME, "localhost"),
        base && String(base).replace(REGEX_LOCALHOST_HOSTNAME, "localhost"),
      );
    }
    var Internal = Symbol("NextURLInternal");
    var NextURL = class {
      constructor(input, baseOrOpts, opts) {
        let base;
        let options;
        if (
          (typeof baseOrOpts === "object" && "pathname" in baseOrOpts) ||
          typeof baseOrOpts === "string"
        ) {
          base = baseOrOpts;
          options = opts || {};
        } else {
          options = opts || baseOrOpts || {};
        }
        this[Internal] = {
          url: parseURL(input, base ?? options.base),
          options,
          basePath: "",
        };
        this.analyze();
      }
      analyze() {
        var _this_Internal_options_nextConfig_i18n,
          _this_Internal_options_nextConfig,
          _this_Internal_domainLocale,
          _this_Internal_options_nextConfig_i18n1,
          _this_Internal_options_nextConfig1;
        const info = (0, _getnextpathnameinfo.getNextPathnameInfo)(
          this[Internal].url.pathname,
          {
            nextConfig: this[Internal].options.nextConfig,
            parseData: !process.env.__NEXT_NO_MIDDLEWARE_URL_NORMALIZE,
            i18nProvider: this[Internal].options.i18nProvider,
          },
        );
        const hostname = (0, _gethostname.getHostname)(
          this[Internal].url,
          this[Internal].options.headers,
        );
        this[Internal].domainLocale = this[Internal].options.i18nProvider
          ? this[Internal].options.i18nProvider.detectDomainLocale(hostname)
          : (0, _detectdomainlocale.detectDomainLocale)(
              (_this_Internal_options_nextConfig =
                this[Internal].options.nextConfig) == null
                ? void 0
                : (_this_Internal_options_nextConfig_i18n =
                      _this_Internal_options_nextConfig.i18n) == null
                  ? void 0
                  : _this_Internal_options_nextConfig_i18n.domains,
              hostname,
            );
        const defaultLocale =
          ((_this_Internal_domainLocale = this[Internal].domainLocale) == null
            ? void 0
            : _this_Internal_domainLocale.defaultLocale) ||
          ((_this_Internal_options_nextConfig1 =
            this[Internal].options.nextConfig) == null
            ? void 0
            : (_this_Internal_options_nextConfig_i18n1 =
                  _this_Internal_options_nextConfig1.i18n) == null
              ? void 0
              : _this_Internal_options_nextConfig_i18n1.defaultLocale);
        this[Internal].url.pathname = info.pathname;
        this[Internal].defaultLocale = defaultLocale;
        this[Internal].basePath = info.basePath ?? "";
        this[Internal].buildId = info.buildId;
        this[Internal].locale = info.locale ?? defaultLocale;
        this[Internal].trailingSlash = info.trailingSlash;
      }
      formatPathname() {
        return (0, _formatnextpathnameinfo.formatNextPathnameInfo)({
          basePath: this[Internal].basePath,
          buildId: this[Internal].buildId,
          defaultLocale: !this[Internal].options.forceLocale
            ? this[Internal].defaultLocale
            : void 0,
          locale: this[Internal].locale,
          pathname: this[Internal].url.pathname,
          trailingSlash: this[Internal].trailingSlash,
        });
      }
      formatSearch() {
        return this[Internal].url.search;
      }
      get buildId() {
        return this[Internal].buildId;
      }
      set buildId(buildId) {
        this[Internal].buildId = buildId;
      }
      get locale() {
        return this[Internal].locale ?? "";
      }
      set locale(locale) {
        var _this_Internal_options_nextConfig_i18n,
          _this_Internal_options_nextConfig;
        if (
          !this[Internal].locale ||
          !((_this_Internal_options_nextConfig =
            this[Internal].options.nextConfig) == null
            ? void 0
            : (_this_Internal_options_nextConfig_i18n =
                  _this_Internal_options_nextConfig.i18n) == null
              ? void 0
              : _this_Internal_options_nextConfig_i18n.locales.includes(locale))
        ) {
          throw Object.defineProperty(
            new TypeError(
              `The NextURL configuration includes no locale "${locale}"`,
            ),
            "__NEXT_ERROR_CODE",
            {
              value: "E597",
              enumerable: false,
              configurable: true,
            },
          );
        }
        this[Internal].locale = locale;
      }
      get defaultLocale() {
        return this[Internal].defaultLocale;
      }
      get domainLocale() {
        return this[Internal].domainLocale;
      }
      get searchParams() {
        return this[Internal].url.searchParams;
      }
      get host() {
        return this[Internal].url.host;
      }
      set host(value) {
        this[Internal].url.host = value;
      }
      get hostname() {
        return this[Internal].url.hostname;
      }
      set hostname(value) {
        this[Internal].url.hostname = value;
      }
      get port() {
        return this[Internal].url.port;
      }
      set port(value) {
        this[Internal].url.port = value;
      }
      get protocol() {
        return this[Internal].url.protocol;
      }
      set protocol(value) {
        this[Internal].url.protocol = value;
      }
      get href() {
        const pathname = this.formatPathname();
        const search = this.formatSearch();
        return `${this.protocol}//${this.host}${pathname}${search}${this.hash}`;
      }
      set href(url) {
        this[Internal].url = parseURL(url);
        this.analyze();
      }
      get origin() {
        return this[Internal].url.origin;
      }
      get pathname() {
        return this[Internal].url.pathname;
      }
      set pathname(value) {
        this[Internal].url.pathname = value;
      }
      get hash() {
        return this[Internal].url.hash;
      }
      set hash(value) {
        this[Internal].url.hash = value;
      }
      get search() {
        return this[Internal].url.search;
      }
      set search(value) {
        this[Internal].url.search = value;
      }
      get password() {
        return this[Internal].url.password;
      }
      set password(value) {
        this[Internal].url.password = value;
      }
      get username() {
        return this[Internal].url.username;
      }
      set username(value) {
        this[Internal].url.username = value;
      }
      get basePath() {
        return this[Internal].basePath;
      }
      set basePath(value) {
        this[Internal].basePath = value.startsWith("/") ? value : `/${value}`;
      }
      toString() {
        return this.href;
      }
      toJSON() {
        return this.href;
      }
      [Symbol.for("edge-runtime.inspect.custom")]() {
        return {
          href: this.href,
          origin: this.origin,
          protocol: this.protocol,
          username: this.username,
          password: this.password,
          host: this.host,
          hostname: this.hostname,
          port: this.port,
          pathname: this.pathname,
          search: this.search,
          searchParams: this.searchParams,
          hash: this.hash,
        };
      }
      clone() {
        return new NextURL(String(this), this[Internal].options);
      }
    };
  },
});

// ../../../../node_modules/next/dist/lib/constants.js
var require_constants = __commonJS({
  "../../../../node_modules/next/dist/lib/constants.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    function _export(target, all3) {
      for (var name in all3)
        Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name],
        });
    }
    _export(exports, {
      ACTION_SUFFIX: function () {
        return ACTION_SUFFIX;
      },
      APP_DIR_ALIAS: function () {
        return APP_DIR_ALIAS;
      },
      CACHE_ONE_YEAR: function () {
        return CACHE_ONE_YEAR;
      },
      DOT_NEXT_ALIAS: function () {
        return DOT_NEXT_ALIAS;
      },
      ESLINT_DEFAULT_DIRS: function () {
        return ESLINT_DEFAULT_DIRS;
      },
      GSP_NO_RETURNED_VALUE: function () {
        return GSP_NO_RETURNED_VALUE;
      },
      GSSP_COMPONENT_MEMBER_ERROR: function () {
        return GSSP_COMPONENT_MEMBER_ERROR;
      },
      GSSP_NO_RETURNED_VALUE: function () {
        return GSSP_NO_RETURNED_VALUE;
      },
      INFINITE_CACHE: function () {
        return INFINITE_CACHE;
      },
      INSTRUMENTATION_HOOK_FILENAME: function () {
        return INSTRUMENTATION_HOOK_FILENAME;
      },
      MATCHED_PATH_HEADER: function () {
        return MATCHED_PATH_HEADER;
      },
      MIDDLEWARE_FILENAME: function () {
        return MIDDLEWARE_FILENAME;
      },
      MIDDLEWARE_LOCATION_REGEXP: function () {
        return MIDDLEWARE_LOCATION_REGEXP;
      },
      NEXT_BODY_SUFFIX: function () {
        return NEXT_BODY_SUFFIX;
      },
      NEXT_CACHE_IMPLICIT_TAG_ID: function () {
        return NEXT_CACHE_IMPLICIT_TAG_ID;
      },
      NEXT_CACHE_REVALIDATED_TAGS_HEADER: function () {
        return NEXT_CACHE_REVALIDATED_TAGS_HEADER;
      },
      NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER: function () {
        return NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER;
      },
      NEXT_CACHE_SOFT_TAG_MAX_LENGTH: function () {
        return NEXT_CACHE_SOFT_TAG_MAX_LENGTH;
      },
      NEXT_CACHE_TAGS_HEADER: function () {
        return NEXT_CACHE_TAGS_HEADER;
      },
      NEXT_CACHE_TAG_MAX_ITEMS: function () {
        return NEXT_CACHE_TAG_MAX_ITEMS;
      },
      NEXT_CACHE_TAG_MAX_LENGTH: function () {
        return NEXT_CACHE_TAG_MAX_LENGTH;
      },
      NEXT_DATA_SUFFIX: function () {
        return NEXT_DATA_SUFFIX;
      },
      NEXT_INTERCEPTION_MARKER_PREFIX: function () {
        return NEXT_INTERCEPTION_MARKER_PREFIX;
      },
      NEXT_META_SUFFIX: function () {
        return NEXT_META_SUFFIX;
      },
      NEXT_QUERY_PARAM_PREFIX: function () {
        return NEXT_QUERY_PARAM_PREFIX;
      },
      NEXT_RESUME_HEADER: function () {
        return NEXT_RESUME_HEADER;
      },
      NON_STANDARD_NODE_ENV: function () {
        return NON_STANDARD_NODE_ENV;
      },
      PAGES_DIR_ALIAS: function () {
        return PAGES_DIR_ALIAS;
      },
      PRERENDER_REVALIDATE_HEADER: function () {
        return PRERENDER_REVALIDATE_HEADER;
      },
      PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER: function () {
        return PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER;
      },
      PUBLIC_DIR_MIDDLEWARE_CONFLICT: function () {
        return PUBLIC_DIR_MIDDLEWARE_CONFLICT;
      },
      ROOT_DIR_ALIAS: function () {
        return ROOT_DIR_ALIAS;
      },
      RSC_ACTION_CLIENT_WRAPPER_ALIAS: function () {
        return RSC_ACTION_CLIENT_WRAPPER_ALIAS;
      },
      RSC_ACTION_ENCRYPTION_ALIAS: function () {
        return RSC_ACTION_ENCRYPTION_ALIAS;
      },
      RSC_ACTION_PROXY_ALIAS: function () {
        return RSC_ACTION_PROXY_ALIAS;
      },
      RSC_ACTION_VALIDATE_ALIAS: function () {
        return RSC_ACTION_VALIDATE_ALIAS;
      },
      RSC_CACHE_WRAPPER_ALIAS: function () {
        return RSC_CACHE_WRAPPER_ALIAS;
      },
      RSC_MOD_REF_PROXY_ALIAS: function () {
        return RSC_MOD_REF_PROXY_ALIAS;
      },
      RSC_PREFETCH_SUFFIX: function () {
        return RSC_PREFETCH_SUFFIX;
      },
      RSC_SEGMENTS_DIR_SUFFIX: function () {
        return RSC_SEGMENTS_DIR_SUFFIX;
      },
      RSC_SEGMENT_SUFFIX: function () {
        return RSC_SEGMENT_SUFFIX;
      },
      RSC_SUFFIX: function () {
        return RSC_SUFFIX;
      },
      SERVER_PROPS_EXPORT_ERROR: function () {
        return SERVER_PROPS_EXPORT_ERROR;
      },
      SERVER_PROPS_GET_INIT_PROPS_CONFLICT: function () {
        return SERVER_PROPS_GET_INIT_PROPS_CONFLICT;
      },
      SERVER_PROPS_SSG_CONFLICT: function () {
        return SERVER_PROPS_SSG_CONFLICT;
      },
      SERVER_RUNTIME: function () {
        return SERVER_RUNTIME;
      },
      SSG_FALLBACK_EXPORT_ERROR: function () {
        return SSG_FALLBACK_EXPORT_ERROR;
      },
      SSG_GET_INITIAL_PROPS_CONFLICT: function () {
        return SSG_GET_INITIAL_PROPS_CONFLICT;
      },
      STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR: function () {
        return STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR;
      },
      UNSTABLE_REVALIDATE_RENAME_ERROR: function () {
        return UNSTABLE_REVALIDATE_RENAME_ERROR;
      },
      WEBPACK_LAYERS: function () {
        return WEBPACK_LAYERS;
      },
      WEBPACK_RESOURCE_QUERIES: function () {
        return WEBPACK_RESOURCE_QUERIES;
      },
    });
    var NEXT_QUERY_PARAM_PREFIX = "nxtP";
    var NEXT_INTERCEPTION_MARKER_PREFIX = "nxtI";
    var MATCHED_PATH_HEADER = "x-matched-path";
    var PRERENDER_REVALIDATE_HEADER = "x-prerender-revalidate";
    var PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER =
      "x-prerender-revalidate-if-generated";
    var RSC_PREFETCH_SUFFIX = ".prefetch.rsc";
    var RSC_SEGMENTS_DIR_SUFFIX = ".segments";
    var RSC_SEGMENT_SUFFIX = ".segment.rsc";
    var RSC_SUFFIX = ".rsc";
    var ACTION_SUFFIX = ".action";
    var NEXT_DATA_SUFFIX = ".json";
    var NEXT_META_SUFFIX = ".meta";
    var NEXT_BODY_SUFFIX = ".body";
    var NEXT_CACHE_TAGS_HEADER = "x-next-cache-tags";
    var NEXT_CACHE_REVALIDATED_TAGS_HEADER = "x-next-revalidated-tags";
    var NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER = "x-next-revalidate-tag-token";
    var NEXT_RESUME_HEADER = "next-resume";
    var NEXT_CACHE_TAG_MAX_ITEMS = 128;
    var NEXT_CACHE_TAG_MAX_LENGTH = 256;
    var NEXT_CACHE_SOFT_TAG_MAX_LENGTH = 1024;
    var NEXT_CACHE_IMPLICIT_TAG_ID = "_N_T_";
    var CACHE_ONE_YEAR = 31536e3;
    var INFINITE_CACHE = 4294967294;
    var MIDDLEWARE_FILENAME = "middleware";
    var MIDDLEWARE_LOCATION_REGEXP = `(?:)?${MIDDLEWARE_FILENAME}`;
    var INSTRUMENTATION_HOOK_FILENAME = "instrumentation";
    var PAGES_DIR_ALIAS = "private-next-pages";
    var DOT_NEXT_ALIAS = "private-dot-next";
    var ROOT_DIR_ALIAS = "private-next-root-dir";
    var APP_DIR_ALIAS = "private-next-app-dir";
    var RSC_MOD_REF_PROXY_ALIAS = "private-next-rsc-mod-ref-proxy";
    var RSC_ACTION_VALIDATE_ALIAS = "private-next-rsc-action-validate";
    var RSC_ACTION_PROXY_ALIAS = "private-next-rsc-server-reference";
    var RSC_CACHE_WRAPPER_ALIAS = "private-next-rsc-cache-wrapper";
    var RSC_ACTION_ENCRYPTION_ALIAS = "private-next-rsc-action-encryption";
    var RSC_ACTION_CLIENT_WRAPPER_ALIAS =
      "private-next-rsc-action-client-wrapper";
    var PUBLIC_DIR_MIDDLEWARE_CONFLICT = `You can not have a '_next' folder inside of your public folder. This conflicts with the internal '/_next' route. https://nextjs.org/docs/messages/public-next-folder-conflict`;
    var SSG_GET_INITIAL_PROPS_CONFLICT = `You can not use getInitialProps with getStaticProps. To use SSG, please remove your getInitialProps`;
    var SERVER_PROPS_GET_INIT_PROPS_CONFLICT = `You can not use getInitialProps with getServerSideProps. Please remove getInitialProps.`;
    var SERVER_PROPS_SSG_CONFLICT = `You can not use getStaticProps or getStaticPaths with getServerSideProps. To use SSG, please remove getServerSideProps`;
    var STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR = `can not have getInitialProps/getServerSideProps, https://nextjs.org/docs/messages/404-get-initial-props`;
    var SERVER_PROPS_EXPORT_ERROR = `pages with \`getServerSideProps\` can not be exported. See more info here: https://nextjs.org/docs/messages/gssp-export`;
    var GSP_NO_RETURNED_VALUE =
      "Your `getStaticProps` function did not return an object. Did you forget to add a `return`?";
    var GSSP_NO_RETURNED_VALUE =
      "Your `getServerSideProps` function did not return an object. Did you forget to add a `return`?";
    var UNSTABLE_REVALIDATE_RENAME_ERROR =
      "The `unstable_revalidate` property is available for general use.\nPlease use `revalidate` instead.";
    var GSSP_COMPONENT_MEMBER_ERROR = `can not be attached to a page's component and must be exported from the page. See more info here: https://nextjs.org/docs/messages/gssp-component-member`;
    var NON_STANDARD_NODE_ENV = `You are using a non-standard "NODE_ENV" value in your environment. This creates inconsistencies in the project and is strongly advised against. Read more: https://nextjs.org/docs/messages/non-standard-node-env`;
    var SSG_FALLBACK_EXPORT_ERROR = `Pages with \`fallback\` enabled in \`getStaticPaths\` can not be exported. See more info here: https://nextjs.org/docs/messages/ssg-fallback-true-export`;
    var ESLINT_DEFAULT_DIRS = ["app", "pages", "components", "lib", "src"];
    var SERVER_RUNTIME = {
      edge: "edge",
      experimentalEdge: "experimental-edge",
      nodejs: "nodejs",
    };
    var WEBPACK_LAYERS_NAMES = {
      /**
       * The layer for the shared code between the client and server bundles.
       */
      shared: "shared",
      /**
       * The layer for server-only runtime and picking up `react-server` export conditions.
       * Including app router RSC pages and app router custom routes and metadata routes.
       */
      reactServerComponents: "rsc",
      /**
       * Server Side Rendering layer for app (ssr).
       */
      serverSideRendering: "ssr",
      /**
       * The browser client bundle layer for actions.
       */
      actionBrowser: "action-browser",
      /**
       * The Node.js bundle layer for the API routes.
       */
      apiNode: "api-node",
      /**
       * The Edge Lite bundle layer for the API routes.
       */
      apiEdge: "api-edge",
      /**
       * The layer for the middleware code.
       */
      middleware: "middleware",
      /**
       * The layer for the instrumentation hooks.
       */
      instrument: "instrument",
      /**
       * The layer for assets on the edge.
       */
      edgeAsset: "edge-asset",
      /**
       * The browser client bundle layer for App directory.
       */
      appPagesBrowser: "app-pages-browser",
      /**
       * The browser client bundle layer for Pages directory.
       */
      pagesDirBrowser: "pages-dir-browser",
      /**
       * The Edge Lite bundle layer for Pages directory.
       */
      pagesDirEdge: "pages-dir-edge",
      /**
       * The Node.js bundle layer for Pages directory.
       */
      pagesDirNode: "pages-dir-node",
    };
    var WEBPACK_LAYERS = {
      ...WEBPACK_LAYERS_NAMES,
      GROUP: {
        builtinReact: [
          WEBPACK_LAYERS_NAMES.reactServerComponents,
          WEBPACK_LAYERS_NAMES.actionBrowser,
        ],
        serverOnly: [
          WEBPACK_LAYERS_NAMES.reactServerComponents,
          WEBPACK_LAYERS_NAMES.actionBrowser,
          WEBPACK_LAYERS_NAMES.instrument,
          WEBPACK_LAYERS_NAMES.middleware,
        ],
        neutralTarget: [
          // pages api
          WEBPACK_LAYERS_NAMES.apiNode,
          WEBPACK_LAYERS_NAMES.apiEdge,
        ],
        clientOnly: [
          WEBPACK_LAYERS_NAMES.serverSideRendering,
          WEBPACK_LAYERS_NAMES.appPagesBrowser,
        ],
        bundled: [
          WEBPACK_LAYERS_NAMES.reactServerComponents,
          WEBPACK_LAYERS_NAMES.actionBrowser,
          WEBPACK_LAYERS_NAMES.serverSideRendering,
          WEBPACK_LAYERS_NAMES.appPagesBrowser,
          WEBPACK_LAYERS_NAMES.shared,
          WEBPACK_LAYERS_NAMES.instrument,
          WEBPACK_LAYERS_NAMES.middleware,
        ],
        appPages: [
          // app router pages and layouts
          WEBPACK_LAYERS_NAMES.reactServerComponents,
          WEBPACK_LAYERS_NAMES.serverSideRendering,
          WEBPACK_LAYERS_NAMES.appPagesBrowser,
          WEBPACK_LAYERS_NAMES.actionBrowser,
        ],
      },
    };
    var WEBPACK_RESOURCE_QUERIES = {
      edgeSSREntry: "__next_edge_ssr_entry__",
      metadata: "__next_metadata__",
      metadataRoute: "__next_metadata_route__",
      metadataImageMeta: "__next_metadata_image_meta__",
    };
  },
});

// ../../../../node_modules/next/dist/server/web/utils.js
var require_utils = __commonJS({
  "../../../../node_modules/next/dist/server/web/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    function _export(target, all3) {
      for (var name in all3)
        Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name],
        });
    }
    _export(exports, {
      fromNodeOutgoingHttpHeaders: function () {
        return fromNodeOutgoingHttpHeaders;
      },
      normalizeNextQueryParam: function () {
        return normalizeNextQueryParam;
      },
      splitCookiesString: function () {
        return splitCookiesString;
      },
      toNodeOutgoingHttpHeaders: function () {
        return toNodeOutgoingHttpHeaders;
      },
      validateURL: function () {
        return validateURL;
      },
    });
    var _constants = require_constants();
    function fromNodeOutgoingHttpHeaders(nodeHeaders) {
      const headers2 = new Headers();
      for (let [key, value] of Object.entries(nodeHeaders)) {
        const values = Array.isArray(value) ? value : [value];
        for (let v2 of values) {
          if (typeof v2 === "undefined") continue;
          if (typeof v2 === "number") {
            v2 = v2.toString();
          }
          headers2.append(key, v2);
        }
      }
      return headers2;
    }
    function splitCookiesString(cookiesString) {
      var cookiesStrings = [];
      var pos = 0;
      var start;
      var ch;
      var lastComma;
      var nextStart;
      var cookiesSeparatorFound;
      function skipWhitespace() {
        while (
          pos < cookiesString.length &&
          /\s/.test(cookiesString.charAt(pos))
        ) {
          pos += 1;
        }
        return pos < cookiesString.length;
      }
      function notSpecialChar() {
        ch = cookiesString.charAt(pos);
        return ch !== "=" && ch !== ";" && ch !== ",";
      }
      while (pos < cookiesString.length) {
        start = pos;
        cookiesSeparatorFound = false;
        while (skipWhitespace()) {
          ch = cookiesString.charAt(pos);
          if (ch === ",") {
            lastComma = pos;
            pos += 1;
            skipWhitespace();
            nextStart = pos;
            while (pos < cookiesString.length && notSpecialChar()) {
              pos += 1;
            }
            if (
              pos < cookiesString.length &&
              cookiesString.charAt(pos) === "="
            ) {
              cookiesSeparatorFound = true;
              pos = nextStart;
              cookiesStrings.push(cookiesString.substring(start, lastComma));
              start = pos;
            } else {
              pos = lastComma + 1;
            }
          } else {
            pos += 1;
          }
        }
        if (!cookiesSeparatorFound || pos >= cookiesString.length) {
          cookiesStrings.push(
            cookiesString.substring(start, cookiesString.length),
          );
        }
      }
      return cookiesStrings;
    }
    function toNodeOutgoingHttpHeaders(headers2) {
      const nodeHeaders = {};
      const cookies2 = [];
      if (headers2) {
        for (const [key, value] of headers2.entries()) {
          if (key.toLowerCase() === "set-cookie") {
            cookies2.push(...splitCookiesString(value));
            nodeHeaders[key] = cookies2.length === 1 ? cookies2[0] : cookies2;
          } else {
            nodeHeaders[key] = value;
          }
        }
      }
      return nodeHeaders;
    }
    function validateURL(url) {
      try {
        return String(new URL(String(url)));
      } catch (error) {
        throw Object.defineProperty(
          new Error(
            `URL is malformed "${String(url)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`,
            {
              cause: error,
            },
          ),
          "__NEXT_ERROR_CODE",
          {
            value: "E61",
            enumerable: false,
            configurable: true,
          },
        );
      }
    }
    function normalizeNextQueryParam(key) {
      const prefixes = [
        _constants.NEXT_QUERY_PARAM_PREFIX,
        _constants.NEXT_INTERCEPTION_MARKER_PREFIX,
      ];
      for (const prefix of prefixes) {
        if (key !== prefix && key.startsWith(prefix)) {
          return key.substring(prefix.length);
        }
      }
      return null;
    }
  },
});

// ../../../../node_modules/next/dist/server/web/error.js
var require_error = __commonJS({
  "../../../../node_modules/next/dist/server/web/error.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    function _export(target, all3) {
      for (var name in all3)
        Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name],
        });
    }
    _export(exports, {
      PageSignatureError: function () {
        return PageSignatureError;
      },
      RemovedPageError: function () {
        return RemovedPageError;
      },
      RemovedUAError: function () {
        return RemovedUAError;
      },
    });
    var PageSignatureError = class extends Error {
      constructor({ page }) {
        super(`The middleware "${page}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `);
      }
    };
    var RemovedPageError = class extends Error {
      constructor() {
        super(`The request.page has been deprecated in favour of \`URLPattern\`.
  Read more: https://nextjs.org/docs/messages/middleware-request-page
  `);
      }
    };
    var RemovedUAError = class extends Error {
      constructor() {
        super(`The request.ua has been removed in favour of \`userAgent\` function.
  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
  `);
      }
    };
  },
});

// ../../../../node_modules/next/dist/compiled/@edge-runtime/cookies/index.js
var require_cookies = __commonJS({
  "../../../../node_modules/next/dist/compiled/@edge-runtime/cookies/index.js"(
    exports,
    module,
  ) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export3 = (target, all3) => {
      for (var name in all3)
        __defProp2(target, name, { get: all3[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if ((from && typeof from === "object") || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, {
              get: () => from[key],
              enumerable:
                !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable,
            });
      }
      return to;
    };
    var __toCommonJS = (mod) =>
      __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var src_exports = {};
    __export3(src_exports, {
      RequestCookies: () => RequestCookies,
      ResponseCookies: () => ResponseCookies,
      parseCookie: () => parseCookie4,
      parseSetCookie: () => parseSetCookie,
      stringifyCookie: () => stringifyCookie,
    });
    module.exports = __toCommonJS(src_exports);
    function stringifyCookie(c3) {
      var _a2;
      const attrs = [
        "path" in c3 && c3.path && `Path=${c3.path}`,
        "expires" in c3 &&
          (c3.expires || c3.expires === 0) &&
          `Expires=${(typeof c3.expires === "number" ? new Date(c3.expires) : c3.expires).toUTCString()}`,
        "maxAge" in c3 &&
          typeof c3.maxAge === "number" &&
          `Max-Age=${c3.maxAge}`,
        "domain" in c3 && c3.domain && `Domain=${c3.domain}`,
        "secure" in c3 && c3.secure && "Secure",
        "httpOnly" in c3 && c3.httpOnly && "HttpOnly",
        "sameSite" in c3 && c3.sameSite && `SameSite=${c3.sameSite}`,
        "partitioned" in c3 && c3.partitioned && "Partitioned",
        "priority" in c3 && c3.priority && `Priority=${c3.priority}`,
      ].filter(Boolean);
      const stringified = `${c3.name}=${encodeURIComponent((_a2 = c3.value) != null ? _a2 : "")}`;
      return attrs.length === 0
        ? stringified
        : `${stringified}; ${attrs.join("; ")}`;
    }
    function parseCookie4(cookie) {
      const map = /* @__PURE__ */ new Map();
      for (const pair of cookie.split(/; */)) {
        if (!pair) continue;
        const splitAt = pair.indexOf("=");
        if (splitAt === -1) {
          map.set(pair, "true");
          continue;
        }
        const [key, value] = [pair.slice(0, splitAt), pair.slice(splitAt + 1)];
        try {
          map.set(key, decodeURIComponent(value != null ? value : "true"));
        } catch {}
      }
      return map;
    }
    function parseSetCookie(setCookie) {
      if (!setCookie) {
        return void 0;
      }
      const [[name, value], ...attributes] = parseCookie4(setCookie);
      const {
        domain,
        expires,
        httponly,
        maxage,
        path,
        samesite,
        secure,
        partitioned,
        priority,
      } = Object.fromEntries(
        attributes.map(([key, value2]) => [
          key.toLowerCase().replace(/-/g, ""),
          value2,
        ]),
      );
      const cookie = {
        name,
        value: decodeURIComponent(value),
        domain,
        ...(expires && { expires: new Date(expires) }),
        ...(httponly && { httpOnly: true }),
        ...(typeof maxage === "string" && { maxAge: Number(maxage) }),
        path,
        ...(samesite && { sameSite: parseSameSite(samesite) }),
        ...(secure && { secure: true }),
        ...(priority && { priority: parsePriority(priority) }),
        ...(partitioned && { partitioned: true }),
      };
      return compact(cookie);
    }
    function compact(t2) {
      const newT = {};
      for (const key in t2) {
        if (t2[key]) {
          newT[key] = t2[key];
        }
      }
      return newT;
    }
    var SAME_SITE = ["strict", "lax", "none"];
    function parseSameSite(string) {
      string = string.toLowerCase();
      return SAME_SITE.includes(string) ? string : void 0;
    }
    var PRIORITY = ["low", "medium", "high"];
    function parsePriority(string) {
      string = string.toLowerCase();
      return PRIORITY.includes(string) ? string : void 0;
    }
    function splitCookiesString(cookiesString) {
      if (!cookiesString) return [];
      var cookiesStrings = [];
      var pos = 0;
      var start;
      var ch;
      var lastComma;
      var nextStart;
      var cookiesSeparatorFound;
      function skipWhitespace() {
        while (
          pos < cookiesString.length &&
          /\s/.test(cookiesString.charAt(pos))
        ) {
          pos += 1;
        }
        return pos < cookiesString.length;
      }
      function notSpecialChar() {
        ch = cookiesString.charAt(pos);
        return ch !== "=" && ch !== ";" && ch !== ",";
      }
      while (pos < cookiesString.length) {
        start = pos;
        cookiesSeparatorFound = false;
        while (skipWhitespace()) {
          ch = cookiesString.charAt(pos);
          if (ch === ",") {
            lastComma = pos;
            pos += 1;
            skipWhitespace();
            nextStart = pos;
            while (pos < cookiesString.length && notSpecialChar()) {
              pos += 1;
            }
            if (
              pos < cookiesString.length &&
              cookiesString.charAt(pos) === "="
            ) {
              cookiesSeparatorFound = true;
              pos = nextStart;
              cookiesStrings.push(cookiesString.substring(start, lastComma));
              start = pos;
            } else {
              pos = lastComma + 1;
            }
          } else {
            pos += 1;
          }
        }
        if (!cookiesSeparatorFound || pos >= cookiesString.length) {
          cookiesStrings.push(
            cookiesString.substring(start, cookiesString.length),
          );
        }
      }
      return cookiesStrings;
    }
    var RequestCookies = class {
      constructor(requestHeaders) {
        this._parsed = /* @__PURE__ */ new Map();
        this._headers = requestHeaders;
        const header = requestHeaders.get("cookie");
        if (header) {
          const parsed = parseCookie4(header);
          for (const [name, value] of parsed) {
            this._parsed.set(name, { name, value });
          }
        }
      }
      [Symbol.iterator]() {
        return this._parsed[Symbol.iterator]();
      }
      /**
       * The amount of cookies received from the client
       */
      get size() {
        return this._parsed.size;
      }
      get(...args) {
        const name = typeof args[0] === "string" ? args[0] : args[0].name;
        return this._parsed.get(name);
      }
      getAll(...args) {
        var _a2;
        const all3 = Array.from(this._parsed);
        if (!args.length) {
          return all3.map(([_3, value]) => value);
        }
        const name =
          typeof args[0] === "string"
            ? args[0]
            : (_a2 = args[0]) == null
              ? void 0
              : _a2.name;
        return all3.filter(([n2]) => n2 === name).map(([_3, value]) => value);
      }
      has(name) {
        return this._parsed.has(name);
      }
      set(...args) {
        const [name, value] =
          args.length === 1 ? [args[0].name, args[0].value] : args;
        const map = this._parsed;
        map.set(name, { name, value });
        this._headers.set(
          "cookie",
          Array.from(map)
            .map(([_3, value2]) => stringifyCookie(value2))
            .join("; "),
        );
        return this;
      }
      /**
       * Delete the cookies matching the passed name or names in the request.
       */
      delete(names) {
        const map = this._parsed;
        const result = !Array.isArray(names)
          ? map.delete(names)
          : names.map((name) => map.delete(name));
        this._headers.set(
          "cookie",
          Array.from(map)
            .map(([_3, value]) => stringifyCookie(value))
            .join("; "),
        );
        return result;
      }
      /**
       * Delete all the cookies in the cookies in the request.
       */
      clear() {
        this.delete(Array.from(this._parsed.keys()));
        return this;
      }
      /**
       * Format the cookies in the request as a string for logging
       */
      [Symbol.for("edge-runtime.inspect.custom")]() {
        return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
      }
      toString() {
        return [...this._parsed.values()]
          .map((v2) => `${v2.name}=${encodeURIComponent(v2.value)}`)
          .join("; ");
      }
    };
    var ResponseCookies = class {
      constructor(responseHeaders) {
        this._parsed = /* @__PURE__ */ new Map();
        var _a2, _b, _c;
        this._headers = responseHeaders;
        const setCookie =
          (_c =
            (_b =
              (_a2 = responseHeaders.getSetCookie) == null
                ? void 0
                : _a2.call(responseHeaders)) != null
              ? _b
              : responseHeaders.get("set-cookie")) != null
            ? _c
            : [];
        const cookieStrings = Array.isArray(setCookie)
          ? setCookie
          : splitCookiesString(setCookie);
        for (const cookieString of cookieStrings) {
          const parsed = parseSetCookie(cookieString);
          if (parsed) this._parsed.set(parsed.name, parsed);
        }
      }
      /**
       * {@link https://wicg.github.io/cookie-store/#CookieStore-get CookieStore#get} without the Promise.
       */
      get(...args) {
        const key = typeof args[0] === "string" ? args[0] : args[0].name;
        return this._parsed.get(key);
      }
      /**
       * {@link https://wicg.github.io/cookie-store/#CookieStore-getAll CookieStore#getAll} without the Promise.
       */
      getAll(...args) {
        var _a2;
        const all3 = Array.from(this._parsed.values());
        if (!args.length) {
          return all3;
        }
        const key =
          typeof args[0] === "string"
            ? args[0]
            : (_a2 = args[0]) == null
              ? void 0
              : _a2.name;
        return all3.filter((c3) => c3.name === key);
      }
      has(name) {
        return this._parsed.has(name);
      }
      /**
       * {@link https://wicg.github.io/cookie-store/#CookieStore-set CookieStore#set} without the Promise.
       */
      set(...args) {
        const [name, value, cookie] =
          args.length === 1 ? [args[0].name, args[0].value, args[0]] : args;
        const map = this._parsed;
        map.set(name, normalizeCookie({ name, value, ...cookie }));
        replace(map, this._headers);
        return this;
      }
      /**
       * {@link https://wicg.github.io/cookie-store/#CookieStore-delete CookieStore#delete} without the Promise.
       */
      delete(...args) {
        const [name, options] =
          typeof args[0] === "string" ? [args[0]] : [args[0].name, args[0]];
        return this.set({
          ...options,
          name,
          value: "",
          expires: /* @__PURE__ */ new Date(0),
        });
      }
      [Symbol.for("edge-runtime.inspect.custom")]() {
        return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
      }
      toString() {
        return [...this._parsed.values()].map(stringifyCookie).join("; ");
      }
    };
    function replace(bag, headers2) {
      headers2.delete("set-cookie");
      for (const [, value] of bag) {
        const serialized = stringifyCookie(value);
        headers2.append("set-cookie", serialized);
      }
    }
    function normalizeCookie(cookie = { name: "", value: "" }) {
      if (typeof cookie.expires === "number") {
        cookie.expires = new Date(cookie.expires);
      }
      if (cookie.maxAge) {
        cookie.expires = new Date(Date.now() + cookie.maxAge * 1e3);
      }
      if (cookie.path === null || cookie.path === void 0) {
        cookie.path = "/";
      }
      return cookie;
    }
  },
});

// ../../../../node_modules/next/dist/server/web/spec-extension/cookies.js
var require_cookies2 = __commonJS({
  "../../../../node_modules/next/dist/server/web/spec-extension/cookies.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    function _export(target, all3) {
      for (var name in all3)
        Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name],
        });
    }
    _export(exports, {
      RequestCookies: function () {
        return _cookies.RequestCookies;
      },
      ResponseCookies: function () {
        return _cookies.ResponseCookies;
      },
      stringifyCookie: function () {
        return _cookies.stringifyCookie;
      },
    });
    var _cookies = require_cookies();
  },
});

// ../../../../node_modules/next/dist/server/web/spec-extension/request.js
var require_request = __commonJS({
  "../../../../node_modules/next/dist/server/web/spec-extension/request.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    function _export(target, all3) {
      for (var name in all3)
        Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name],
        });
    }
    _export(exports, {
      INTERNALS: function () {
        return INTERNALS;
      },
      NextRequest: function () {
        return NextRequest2;
      },
    });
    var _nexturl = require_next_url();
    var _utils = require_utils();
    var _error = require_error();
    var _cookies = require_cookies2();
    var INTERNALS = Symbol("internal request");
    var NextRequest2 = class extends Request {
      constructor(input, init2 = {}) {
        const url =
          typeof input !== "string" && "url" in input
            ? input.url
            : String(input);
        (0, _utils.validateURL)(url);
        if (process.env.NEXT_RUNTIME !== "edge") {
          if (init2.body && init2.duplex !== "half") {
            init2.duplex = "half";
          }
        }
        if (input instanceof Request) super(input, init2);
        else super(url, init2);
        const nextUrl = new _nexturl.NextURL(url, {
          headers: (0, _utils.toNodeOutgoingHttpHeaders)(this.headers),
          nextConfig: init2.nextConfig,
        });
        this[INTERNALS] = {
          cookies: new _cookies.RequestCookies(this.headers),
          nextUrl,
          url: process.env.__NEXT_NO_MIDDLEWARE_URL_NORMALIZE
            ? url
            : nextUrl.toString(),
        };
      }
      [Symbol.for("edge-runtime.inspect.custom")]() {
        return {
          cookies: this.cookies,
          nextUrl: this.nextUrl,
          url: this.url,
          // rest of props come from Request
          bodyUsed: this.bodyUsed,
          cache: this.cache,
          credentials: this.credentials,
          destination: this.destination,
          headers: Object.fromEntries(this.headers),
          integrity: this.integrity,
          keepalive: this.keepalive,
          method: this.method,
          mode: this.mode,
          redirect: this.redirect,
          referrer: this.referrer,
          referrerPolicy: this.referrerPolicy,
          signal: this.signal,
        };
      }
      get cookies() {
        return this[INTERNALS].cookies;
      }
      get nextUrl() {
        return this[INTERNALS].nextUrl;
      }
      /**
       * @deprecated
       * `page` has been deprecated in favour of `URLPattern`.
       * Read more: https://nextjs.org/docs/messages/middleware-request-page
       */
      get page() {
        throw new _error.RemovedPageError();
      }
      /**
       * @deprecated
       * `ua` has been removed in favour of \`userAgent\` function.
       * Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
       */
      get ua() {
        throw new _error.RemovedUAError();
      }
      get url() {
        return this[INTERNALS].url;
      }
    };
  },
});

// ../../../../node_modules/next/dist/server/web/spec-extension/adapters/reflect.js
var require_reflect = __commonJS({
  "../../../../node_modules/next/dist/server/web/spec-extension/adapters/reflect.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "ReflectAdapter", {
      enumerable: true,
      get: function () {
        return ReflectAdapter;
      },
    });
    var ReflectAdapter = class {
      static get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        if (typeof value === "function") {
          return value.bind(target);
        }
        return value;
      }
      static set(target, prop, value, receiver) {
        return Reflect.set(target, prop, value, receiver);
      }
      static has(target, prop) {
        return Reflect.has(target, prop);
      }
      static deleteProperty(target, prop) {
        return Reflect.deleteProperty(target, prop);
      }
    };
  },
});

// ../../../../node_modules/next/dist/server/web/spec-extension/response.js
var require_response = __commonJS({
  "../../../../node_modules/next/dist/server/web/spec-extension/response.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "NextResponse", {
      enumerable: true,
      get: function () {
        return NextResponse2;
      },
    });
    var _cookies = require_cookies2();
    var _nexturl = require_next_url();
    var _utils = require_utils();
    var _reflect = require_reflect();
    var _cookies1 = require_cookies2();
    var INTERNALS = Symbol("internal response");
    var REDIRECTS = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
    function handleMiddlewareField(init2, headers2) {
      var _init_request;
      if (
        init2 == null
          ? void 0
          : (_init_request = init2.request) == null
            ? void 0
            : _init_request.headers
      ) {
        if (!(init2.request.headers instanceof Headers)) {
          throw Object.defineProperty(
            new Error("request.headers must be an instance of Headers"),
            "__NEXT_ERROR_CODE",
            {
              value: "E119",
              enumerable: false,
              configurable: true,
            },
          );
        }
        const keys = [];
        for (const [key, value] of init2.request.headers) {
          headers2.set("x-middleware-request-" + key, value);
          keys.push(key);
        }
        headers2.set("x-middleware-override-headers", keys.join(","));
      }
    }
    var NextResponse2 = class extends Response {
      constructor(body, init2 = {}) {
        super(body, init2);
        const headers2 = this.headers;
        const cookies2 = new _cookies1.ResponseCookies(headers2);
        const cookiesProxy = new Proxy(cookies2, {
          get(target, prop, receiver) {
            switch (prop) {
              case "delete":
              case "set": {
                return (...args) => {
                  const result = Reflect.apply(target[prop], target, args);
                  const newHeaders = new Headers(headers2);
                  if (result instanceof _cookies1.ResponseCookies) {
                    headers2.set(
                      "x-middleware-set-cookie",
                      result
                        .getAll()
                        .map((cookie) => (0, _cookies.stringifyCookie)(cookie))
                        .join(","),
                    );
                  }
                  handleMiddlewareField(init2, newHeaders);
                  return result;
                };
              }
              default:
                return _reflect.ReflectAdapter.get(target, prop, receiver);
            }
          },
        });
        this[INTERNALS] = {
          cookies: cookiesProxy,
          url: init2.url
            ? new _nexturl.NextURL(init2.url, {
                headers: (0, _utils.toNodeOutgoingHttpHeaders)(headers2),
                nextConfig: init2.nextConfig,
              })
            : void 0,
        };
      }
      [Symbol.for("edge-runtime.inspect.custom")]() {
        return {
          cookies: this.cookies,
          url: this.url,
          // rest of props come from Response
          body: this.body,
          bodyUsed: this.bodyUsed,
          headers: Object.fromEntries(this.headers),
          ok: this.ok,
          redirected: this.redirected,
          status: this.status,
          statusText: this.statusText,
          type: this.type,
        };
      }
      get cookies() {
        return this[INTERNALS].cookies;
      }
      static json(body, init2) {
        const response = Response.json(body, init2);
        return new NextResponse2(response.body, response);
      }
      static redirect(url, init2) {
        const status =
          typeof init2 === "number"
            ? init2
            : ((init2 == null ? void 0 : init2.status) ?? 307);
        if (!REDIRECTS.has(status)) {
          throw Object.defineProperty(
            new RangeError(
              'Failed to execute "redirect" on "response": Invalid status code',
            ),
            "__NEXT_ERROR_CODE",
            {
              value: "E529",
              enumerable: false,
              configurable: true,
            },
          );
        }
        const initObj = typeof init2 === "object" ? init2 : {};
        const headers2 = new Headers(
          initObj == null ? void 0 : initObj.headers,
        );
        headers2.set("Location", (0, _utils.validateURL)(url));
        return new NextResponse2(null, {
          ...initObj,
          headers: headers2,
          status,
        });
      }
      static rewrite(destination, init2) {
        const headers2 = new Headers(init2 == null ? void 0 : init2.headers);
        headers2.set(
          "x-middleware-rewrite",
          (0, _utils.validateURL)(destination),
        );
        handleMiddlewareField(init2, headers2);
        return new NextResponse2(null, {
          ...init2,
          headers: headers2,
        });
      }
      static next(init2) {
        const headers2 = new Headers(init2 == null ? void 0 : init2.headers);
        headers2.set("x-middleware-next", "1");
        handleMiddlewareField(init2, headers2);
        return new NextResponse2(null, {
          ...init2,
          headers: headers2,
        });
      }
    };
  },
});

// ../../../../node_modules/next/dist/server/web/spec-extension/image-response.js
var require_image_response = __commonJS({
  "../../../../node_modules/next/dist/server/web/spec-extension/image-response.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "ImageResponse", {
      enumerable: true,
      get: function () {
        return ImageResponse;
      },
    });
    function ImageResponse() {
      throw Object.defineProperty(
        new Error(
          'ImageResponse moved from "next/server" to "next/og" since Next.js 14, please import from "next/og" instead',
        ),
        "__NEXT_ERROR_CODE",
        {
          value: "E183",
          enumerable: false,
          configurable: true,
        },
      );
    }
  },
});

// ../../../../node_modules/next/dist/compiled/ua-parser-js/ua-parser.js
var require_ua_parser = __commonJS({
  "../../../../node_modules/next/dist/compiled/ua-parser-js/ua-parser.js"(
    exports,
    module,
  ) {
    (() => {
      var i4 = {
        226: function (i5, e3) {
          (function (o4, a3) {
            "use strict";
            var r3 = "1.0.35",
              t2 = "",
              n2 = "?",
              s3 = "function",
              b2 = "undefined",
              w3 = "object",
              l3 = "string",
              d3 = "major",
              c3 = "model",
              u4 = "name",
              p3 = "type",
              m = "vendor",
              f4 = "version",
              h3 = "architecture",
              v2 = "console",
              g2 = "mobile",
              k3 = "tablet",
              x3 = "smarttv",
              _3 = "wearable",
              y2 = "embedded",
              q2 = 350;
            var T3 = "Amazon",
              S2 = "Apple",
              z2 = "ASUS",
              N2 = "BlackBerry",
              A3 = "Browser",
              C3 = "Chrome",
              E2 = "Edge",
              O2 = "Firefox",
              U2 = "Google",
              j3 = "Huawei",
              P3 = "LG",
              R = "Microsoft",
              M2 = "Motorola",
              B = "Opera",
              V2 = "Samsung",
              D2 = "Sharp",
              I2 = "Sony",
              W = "Viera",
              F2 = "Xiaomi",
              G = "Zebra",
              H = "Facebook",
              L3 = "Chromium OS",
              Z2 = "Mac OS";
            var extend2 = function (i6, e4) {
                var o5 = {};
                for (var a4 in i6) {
                  if (e4[a4] && e4[a4].length % 2 === 0) {
                    o5[a4] = e4[a4].concat(i6[a4]);
                  } else {
                    o5[a4] = i6[a4];
                  }
                }
                return o5;
              },
              enumerize = function (i6) {
                var e4 = {};
                for (var o5 = 0; o5 < i6.length; o5++) {
                  e4[i6[o5].toUpperCase()] = i6[o5];
                }
                return e4;
              },
              has = function (i6, e4) {
                return typeof i6 === l3
                  ? lowerize(e4).indexOf(lowerize(i6)) !== -1
                  : false;
              },
              lowerize = function (i6) {
                return i6.toLowerCase();
              },
              majorize = function (i6) {
                return typeof i6 === l3
                  ? i6.replace(/[^\d\.]/g, t2).split(".")[0]
                  : a3;
              },
              trim2 = function (i6, e4) {
                if (typeof i6 === l3) {
                  i6 = i6.replace(/^\s\s*/, t2);
                  return typeof e4 === b2 ? i6 : i6.substring(0, q2);
                }
              };
            var rgxMapper = function (i6, e4) {
                var o5 = 0,
                  r4,
                  t3,
                  n3,
                  b3,
                  l4,
                  d4;
                while (o5 < e4.length && !l4) {
                  var c4 = e4[o5],
                    u5 = e4[o5 + 1];
                  r4 = t3 = 0;
                  while (r4 < c4.length && !l4) {
                    if (!c4[r4]) {
                      break;
                    }
                    l4 = c4[r4++].exec(i6);
                    if (!!l4) {
                      for (n3 = 0; n3 < u5.length; n3++) {
                        d4 = l4[++t3];
                        b3 = u5[n3];
                        if (typeof b3 === w3 && b3.length > 0) {
                          if (b3.length === 2) {
                            if (typeof b3[1] == s3) {
                              this[b3[0]] = b3[1].call(this, d4);
                            } else {
                              this[b3[0]] = b3[1];
                            }
                          } else if (b3.length === 3) {
                            if (
                              typeof b3[1] === s3 &&
                              !(b3[1].exec && b3[1].test)
                            ) {
                              this[b3[0]] = d4
                                ? b3[1].call(this, d4, b3[2])
                                : a3;
                            } else {
                              this[b3[0]] = d4 ? d4.replace(b3[1], b3[2]) : a3;
                            }
                          } else if (b3.length === 4) {
                            this[b3[0]] = d4
                              ? b3[3].call(this, d4.replace(b3[1], b3[2]))
                              : a3;
                          }
                        } else {
                          this[b3] = d4 ? d4 : a3;
                        }
                      }
                    }
                  }
                  o5 += 2;
                }
              },
              strMapper = function (i6, e4) {
                for (var o5 in e4) {
                  if (typeof e4[o5] === w3 && e4[o5].length > 0) {
                    for (var r4 = 0; r4 < e4[o5].length; r4++) {
                      if (has(e4[o5][r4], i6)) {
                        return o5 === n2 ? a3 : o5;
                      }
                    }
                  } else if (has(e4[o5], i6)) {
                    return o5 === n2 ? a3 : o5;
                  }
                }
                return i6;
              };
            var $2 = {
                "1.0": "/8",
                1.2: "/1",
                1.3: "/3",
                "2.0": "/412",
                "2.0.2": "/416",
                "2.0.3": "/417",
                "2.0.4": "/419",
                "?": "/",
              },
              X = {
                ME: "4.90",
                "NT 3.11": "NT3.51",
                "NT 4.0": "NT4.0",
                2e3: "NT 5.0",
                XP: ["NT 5.1", "NT 5.2"],
                Vista: "NT 6.0",
                7: "NT 6.1",
                8: "NT 6.2",
                8.1: "NT 6.3",
                10: ["NT 6.4", "NT 10.0"],
                RT: "ARM",
              };
            var K = {
              browser: [
                [/\b(?:crmo|crios)\/([\w\.]+)/i],
                [f4, [u4, "Chrome"]],
                [/edg(?:e|ios|a)?\/([\w\.]+)/i],
                [f4, [u4, "Edge"]],
                [
                  /(opera mini)\/([-\w\.]+)/i,
                  /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,
                  /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i,
                ],
                [u4, f4],
                [/opios[\/ ]+([\w\.]+)/i],
                [f4, [u4, B + " Mini"]],
                [/\bopr\/([\w\.]+)/i],
                [f4, [u4, B]],
                [
                  /(kindle)\/([\w\.]+)/i,
                  /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i,
                  /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i,
                  /(ba?idubrowser)[\/ ]?([\w\.]+)/i,
                  /(?:ms|\()(ie) ([\w\.]+)/i,
                  /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i,
                  /(heytap|ovi)browser\/([\d\.]+)/i,
                  /(weibo)__([\d\.]+)/i,
                ],
                [u4, f4],
                [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i],
                [f4, [u4, "UC" + A3]],
                [
                  /microm.+\bqbcore\/([\w\.]+)/i,
                  /\bqbcore\/([\w\.]+).+microm/i,
                ],
                [f4, [u4, "WeChat(Win) Desktop"]],
                [/micromessenger\/([\w\.]+)/i],
                [f4, [u4, "WeChat"]],
                [/konqueror\/([\w\.]+)/i],
                [f4, [u4, "Konqueror"]],
                [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i],
                [f4, [u4, "IE"]],
                [/ya(?:search)?browser\/([\w\.]+)/i],
                [f4, [u4, "Yandex"]],
                [/(avast|avg)\/([\w\.]+)/i],
                [[u4, /(.+)/, "$1 Secure " + A3], f4],
                [/\bfocus\/([\w\.]+)/i],
                [f4, [u4, O2 + " Focus"]],
                [/\bopt\/([\w\.]+)/i],
                [f4, [u4, B + " Touch"]],
                [/coc_coc\w+\/([\w\.]+)/i],
                [f4, [u4, "Coc Coc"]],
                [/dolfin\/([\w\.]+)/i],
                [f4, [u4, "Dolphin"]],
                [/coast\/([\w\.]+)/i],
                [f4, [u4, B + " Coast"]],
                [/miuibrowser\/([\w\.]+)/i],
                [f4, [u4, "MIUI " + A3]],
                [/fxios\/([-\w\.]+)/i],
                [f4, [u4, O2]],
                [/\bqihu|(qi?ho?o?|360)browser/i],
                [[u4, "360 " + A3]],
                [/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i],
                [[u4, /(.+)/, "$1 " + A3], f4],
                [/(comodo_dragon)\/([\w\.]+)/i],
                [[u4, /_/g, " "], f4],
                [
                  /(electron)\/([\w\.]+) safari/i,
                  /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,
                  /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i,
                ],
                [u4, f4],
                [
                  /(metasr)[\/ ]?([\w\.]+)/i,
                  /(lbbrowser)/i,
                  /\[(linkedin)app\]/i,
                ],
                [u4],
                [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i],
                [[u4, H], f4],
                [
                  /(kakao(?:talk|story))[\/ ]([\w\.]+)/i,
                  /(naver)\(.*?(\d+\.[\w\.]+).*\)/i,
                  /safari (line)\/([\w\.]+)/i,
                  /\b(line)\/([\w\.]+)\/iab/i,
                  /(chromium|instagram)[\/ ]([-\w\.]+)/i,
                ],
                [u4, f4],
                [/\bgsa\/([\w\.]+) .*safari\//i],
                [f4, [u4, "GSA"]],
                [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i],
                [f4, [u4, "TikTok"]],
                [/headlesschrome(?:\/([\w\.]+)| )/i],
                [f4, [u4, C3 + " Headless"]],
                [/ wv\).+(chrome)\/([\w\.]+)/i],
                [[u4, C3 + " WebView"], f4],
                [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i],
                [f4, [u4, "Android " + A3]],
                [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i],
                [u4, f4],
                [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i],
                [f4, [u4, "Mobile Safari"]],
                [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i],
                [f4, u4],
                [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i],
                [u4, [f4, strMapper, $2]],
                [/(webkit|khtml)\/([\w\.]+)/i],
                [u4, f4],
                [/(navigator|netscape\d?)\/([-\w\.]+)/i],
                [[u4, "Netscape"], f4],
                [/mobile vr; rv:([\w\.]+)\).+firefox/i],
                [f4, [u4, O2 + " Reality"]],
                [
                  /ekiohf.+(flow)\/([\w\.]+)/i,
                  /(swiftfox)/i,
                  /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i,
                  /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,
                  /(firefox)\/([\w\.]+)/i,
                  /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,
                  /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,
                  /(links) \(([\w\.]+)/i,
                  /panasonic;(viera)/i,
                ],
                [u4, f4],
                [/(cobalt)\/([\w\.]+)/i],
                [u4, [f4, /master.|lts./, ""]],
              ],
              cpu: [
                [/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i],
                [[h3, "amd64"]],
                [/(ia32(?=;))/i],
                [[h3, lowerize]],
                [/((?:i[346]|x)86)[;\)]/i],
                [[h3, "ia32"]],
                [/\b(aarch64|arm(v?8e?l?|_?64))\b/i],
                [[h3, "arm64"]],
                [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i],
                [[h3, "armhf"]],
                [/windows (ce|mobile); ppc;/i],
                [[h3, "arm"]],
                [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i],
                [[h3, /ower/, t2, lowerize]],
                [/(sun4\w)[;\)]/i],
                [[h3, "sparc"]],
                [
                  /((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i,
                ],
                [[h3, lowerize]],
              ],
              device: [
                [
                  /\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i,
                ],
                [c3, [m, V2], [p3, k3]],
                [
                  /\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
                  /samsung[- ]([-\w]+)/i,
                  /sec-(sgh\w+)/i,
                ],
                [c3, [m, V2], [p3, g2]],
                [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i],
                [c3, [m, S2], [p3, g2]],
                [
                  /\((ipad);[-\w\),; ]+apple/i,
                  /applecoremedia\/[\w\.]+ \((ipad)/i,
                  /\b(ipad)\d\d?,\d\d?[;\]].+ios/i,
                ],
                [c3, [m, S2], [p3, k3]],
                [/(macintosh);/i],
                [c3, [m, S2]],
                [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i],
                [c3, [m, D2], [p3, g2]],
                [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i],
                [c3, [m, j3], [p3, k3]],
                [
                  /(?:huawei|honor)([-\w ]+)[;\)]/i,
                  /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i,
                ],
                [c3, [m, j3], [p3, g2]],
                [
                  /\b(poco[\w ]+)(?: bui|\))/i,
                  /\b; (\w+) build\/hm\1/i,
                  /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,
                  /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,
                  /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i,
                ],
                [
                  [c3, /_/g, " "],
                  [m, F2],
                  [p3, g2],
                ],
                [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i],
                [
                  [c3, /_/g, " "],
                  [m, F2],
                  [p3, k3],
                ],
                [
                  /; (\w+) bui.+ oppo/i,
                  /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i,
                ],
                [c3, [m, "OPPO"], [p3, g2]],
                [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i],
                [c3, [m, "Vivo"], [p3, g2]],
                [/\b(rmx[12]\d{3})(?: bui|;|\))/i],
                [c3, [m, "Realme"], [p3, g2]],
                [
                  /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
                  /\bmot(?:orola)?[- ](\w*)/i,
                  /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i,
                ],
                [c3, [m, M2], [p3, g2]],
                [/\b(mz60\d|xoom[2 ]{0,2}) build\//i],
                [c3, [m, M2], [p3, k3]],
                [
                  /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i,
                ],
                [c3, [m, P3], [p3, k3]],
                [
                  /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
                  /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,
                  /\blg-?([\d\w]+) bui/i,
                ],
                [c3, [m, P3], [p3, g2]],
                [
                  /(ideatab[-\w ]+)/i,
                  /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i,
                ],
                [c3, [m, "Lenovo"], [p3, k3]],
                [
                  /(?:maemo|nokia).*(n900|lumia \d+)/i,
                  /nokia[-_ ]?([-\w\.]*)/i,
                ],
                [
                  [c3, /_/g, " "],
                  [m, "Nokia"],
                  [p3, g2],
                ],
                [/(pixel c)\b/i],
                [c3, [m, U2], [p3, k3]],
                [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i],
                [c3, [m, U2], [p3, g2]],
                [
                  /droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i,
                ],
                [c3, [m, I2], [p3, g2]],
                [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i],
                [
                  [c3, "Xperia Tablet"],
                  [m, I2],
                  [p3, k3],
                ],
                [
                  / (kb2005|in20[12]5|be20[12][59])\b/i,
                  /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i,
                ],
                [c3, [m, "OnePlus"], [p3, g2]],
                [
                  /(alexa)webm/i,
                  /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i,
                  /(kf[a-z]+)( bui|\)).+silk\//i,
                ],
                [c3, [m, T3], [p3, k3]],
                [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i],
                [
                  [c3, /(.+)/g, "Fire Phone $1"],
                  [m, T3],
                  [p3, g2],
                ],
                [/(playbook);[-\w\),; ]+(rim)/i],
                [c3, m, [p3, k3]],
                [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i],
                [c3, [m, N2], [p3, g2]],
                [
                  /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i,
                ],
                [c3, [m, z2], [p3, k3]],
                [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i],
                [c3, [m, z2], [p3, g2]],
                [/(nexus 9)/i],
                [c3, [m, "HTC"], [p3, k3]],
                [
                  /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,
                  /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
                  /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i,
                ],
                [m, [c3, /_/g, " "], [p3, g2]],
                [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i],
                [c3, [m, "Acer"], [p3, k3]],
                [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i],
                [c3, [m, "Meizu"], [p3, g2]],
                [
                  /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i,
                  /(hp) ([\w ]+\w)/i,
                  /(asus)-?(\w+)/i,
                  /(microsoft); (lumia[\w ]+)/i,
                  /(lenovo)[-_ ]?([-\w]+)/i,
                  /(jolla)/i,
                  /(oppo) ?([\w ]+) bui/i,
                ],
                [m, c3, [p3, g2]],
                [
                  /(kobo)\s(ereader|touch)/i,
                  /(archos) (gamepad2?)/i,
                  /(hp).+(touchpad(?!.+tablet)|tablet)/i,
                  /(kindle)\/([\w\.]+)/i,
                  /(nook)[\w ]+build\/(\w+)/i,
                  /(dell) (strea[kpr\d ]*[\dko])/i,
                  /(le[- ]+pan)[- ]+(\w{1,9}) bui/i,
                  /(trinity)[- ]*(t\d{3}) bui/i,
                  /(gigaset)[- ]+(q\w{1,9}) bui/i,
                  /(vodafone) ([\w ]+)(?:\)| bui)/i,
                ],
                [m, c3, [p3, k3]],
                [/(surface duo)/i],
                [c3, [m, R], [p3, k3]],
                [/droid [\d\.]+; (fp\du?)(?: b|\))/i],
                [c3, [m, "Fairphone"], [p3, g2]],
                [/(u304aa)/i],
                [c3, [m, "AT&T"], [p3, g2]],
                [/\bsie-(\w*)/i],
                [c3, [m, "Siemens"], [p3, g2]],
                [/\b(rct\w+) b/i],
                [c3, [m, "RCA"], [p3, k3]],
                [/\b(venue[\d ]{2,7}) b/i],
                [c3, [m, "Dell"], [p3, k3]],
                [/\b(q(?:mv|ta)\w+) b/i],
                [c3, [m, "Verizon"], [p3, k3]],
                [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i],
                [c3, [m, "Barnes & Noble"], [p3, k3]],
                [/\b(tm\d{3}\w+) b/i],
                [c3, [m, "NuVision"], [p3, k3]],
                [/\b(k88) b/i],
                [c3, [m, "ZTE"], [p3, k3]],
                [/\b(nx\d{3}j) b/i],
                [c3, [m, "ZTE"], [p3, g2]],
                [/\b(gen\d{3}) b.+49h/i],
                [c3, [m, "Swiss"], [p3, g2]],
                [/\b(zur\d{3}) b/i],
                [c3, [m, "Swiss"], [p3, k3]],
                [/\b((zeki)?tb.*\b) b/i],
                [c3, [m, "Zeki"], [p3, k3]],
                [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i],
                [[m, "Dragon Touch"], c3, [p3, k3]],
                [/\b(ns-?\w{0,9}) b/i],
                [c3, [m, "Insignia"], [p3, k3]],
                [/\b((nxa|next)-?\w{0,9}) b/i],
                [c3, [m, "NextBook"], [p3, k3]],
                [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i],
                [[m, "Voice"], c3, [p3, g2]],
                [/\b(lvtel\-)?(v1[12]) b/i],
                [[m, "LvTel"], c3, [p3, g2]],
                [/\b(ph-1) /i],
                [c3, [m, "Essential"], [p3, g2]],
                [/\b(v(100md|700na|7011|917g).*\b) b/i],
                [c3, [m, "Envizen"], [p3, k3]],
                [/\b(trio[-\w\. ]+) b/i],
                [c3, [m, "MachSpeed"], [p3, k3]],
                [/\btu_(1491) b/i],
                [c3, [m, "Rotor"], [p3, k3]],
                [/(shield[\w ]+) b/i],
                [c3, [m, "Nvidia"], [p3, k3]],
                [/(sprint) (\w+)/i],
                [m, c3, [p3, g2]],
                [/(kin\.[onetw]{3})/i],
                [
                  [c3, /\./g, " "],
                  [m, R],
                  [p3, g2],
                ],
                [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i],
                [c3, [m, G], [p3, k3]],
                [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i],
                [c3, [m, G], [p3, g2]],
                [/smart-tv.+(samsung)/i],
                [m, [p3, x3]],
                [/hbbtv.+maple;(\d+)/i],
                [
                  [c3, /^/, "SmartTV"],
                  [m, V2],
                  [p3, x3],
                ],
                [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i],
                [
                  [m, P3],
                  [p3, x3],
                ],
                [/(apple) ?tv/i],
                [m, [c3, S2 + " TV"], [p3, x3]],
                [/crkey/i],
                [
                  [c3, C3 + "cast"],
                  [m, U2],
                  [p3, x3],
                ],
                [/droid.+aft(\w)( bui|\))/i],
                [c3, [m, T3], [p3, x3]],
                [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i],
                [c3, [m, D2], [p3, x3]],
                [/(bravia[\w ]+)( bui|\))/i],
                [c3, [m, I2], [p3, x3]],
                [/(mitv-\w{5}) bui/i],
                [c3, [m, F2], [p3, x3]],
                [/Hbbtv.*(technisat) (.*);/i],
                [m, c3, [p3, x3]],
                [
                  /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,
                  /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i,
                ],
                [
                  [m, trim2],
                  [c3, trim2],
                  [p3, x3],
                ],
                [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i],
                [[p3, x3]],
                [/(ouya)/i, /(nintendo) ([wids3utch]+)/i],
                [m, c3, [p3, v2]],
                [/droid.+; (shield) bui/i],
                [c3, [m, "Nvidia"], [p3, v2]],
                [/(playstation [345portablevi]+)/i],
                [c3, [m, I2], [p3, v2]],
                [/\b(xbox(?: one)?(?!; xbox))[\); ]/i],
                [c3, [m, R], [p3, v2]],
                [/((pebble))app/i],
                [m, c3, [p3, _3]],
                [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i],
                [c3, [m, S2], [p3, _3]],
                [/droid.+; (glass) \d/i],
                [c3, [m, U2], [p3, _3]],
                [/droid.+; (wt63?0{2,3})\)/i],
                [c3, [m, G], [p3, _3]],
                [/(quest( 2| pro)?)/i],
                [c3, [m, H], [p3, _3]],
                [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i],
                [m, [p3, y2]],
                [/(aeobc)\b/i],
                [c3, [m, T3], [p3, y2]],
                [/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i],
                [c3, [p3, g2]],
                [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i],
                [c3, [p3, k3]],
                [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i],
                [[p3, k3]],
                [
                  /(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i,
                ],
                [[p3, g2]],
                [/(android[-\w\. ]{0,9});.+buil/i],
                [c3, [m, "Generic"]],
              ],
              engine: [
                [/windows.+ edge\/([\w\.]+)/i],
                [f4, [u4, E2 + "HTML"]],
                [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i],
                [f4, [u4, "Blink"]],
                [
                  /(presto)\/([\w\.]+)/i,
                  /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,
                  /ekioh(flow)\/([\w\.]+)/i,
                  /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,
                  /(icab)[\/ ]([23]\.[\d\.]+)/i,
                  /\b(libweb)/i,
                ],
                [u4, f4],
                [/rv\:([\w\.]{1,9})\b.+(gecko)/i],
                [f4, u4],
              ],
              os: [
                [/microsoft (windows) (vista|xp)/i],
                [u4, f4],
                [
                  /(windows) nt 6\.2; (arm)/i,
                  /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i,
                  /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i,
                ],
                [u4, [f4, strMapper, X]],
                [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i],
                [
                  [u4, "Windows"],
                  [f4, strMapper, X],
                ],
                [
                  /ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,
                  /ios;fbsv\/([\d\.]+)/i,
                  /cfnetwork\/.+darwin/i,
                ],
                [
                  [f4, /_/g, "."],
                  [u4, "iOS"],
                ],
                [
                  /(mac os x) ?([\w\. ]*)/i,
                  /(macintosh|mac_powerpc\b)(?!.+haiku)/i,
                ],
                [
                  [u4, Z2],
                  [f4, /_/g, "."],
                ],
                [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i],
                [f4, u4],
                [
                  /(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i,
                  /(blackberry)\w*\/([\w\.]*)/i,
                  /(tizen|kaios)[\/ ]([\w\.]+)/i,
                  /\((series40);/i,
                ],
                [u4, f4],
                [/\(bb(10);/i],
                [f4, [u4, N2]],
                [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i],
                [f4, [u4, "Symbian"]],
                [
                  /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i,
                ],
                [f4, [u4, O2 + " OS"]],
                [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i],
                [f4, [u4, "webOS"]],
                [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i],
                [f4, [u4, "watchOS"]],
                [/crkey\/([\d\.]+)/i],
                [f4, [u4, C3 + "cast"]],
                [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i],
                [[u4, L3], f4],
                [
                  /panasonic;(viera)/i,
                  /(netrange)mmh/i,
                  /(nettv)\/(\d+\.[\w\.]+)/i,
                  /(nintendo|playstation) ([wids345portablevuch]+)/i,
                  /(xbox); +xbox ([^\);]+)/i,
                  /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,
                  /(mint)[\/\(\) ]?(\w*)/i,
                  /(mageia|vectorlinux)[; ]/i,
                  /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,
                  /(hurd|linux) ?([\w\.]*)/i,
                  /(gnu) ?([\w\.]*)/i,
                  /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i,
                  /(haiku) (\w+)/i,
                ],
                [u4, f4],
                [/(sunos) ?([\w\.\d]*)/i],
                [[u4, "Solaris"], f4],
                [
                  /((?:open)?solaris)[-\/ ]?([\w\.]*)/i,
                  /(aix) ((\d)(?=\.|\)| )[\w\.])*/i,
                  /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i,
                  /(unix) ?([\w\.]*)/i,
                ],
                [u4, f4],
              ],
            };
            var UAParser = function (i6, e4) {
              if (typeof i6 === w3) {
                e4 = i6;
                i6 = a3;
              }
              if (!(this instanceof UAParser)) {
                return new UAParser(i6, e4).getResult();
              }
              var r4 = typeof o4 !== b2 && o4.navigator ? o4.navigator : a3;
              var n3 = i6 || (r4 && r4.userAgent ? r4.userAgent : t2);
              var v3 = r4 && r4.userAgentData ? r4.userAgentData : a3;
              var x4 = e4 ? extend2(K, e4) : K;
              var _4 = r4 && r4.userAgent == n3;
              this.getBrowser = function () {
                var i7 = {};
                i7[u4] = a3;
                i7[f4] = a3;
                rgxMapper.call(i7, n3, x4.browser);
                i7[d3] = majorize(i7[f4]);
                if (_4 && r4 && r4.brave && typeof r4.brave.isBrave == s3) {
                  i7[u4] = "Brave";
                }
                return i7;
              };
              this.getCPU = function () {
                var i7 = {};
                i7[h3] = a3;
                rgxMapper.call(i7, n3, x4.cpu);
                return i7;
              };
              this.getDevice = function () {
                var i7 = {};
                i7[m] = a3;
                i7[c3] = a3;
                i7[p3] = a3;
                rgxMapper.call(i7, n3, x4.device);
                if (_4 && !i7[p3] && v3 && v3.mobile) {
                  i7[p3] = g2;
                }
                if (
                  _4 &&
                  i7[c3] == "Macintosh" &&
                  r4 &&
                  typeof r4.standalone !== b2 &&
                  r4.maxTouchPoints &&
                  r4.maxTouchPoints > 2
                ) {
                  i7[c3] = "iPad";
                  i7[p3] = k3;
                }
                return i7;
              };
              this.getEngine = function () {
                var i7 = {};
                i7[u4] = a3;
                i7[f4] = a3;
                rgxMapper.call(i7, n3, x4.engine);
                return i7;
              };
              this.getOS = function () {
                var i7 = {};
                i7[u4] = a3;
                i7[f4] = a3;
                rgxMapper.call(i7, n3, x4.os);
                if (_4 && !i7[u4] && v3 && v3.platform != "Unknown") {
                  i7[u4] = v3.platform
                    .replace(/chrome os/i, L3)
                    .replace(/macos/i, Z2);
                }
                return i7;
              };
              this.getResult = function () {
                return {
                  ua: this.getUA(),
                  browser: this.getBrowser(),
                  engine: this.getEngine(),
                  os: this.getOS(),
                  device: this.getDevice(),
                  cpu: this.getCPU(),
                };
              };
              this.getUA = function () {
                return n3;
              };
              this.setUA = function (i7) {
                n3 = typeof i7 === l3 && i7.length > q2 ? trim2(i7, q2) : i7;
                return this;
              };
              this.setUA(n3);
              return this;
            };
            UAParser.VERSION = r3;
            UAParser.BROWSER = enumerize([u4, f4, d3]);
            UAParser.CPU = enumerize([h3]);
            UAParser.DEVICE = enumerize([c3, m, p3, v2, g2, x3, k3, _3, y2]);
            UAParser.ENGINE = UAParser.OS = enumerize([u4, f4]);
            if (typeof e3 !== b2) {
              if ("object" !== b2 && i5.exports) {
                e3 = i5.exports = UAParser;
              }
              e3.UAParser = UAParser;
            } else {
              if (typeof define === s3 && define.amd) {
                define(function () {
                  return UAParser;
                });
              } else if (typeof o4 !== b2) {
                o4.UAParser = UAParser;
              }
            }
            var Q = typeof o4 !== b2 && (o4.jQuery || o4.Zepto);
            if (Q && !Q.ua) {
              var Y = new UAParser();
              Q.ua = Y.getResult();
              Q.ua.get = function () {
                return Y.getUA();
              };
              Q.ua.set = function (i6) {
                Y.setUA(i6);
                var e4 = Y.getResult();
                for (var o5 in e4) {
                  Q.ua[o5] = e4[o5];
                }
              };
            }
          })(typeof window === "object" ? window : this);
        },
      };
      var e2 = {};
      function __nccwpck_require__(o4) {
        var a3 = e2[o4];
        if (a3 !== void 0) {
          return a3.exports;
        }
        var r3 = (e2[o4] = { exports: {} });
        var t2 = true;
        try {
          i4[o4].call(r3.exports, r3, r3.exports, __nccwpck_require__);
          t2 = false;
        } finally {
          if (t2) delete e2[o4];
        }
        return r3.exports;
      }
      if (typeof __nccwpck_require__ !== "undefined")
        __nccwpck_require__.ab = __dirname + "/";
      var o3 = __nccwpck_require__(226);
      module.exports = o3;
    })();
  },
});

// ../../../../node_modules/next/dist/server/web/spec-extension/user-agent.js
var require_user_agent = __commonJS({
  "../../../../node_modules/next/dist/server/web/spec-extension/user-agent.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    function _export(target, all3) {
      for (var name in all3)
        Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name],
        });
    }
    _export(exports, {
      isBot: function () {
        return isBot;
      },
      userAgent: function () {
        return userAgent;
      },
      userAgentFromString: function () {
        return userAgentFromString;
      },
    });
    var _uaparserjs =
      /* @__PURE__ */ _interop_require_default(require_ua_parser());
    function _interop_require_default(obj) {
      return obj && obj.__esModule
        ? obj
        : {
            default: obj,
          };
    }
    function isBot(input) {
      return /Googlebot|Mediapartners-Google|AdsBot-Google|googleweblight|Storebot-Google|Google-PageRenderer|Google-InspectionTool|Bingbot|BingPreview|Slurp|DuckDuckBot|baiduspider|yandex|sogou|LinkedInBot|bitlybot|tumblr|vkShare|quora link preview|facebookexternalhit|facebookcatalog|Twitterbot|applebot|redditbot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|ia_archiver/i.test(
        input,
      );
    }
    function userAgentFromString(input) {
      return {
        ...(0, _uaparserjs.default)(input),
        isBot: input === void 0 ? false : isBot(input),
      };
    }
    function userAgent({ headers: headers2 }) {
      return userAgentFromString(headers2.get("user-agent") || void 0);
    }
  },
});

// ../../../../node_modules/next/dist/server/web/spec-extension/url-pattern.js
var require_url_pattern = __commonJS({
  "../../../../node_modules/next/dist/server/web/spec-extension/url-pattern.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "URLPattern", {
      enumerable: true,
      get: function () {
        return GlobalURLPattern;
      },
    });
    var GlobalURLPattern =
      // @ts-expect-error: URLPattern is not available in Node.js
      typeof URLPattern === "undefined" ? void 0 : URLPattern;
  },
});

// ../../../../node_modules/next/dist/server/app-render/async-local-storage.js
var require_async_local_storage = __commonJS({
  "../../../../node_modules/next/dist/server/app-render/async-local-storage.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    function _export(target, all3) {
      for (var name in all3)
        Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name],
        });
    }
    _export(exports, {
      bindSnapshot: function () {
        return bindSnapshot;
      },
      createAsyncLocalStorage: function () {
        return createAsyncLocalStorage;
      },
      createSnapshot: function () {
        return createSnapshot;
      },
    });
    var sharedAsyncLocalStorageNotAvailableError = Object.defineProperty(
      new Error(
        "Invariant: AsyncLocalStorage accessed in runtime where it is not available",
      ),
      "__NEXT_ERROR_CODE",
      {
        value: "E504",
        enumerable: false,
        configurable: true,
      },
    );
    var FakeAsyncLocalStorage = class {
      disable() {
        throw sharedAsyncLocalStorageNotAvailableError;
      }
      getStore() {
        return void 0;
      }
      run() {
        throw sharedAsyncLocalStorageNotAvailableError;
      }
      exit() {
        throw sharedAsyncLocalStorageNotAvailableError;
      }
      enterWith() {
        throw sharedAsyncLocalStorageNotAvailableError;
      }
      static bind(fn) {
        return fn;
      }
    };
    var maybeGlobalAsyncLocalStorage =
      typeof globalThis !== "undefined" && globalThis.AsyncLocalStorage;
    function createAsyncLocalStorage() {
      if (maybeGlobalAsyncLocalStorage) {
        return new maybeGlobalAsyncLocalStorage();
      }
      return new FakeAsyncLocalStorage();
    }
    function bindSnapshot(fn) {
      if (maybeGlobalAsyncLocalStorage) {
        return maybeGlobalAsyncLocalStorage.bind(fn);
      }
      return FakeAsyncLocalStorage.bind(fn);
    }
    function createSnapshot() {
      if (maybeGlobalAsyncLocalStorage) {
        return maybeGlobalAsyncLocalStorage.snapshot();
      }
      return function (fn, ...args) {
        return fn(...args);
      };
    }
  },
});

// ../../../../node_modules/next/dist/server/app-render/work-async-storage-instance.js
var require_work_async_storage_instance = __commonJS({
  "../../../../node_modules/next/dist/server/app-render/work-async-storage-instance.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "workAsyncStorageInstance", {
      enumerable: true,
      get: function () {
        return workAsyncStorageInstance;
      },
    });
    var _asynclocalstorage = require_async_local_storage();
    var workAsyncStorageInstance = (0,
    _asynclocalstorage.createAsyncLocalStorage)();
  },
});

// ../../../../node_modules/next/dist/server/app-render/work-async-storage.external.js
var require_work_async_storage_external = __commonJS({
  "../../../../node_modules/next/dist/server/app-render/work-async-storage.external.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "workAsyncStorage", {
      enumerable: true,
      get: function () {
        return _workasyncstorageinstance.workAsyncStorageInstance;
      },
    });
    var _workasyncstorageinstance = require_work_async_storage_instance();
  },
});

// ../../../../node_modules/next/dist/server/after/after.js
var require_after = __commonJS({
  "../../../../node_modules/next/dist/server/after/after.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "after", {
      enumerable: true,
      get: function () {
        return after;
      },
    });
    var _workasyncstorageexternal = require_work_async_storage_external();
    function after(task) {
      const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
      if (!workStore) {
        throw Object.defineProperty(
          new Error(
            "`after` was called outside a request scope. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context",
          ),
          "__NEXT_ERROR_CODE",
          {
            value: "E468",
            enumerable: false,
            configurable: true,
          },
        );
      }
      const { afterContext } = workStore;
      return afterContext.after(task);
    }
  },
});

// ../../../../node_modules/next/dist/server/after/index.js
var require_after2 = __commonJS({
  "../../../../node_modules/next/dist/server/after/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    _export_star(require_after(), exports);
    function _export_star(from, to) {
      Object.keys(from).forEach(function (k3) {
        if (k3 !== "default" && !Object.prototype.hasOwnProperty.call(to, k3)) {
          Object.defineProperty(to, k3, {
            enumerable: true,
            get: function () {
              return from[k3];
            },
          });
        }
      });
      return from;
    }
  },
});

// ../../../../node_modules/next/dist/server/app-render/work-unit-async-storage-instance.js
var require_work_unit_async_storage_instance = __commonJS({
  "../../../../node_modules/next/dist/server/app-render/work-unit-async-storage-instance.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "workUnitAsyncStorageInstance", {
      enumerable: true,
      get: function () {
        return workUnitAsyncStorageInstance;
      },
    });
    var _asynclocalstorage = require_async_local_storage();
    var workUnitAsyncStorageInstance = (0,
    _asynclocalstorage.createAsyncLocalStorage)();
  },
});

// ../../../../node_modules/next/dist/server/app-render/work-unit-async-storage.external.js
var require_work_unit_async_storage_external = __commonJS({
  "../../../../node_modules/next/dist/server/app-render/work-unit-async-storage.external.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    function _export(target, all3) {
      for (var name in all3)
        Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name],
        });
    }
    _export(exports, {
      getExpectedRequestStore: function () {
        return getExpectedRequestStore;
      },
      getHmrRefreshHash: function () {
        return getHmrRefreshHash;
      },
      getPrerenderResumeDataCache: function () {
        return getPrerenderResumeDataCache;
      },
      getRenderResumeDataCache: function () {
        return getRenderResumeDataCache;
      },
      workUnitAsyncStorage: function () {
        return _workunitasyncstorageinstance.workUnitAsyncStorageInstance;
      },
    });
    var _workunitasyncstorageinstance =
      require_work_unit_async_storage_instance();
    function getExpectedRequestStore(callingExpression) {
      const workUnitStore =
        _workunitasyncstorageinstance.workUnitAsyncStorageInstance.getStore();
      if (workUnitStore) {
        if (workUnitStore.type === "request") {
          return workUnitStore;
        }
        if (
          workUnitStore.type === "prerender" ||
          workUnitStore.type === "prerender-ppr" ||
          workUnitStore.type === "prerender-legacy"
        ) {
          throw Object.defineProperty(
            new Error(
              `\`${callingExpression}\` cannot be called inside a prerender. This is a bug in Next.js.`,
            ),
            "__NEXT_ERROR_CODE",
            {
              value: "E401",
              enumerable: false,
              configurable: true,
            },
          );
        }
        if (workUnitStore.type === "cache") {
          throw Object.defineProperty(
            new Error(
              `\`${callingExpression}\` cannot be called inside "use cache". Call it outside and pass an argument instead. Read more: https://nextjs.org/docs/messages/next-request-in-use-cache`,
            ),
            "__NEXT_ERROR_CODE",
            {
              value: "E37",
              enumerable: false,
              configurable: true,
            },
          );
        } else if (workUnitStore.type === "unstable-cache") {
          throw Object.defineProperty(
            new Error(
              `\`${callingExpression}\` cannot be called inside unstable_cache. Call it outside and pass an argument instead. Read more: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`,
            ),
            "__NEXT_ERROR_CODE",
            {
              value: "E69",
              enumerable: false,
              configurable: true,
            },
          );
        }
      }
      throw Object.defineProperty(
        new Error(
          `\`${callingExpression}\` was called outside a request scope. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context`,
        ),
        "__NEXT_ERROR_CODE",
        {
          value: "E251",
          enumerable: false,
          configurable: true,
        },
      );
    }
    function getPrerenderResumeDataCache(workUnitStore) {
      if (
        workUnitStore.type === "prerender" ||
        workUnitStore.type === "prerender-ppr"
      ) {
        return workUnitStore.prerenderResumeDataCache;
      }
      return null;
    }
    function getRenderResumeDataCache(workUnitStore) {
      if (
        workUnitStore.type !== "prerender-legacy" &&
        workUnitStore.type !== "cache" &&
        workUnitStore.type !== "unstable-cache"
      ) {
        if (workUnitStore.type === "request") {
          return workUnitStore.renderResumeDataCache;
        }
        return workUnitStore.prerenderResumeDataCache;
      }
      return null;
    }
    function getHmrRefreshHash(workUnitStore) {
      var _workUnitStore_cookies_get;
      return workUnitStore.type === "cache"
        ? workUnitStore.hmrRefreshHash
        : workUnitStore.type === "request"
          ? (_workUnitStore_cookies_get = workUnitStore.cookies.get(
              "__next_hmr_refresh_hash__",
            )) == null
            ? void 0
            : _workUnitStore_cookies_get.value
          : void 0;
    }
  },
});

// ../../../../node_modules/next/dist/client/components/hooks-server-context.js
var require_hooks_server_context = __commonJS({
  "../../../../node_modules/next/dist/client/components/hooks-server-context.js"(
    exports,
    module,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    function _export(target, all3) {
      for (var name in all3)
        Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name],
        });
    }
    _export(exports, {
      DynamicServerError: function () {
        return DynamicServerError;
      },
      isDynamicServerError: function () {
        return isDynamicServerError;
      },
    });
    var DYNAMIC_ERROR_CODE = "DYNAMIC_SERVER_USAGE";
    var DynamicServerError = class extends Error {
      constructor(description) {
        super("Dynamic server usage: " + description),
          (this.description = description),
          (this.digest = DYNAMIC_ERROR_CODE);
      }
    };
    function isDynamicServerError(err) {
      if (
        typeof err !== "object" ||
        err === null ||
        !("digest" in err) ||
        typeof err.digest !== "string"
      ) {
        return false;
      }
      return err.digest === DYNAMIC_ERROR_CODE;
    }
    if (
      (typeof exports.default === "function" ||
        (typeof exports.default === "object" && exports.default !== null)) &&
      typeof exports.default.__esModule === "undefined"
    ) {
      Object.defineProperty(exports.default, "__esModule", { value: true });
      Object.assign(exports.default, exports);
      module.exports = exports.default;
    }
  },
});

// ../../../../node_modules/next/dist/client/components/static-generation-bailout.js
var require_static_generation_bailout = __commonJS({
  "../../../../node_modules/next/dist/client/components/static-generation-bailout.js"(
    exports,
    module,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    function _export(target, all3) {
      for (var name in all3)
        Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name],
        });
    }
    _export(exports, {
      StaticGenBailoutError: function () {
        return StaticGenBailoutError;
      },
      isStaticGenBailoutError: function () {
        return isStaticGenBailoutError;
      },
    });
    var NEXT_STATIC_GEN_BAILOUT = "NEXT_STATIC_GEN_BAILOUT";
    var StaticGenBailoutError = class extends Error {
      constructor(...args) {
        super(...args), (this.code = NEXT_STATIC_GEN_BAILOUT);
      }
    };
    function isStaticGenBailoutError(error) {
      if (typeof error !== "object" || error === null || !("code" in error)) {
        return false;
      }
      return error.code === NEXT_STATIC_GEN_BAILOUT;
    }
    if (
      (typeof exports.default === "function" ||
        (typeof exports.default === "object" && exports.default !== null)) &&
      typeof exports.default.__esModule === "undefined"
    ) {
      Object.defineProperty(exports.default, "__esModule", { value: true });
      Object.assign(exports.default, exports);
      module.exports = exports.default;
    }
  },
});

// ../../../../node_modules/next/dist/server/dynamic-rendering-utils.js
var require_dynamic_rendering_utils = __commonJS({
  "../../../../node_modules/next/dist/server/dynamic-rendering-utils.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    function _export(target, all3) {
      for (var name in all3)
        Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name],
        });
    }
    _export(exports, {
      isHangingPromiseRejectionError: function () {
        return isHangingPromiseRejectionError;
      },
      makeHangingPromise: function () {
        return makeHangingPromise;
      },
    });
    function isHangingPromiseRejectionError(err) {
      if (typeof err !== "object" || err === null || !("digest" in err)) {
        return false;
      }
      return err.digest === HANGING_PROMISE_REJECTION;
    }
    var HANGING_PROMISE_REJECTION = "HANGING_PROMISE_REJECTION";
    var HangingPromiseRejectionError = class extends Error {
      constructor(expression) {
        super(
          `During prerendering, ${expression} rejects when the prerender is complete. Typically these errors are handled by React but if you move ${expression} to a different context by using \`setTimeout\`, \`after\`, or similar functions you may observe this error and you should handle it in that context.`,
        ),
          (this.expression = expression),
          (this.digest = HANGING_PROMISE_REJECTION);
      }
    };
    function makeHangingPromise(signal2, expression) {
      const hangingPromise = new Promise((_3, reject) => {
        signal2.addEventListener(
          "abort",
          () => {
            reject(new HangingPromiseRejectionError(expression));
          },
          {
            once: true,
          },
        );
      });
      hangingPromise.catch(ignoreReject);
      return hangingPromise;
    }
    function ignoreReject() {}
  },
});

// ../../../../node_modules/next/dist/lib/metadata/metadata-constants.js
var require_metadata_constants = __commonJS({
  "../../../../node_modules/next/dist/lib/metadata/metadata-constants.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    function _export(target, all3) {
      for (var name in all3)
        Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name],
        });
    }
    _export(exports, {
      METADATA_BOUNDARY_NAME: function () {
        return METADATA_BOUNDARY_NAME;
      },
      OUTLET_BOUNDARY_NAME: function () {
        return OUTLET_BOUNDARY_NAME;
      },
      VIEWPORT_BOUNDARY_NAME: function () {
        return VIEWPORT_BOUNDARY_NAME;
      },
    });
    var METADATA_BOUNDARY_NAME = "__next_metadata_boundary__";
    var VIEWPORT_BOUNDARY_NAME = "__next_viewport_boundary__";
    var OUTLET_BOUNDARY_NAME = "__next_outlet_boundary__";
  },
});

// ../../../../node_modules/next/dist/lib/scheduler.js
var require_scheduler = __commonJS({
  "../../../../node_modules/next/dist/lib/scheduler.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    function _export(target, all3) {
      for (var name in all3)
        Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name],
        });
    }
    _export(exports, {
      atLeastOneTask: function () {
        return atLeastOneTask;
      },
      scheduleImmediate: function () {
        return scheduleImmediate;
      },
      scheduleOnNextTick: function () {
        return scheduleOnNextTick;
      },
      waitAtLeastOneReactRenderTask: function () {
        return waitAtLeastOneReactRenderTask;
      },
    });
    var scheduleOnNextTick = (cb) => {
      Promise.resolve().then(() => {
        if (process.env.NEXT_RUNTIME === "edge") {
          setTimeout(cb, 0);
        } else {
          process.nextTick(cb);
        }
      });
    };
    var scheduleImmediate = (cb) => {
      if (process.env.NEXT_RUNTIME === "edge") {
        setTimeout(cb, 0);
      } else {
        setImmediate(cb);
      }
    };
    function atLeastOneTask() {
      return new Promise((resolve) => scheduleImmediate(resolve));
    }
    function waitAtLeastOneReactRenderTask() {
      if (process.env.NEXT_RUNTIME === "edge") {
        return new Promise((r3) => setTimeout(r3, 0));
      } else {
        return new Promise((r3) => setImmediate(r3));
      }
    }
  },
});

// ../../../../node_modules/next/dist/server/app-render/dynamic-rendering.js
var require_dynamic_rendering = __commonJS({
  "../../../../node_modules/next/dist/server/app-render/dynamic-rendering.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    function _export(target, all3) {
      for (var name in all3)
        Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name],
        });
    }
    _export(exports, {
      Postpone: function () {
        return Postpone;
      },
      abortAndThrowOnSynchronousRequestDataAccess: function () {
        return abortAndThrowOnSynchronousRequestDataAccess;
      },
      abortOnSynchronousPlatformIOAccess: function () {
        return abortOnSynchronousPlatformIOAccess;
      },
      accessedDynamicData: function () {
        return accessedDynamicData;
      },
      annotateDynamicAccess: function () {
        return annotateDynamicAccess;
      },
      consumeDynamicAccess: function () {
        return consumeDynamicAccess;
      },
      createDynamicTrackingState: function () {
        return createDynamicTrackingState;
      },
      createDynamicValidationState: function () {
        return createDynamicValidationState;
      },
      createHangingInputAbortSignal: function () {
        return createHangingInputAbortSignal;
      },
      createPostponedAbortSignal: function () {
        return createPostponedAbortSignal;
      },
      formatDynamicAPIAccesses: function () {
        return formatDynamicAPIAccesses;
      },
      getFirstDynamicReason: function () {
        return getFirstDynamicReason;
      },
      isDynamicPostpone: function () {
        return isDynamicPostpone;
      },
      isPrerenderInterruptedError: function () {
        return isPrerenderInterruptedError;
      },
      markCurrentScopeAsDynamic: function () {
        return markCurrentScopeAsDynamic;
      },
      postponeWithTracking: function () {
        return postponeWithTracking;
      },
      throwIfDisallowedDynamic: function () {
        return throwIfDisallowedDynamic;
      },
      throwToInterruptStaticGeneration: function () {
        return throwToInterruptStaticGeneration;
      },
      trackAllowedDynamicAccess: function () {
        return trackAllowedDynamicAccess;
      },
      trackDynamicDataInDynamicRender: function () {
        return trackDynamicDataInDynamicRender;
      },
      trackFallbackParamAccessed: function () {
        return trackFallbackParamAccessed;
      },
      trackSynchronousPlatformIOAccessInDev: function () {
        return trackSynchronousPlatformIOAccessInDev;
      },
      trackSynchronousRequestDataAccessInDev: function () {
        return trackSynchronousRequestDataAccessInDev;
      },
      useDynamicRouteParams: function () {
        return useDynamicRouteParams;
      },
    });
    var _react = /* @__PURE__ */ _interop_require_default(__require("react"));
    var _hooksservercontext = require_hooks_server_context();
    var _staticgenerationbailout = require_static_generation_bailout();
    var _workunitasyncstorageexternal =
      require_work_unit_async_storage_external();
    var _workasyncstorageexternal = require_work_async_storage_external();
    var _dynamicrenderingutils = require_dynamic_rendering_utils();
    var _metadataconstants = require_metadata_constants();
    var _scheduler = require_scheduler();
    function _interop_require_default(obj) {
      return obj && obj.__esModule
        ? obj
        : {
            default: obj,
          };
    }
    var hasPostpone = typeof _react.default.unstable_postpone === "function";
    function createDynamicTrackingState(isDebugDynamicAccesses) {
      return {
        isDebugDynamicAccesses,
        dynamicAccesses: [],
        syncDynamicExpression: void 0,
        syncDynamicErrorWithStack: null,
      };
    }
    function createDynamicValidationState() {
      return {
        hasSuspendedDynamic: false,
        hasDynamicMetadata: false,
        hasDynamicViewport: false,
        hasSyncDynamicErrors: false,
        dynamicErrors: [],
      };
    }
    function getFirstDynamicReason(trackingState) {
      var _trackingState_dynamicAccesses_;
      return (_trackingState_dynamicAccesses_ =
        trackingState.dynamicAccesses[0]) == null
        ? void 0
        : _trackingState_dynamicAccesses_.expression;
    }
    function markCurrentScopeAsDynamic(store, workUnitStore, expression) {
      if (workUnitStore) {
        if (
          workUnitStore.type === "cache" ||
          workUnitStore.type === "unstable-cache"
        ) {
          return;
        }
      }
      if (store.forceDynamic || store.forceStatic) return;
      if (store.dynamicShouldError) {
        throw Object.defineProperty(
          new _staticgenerationbailout.StaticGenBailoutError(
            `Route ${store.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`${expression}\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`,
          ),
          "__NEXT_ERROR_CODE",
          {
            value: "E553",
            enumerable: false,
            configurable: true,
          },
        );
      }
      if (workUnitStore) {
        if (workUnitStore.type === "prerender-ppr") {
          postponeWithTracking(
            store.route,
            expression,
            workUnitStore.dynamicTracking,
          );
        } else if (workUnitStore.type === "prerender-legacy") {
          workUnitStore.revalidate = 0;
          const err = Object.defineProperty(
            new _hooksservercontext.DynamicServerError(
              `Route ${store.route} couldn't be rendered statically because it used ${expression}. See more info here: https://nextjs.org/docs/messages/dynamic-server-error`,
            ),
            "__NEXT_ERROR_CODE",
            {
              value: "E550",
              enumerable: false,
              configurable: true,
            },
          );
          store.dynamicUsageDescription = expression;
          store.dynamicUsageStack = err.stack;
          throw err;
        } else if (workUnitStore && workUnitStore.type === "request") {
          workUnitStore.usedDynamic = true;
        }
      }
    }
    function trackFallbackParamAccessed(store, expression) {
      const prerenderStore =
        _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
      if (!prerenderStore || prerenderStore.type !== "prerender-ppr") return;
      postponeWithTracking(
        store.route,
        expression,
        prerenderStore.dynamicTracking,
      );
    }
    function throwToInterruptStaticGeneration(
      expression,
      store,
      prerenderStore,
    ) {
      const err = Object.defineProperty(
        new _hooksservercontext.DynamicServerError(
          `Route ${store.route} couldn't be rendered statically because it used \`${expression}\`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error`,
        ),
        "__NEXT_ERROR_CODE",
        {
          value: "E558",
          enumerable: false,
          configurable: true,
        },
      );
      prerenderStore.revalidate = 0;
      store.dynamicUsageDescription = expression;
      store.dynamicUsageStack = err.stack;
      throw err;
    }
    function trackDynamicDataInDynamicRender(_store, workUnitStore) {
      if (workUnitStore) {
        if (
          workUnitStore.type === "cache" ||
          workUnitStore.type === "unstable-cache"
        ) {
          return;
        }
        if (
          workUnitStore.type === "prerender" ||
          workUnitStore.type === "prerender-legacy"
        ) {
          workUnitStore.revalidate = 0;
        }
        if (workUnitStore.type === "request") {
          workUnitStore.usedDynamic = true;
        }
      }
    }
    function abortOnSynchronousDynamicDataAccess(
      route,
      expression,
      prerenderStore,
    ) {
      const reason = `Route ${route} needs to bail out of prerendering at this point because it used ${expression}.`;
      const error = createPrerenderInterruptedError(reason);
      prerenderStore.controller.abort(error);
      const dynamicTracking = prerenderStore.dynamicTracking;
      if (dynamicTracking) {
        dynamicTracking.dynamicAccesses.push({
          // When we aren't debugging, we don't need to create another error for the
          // stack trace.
          stack: dynamicTracking.isDebugDynamicAccesses
            ? new Error().stack
            : void 0,
          expression,
        });
      }
    }
    function abortOnSynchronousPlatformIOAccess(
      route,
      expression,
      errorWithStack,
      prerenderStore,
    ) {
      const dynamicTracking = prerenderStore.dynamicTracking;
      if (dynamicTracking) {
        if (dynamicTracking.syncDynamicErrorWithStack === null) {
          dynamicTracking.syncDynamicExpression = expression;
          dynamicTracking.syncDynamicErrorWithStack = errorWithStack;
        }
      }
      return abortOnSynchronousDynamicDataAccess(
        route,
        expression,
        prerenderStore,
      );
    }
    function trackSynchronousPlatformIOAccessInDev(requestStore) {
      requestStore.prerenderPhase = false;
    }
    function abortAndThrowOnSynchronousRequestDataAccess(
      route,
      expression,
      errorWithStack,
      prerenderStore,
    ) {
      const dynamicTracking = prerenderStore.dynamicTracking;
      if (dynamicTracking) {
        if (dynamicTracking.syncDynamicErrorWithStack === null) {
          dynamicTracking.syncDynamicExpression = expression;
          dynamicTracking.syncDynamicErrorWithStack = errorWithStack;
          if (prerenderStore.validating === true) {
            dynamicTracking.syncDynamicLogged = true;
          }
        }
      }
      abortOnSynchronousDynamicDataAccess(route, expression, prerenderStore);
      throw createPrerenderInterruptedError(
        `Route ${route} needs to bail out of prerendering at this point because it used ${expression}.`,
      );
    }
    var trackSynchronousRequestDataAccessInDev =
      trackSynchronousPlatformIOAccessInDev;
    function Postpone({ reason, route }) {
      const prerenderStore =
        _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
      const dynamicTracking =
        prerenderStore && prerenderStore.type === "prerender-ppr"
          ? prerenderStore.dynamicTracking
          : null;
      postponeWithTracking(route, reason, dynamicTracking);
    }
    function postponeWithTracking(route, expression, dynamicTracking) {
      assertPostpone();
      if (dynamicTracking) {
        dynamicTracking.dynamicAccesses.push({
          // When we aren't debugging, we don't need to create another error for the
          // stack trace.
          stack: dynamicTracking.isDebugDynamicAccesses
            ? new Error().stack
            : void 0,
          expression,
        });
      }
      _react.default.unstable_postpone(createPostponeReason(route, expression));
    }
    function createPostponeReason(route, expression) {
      return `Route ${route} needs to bail out of prerendering at this point because it used ${expression}. React throws this special object to indicate where. It should not be caught by your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error`;
    }
    function isDynamicPostpone(err) {
      if (
        typeof err === "object" &&
        err !== null &&
        typeof err.message === "string"
      ) {
        return isDynamicPostponeReason(err.message);
      }
      return false;
    }
    function isDynamicPostponeReason(reason) {
      return (
        reason.includes(
          "needs to bail out of prerendering at this point because it used",
        ) &&
        reason.includes(
          "Learn more: https://nextjs.org/docs/messages/ppr-caught-error",
        )
      );
    }
    if (isDynamicPostponeReason(createPostponeReason("%%%", "^^^")) === false) {
      throw Object.defineProperty(
        new Error(
          "Invariant: isDynamicPostpone misidentified a postpone reason. This is a bug in Next.js",
        ),
        "__NEXT_ERROR_CODE",
        {
          value: "E296",
          enumerable: false,
          configurable: true,
        },
      );
    }
    var NEXT_PRERENDER_INTERRUPTED = "NEXT_PRERENDER_INTERRUPTED";
    function createPrerenderInterruptedError(message2) {
      const error = Object.defineProperty(
        new Error(message2),
        "__NEXT_ERROR_CODE",
        {
          value: "E394",
          enumerable: false,
          configurable: true,
        },
      );
      error.digest = NEXT_PRERENDER_INTERRUPTED;
      return error;
    }
    function isPrerenderInterruptedError(error) {
      return (
        typeof error === "object" &&
        error !== null &&
        error.digest === NEXT_PRERENDER_INTERRUPTED &&
        "name" in error &&
        "message" in error &&
        error instanceof Error
      );
    }
    function accessedDynamicData(dynamicAccesses) {
      return dynamicAccesses.length > 0;
    }
    function consumeDynamicAccess(serverDynamic, clientDynamic) {
      serverDynamic.dynamicAccesses.push(...clientDynamic.dynamicAccesses);
      return serverDynamic.dynamicAccesses;
    }
    function formatDynamicAPIAccesses(dynamicAccesses) {
      return dynamicAccesses
        .filter(
          (access) =>
            typeof access.stack === "string" && access.stack.length > 0,
        )
        .map(({ expression, stack }) => {
          stack = stack
            .split("\n")
            .slice(4)
            .filter((line) => {
              if (line.includes("node_modules/next/")) {
                return false;
              }
              if (line.includes(" (<anonymous>)")) {
                return false;
              }
              if (line.includes(" (node:")) {
                return false;
              }
              return true;
            })
            .join("\n");
          return `Dynamic API Usage Debug - ${expression}:
${stack}`;
        });
    }
    function assertPostpone() {
      if (!hasPostpone) {
        throw Object.defineProperty(
          new Error(
            `Invariant: React.unstable_postpone is not defined. This suggests the wrong version of React was loaded. This is a bug in Next.js`,
          ),
          "__NEXT_ERROR_CODE",
          {
            value: "E224",
            enumerable: false,
            configurable: true,
          },
        );
      }
    }
    function createPostponedAbortSignal(reason) {
      assertPostpone();
      const controller = new AbortController();
      try {
        _react.default.unstable_postpone(reason);
      } catch (x3) {
        controller.abort(x3);
      }
      return controller.signal;
    }
    function createHangingInputAbortSignal(workUnitStore) {
      const controller = new AbortController();
      if (workUnitStore.cacheSignal) {
        workUnitStore.cacheSignal.inputReady().then(() => {
          controller.abort();
        });
      } else {
        (0, _scheduler.scheduleOnNextTick)(() => controller.abort());
      }
      return controller.signal;
    }
    function annotateDynamicAccess(expression, prerenderStore) {
      const dynamicTracking = prerenderStore.dynamicTracking;
      if (dynamicTracking) {
        dynamicTracking.dynamicAccesses.push({
          stack: dynamicTracking.isDebugDynamicAccesses
            ? new Error().stack
            : void 0,
          expression,
        });
      }
    }
    function useDynamicRouteParams(expression) {
      const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
      if (
        workStore &&
        workStore.isStaticGeneration &&
        workStore.fallbackRouteParams &&
        workStore.fallbackRouteParams.size > 0
      ) {
        const workUnitStore =
          _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
        if (workUnitStore) {
          if (workUnitStore.type === "prerender") {
            _react.default.use(
              (0, _dynamicrenderingutils.makeHangingPromise)(
                workUnitStore.renderSignal,
                expression,
              ),
            );
          } else if (workUnitStore.type === "prerender-ppr") {
            postponeWithTracking(
              workStore.route,
              expression,
              workUnitStore.dynamicTracking,
            );
          } else if (workUnitStore.type === "prerender-legacy") {
            throwToInterruptStaticGeneration(
              expression,
              workStore,
              workUnitStore,
            );
          }
        }
      }
    }
    var hasSuspenseRegex = /\n\s+at Suspense \(<anonymous>\)/;
    var hasMetadataRegex = new RegExp(
      `\\n\\s+at ${_metadataconstants.METADATA_BOUNDARY_NAME}[\\n\\s]`,
    );
    var hasViewportRegex = new RegExp(
      `\\n\\s+at ${_metadataconstants.VIEWPORT_BOUNDARY_NAME}[\\n\\s]`,
    );
    var hasOutletRegex = new RegExp(
      `\\n\\s+at ${_metadataconstants.OUTLET_BOUNDARY_NAME}[\\n\\s]`,
    );
    function trackAllowedDynamicAccess(
      route,
      componentStack,
      dynamicValidation,
      serverDynamic,
      clientDynamic,
    ) {
      if (hasOutletRegex.test(componentStack)) {
        return;
      } else if (hasMetadataRegex.test(componentStack)) {
        dynamicValidation.hasDynamicMetadata = true;
        return;
      } else if (hasViewportRegex.test(componentStack)) {
        dynamicValidation.hasDynamicViewport = true;
        return;
      } else if (hasSuspenseRegex.test(componentStack)) {
        dynamicValidation.hasSuspendedDynamic = true;
        return;
      } else if (
        serverDynamic.syncDynamicErrorWithStack ||
        clientDynamic.syncDynamicErrorWithStack
      ) {
        dynamicValidation.hasSyncDynamicErrors = true;
        return;
      } else {
        const message2 = `Route "${route}": A component accessed data, headers, params, searchParams, or a short-lived cache without a Suspense boundary nor a "use cache" above it. We don't have the exact line number added to error messages yet but you can see which component in the stack below. See more info: https://nextjs.org/docs/messages/next-prerender-missing-suspense`;
        const error = createErrorWithComponentStack(message2, componentStack);
        dynamicValidation.dynamicErrors.push(error);
        return;
      }
    }
    function createErrorWithComponentStack(message2, componentStack) {
      const error = Object.defineProperty(
        new Error(message2),
        "__NEXT_ERROR_CODE",
        {
          value: "E394",
          enumerable: false,
          configurable: true,
        },
      );
      error.stack = "Error: " + message2 + componentStack;
      return error;
    }
    function throwIfDisallowedDynamic(
      route,
      dynamicValidation,
      serverDynamic,
      clientDynamic,
    ) {
      let syncError;
      let syncExpression;
      let syncLogged;
      if (serverDynamic.syncDynamicErrorWithStack) {
        syncError = serverDynamic.syncDynamicErrorWithStack;
        syncExpression = serverDynamic.syncDynamicExpression;
        syncLogged = serverDynamic.syncDynamicLogged === true;
      } else if (clientDynamic.syncDynamicErrorWithStack) {
        syncError = clientDynamic.syncDynamicErrorWithStack;
        syncExpression = clientDynamic.syncDynamicExpression;
        syncLogged = clientDynamic.syncDynamicLogged === true;
      } else {
        syncError = null;
        syncExpression = void 0;
        syncLogged = false;
      }
      if (dynamicValidation.hasSyncDynamicErrors && syncError) {
        if (!syncLogged) {
          console.error(syncError);
        }
        throw new _staticgenerationbailout.StaticGenBailoutError();
      }
      const dynamicErrors = dynamicValidation.dynamicErrors;
      if (dynamicErrors.length) {
        for (let i4 = 0; i4 < dynamicErrors.length; i4++) {
          console.error(dynamicErrors[i4]);
        }
        throw new _staticgenerationbailout.StaticGenBailoutError();
      }
      if (!dynamicValidation.hasSuspendedDynamic) {
        if (dynamicValidation.hasDynamicMetadata) {
          if (syncError) {
            console.error(syncError);
            throw Object.defineProperty(
              new _staticgenerationbailout.StaticGenBailoutError(
                `Route "${route}" has a \`generateMetadata\` that could not finish rendering before ${syncExpression} was used. Follow the instructions in the error for this expression to resolve.`,
              ),
              "__NEXT_ERROR_CODE",
              {
                value: "E608",
                enumerable: false,
                configurable: true,
              },
            );
          }
          throw Object.defineProperty(
            new _staticgenerationbailout.StaticGenBailoutError(
              `Route "${route}" has a \`generateMetadata\` that depends on Request data (\`cookies()\`, etc...) or external data (\`fetch(...)\`, etc...) but the rest of the route was static or only used cached data (\`"use cache"\`). If you expected this route to be prerenderable update your \`generateMetadata\` to not use Request data and only use cached external data. Otherwise, add \`await connection()\` somewhere within this route to indicate explicitly it should not be prerendered.`,
            ),
            "__NEXT_ERROR_CODE",
            {
              value: "E534",
              enumerable: false,
              configurable: true,
            },
          );
        } else if (dynamicValidation.hasDynamicViewport) {
          if (syncError) {
            console.error(syncError);
            throw Object.defineProperty(
              new _staticgenerationbailout.StaticGenBailoutError(
                `Route "${route}" has a \`generateViewport\` that could not finish rendering before ${syncExpression} was used. Follow the instructions in the error for this expression to resolve.`,
              ),
              "__NEXT_ERROR_CODE",
              {
                value: "E573",
                enumerable: false,
                configurable: true,
              },
            );
          }
          throw Object.defineProperty(
            new _staticgenerationbailout.StaticGenBailoutError(
              `Route "${route}" has a \`generateViewport\` that depends on Request data (\`cookies()\`, etc...) or external data (\`fetch(...)\`, etc...) but the rest of the route was static or only used cached data (\`"use cache"\`). If you expected this route to be prerenderable update your \`generateViewport\` to not use Request data and only use cached external data. Otherwise, add \`await connection()\` somewhere within this route to indicate explicitly it should not be prerendered.`,
            ),
            "__NEXT_ERROR_CODE",
            {
              value: "E590",
              enumerable: false,
              configurable: true,
            },
          );
        }
      }
    }
  },
});

// ../../../../node_modules/next/dist/server/app-render/after-task-async-storage-instance.js
var require_after_task_async_storage_instance = __commonJS({
  "../../../../node_modules/next/dist/server/app-render/after-task-async-storage-instance.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "afterTaskAsyncStorageInstance", {
      enumerable: true,
      get: function () {
        return afterTaskAsyncStorageInstance;
      },
    });
    var _asynclocalstorage = require_async_local_storage();
    var afterTaskAsyncStorageInstance = (0,
    _asynclocalstorage.createAsyncLocalStorage)();
  },
});

// ../../../../node_modules/next/dist/server/app-render/after-task-async-storage.external.js
var require_after_task_async_storage_external = __commonJS({
  "../../../../node_modules/next/dist/server/app-render/after-task-async-storage.external.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "afterTaskAsyncStorage", {
      enumerable: true,
      get: function () {
        return _aftertaskasyncstorageinstance.afterTaskAsyncStorageInstance;
      },
    });
    var _aftertaskasyncstorageinstance =
      require_after_task_async_storage_instance();
  },
});

// ../../../../node_modules/next/dist/server/request/utils.js
var require_utils2 = __commonJS({
  "../../../../node_modules/next/dist/server/request/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    function _export(target, all3) {
      for (var name in all3)
        Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name],
        });
    }
    _export(exports, {
      isRequestAPICallableInsideAfter: function () {
        return isRequestAPICallableInsideAfter;
      },
      throwForSearchParamsAccessInUseCache: function () {
        return throwForSearchParamsAccessInUseCache;
      },
      throwWithStaticGenerationBailoutError: function () {
        return throwWithStaticGenerationBailoutError;
      },
      throwWithStaticGenerationBailoutErrorWithDynamicError: function () {
        return throwWithStaticGenerationBailoutErrorWithDynamicError;
      },
    });
    var _staticgenerationbailout = require_static_generation_bailout();
    var _aftertaskasyncstorageexternal =
      require_after_task_async_storage_external();
    function throwWithStaticGenerationBailoutError(route, expression) {
      throw Object.defineProperty(
        new _staticgenerationbailout.StaticGenBailoutError(
          `Route ${route} couldn't be rendered statically because it used ${expression}. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`,
        ),
        "__NEXT_ERROR_CODE",
        {
          value: "E576",
          enumerable: false,
          configurable: true,
        },
      );
    }
    function throwWithStaticGenerationBailoutErrorWithDynamicError(
      route,
      expression,
    ) {
      throw Object.defineProperty(
        new _staticgenerationbailout.StaticGenBailoutError(
          `Route ${route} with \`dynamic = "error"\` couldn't be rendered statically because it used ${expression}. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`,
        ),
        "__NEXT_ERROR_CODE",
        {
          value: "E543",
          enumerable: false,
          configurable: true,
        },
      );
    }
    function throwForSearchParamsAccessInUseCache(route) {
      throw Object.defineProperty(
        new Error(
          `Route ${route} used "searchParams" inside "use cache". Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use "searchParams" outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`,
        ),
        "__NEXT_ERROR_CODE",
        {
          value: "E634",
          enumerable: false,
          configurable: true,
        },
      );
    }
    function isRequestAPICallableInsideAfter() {
      const afterTaskStore =
        _aftertaskasyncstorageexternal.afterTaskAsyncStorage.getStore();
      return (
        (afterTaskStore == null
          ? void 0
          : afterTaskStore.rootTaskSpawnPhase) === "action"
      );
    }
  },
});

// ../../../../node_modules/next/dist/server/request/connection.js
var require_connection = __commonJS({
  "../../../../node_modules/next/dist/server/request/connection.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "connection", {
      enumerable: true,
      get: function () {
        return connection;
      },
    });
    var _workasyncstorageexternal = require_work_async_storage_external();
    var _workunitasyncstorageexternal =
      require_work_unit_async_storage_external();
    var _dynamicrendering = require_dynamic_rendering();
    var _staticgenerationbailout = require_static_generation_bailout();
    var _dynamicrenderingutils = require_dynamic_rendering_utils();
    var _utils = require_utils2();
    function connection() {
      const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
      const workUnitStore =
        _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
      if (workStore) {
        if (
          workUnitStore &&
          workUnitStore.phase === "after" &&
          !(0, _utils.isRequestAPICallableInsideAfter)()
        ) {
          throw Object.defineProperty(
            new Error(
              `Route ${workStore.route} used "connection" inside "after(...)". The \`connection()\` function is used to indicate the subsequent code must only run when there is an actual Request, but "after(...)" executes after the request, so this function is not allowed in this scope. See more info here: https://nextjs.org/docs/canary/app/api-reference/functions/after`,
            ),
            "__NEXT_ERROR_CODE",
            {
              value: "E186",
              enumerable: false,
              configurable: true,
            },
          );
        }
        if (workStore.forceStatic) {
          return Promise.resolve(void 0);
        }
        if (workUnitStore) {
          if (workUnitStore.type === "cache") {
            throw Object.defineProperty(
              new Error(
                `Route ${workStore.route} used "connection" inside "use cache". The \`connection()\` function is used to indicate the subsequent code must only run when there is an actual Request, but caches must be able to be produced before a Request so this function is not allowed in this scope. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`,
              ),
              "__NEXT_ERROR_CODE",
              {
                value: "E111",
                enumerable: false,
                configurable: true,
              },
            );
          } else if (workUnitStore.type === "unstable-cache") {
            throw Object.defineProperty(
              new Error(
                `Route ${workStore.route} used "connection" inside a function cached with "unstable_cache(...)". The \`connection()\` function is used to indicate the subsequent code must only run when there is an actual Request, but caches must be able to be produced before a Request so this function is not allowed in this scope. See more info here: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`,
              ),
              "__NEXT_ERROR_CODE",
              {
                value: "E1",
                enumerable: false,
                configurable: true,
              },
            );
          }
        }
        if (workStore.dynamicShouldError) {
          throw Object.defineProperty(
            new _staticgenerationbailout.StaticGenBailoutError(
              `Route ${workStore.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`connection\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`,
            ),
            "__NEXT_ERROR_CODE",
            {
              value: "E562",
              enumerable: false,
              configurable: true,
            },
          );
        }
        if (workUnitStore) {
          if (workUnitStore.type === "prerender") {
            return (0, _dynamicrenderingutils.makeHangingPromise)(
              workUnitStore.renderSignal,
              "`connection()`",
            );
          } else if (workUnitStore.type === "prerender-ppr") {
            (0, _dynamicrendering.postponeWithTracking)(
              workStore.route,
              "connection",
              workUnitStore.dynamicTracking,
            );
          } else if (workUnitStore.type === "prerender-legacy") {
            (0, _dynamicrendering.throwToInterruptStaticGeneration)(
              "connection",
              workStore,
              workUnitStore,
            );
          }
        }
        (0, _dynamicrendering.trackDynamicDataInDynamicRender)(
          workStore,
          workUnitStore,
        );
      }
      return Promise.resolve(void 0);
    }
  },
});

// ../../../../node_modules/next/dist/shared/lib/invariant-error.js
var require_invariant_error = __commonJS({
  "../../../../node_modules/next/dist/shared/lib/invariant-error.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "InvariantError", {
      enumerable: true,
      get: function () {
        return InvariantError;
      },
    });
    var InvariantError = class extends Error {
      constructor(message2, options) {
        super(
          "Invariant: " +
            (message2.endsWith(".") ? message2 : message2 + ".") +
            " This is a bug in Next.js.",
          options,
        );
        this.name = "InvariantError";
      }
    };
  },
});

// ../../../../node_modules/next/dist/shared/lib/utils/reflect-utils.js
var require_reflect_utils = __commonJS({
  "../../../../node_modules/next/dist/shared/lib/utils/reflect-utils.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    function _export(target, all3) {
      for (var name in all3)
        Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name],
        });
    }
    _export(exports, {
      describeHasCheckingStringProperty: function () {
        return describeHasCheckingStringProperty;
      },
      describeStringPropertyAccess: function () {
        return describeStringPropertyAccess;
      },
      wellKnownProperties: function () {
        return wellKnownProperties;
      },
    });
    var isDefinitelyAValidIdentifier = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
    function describeStringPropertyAccess(target, prop) {
      if (isDefinitelyAValidIdentifier.test(prop)) {
        return "`" + target + "." + prop + "`";
      }
      return "`" + target + "[" + JSON.stringify(prop) + "]`";
    }
    function describeHasCheckingStringProperty(target, prop) {
      const stringifiedProp = JSON.stringify(prop);
      return (
        "`Reflect.has(" +
        target +
        ", " +
        stringifiedProp +
        ")`, `" +
        stringifiedProp +
        " in " +
        target +
        "`, or similar"
      );
    }
    var wellKnownProperties = /* @__PURE__ */ new Set([
      "hasOwnProperty",
      "isPrototypeOf",
      "propertyIsEnumerable",
      "toString",
      "valueOf",
      "toLocaleString",
      // Promise prototype
      // fallthrough
      "then",
      "catch",
      "finally",
      // React Promise extension
      // fallthrough
      "status",
      // React introspection
      "displayName",
      // Common tested properties
      // fallthrough
      "toJSON",
      "$$typeof",
      "__esModule",
    ]);
  },
});

// ../../../../node_modules/next/dist/server/request/root-params.js
var require_root_params = __commonJS({
  "../../../../node_modules/next/dist/server/request/root-params.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "unstable_rootParams", {
      enumerable: true,
      get: function () {
        return unstable_rootParams;
      },
    });
    var _invarianterror = require_invariant_error();
    var _dynamicrendering = require_dynamic_rendering();
    var _workasyncstorageexternal = require_work_async_storage_external();
    var _workunitasyncstorageexternal =
      require_work_unit_async_storage_external();
    var _dynamicrenderingutils = require_dynamic_rendering_utils();
    var _reflectutils = require_reflect_utils();
    var CachedParams = /* @__PURE__ */ new WeakMap();
    async function unstable_rootParams() {
      const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
      if (!workStore) {
        throw Object.defineProperty(
          new _invarianterror.InvariantError(
            "Missing workStore in unstable_rootParams",
          ),
          "__NEXT_ERROR_CODE",
          {
            value: "E615",
            enumerable: false,
            configurable: true,
          },
        );
      }
      const workUnitStore =
        _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
      if (!workUnitStore) {
        throw Object.defineProperty(
          new Error(
            `Route ${workStore.route} used \`unstable_rootParams()\` in Pages Router. This API is only available within App Router.`,
          ),
          "__NEXT_ERROR_CODE",
          {
            value: "E641",
            enumerable: false,
            configurable: true,
          },
        );
      }
      switch (workUnitStore.type) {
        case "unstable-cache":
        case "cache": {
          throw Object.defineProperty(
            new Error(
              `Route ${workStore.route} used \`unstable_rootParams()\` inside \`"use cache"\` or \`unstable_cache\`. Support for this API inside cache scopes is planned for a future version of Next.js.`,
            ),
            "__NEXT_ERROR_CODE",
            {
              value: "E642",
              enumerable: false,
              configurable: true,
            },
          );
        }
        case "prerender":
        case "prerender-ppr":
        case "prerender-legacy":
          return createPrerenderRootParams(
            workUnitStore.rootParams,
            workStore,
            workUnitStore,
          );
        default:
          return Promise.resolve(workUnitStore.rootParams);
      }
    }
    function createPrerenderRootParams(
      underlyingParams,
      workStore,
      prerenderStore,
    ) {
      const fallbackParams = workStore.fallbackRouteParams;
      if (fallbackParams) {
        let hasSomeFallbackParams = false;
        for (const key in underlyingParams) {
          if (fallbackParams.has(key)) {
            hasSomeFallbackParams = true;
            break;
          }
        }
        if (hasSomeFallbackParams) {
          if (prerenderStore.type === "prerender") {
            const cachedParams = CachedParams.get(underlyingParams);
            if (cachedParams) {
              return cachedParams;
            }
            const promise = (0, _dynamicrenderingutils.makeHangingPromise)(
              prerenderStore.renderSignal,
              "`unstable_rootParams`",
            );
            CachedParams.set(underlyingParams, promise);
            return promise;
          }
          return makeErroringRootParams(
            underlyingParams,
            fallbackParams,
            workStore,
            prerenderStore,
          );
        }
      }
      return Promise.resolve(underlyingParams);
    }
    function makeErroringRootParams(
      underlyingParams,
      fallbackParams,
      workStore,
      prerenderStore,
    ) {
      const cachedParams = CachedParams.get(underlyingParams);
      if (cachedParams) {
        return cachedParams;
      }
      const augmentedUnderlying = {
        ...underlyingParams,
      };
      const promise = Promise.resolve(augmentedUnderlying);
      CachedParams.set(underlyingParams, promise);
      Object.keys(underlyingParams).forEach((prop) => {
        if (_reflectutils.wellKnownProperties.has(prop)) {
        } else {
          if (fallbackParams.has(prop)) {
            Object.defineProperty(augmentedUnderlying, prop, {
              get() {
                const expression = (0,
                _reflectutils.describeStringPropertyAccess)(
                  "unstable_rootParams",
                  prop,
                );
                if (prerenderStore.type === "prerender-ppr") {
                  (0, _dynamicrendering.postponeWithTracking)(
                    workStore.route,
                    expression,
                    prerenderStore.dynamicTracking,
                  );
                } else {
                  (0, _dynamicrendering.throwToInterruptStaticGeneration)(
                    expression,
                    workStore,
                    prerenderStore,
                  );
                }
              },
              enumerable: true,
            });
          } else {
            promise[prop] = underlyingParams[prop];
          }
        }
      });
      return promise;
    }
  },
});

// ../../../../node_modules/next/server.js
var require_server = __commonJS({
  "../../../../node_modules/next/server.js"(exports, module) {
    var serverExports = {
      NextRequest: require_request().NextRequest,
      NextResponse: require_response().NextResponse,
      ImageResponse: require_image_response().ImageResponse,
      userAgentFromString: require_user_agent().userAgentFromString,
      userAgent: require_user_agent().userAgent,
      URLPattern: require_url_pattern().URLPattern,
      after: require_after2().after,
      connection: require_connection().connection,
      unstable_rootParams: require_root_params().unstable_rootParams,
    };
    module.exports = serverExports;
    exports.NextRequest = serverExports.NextRequest;
    exports.NextResponse = serverExports.NextResponse;
    exports.ImageResponse = serverExports.ImageResponse;
    exports.userAgentFromString = serverExports.userAgentFromString;
    exports.userAgent = serverExports.userAgent;
    exports.URLPattern = serverExports.URLPattern;
    exports.after = serverExports.after;
    exports.connection = serverExports.connection;
    exports.unstable_rootParams = serverExports.unstable_rootParams;
  },
});

// ../../../../node_modules/next/dist/server/web/spec-extension/adapters/request-cookies.js
var require_request_cookies = __commonJS({
  "../../../../node_modules/next/dist/server/web/spec-extension/adapters/request-cookies.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    function _export(target, all3) {
      for (var name in all3)
        Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name],
        });
    }
    _export(exports, {
      MutableRequestCookiesAdapter: function () {
        return MutableRequestCookiesAdapter;
      },
      ReadonlyRequestCookiesError: function () {
        return ReadonlyRequestCookiesError;
      },
      RequestCookiesAdapter: function () {
        return RequestCookiesAdapter;
      },
      appendMutableCookies: function () {
        return appendMutableCookies;
      },
      areCookiesMutableInCurrentPhase: function () {
        return areCookiesMutableInCurrentPhase;
      },
      getModifiedCookieValues: function () {
        return getModifiedCookieValues;
      },
      responseCookiesToRequestCookies: function () {
        return responseCookiesToRequestCookies;
      },
      wrapWithMutableAccessCheck: function () {
        return wrapWithMutableAccessCheck;
      },
    });
    var _cookies = require_cookies2();
    var _reflect = require_reflect();
    var _workasyncstorageexternal = require_work_async_storage_external();
    var _workunitasyncstorageexternal =
      require_work_unit_async_storage_external();
    var ReadonlyRequestCookiesError = class extends Error {
      constructor() {
        super(
          "Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#options",
        );
      }
      static callable() {
        throw new ReadonlyRequestCookiesError();
      }
    };
    var RequestCookiesAdapter = class {
      static seal(cookies2) {
        return new Proxy(cookies2, {
          get(target, prop, receiver) {
            switch (prop) {
              case "clear":
              case "delete":
              case "set":
                return ReadonlyRequestCookiesError.callable;
              default:
                return _reflect.ReflectAdapter.get(target, prop, receiver);
            }
          },
        });
      }
    };
    var SYMBOL_MODIFY_COOKIE_VALUES = Symbol.for("next.mutated.cookies");
    function getModifiedCookieValues(cookies2) {
      const modified = cookies2[SYMBOL_MODIFY_COOKIE_VALUES];
      if (!modified || !Array.isArray(modified) || modified.length === 0) {
        return [];
      }
      return modified;
    }
    function appendMutableCookies(headers2, mutableCookies) {
      const modifiedCookieValues = getModifiedCookieValues(mutableCookies);
      if (modifiedCookieValues.length === 0) {
        return false;
      }
      const resCookies = new _cookies.ResponseCookies(headers2);
      const returnedCookies = resCookies.getAll();
      for (const cookie of modifiedCookieValues) {
        resCookies.set(cookie);
      }
      for (const cookie of returnedCookies) {
        resCookies.set(cookie);
      }
      return true;
    }
    var MutableRequestCookiesAdapter = class {
      static wrap(cookies2, onUpdateCookies) {
        const responseCookies = new _cookies.ResponseCookies(new Headers());
        for (const cookie of cookies2.getAll()) {
          responseCookies.set(cookie);
        }
        let modifiedValues = [];
        const modifiedCookies = /* @__PURE__ */ new Set();
        const updateResponseCookies = () => {
          const workStore =
            _workasyncstorageexternal.workAsyncStorage.getStore();
          if (workStore) {
            workStore.pathWasRevalidated = true;
          }
          const allCookies = responseCookies.getAll();
          modifiedValues = allCookies.filter((c3) =>
            modifiedCookies.has(c3.name),
          );
          if (onUpdateCookies) {
            const serializedCookies = [];
            for (const cookie of modifiedValues) {
              const tempCookies = new _cookies.ResponseCookies(new Headers());
              tempCookies.set(cookie);
              serializedCookies.push(tempCookies.toString());
            }
            onUpdateCookies(serializedCookies);
          }
        };
        const wrappedCookies = new Proxy(responseCookies, {
          get(target, prop, receiver) {
            switch (prop) {
              case SYMBOL_MODIFY_COOKIE_VALUES:
                return modifiedValues;
              case "delete":
                return function (...args) {
                  modifiedCookies.add(
                    typeof args[0] === "string" ? args[0] : args[0].name,
                  );
                  try {
                    target.delete(...args);
                    return wrappedCookies;
                  } finally {
                    updateResponseCookies();
                  }
                };
              case "set":
                return function (...args) {
                  modifiedCookies.add(
                    typeof args[0] === "string" ? args[0] : args[0].name,
                  );
                  try {
                    target.set(...args);
                    return wrappedCookies;
                  } finally {
                    updateResponseCookies();
                  }
                };
              default:
                return _reflect.ReflectAdapter.get(target, prop, receiver);
            }
          },
        });
        return wrappedCookies;
      }
    };
    function wrapWithMutableAccessCheck(responseCookies) {
      const wrappedCookies = new Proxy(responseCookies, {
        get(target, prop, receiver) {
          switch (prop) {
            case "delete":
              return function (...args) {
                ensureCookiesAreStillMutable("cookies().delete");
                target.delete(...args);
                return wrappedCookies;
              };
            case "set":
              return function (...args) {
                ensureCookiesAreStillMutable("cookies().set");
                target.set(...args);
                return wrappedCookies;
              };
            default:
              return _reflect.ReflectAdapter.get(target, prop, receiver);
          }
        },
      });
      return wrappedCookies;
    }
    function areCookiesMutableInCurrentPhase(requestStore) {
      return requestStore.phase === "action";
    }
    function ensureCookiesAreStillMutable(callingExpression) {
      const requestStore = (0,
      _workunitasyncstorageexternal.getExpectedRequestStore)(callingExpression);
      if (!areCookiesMutableInCurrentPhase(requestStore)) {
        throw new ReadonlyRequestCookiesError();
      }
    }
    function responseCookiesToRequestCookies(responseCookies) {
      const requestCookies = new _cookies.RequestCookies(new Headers());
      for (const cookie of responseCookies.getAll()) {
        requestCookies.set(cookie);
      }
      return requestCookies;
    }
  },
});

// ../../../../node_modules/next/dist/server/create-deduped-by-callsite-server-error-logger.js
var require_create_deduped_by_callsite_server_error_logger = __commonJS({
  "../../../../node_modules/next/dist/server/create-deduped-by-callsite-server-error-logger.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(
      exports,
      "createDedupedByCallsiteServerErrorLoggerDev",
      {
        enumerable: true,
        get: function () {
          return createDedupedByCallsiteServerErrorLoggerDev;
        },
      },
    );
    var _react = /* @__PURE__ */ _interop_require_wildcard(__require("react"));
    function _getRequireWildcardCache(nodeInterop) {
      if (typeof WeakMap !== "function") return null;
      var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
      var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
      return (_getRequireWildcardCache = function (nodeInterop2) {
        return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
      })(nodeInterop);
    }
    function _interop_require_wildcard(obj, nodeInterop) {
      if (!nodeInterop && obj && obj.__esModule) {
        return obj;
      }
      if (
        obj === null ||
        (typeof obj !== "object" && typeof obj !== "function")
      ) {
        return {
          default: obj,
        };
      }
      var cache3 = _getRequireWildcardCache(nodeInterop);
      if (cache3 && cache3.has(obj)) {
        return cache3.get(obj);
      }
      var newObj = {
        __proto__: null,
      };
      var hasPropertyDescriptor =
        Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var key in obj) {
        if (
          key !== "default" &&
          Object.prototype.hasOwnProperty.call(obj, key)
        ) {
          var desc = hasPropertyDescriptor
            ? Object.getOwnPropertyDescriptor(obj, key)
            : null;
          if (desc && (desc.get || desc.set)) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
      newObj.default = obj;
      if (cache3) {
        cache3.set(obj, newObj);
      }
      return newObj;
    }
    var errorRef = {
      current: null,
    };
    var cache2 = typeof _react.cache === "function" ? _react.cache : (fn) => fn;
    var logErrorOrWarn = process.env.__NEXT_DYNAMIC_IO
      ? console.error
      : console.warn;
    var flushCurrentErrorIfNew = cache2(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- cache key
      (key) => {
        try {
          logErrorOrWarn(errorRef.current);
        } finally {
          errorRef.current = null;
        }
      },
    );
    function createDedupedByCallsiteServerErrorLoggerDev(getMessage) {
      return function logDedupedError(...args) {
        const message2 = getMessage(...args);
        if (true) {
          var _stack;
          const callStackFrames =
            (_stack = new Error().stack) == null ? void 0 : _stack.split("\n");
          if (callStackFrames === void 0 || callStackFrames.length < 4) {
            logErrorOrWarn(message2);
          } else {
            const key = callStackFrames[4];
            errorRef.current = message2;
            flushCurrentErrorIfNew(key);
          }
        } else {
          logErrorOrWarn(message2);
        }
      };
    }
  },
});

// ../../../../node_modules/next/dist/server/request/cookies.js
var require_cookies3 = __commonJS({
  "../../../../node_modules/next/dist/server/request/cookies.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "cookies", {
      enumerable: true,
      get: function () {
        return cookies2;
      },
    });
    var _requestcookies = require_request_cookies();
    var _cookies = require_cookies2();
    var _workasyncstorageexternal = require_work_async_storage_external();
    var _workunitasyncstorageexternal =
      require_work_unit_async_storage_external();
    var _dynamicrendering = require_dynamic_rendering();
    var _staticgenerationbailout = require_static_generation_bailout();
    var _dynamicrenderingutils = require_dynamic_rendering_utils();
    var _creatededupedbycallsiteservererrorlogger =
      require_create_deduped_by_callsite_server_error_logger();
    var _scheduler = require_scheduler();
    var _utils = require_utils2();
    function cookies2() {
      const callingExpression = "cookies";
      const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
      const workUnitStore =
        _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
      if (workStore) {
        if (
          workUnitStore &&
          workUnitStore.phase === "after" &&
          !(0, _utils.isRequestAPICallableInsideAfter)()
        ) {
          throw Object.defineProperty(
            new Error(
              // TODO(after): clarify that this only applies to pages?
              `Route ${workStore.route} used "cookies" inside "after(...)". This is not supported. If you need this data inside an "after" callback, use "cookies" outside of the callback. See more info here: https://nextjs.org/docs/canary/app/api-reference/functions/after`,
            ),
            "__NEXT_ERROR_CODE",
            {
              value: "E88",
              enumerable: false,
              configurable: true,
            },
          );
        }
        if (workStore.forceStatic) {
          const underlyingCookies2 = createEmptyCookies();
          return makeUntrackedExoticCookies(underlyingCookies2);
        }
        if (workUnitStore) {
          if (workUnitStore.type === "cache") {
            throw Object.defineProperty(
              new Error(
                `Route ${workStore.route} used "cookies" inside "use cache". Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use "cookies" outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`,
              ),
              "__NEXT_ERROR_CODE",
              {
                value: "E398",
                enumerable: false,
                configurable: true,
              },
            );
          } else if (workUnitStore.type === "unstable-cache") {
            throw Object.defineProperty(
              new Error(
                `Route ${workStore.route} used "cookies" inside a function cached with "unstable_cache(...)". Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use "cookies" outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`,
              ),
              "__NEXT_ERROR_CODE",
              {
                value: "E157",
                enumerable: false,
                configurable: true,
              },
            );
          }
        }
        if (workStore.dynamicShouldError) {
          throw Object.defineProperty(
            new _staticgenerationbailout.StaticGenBailoutError(
              `Route ${workStore.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`cookies\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`,
            ),
            "__NEXT_ERROR_CODE",
            {
              value: "E549",
              enumerable: false,
              configurable: true,
            },
          );
        }
        if (workUnitStore) {
          if (workUnitStore.type === "prerender") {
            return makeDynamicallyTrackedExoticCookies(
              workStore.route,
              workUnitStore,
            );
          } else if (workUnitStore.type === "prerender-ppr") {
            (0, _dynamicrendering.postponeWithTracking)(
              workStore.route,
              callingExpression,
              workUnitStore.dynamicTracking,
            );
          } else if (workUnitStore.type === "prerender-legacy") {
            (0, _dynamicrendering.throwToInterruptStaticGeneration)(
              callingExpression,
              workStore,
              workUnitStore,
            );
          }
        }
        (0, _dynamicrendering.trackDynamicDataInDynamicRender)(
          workStore,
          workUnitStore,
        );
      }
      const requestStore = (0,
      _workunitasyncstorageexternal.getExpectedRequestStore)(callingExpression);
      let underlyingCookies;
      if ((0, _requestcookies.areCookiesMutableInCurrentPhase)(requestStore)) {
        underlyingCookies = requestStore.userspaceMutableCookies;
      } else {
        underlyingCookies = requestStore.cookies;
      }
      if (!(workStore == null ? void 0 : workStore.isPrefetchRequest)) {
        return makeUntrackedExoticCookiesWithDevWarnings(
          underlyingCookies,
          workStore == null ? void 0 : workStore.route,
        );
      } else {
        return makeUntrackedExoticCookies(underlyingCookies);
      }
    }
    function createEmptyCookies() {
      return _requestcookies.RequestCookiesAdapter.seal(
        new _cookies.RequestCookies(new Headers({})),
      );
    }
    var CachedCookies = /* @__PURE__ */ new WeakMap();
    function makeDynamicallyTrackedExoticCookies(route, prerenderStore) {
      const cachedPromise = CachedCookies.get(prerenderStore);
      if (cachedPromise) {
        return cachedPromise;
      }
      const promise = (0, _dynamicrenderingutils.makeHangingPromise)(
        prerenderStore.renderSignal,
        "`cookies()`",
      );
      CachedCookies.set(prerenderStore, promise);
      Object.defineProperties(promise, {
        [Symbol.iterator]: {
          value: function () {
            const expression = "`cookies()[Symbol.iterator]()`";
            const error = createCookiesAccessError(route, expression);
            (0, _dynamicrendering.abortAndThrowOnSynchronousRequestDataAccess)(
              route,
              expression,
              error,
              prerenderStore,
            );
          },
        },
        size: {
          get() {
            const expression = "`cookies().size`";
            const error = createCookiesAccessError(route, expression);
            (0, _dynamicrendering.abortAndThrowOnSynchronousRequestDataAccess)(
              route,
              expression,
              error,
              prerenderStore,
            );
          },
        },
        get: {
          value: function get() {
            let expression;
            if (arguments.length === 0) {
              expression = "`cookies().get()`";
            } else {
              expression = `\`cookies().get(${describeNameArg(arguments[0])})\``;
            }
            const error = createCookiesAccessError(route, expression);
            (0, _dynamicrendering.abortAndThrowOnSynchronousRequestDataAccess)(
              route,
              expression,
              error,
              prerenderStore,
            );
          },
        },
        getAll: {
          value: function getAll() {
            let expression;
            if (arguments.length === 0) {
              expression = "`cookies().getAll()`";
            } else {
              expression = `\`cookies().getAll(${describeNameArg(arguments[0])})\``;
            }
            const error = createCookiesAccessError(route, expression);
            (0, _dynamicrendering.abortAndThrowOnSynchronousRequestDataAccess)(
              route,
              expression,
              error,
              prerenderStore,
            );
          },
        },
        has: {
          value: function has() {
            let expression;
            if (arguments.length === 0) {
              expression = "`cookies().has()`";
            } else {
              expression = `\`cookies().has(${describeNameArg(arguments[0])})\``;
            }
            const error = createCookiesAccessError(route, expression);
            (0, _dynamicrendering.abortAndThrowOnSynchronousRequestDataAccess)(
              route,
              expression,
              error,
              prerenderStore,
            );
          },
        },
        set: {
          value: function set() {
            let expression;
            if (arguments.length === 0) {
              expression = "`cookies().set()`";
            } else {
              const arg = arguments[0];
              if (arg) {
                expression = `\`cookies().set(${describeNameArg(arg)}, ...)\``;
              } else {
                expression = "`cookies().set(...)`";
              }
            }
            const error = createCookiesAccessError(route, expression);
            (0, _dynamicrendering.abortAndThrowOnSynchronousRequestDataAccess)(
              route,
              expression,
              error,
              prerenderStore,
            );
          },
        },
        delete: {
          value: function () {
            let expression;
            if (arguments.length === 0) {
              expression = "`cookies().delete()`";
            } else if (arguments.length === 1) {
              expression = `\`cookies().delete(${describeNameArg(arguments[0])})\``;
            } else {
              expression = `\`cookies().delete(${describeNameArg(arguments[0])}, ...)\``;
            }
            const error = createCookiesAccessError(route, expression);
            (0, _dynamicrendering.abortAndThrowOnSynchronousRequestDataAccess)(
              route,
              expression,
              error,
              prerenderStore,
            );
          },
        },
        clear: {
          value: function clear() {
            const expression = "`cookies().clear()`";
            const error = createCookiesAccessError(route, expression);
            (0, _dynamicrendering.abortAndThrowOnSynchronousRequestDataAccess)(
              route,
              expression,
              error,
              prerenderStore,
            );
          },
        },
        toString: {
          value: function toString3() {
            const expression = "`cookies().toString()`";
            const error = createCookiesAccessError(route, expression);
            (0, _dynamicrendering.abortAndThrowOnSynchronousRequestDataAccess)(
              route,
              expression,
              error,
              prerenderStore,
            );
          },
        },
      });
      return promise;
    }
    function makeUntrackedExoticCookies(underlyingCookies) {
      const cachedCookies = CachedCookies.get(underlyingCookies);
      if (cachedCookies) {
        return cachedCookies;
      }
      const promise = Promise.resolve(underlyingCookies);
      CachedCookies.set(underlyingCookies, promise);
      Object.defineProperties(promise, {
        [Symbol.iterator]: {
          value: underlyingCookies[Symbol.iterator]
            ? underlyingCookies[Symbol.iterator].bind(underlyingCookies)
            : // We should remove this and unify our cookies types. We could just let this continue to throw lazily
              // but that's already a hard thing to debug so we may as well implement it consistently. The biggest problem with
              // implementing this in this way is the underlying cookie type is a ResponseCookie and not a RequestCookie and so it
              // has extra properties not available on RequestCookie instances.
              polyfilledResponseCookiesIterator.bind(underlyingCookies),
        },
        size: {
          get() {
            return underlyingCookies.size;
          },
        },
        get: {
          value: underlyingCookies.get.bind(underlyingCookies),
        },
        getAll: {
          value: underlyingCookies.getAll.bind(underlyingCookies),
        },
        has: {
          value: underlyingCookies.has.bind(underlyingCookies),
        },
        set: {
          value: underlyingCookies.set.bind(underlyingCookies),
        },
        delete: {
          value: underlyingCookies.delete.bind(underlyingCookies),
        },
        clear: {
          value:
            // @ts-expect-error clear is defined in RequestCookies implementation but not in the type
            typeof underlyingCookies.clear === "function"
              ? underlyingCookies.clear.bind(underlyingCookies)
              : // We should remove this and unify our cookies types. We could just let this continue to throw lazily
                // but that's already a hard thing to debug so we may as well implement it consistently. The biggest problem with
                // implementing this in this way is the underlying cookie type is a ResponseCookie and not a RequestCookie and so it
                // has extra properties not available on RequestCookie instances.
                polyfilledResponseCookiesClear.bind(underlyingCookies, promise),
        },
        toString: {
          value: underlyingCookies.toString.bind(underlyingCookies),
        },
      });
      return promise;
    }
    function makeUntrackedExoticCookiesWithDevWarnings(
      underlyingCookies,
      route,
    ) {
      const cachedCookies = CachedCookies.get(underlyingCookies);
      if (cachedCookies) {
        return cachedCookies;
      }
      const promise = new Promise((resolve) =>
        (0, _scheduler.scheduleImmediate)(() => resolve(underlyingCookies)),
      );
      CachedCookies.set(underlyingCookies, promise);
      Object.defineProperties(promise, {
        [Symbol.iterator]: {
          value: function () {
            const expression = "`...cookies()` or similar iteration";
            syncIODev(route, expression);
            return underlyingCookies[Symbol.iterator]
              ? underlyingCookies[Symbol.iterator].apply(
                  underlyingCookies,
                  arguments,
                )
              : // We should remove this and unify our cookies types. We could just let this continue to throw lazily
                // but that's already a hard thing to debug so we may as well implement it consistently. The biggest problem with
                // implementing this in this way is the underlying cookie type is a ResponseCookie and not a RequestCookie and so it
                // has extra properties not available on RequestCookie instances.
                polyfilledResponseCookiesIterator.call(underlyingCookies);
          },
          writable: false,
        },
        size: {
          get() {
            const expression = "`cookies().size`";
            syncIODev(route, expression);
            return underlyingCookies.size;
          },
        },
        get: {
          value: function get() {
            let expression;
            if (arguments.length === 0) {
              expression = "`cookies().get()`";
            } else {
              expression = `\`cookies().get(${describeNameArg(arguments[0])})\``;
            }
            syncIODev(route, expression);
            return underlyingCookies.get.apply(underlyingCookies, arguments);
          },
          writable: false,
        },
        getAll: {
          value: function getAll() {
            let expression;
            if (arguments.length === 0) {
              expression = "`cookies().getAll()`";
            } else {
              expression = `\`cookies().getAll(${describeNameArg(arguments[0])})\``;
            }
            syncIODev(route, expression);
            return underlyingCookies.getAll.apply(underlyingCookies, arguments);
          },
          writable: false,
        },
        has: {
          value: function get() {
            let expression;
            if (arguments.length === 0) {
              expression = "`cookies().has()`";
            } else {
              expression = `\`cookies().has(${describeNameArg(arguments[0])})\``;
            }
            syncIODev(route, expression);
            return underlyingCookies.has.apply(underlyingCookies, arguments);
          },
          writable: false,
        },
        set: {
          value: function set() {
            let expression;
            if (arguments.length === 0) {
              expression = "`cookies().set()`";
            } else {
              const arg = arguments[0];
              if (arg) {
                expression = `\`cookies().set(${describeNameArg(arg)}, ...)\``;
              } else {
                expression = "`cookies().set(...)`";
              }
            }
            syncIODev(route, expression);
            return underlyingCookies.set.apply(underlyingCookies, arguments);
          },
          writable: false,
        },
        delete: {
          value: function () {
            let expression;
            if (arguments.length === 0) {
              expression = "`cookies().delete()`";
            } else if (arguments.length === 1) {
              expression = `\`cookies().delete(${describeNameArg(arguments[0])})\``;
            } else {
              expression = `\`cookies().delete(${describeNameArg(arguments[0])}, ...)\``;
            }
            syncIODev(route, expression);
            return underlyingCookies.delete.apply(underlyingCookies, arguments);
          },
          writable: false,
        },
        clear: {
          value: function clear() {
            const expression = "`cookies().clear()`";
            syncIODev(route, expression);
            return typeof underlyingCookies.clear === "function"
              ? underlyingCookies.clear.apply(underlyingCookies, arguments)
              : // We should remove this and unify our cookies types. We could just let this continue to throw lazily
                // but that's already a hard thing to debug so we may as well implement it consistently. The biggest problem with
                // implementing this in this way is the underlying cookie type is a ResponseCookie and not a RequestCookie and so it
                // has extra properties not available on RequestCookie instances.
                polyfilledResponseCookiesClear.call(underlyingCookies, promise);
          },
          writable: false,
        },
        toString: {
          value: function toString3() {
            const expression = "`cookies().toString()` or implicit casting";
            syncIODev(route, expression);
            return underlyingCookies.toString.apply(
              underlyingCookies,
              arguments,
            );
          },
          writable: false,
        },
      });
      return promise;
    }
    function describeNameArg(arg) {
      return typeof arg === "object" &&
        arg !== null &&
        typeof arg.name === "string"
        ? `'${arg.name}'`
        : typeof arg === "string"
          ? `'${arg}'`
          : "...";
    }
    function syncIODev(route, expression) {
      const workUnitStore =
        _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
      if (
        workUnitStore &&
        workUnitStore.type === "request" &&
        workUnitStore.prerenderPhase === true
      ) {
        const requestStore = workUnitStore;
        (0, _dynamicrendering.trackSynchronousRequestDataAccessInDev)(
          requestStore,
        );
      }
      warnForSyncAccess(route, expression);
    }
    var warnForSyncAccess = (0,
    _creatededupedbycallsiteservererrorlogger.createDedupedByCallsiteServerErrorLoggerDev)(
      createCookiesAccessError,
    );
    function createCookiesAccessError(route, expression) {
      const prefix = route ? `Route "${route}" ` : "This route ";
      return Object.defineProperty(
        new Error(
          `${prefix}used ${expression}. \`cookies()\` should be awaited before using its value. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`,
        ),
        "__NEXT_ERROR_CODE",
        {
          value: "E223",
          enumerable: false,
          configurable: true,
        },
      );
    }
    function polyfilledResponseCookiesIterator() {
      return this.getAll()
        .map((c3) => [c3.name, c3])
        .values();
    }
    function polyfilledResponseCookiesClear(returnable) {
      for (const cookie of this.getAll()) {
        this.delete(cookie.name);
      }
      return returnable;
    }
  },
});

// ../../../../node_modules/next/dist/server/web/spec-extension/adapters/headers.js
var require_headers = __commonJS({
  "../../../../node_modules/next/dist/server/web/spec-extension/adapters/headers.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    function _export(target, all3) {
      for (var name in all3)
        Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name],
        });
    }
    _export(exports, {
      HeadersAdapter: function () {
        return HeadersAdapter;
      },
      ReadonlyHeadersError: function () {
        return ReadonlyHeadersError;
      },
    });
    var _reflect = require_reflect();
    var ReadonlyHeadersError = class extends Error {
      constructor() {
        super(
          "Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers",
        );
      }
      static callable() {
        throw new ReadonlyHeadersError();
      }
    };
    var HeadersAdapter = class extends Headers {
      constructor(headers2) {
        super();
        this.headers = new Proxy(headers2, {
          get(target, prop, receiver) {
            if (typeof prop === "symbol") {
              return _reflect.ReflectAdapter.get(target, prop, receiver);
            }
            const lowercased = prop.toLowerCase();
            const original = Object.keys(headers2).find(
              (o3) => o3.toLowerCase() === lowercased,
            );
            if (typeof original === "undefined") return;
            return _reflect.ReflectAdapter.get(target, original, receiver);
          },
          set(target, prop, value, receiver) {
            if (typeof prop === "symbol") {
              return _reflect.ReflectAdapter.set(target, prop, value, receiver);
            }
            const lowercased = prop.toLowerCase();
            const original = Object.keys(headers2).find(
              (o3) => o3.toLowerCase() === lowercased,
            );
            return _reflect.ReflectAdapter.set(
              target,
              original ?? prop,
              value,
              receiver,
            );
          },
          has(target, prop) {
            if (typeof prop === "symbol")
              return _reflect.ReflectAdapter.has(target, prop);
            const lowercased = prop.toLowerCase();
            const original = Object.keys(headers2).find(
              (o3) => o3.toLowerCase() === lowercased,
            );
            if (typeof original === "undefined") return false;
            return _reflect.ReflectAdapter.has(target, original);
          },
          deleteProperty(target, prop) {
            if (typeof prop === "symbol")
              return _reflect.ReflectAdapter.deleteProperty(target, prop);
            const lowercased = prop.toLowerCase();
            const original = Object.keys(headers2).find(
              (o3) => o3.toLowerCase() === lowercased,
            );
            if (typeof original === "undefined") return true;
            return _reflect.ReflectAdapter.deleteProperty(target, original);
          },
        });
      }
      /**
       * Seals a Headers instance to prevent modification by throwing an error when
       * any mutating method is called.
       */
      static seal(headers2) {
        return new Proxy(headers2, {
          get(target, prop, receiver) {
            switch (prop) {
              case "append":
              case "delete":
              case "set":
                return ReadonlyHeadersError.callable;
              default:
                return _reflect.ReflectAdapter.get(target, prop, receiver);
            }
          },
        });
      }
      /**
       * Merges a header value into a string. This stores multiple values as an
       * array, so we need to merge them into a string.
       *
       * @param value a header value
       * @returns a merged header value (a string)
       */
      merge(value) {
        if (Array.isArray(value)) return value.join(", ");
        return value;
      }
      /**
       * Creates a Headers instance from a plain object or a Headers instance.
       *
       * @param headers a plain object or a Headers instance
       * @returns a headers instance
       */
      static from(headers2) {
        if (headers2 instanceof Headers) return headers2;
        return new HeadersAdapter(headers2);
      }
      append(name, value) {
        const existing = this.headers[name];
        if (typeof existing === "string") {
          this.headers[name] = [existing, value];
        } else if (Array.isArray(existing)) {
          existing.push(value);
        } else {
          this.headers[name] = value;
        }
      }
      delete(name) {
        delete this.headers[name];
      }
      get(name) {
        const value = this.headers[name];
        if (typeof value !== "undefined") return this.merge(value);
        return null;
      }
      has(name) {
        return typeof this.headers[name] !== "undefined";
      }
      set(name, value) {
        this.headers[name] = value;
      }
      forEach(callbackfn, thisArg) {
        for (const [name, value] of this.entries()) {
          callbackfn.call(thisArg, value, name, this);
        }
      }
      *entries() {
        for (const key of Object.keys(this.headers)) {
          const name = key.toLowerCase();
          const value = this.get(name);
          yield [name, value];
        }
      }
      *keys() {
        for (const key of Object.keys(this.headers)) {
          const name = key.toLowerCase();
          yield name;
        }
      }
      *values() {
        for (const key of Object.keys(this.headers)) {
          const value = this.get(key);
          yield value;
        }
      }
      [Symbol.iterator]() {
        return this.entries();
      }
    };
  },
});

// ../../../../node_modules/next/dist/server/request/headers.js
var require_headers2 = __commonJS({
  "../../../../node_modules/next/dist/server/request/headers.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "headers", {
      enumerable: true,
      get: function () {
        return headers2;
      },
    });
    var _headers = require_headers();
    var _workasyncstorageexternal = require_work_async_storage_external();
    var _workunitasyncstorageexternal =
      require_work_unit_async_storage_external();
    var _dynamicrendering = require_dynamic_rendering();
    var _staticgenerationbailout = require_static_generation_bailout();
    var _dynamicrenderingutils = require_dynamic_rendering_utils();
    var _creatededupedbycallsiteservererrorlogger =
      require_create_deduped_by_callsite_server_error_logger();
    var _scheduler = require_scheduler();
    var _utils = require_utils2();
    function headers2() {
      const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
      const workUnitStore =
        _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
      if (workStore) {
        if (
          workUnitStore &&
          workUnitStore.phase === "after" &&
          !(0, _utils.isRequestAPICallableInsideAfter)()
        ) {
          throw Object.defineProperty(
            new Error(
              `Route ${workStore.route} used "headers" inside "after(...)". This is not supported. If you need this data inside an "after" callback, use "headers" outside of the callback. See more info here: https://nextjs.org/docs/canary/app/api-reference/functions/after`,
            ),
            "__NEXT_ERROR_CODE",
            {
              value: "E367",
              enumerable: false,
              configurable: true,
            },
          );
        }
        if (workStore.forceStatic) {
          const underlyingHeaders = _headers.HeadersAdapter.seal(
            new Headers({}),
          );
          return makeUntrackedExoticHeaders(underlyingHeaders);
        }
        if (workUnitStore) {
          if (workUnitStore.type === "cache") {
            throw Object.defineProperty(
              new Error(
                `Route ${workStore.route} used "headers" inside "use cache". Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use "headers" outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`,
              ),
              "__NEXT_ERROR_CODE",
              {
                value: "E304",
                enumerable: false,
                configurable: true,
              },
            );
          } else if (workUnitStore.type === "unstable-cache") {
            throw Object.defineProperty(
              new Error(
                `Route ${workStore.route} used "headers" inside a function cached with "unstable_cache(...)". Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use "headers" outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`,
              ),
              "__NEXT_ERROR_CODE",
              {
                value: "E127",
                enumerable: false,
                configurable: true,
              },
            );
          }
        }
        if (workStore.dynamicShouldError) {
          throw Object.defineProperty(
            new _staticgenerationbailout.StaticGenBailoutError(
              `Route ${workStore.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`headers\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`,
            ),
            "__NEXT_ERROR_CODE",
            {
              value: "E525",
              enumerable: false,
              configurable: true,
            },
          );
        }
        if (workUnitStore) {
          if (workUnitStore.type === "prerender") {
            return makeDynamicallyTrackedExoticHeaders(
              workStore.route,
              workUnitStore,
            );
          } else if (workUnitStore.type === "prerender-ppr") {
            (0, _dynamicrendering.postponeWithTracking)(
              workStore.route,
              "headers",
              workUnitStore.dynamicTracking,
            );
          } else if (workUnitStore.type === "prerender-legacy") {
            (0, _dynamicrendering.throwToInterruptStaticGeneration)(
              "headers",
              workStore,
              workUnitStore,
            );
          }
        }
        (0, _dynamicrendering.trackDynamicDataInDynamicRender)(
          workStore,
          workUnitStore,
        );
      }
      const requestStore = (0,
      _workunitasyncstorageexternal.getExpectedRequestStore)("headers");
      if (!(workStore == null ? void 0 : workStore.isPrefetchRequest)) {
        return makeUntrackedExoticHeadersWithDevWarnings(
          requestStore.headers,
          workStore == null ? void 0 : workStore.route,
        );
      } else {
        return makeUntrackedExoticHeaders(requestStore.headers);
      }
    }
    var CachedHeaders = /* @__PURE__ */ new WeakMap();
    function makeDynamicallyTrackedExoticHeaders(route, prerenderStore) {
      const cachedHeaders = CachedHeaders.get(prerenderStore);
      if (cachedHeaders) {
        return cachedHeaders;
      }
      const promise = (0, _dynamicrenderingutils.makeHangingPromise)(
        prerenderStore.renderSignal,
        "`headers()`",
      );
      CachedHeaders.set(prerenderStore, promise);
      Object.defineProperties(promise, {
        append: {
          value: function append2() {
            const expression = `\`headers().append(${describeNameArg(arguments[0])}, ...)\``;
            const error = createHeadersAccessError(route, expression);
            (0, _dynamicrendering.abortAndThrowOnSynchronousRequestDataAccess)(
              route,
              expression,
              error,
              prerenderStore,
            );
          },
        },
        delete: {
          value: function _delete() {
            const expression = `\`headers().delete(${describeNameArg(arguments[0])})\``;
            const error = createHeadersAccessError(route, expression);
            (0, _dynamicrendering.abortAndThrowOnSynchronousRequestDataAccess)(
              route,
              expression,
              error,
              prerenderStore,
            );
          },
        },
        get: {
          value: function get() {
            const expression = `\`headers().get(${describeNameArg(arguments[0])})\``;
            const error = createHeadersAccessError(route, expression);
            (0, _dynamicrendering.abortAndThrowOnSynchronousRequestDataAccess)(
              route,
              expression,
              error,
              prerenderStore,
            );
          },
        },
        has: {
          value: function has() {
            const expression = `\`headers().has(${describeNameArg(arguments[0])})\``;
            const error = createHeadersAccessError(route, expression);
            (0, _dynamicrendering.abortAndThrowOnSynchronousRequestDataAccess)(
              route,
              expression,
              error,
              prerenderStore,
            );
          },
        },
        set: {
          value: function set() {
            const expression = `\`headers().set(${describeNameArg(arguments[0])}, ...)\``;
            const error = createHeadersAccessError(route, expression);
            (0, _dynamicrendering.abortAndThrowOnSynchronousRequestDataAccess)(
              route,
              expression,
              error,
              prerenderStore,
            );
          },
        },
        getSetCookie: {
          value: function getSetCookie() {
            const expression = "`headers().getSetCookie()`";
            const error = createHeadersAccessError(route, expression);
            (0, _dynamicrendering.abortAndThrowOnSynchronousRequestDataAccess)(
              route,
              expression,
              error,
              prerenderStore,
            );
          },
        },
        forEach: {
          value: function forEach2() {
            const expression = "`headers().forEach(...)`";
            const error = createHeadersAccessError(route, expression);
            (0, _dynamicrendering.abortAndThrowOnSynchronousRequestDataAccess)(
              route,
              expression,
              error,
              prerenderStore,
            );
          },
        },
        keys: {
          value: function keys() {
            const expression = "`headers().keys()`";
            const error = createHeadersAccessError(route, expression);
            (0, _dynamicrendering.abortAndThrowOnSynchronousRequestDataAccess)(
              route,
              expression,
              error,
              prerenderStore,
            );
          },
        },
        values: {
          value: function values() {
            const expression = "`headers().values()`";
            const error = createHeadersAccessError(route, expression);
            (0, _dynamicrendering.abortAndThrowOnSynchronousRequestDataAccess)(
              route,
              expression,
              error,
              prerenderStore,
            );
          },
        },
        entries: {
          value: function entries() {
            const expression = "`headers().entries()`";
            const error = createHeadersAccessError(route, expression);
            (0, _dynamicrendering.abortAndThrowOnSynchronousRequestDataAccess)(
              route,
              expression,
              error,
              prerenderStore,
            );
          },
        },
        [Symbol.iterator]: {
          value: function () {
            const expression = "`headers()[Symbol.iterator]()`";
            const error = createHeadersAccessError(route, expression);
            (0, _dynamicrendering.abortAndThrowOnSynchronousRequestDataAccess)(
              route,
              expression,
              error,
              prerenderStore,
            );
          },
        },
      });
      return promise;
    }
    function makeUntrackedExoticHeaders(underlyingHeaders) {
      const cachedHeaders = CachedHeaders.get(underlyingHeaders);
      if (cachedHeaders) {
        return cachedHeaders;
      }
      const promise = Promise.resolve(underlyingHeaders);
      CachedHeaders.set(underlyingHeaders, promise);
      Object.defineProperties(promise, {
        append: {
          value: underlyingHeaders.append.bind(underlyingHeaders),
        },
        delete: {
          value: underlyingHeaders.delete.bind(underlyingHeaders),
        },
        get: {
          value: underlyingHeaders.get.bind(underlyingHeaders),
        },
        has: {
          value: underlyingHeaders.has.bind(underlyingHeaders),
        },
        set: {
          value: underlyingHeaders.set.bind(underlyingHeaders),
        },
        getSetCookie: {
          value: underlyingHeaders.getSetCookie.bind(underlyingHeaders),
        },
        forEach: {
          value: underlyingHeaders.forEach.bind(underlyingHeaders),
        },
        keys: {
          value: underlyingHeaders.keys.bind(underlyingHeaders),
        },
        values: {
          value: underlyingHeaders.values.bind(underlyingHeaders),
        },
        entries: {
          value: underlyingHeaders.entries.bind(underlyingHeaders),
        },
        [Symbol.iterator]: {
          value: underlyingHeaders[Symbol.iterator].bind(underlyingHeaders),
        },
      });
      return promise;
    }
    function makeUntrackedExoticHeadersWithDevWarnings(
      underlyingHeaders,
      route,
    ) {
      const cachedHeaders = CachedHeaders.get(underlyingHeaders);
      if (cachedHeaders) {
        return cachedHeaders;
      }
      const promise = new Promise((resolve) =>
        (0, _scheduler.scheduleImmediate)(() => resolve(underlyingHeaders)),
      );
      CachedHeaders.set(underlyingHeaders, promise);
      Object.defineProperties(promise, {
        append: {
          value: function append2() {
            const expression = `\`headers().append(${describeNameArg(arguments[0])}, ...)\``;
            syncIODev(route, expression);
            return underlyingHeaders.append.apply(underlyingHeaders, arguments);
          },
        },
        delete: {
          value: function _delete() {
            const expression = `\`headers().delete(${describeNameArg(arguments[0])})\``;
            syncIODev(route, expression);
            return underlyingHeaders.delete.apply(underlyingHeaders, arguments);
          },
        },
        get: {
          value: function get() {
            const expression = `\`headers().get(${describeNameArg(arguments[0])})\``;
            syncIODev(route, expression);
            return underlyingHeaders.get.apply(underlyingHeaders, arguments);
          },
        },
        has: {
          value: function has() {
            const expression = `\`headers().has(${describeNameArg(arguments[0])})\``;
            syncIODev(route, expression);
            return underlyingHeaders.has.apply(underlyingHeaders, arguments);
          },
        },
        set: {
          value: function set() {
            const expression = `\`headers().set(${describeNameArg(arguments[0])}, ...)\``;
            syncIODev(route, expression);
            return underlyingHeaders.set.apply(underlyingHeaders, arguments);
          },
        },
        getSetCookie: {
          value: function getSetCookie() {
            const expression = "`headers().getSetCookie()`";
            syncIODev(route, expression);
            return underlyingHeaders.getSetCookie.apply(
              underlyingHeaders,
              arguments,
            );
          },
        },
        forEach: {
          value: function forEach2() {
            const expression = "`headers().forEach(...)`";
            syncIODev(route, expression);
            return underlyingHeaders.forEach.apply(
              underlyingHeaders,
              arguments,
            );
          },
        },
        keys: {
          value: function keys() {
            const expression = "`headers().keys()`";
            syncIODev(route, expression);
            return underlyingHeaders.keys.apply(underlyingHeaders, arguments);
          },
        },
        values: {
          value: function values() {
            const expression = "`headers().values()`";
            syncIODev(route, expression);
            return underlyingHeaders.values.apply(underlyingHeaders, arguments);
          },
        },
        entries: {
          value: function entries() {
            const expression = "`headers().entries()`";
            syncIODev(route, expression);
            return underlyingHeaders.entries.apply(
              underlyingHeaders,
              arguments,
            );
          },
        },
        [Symbol.iterator]: {
          value: function () {
            const expression = "`...headers()` or similar iteration";
            syncIODev(route, expression);
            return underlyingHeaders[Symbol.iterator].apply(
              underlyingHeaders,
              arguments,
            );
          },
        },
      });
      return promise;
    }
    function describeNameArg(arg) {
      return typeof arg === "string" ? `'${arg}'` : "...";
    }
    function syncIODev(route, expression) {
      const workUnitStore =
        _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
      if (
        workUnitStore &&
        workUnitStore.type === "request" &&
        workUnitStore.prerenderPhase === true
      ) {
        const requestStore = workUnitStore;
        (0, _dynamicrendering.trackSynchronousRequestDataAccessInDev)(
          requestStore,
        );
      }
      warnForSyncAccess(route, expression);
    }
    var warnForSyncAccess = (0,
    _creatededupedbycallsiteservererrorlogger.createDedupedByCallsiteServerErrorLoggerDev)(
      createHeadersAccessError,
    );
    function createHeadersAccessError(route, expression) {
      const prefix = route ? `Route "${route}" ` : "This route ";
      return Object.defineProperty(
        new Error(
          `${prefix}used ${expression}. \`headers()\` should be awaited before using its value. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`,
        ),
        "__NEXT_ERROR_CODE",
        {
          value: "E277",
          enumerable: false,
          configurable: true,
        },
      );
    }
  },
});

// ../../../../node_modules/next/dist/server/request/draft-mode.js
var require_draft_mode = __commonJS({
  "../../../../node_modules/next/dist/server/request/draft-mode.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "draftMode", {
      enumerable: true,
      get: function () {
        return draftMode;
      },
    });
    var _workunitasyncstorageexternal =
      require_work_unit_async_storage_external();
    var _workasyncstorageexternal = require_work_async_storage_external();
    var _dynamicrendering = require_dynamic_rendering();
    var _creatededupedbycallsiteservererrorlogger =
      require_create_deduped_by_callsite_server_error_logger();
    var _staticgenerationbailout = require_static_generation_bailout();
    var _hooksservercontext = require_hooks_server_context();
    function draftMode() {
      const callingExpression = "draftMode";
      const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
      const workUnitStore =
        _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
      if (workUnitStore) {
        if (
          workUnitStore.type === "cache" ||
          workUnitStore.type === "unstable-cache" ||
          workUnitStore.type === "prerender" ||
          workUnitStore.type === "prerender-ppr" ||
          workUnitStore.type === "prerender-legacy"
        ) {
          if (!(workStore == null ? void 0 : workStore.isPrefetchRequest)) {
            const route = workStore == null ? void 0 : workStore.route;
            return createExoticDraftModeWithDevWarnings(null, route);
          } else {
            return createExoticDraftMode(null);
          }
        }
      }
      const requestStore = (0,
      _workunitasyncstorageexternal.getExpectedRequestStore)(callingExpression);
      const cachedDraftMode = CachedDraftModes.get(requestStore.draftMode);
      if (cachedDraftMode) {
        return cachedDraftMode;
      }
      let promise;
      if (!(workStore == null ? void 0 : workStore.isPrefetchRequest)) {
        const route = workStore == null ? void 0 : workStore.route;
        promise = createExoticDraftModeWithDevWarnings(
          requestStore.draftMode,
          route,
        );
      } else {
        promise = createExoticDraftMode(requestStore.draftMode);
      }
      CachedDraftModes.set(requestStore.draftMode, promise);
      return promise;
    }
    var CachedDraftModes = /* @__PURE__ */ new WeakMap();
    function createExoticDraftMode(underlyingProvider) {
      const instance = new DraftMode(underlyingProvider);
      const promise = Promise.resolve(instance);
      Object.defineProperty(promise, "isEnabled", {
        get() {
          return instance.isEnabled;
        },
        set(newValue) {
          Object.defineProperty(promise, "isEnabled", {
            value: newValue,
            writable: true,
            enumerable: true,
          });
        },
        enumerable: true,
        configurable: true,
      });
      promise.enable = instance.enable.bind(instance);
      promise.disable = instance.disable.bind(instance);
      return promise;
    }
    function createExoticDraftModeWithDevWarnings(underlyingProvider, route) {
      const instance = new DraftMode(underlyingProvider);
      const promise = Promise.resolve(instance);
      Object.defineProperty(promise, "isEnabled", {
        get() {
          const expression = "`draftMode().isEnabled`";
          syncIODev(route, expression);
          return instance.isEnabled;
        },
        set(newValue) {
          Object.defineProperty(promise, "isEnabled", {
            value: newValue,
            writable: true,
            enumerable: true,
          });
        },
        enumerable: true,
        configurable: true,
      });
      Object.defineProperty(promise, "enable", {
        value: function get() {
          const expression = "`draftMode().enable()`";
          syncIODev(route, expression);
          return instance.enable.apply(instance, arguments);
        },
      });
      Object.defineProperty(promise, "disable", {
        value: function get() {
          const expression = "`draftMode().disable()`";
          syncIODev(route, expression);
          return instance.disable.apply(instance, arguments);
        },
      });
      return promise;
    }
    var DraftMode = class {
      constructor(provider) {
        this._provider = provider;
      }
      get isEnabled() {
        if (this._provider !== null) {
          return this._provider.isEnabled;
        }
        return false;
      }
      enable() {
        trackDynamicDraftMode("draftMode().enable()");
        if (this._provider !== null) {
          this._provider.enable();
        }
      }
      disable() {
        trackDynamicDraftMode("draftMode().disable()");
        if (this._provider !== null) {
          this._provider.disable();
        }
      }
    };
    function syncIODev(route, expression) {
      const workUnitStore =
        _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
      if (
        workUnitStore &&
        workUnitStore.type === "request" &&
        workUnitStore.prerenderPhase === true
      ) {
        const requestStore = workUnitStore;
        (0, _dynamicrendering.trackSynchronousRequestDataAccessInDev)(
          requestStore,
        );
      }
      warnForSyncAccess(route, expression);
    }
    var warnForSyncAccess = (0,
    _creatededupedbycallsiteservererrorlogger.createDedupedByCallsiteServerErrorLoggerDev)(
      createDraftModeAccessError,
    );
    function createDraftModeAccessError(route, expression) {
      const prefix = route ? `Route "${route}" ` : "This route ";
      return Object.defineProperty(
        new Error(
          `${prefix}used ${expression}. \`draftMode()\` should be awaited before using its value. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`,
        ),
        "__NEXT_ERROR_CODE",
        {
          value: "E377",
          enumerable: false,
          configurable: true,
        },
      );
    }
    function trackDynamicDraftMode(expression) {
      const store = _workasyncstorageexternal.workAsyncStorage.getStore();
      const workUnitStore =
        _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
      if (store) {
        if (workUnitStore) {
          if (workUnitStore.type === "cache") {
            throw Object.defineProperty(
              new Error(
                `Route ${store.route} used "${expression}" inside "use cache". The enabled status of draftMode can be read in caches but you must not enable or disable draftMode inside a cache. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`,
              ),
              "__NEXT_ERROR_CODE",
              {
                value: "E246",
                enumerable: false,
                configurable: true,
              },
            );
          } else if (workUnitStore.type === "unstable-cache") {
            throw Object.defineProperty(
              new Error(
                `Route ${store.route} used "${expression}" inside a function cached with "unstable_cache(...)". The enabled status of draftMode can be read in caches but you must not enable or disable draftMode inside a cache. See more info here: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`,
              ),
              "__NEXT_ERROR_CODE",
              {
                value: "E259",
                enumerable: false,
                configurable: true,
              },
            );
          } else if (workUnitStore.phase === "after") {
            throw Object.defineProperty(
              new Error(
                `Route ${store.route} used "${expression}" inside \`after\`. The enabled status of draftMode can be read inside \`after\` but you cannot enable or disable draftMode. See more info here: https://nextjs.org/docs/app/api-reference/functions/after`,
              ),
              "__NEXT_ERROR_CODE",
              {
                value: "E348",
                enumerable: false,
                configurable: true,
              },
            );
          }
        }
        if (store.dynamicShouldError) {
          throw Object.defineProperty(
            new _staticgenerationbailout.StaticGenBailoutError(
              `Route ${store.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`${expression}\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`,
            ),
            "__NEXT_ERROR_CODE",
            {
              value: "E553",
              enumerable: false,
              configurable: true,
            },
          );
        }
        if (workUnitStore) {
          if (workUnitStore.type === "prerender") {
            const error = Object.defineProperty(
              new Error(
                `Route ${store.route} used ${expression} without first calling \`await connection()\`. See more info here: https://nextjs.org/docs/messages/next-prerender-sync-headers`,
              ),
              "__NEXT_ERROR_CODE",
              {
                value: "E126",
                enumerable: false,
                configurable: true,
              },
            );
            (0, _dynamicrendering.abortAndThrowOnSynchronousRequestDataAccess)(
              store.route,
              expression,
              error,
              workUnitStore,
            );
          } else if (workUnitStore.type === "prerender-ppr") {
            (0, _dynamicrendering.postponeWithTracking)(
              store.route,
              expression,
              workUnitStore.dynamicTracking,
            );
          } else if (workUnitStore.type === "prerender-legacy") {
            workUnitStore.revalidate = 0;
            const err = Object.defineProperty(
              new _hooksservercontext.DynamicServerError(
                `Route ${store.route} couldn't be rendered statically because it used \`${expression}\`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error`,
              ),
              "__NEXT_ERROR_CODE",
              {
                value: "E558",
                enumerable: false,
                configurable: true,
              },
            );
            store.dynamicUsageDescription = expression;
            store.dynamicUsageStack = err.stack;
            throw err;
          } else if (workUnitStore && workUnitStore.type === "request") {
            workUnitStore.usedDynamic = true;
          }
        }
      }
    }
  },
});

// ../../../../node_modules/next/headers.js
var require_headers3 = __commonJS({
  "../../../../node_modules/next/headers.js"(exports, module) {
    module.exports.cookies = require_cookies3().cookies;
    module.exports.headers = require_headers2().headers;
    module.exports.draftMode = require_draft_mode().draftMode;
  },
});

// ../../../../node_modules/@swc/helpers/cjs/_interop_require_default.cjs
var require_interop_require_default = __commonJS({
  "../../../../node_modules/@swc/helpers/cjs/_interop_require_default.cjs"(
    exports,
  ) {
    "use strict";
    function _interop_require_default(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    exports._ = _interop_require_default;
  },
});

// ../../../../node_modules/next/dist/shared/lib/app-router-context.shared-runtime.js
var require_app_router_context_shared_runtime = __commonJS({
  "../../../../node_modules/next/dist/shared/lib/app-router-context.shared-runtime.js"(
    exports,
  ) {
    "use client";
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    function _export(target, all3) {
      for (var name in all3)
        Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name],
        });
    }
    _export(exports, {
      AppRouterContext: function () {
        return AppRouterContext;
      },
      GlobalLayoutRouterContext: function () {
        return GlobalLayoutRouterContext;
      },
      LayoutRouterContext: function () {
        return LayoutRouterContext;
      },
      MissingSlotContext: function () {
        return MissingSlotContext;
      },
      TemplateContext: function () {
        return TemplateContext;
      },
    });
    var _interop_require_default = require_interop_require_default();
    var _react = /* @__PURE__ */ _interop_require_default._(__require("react"));
    var AppRouterContext = _react.default.createContext(null);
    var LayoutRouterContext = _react.default.createContext(null);
    var GlobalLayoutRouterContext = _react.default.createContext(null);
    var TemplateContext = _react.default.createContext(null);
    if (true) {
      AppRouterContext.displayName = "AppRouterContext";
      LayoutRouterContext.displayName = "LayoutRouterContext";
      GlobalLayoutRouterContext.displayName = "GlobalLayoutRouterContext";
      TemplateContext.displayName = "TemplateContext";
    }
    var MissingSlotContext = _react.default.createContext(
      /* @__PURE__ */ new Set(),
    );
  },
});

// ../../../../node_modules/next/dist/shared/lib/hooks-client-context.shared-runtime.js
var require_hooks_client_context_shared_runtime = __commonJS({
  "../../../../node_modules/next/dist/shared/lib/hooks-client-context.shared-runtime.js"(
    exports,
  ) {
    "use client";
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    function _export(target, all3) {
      for (var name in all3)
        Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name],
        });
    }
    _export(exports, {
      PathParamsContext: function () {
        return PathParamsContext;
      },
      PathnameContext: function () {
        return PathnameContext;
      },
      SearchParamsContext: function () {
        return SearchParamsContext;
      },
    });
    var _react = __require("react");
    var SearchParamsContext = (0, _react.createContext)(null);
    var PathnameContext = (0, _react.createContext)(null);
    var PathParamsContext = (0, _react.createContext)(null);
    if (true) {
      SearchParamsContext.displayName = "SearchParamsContext";
      PathnameContext.displayName = "PathnameContext";
      PathParamsContext.displayName = "PathParamsContext";
    }
  },
});

// ../../../../node_modules/next/dist/client/components/router-reducer/reducers/get-segment-value.js
var require_get_segment_value = __commonJS({
  "../../../../node_modules/next/dist/client/components/router-reducer/reducers/get-segment-value.js"(
    exports,
    module,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "getSegmentValue", {
      enumerable: true,
      get: function () {
        return getSegmentValue;
      },
    });
    function getSegmentValue(segment) {
      return Array.isArray(segment) ? segment[1] : segment;
    }
    if (
      (typeof exports.default === "function" ||
        (typeof exports.default === "object" && exports.default !== null)) &&
      typeof exports.default.__esModule === "undefined"
    ) {
      Object.defineProperty(exports.default, "__esModule", { value: true });
      Object.assign(exports.default, exports);
      module.exports = exports.default;
    }
  },
});

// ../../../../node_modules/next/dist/shared/lib/segment.js
var require_segment = __commonJS({
  "../../../../node_modules/next/dist/shared/lib/segment.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    function _export(target, all3) {
      for (var name in all3)
        Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name],
        });
    }
    _export(exports, {
      DEFAULT_SEGMENT_KEY: function () {
        return DEFAULT_SEGMENT_KEY;
      },
      PAGE_SEGMENT_KEY: function () {
        return PAGE_SEGMENT_KEY;
      },
      addSearchParamsIfPageSegment: function () {
        return addSearchParamsIfPageSegment;
      },
      isGroupSegment: function () {
        return isGroupSegment;
      },
      isParallelRouteSegment: function () {
        return isParallelRouteSegment;
      },
    });
    function isGroupSegment(segment) {
      return segment[0] === "(" && segment.endsWith(")");
    }
    function isParallelRouteSegment(segment) {
      return segment.startsWith("@") && segment !== "@children";
    }
    function addSearchParamsIfPageSegment(segment, searchParams) {
      const isPageSegment = segment.includes(PAGE_SEGMENT_KEY);
      if (isPageSegment) {
        const stringifiedQuery = JSON.stringify(searchParams);
        return stringifiedQuery !== "{}"
          ? PAGE_SEGMENT_KEY + "?" + stringifiedQuery
          : PAGE_SEGMENT_KEY;
      }
      return segment;
    }
    var PAGE_SEGMENT_KEY = "__PAGE__";
    var DEFAULT_SEGMENT_KEY = "__DEFAULT__";
  },
});

// ../../../../node_modules/next/dist/client/components/redirect-status-code.js
var require_redirect_status_code = __commonJS({
  "../../../../node_modules/next/dist/client/components/redirect-status-code.js"(
    exports,
    module,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "RedirectStatusCode", {
      enumerable: true,
      get: function () {
        return RedirectStatusCode;
      },
    });
    var RedirectStatusCode = /* @__PURE__ */ (function (RedirectStatusCode2) {
      RedirectStatusCode2[(RedirectStatusCode2["SeeOther"] = 303)] = "SeeOther";
      RedirectStatusCode2[(RedirectStatusCode2["TemporaryRedirect"] = 307)] =
        "TemporaryRedirect";
      RedirectStatusCode2[(RedirectStatusCode2["PermanentRedirect"] = 308)] =
        "PermanentRedirect";
      return RedirectStatusCode2;
    })({});
    if (
      (typeof exports.default === "function" ||
        (typeof exports.default === "object" && exports.default !== null)) &&
      typeof exports.default.__esModule === "undefined"
    ) {
      Object.defineProperty(exports.default, "__esModule", { value: true });
      Object.assign(exports.default, exports);
      module.exports = exports.default;
    }
  },
});

// ../../../../node_modules/next/dist/client/components/redirect-error.js
var require_redirect_error = __commonJS({
  "../../../../node_modules/next/dist/client/components/redirect-error.js"(
    exports,
    module,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    function _export(target, all3) {
      for (var name in all3)
        Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name],
        });
    }
    _export(exports, {
      REDIRECT_ERROR_CODE: function () {
        return REDIRECT_ERROR_CODE;
      },
      RedirectType: function () {
        return RedirectType;
      },
      isRedirectError: function () {
        return isRedirectError;
      },
    });
    var _redirectstatuscode = require_redirect_status_code();
    var REDIRECT_ERROR_CODE = "NEXT_REDIRECT";
    var RedirectType = /* @__PURE__ */ (function (RedirectType2) {
      RedirectType2["push"] = "push";
      RedirectType2["replace"] = "replace";
      return RedirectType2;
    })({});
    function isRedirectError(error) {
      if (
        typeof error !== "object" ||
        error === null ||
        !("digest" in error) ||
        typeof error.digest !== "string"
      ) {
        return false;
      }
      const digest = error.digest.split(";");
      const [errorCode, type] = digest;
      const destination = digest.slice(2, -2).join(";");
      const status = digest.at(-2);
      const statusCode = Number(status);
      return (
        errorCode === REDIRECT_ERROR_CODE &&
        (type === "replace" || type === "push") &&
        typeof destination === "string" &&
        !isNaN(statusCode) &&
        statusCode in _redirectstatuscode.RedirectStatusCode
      );
    }
    if (
      (typeof exports.default === "function" ||
        (typeof exports.default === "object" && exports.default !== null)) &&
      typeof exports.default.__esModule === "undefined"
    ) {
      Object.defineProperty(exports.default, "__esModule", { value: true });
      Object.assign(exports.default, exports);
      module.exports = exports.default;
    }
  },
});

// ../../../../node_modules/next/dist/server/app-render/action-async-storage-instance.js
var require_action_async_storage_instance = __commonJS({
  "../../../../node_modules/next/dist/server/app-render/action-async-storage-instance.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "actionAsyncStorageInstance", {
      enumerable: true,
      get: function () {
        return actionAsyncStorageInstance;
      },
    });
    var _asynclocalstorage = require_async_local_storage();
    var actionAsyncStorageInstance = (0,
    _asynclocalstorage.createAsyncLocalStorage)();
  },
});

// ../../../../node_modules/next/dist/server/app-render/action-async-storage.external.js
var require_action_async_storage_external = __commonJS({
  "../../../../node_modules/next/dist/server/app-render/action-async-storage.external.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "actionAsyncStorage", {
      enumerable: true,
      get: function () {
        return _actionasyncstorageinstance.actionAsyncStorageInstance;
      },
    });
    var _actionasyncstorageinstance = require_action_async_storage_instance();
  },
});

// ../../../../node_modules/next/dist/client/components/redirect.js
var require_redirect = __commonJS({
  "../../../../node_modules/next/dist/client/components/redirect.js"(
    exports,
    module,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    function _export(target, all3) {
      for (var name in all3)
        Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name],
        });
    }
    _export(exports, {
      getRedirectError: function () {
        return getRedirectError;
      },
      getRedirectStatusCodeFromError: function () {
        return getRedirectStatusCodeFromError;
      },
      getRedirectTypeFromError: function () {
        return getRedirectTypeFromError;
      },
      getURLFromRedirectError: function () {
        return getURLFromRedirectError;
      },
      permanentRedirect: function () {
        return permanentRedirect;
      },
      redirect: function () {
        return redirect2;
      },
    });
    var _redirectstatuscode = require_redirect_status_code();
    var _redirecterror = require_redirect_error();
    var actionAsyncStorage =
      typeof window === "undefined"
        ? require_action_async_storage_external().actionAsyncStorage
        : void 0;
    function getRedirectError(url, type, statusCode) {
      if (statusCode === void 0)
        statusCode = _redirectstatuscode.RedirectStatusCode.TemporaryRedirect;
      const error = Object.defineProperty(
        new Error(_redirecterror.REDIRECT_ERROR_CODE),
        "__NEXT_ERROR_CODE",
        {
          value: "E394",
          enumerable: false,
          configurable: true,
        },
      );
      error.digest =
        _redirecterror.REDIRECT_ERROR_CODE +
        ";" +
        type +
        ";" +
        url +
        ";" +
        statusCode +
        ";";
      return error;
    }
    function redirect2(url, type) {
      var _actionAsyncStorage_getStore;
      type != null
        ? type
        : (type = (
            actionAsyncStorage == null
              ? void 0
              : (_actionAsyncStorage_getStore =
                    actionAsyncStorage.getStore()) == null
                ? void 0
                : _actionAsyncStorage_getStore.isAction
          )
            ? _redirecterror.RedirectType.push
            : _redirecterror.RedirectType.replace);
      throw getRedirectError(
        url,
        type,
        _redirectstatuscode.RedirectStatusCode.TemporaryRedirect,
      );
    }
    function permanentRedirect(url, type) {
      if (type === void 0) type = _redirecterror.RedirectType.replace;
      throw getRedirectError(
        url,
        type,
        _redirectstatuscode.RedirectStatusCode.PermanentRedirect,
      );
    }
    function getURLFromRedirectError(error) {
      if (!(0, _redirecterror.isRedirectError)(error)) return null;
      return error.digest.split(";").slice(2, -2).join(";");
    }
    function getRedirectTypeFromError(error) {
      if (!(0, _redirecterror.isRedirectError)(error)) {
        throw Object.defineProperty(
          new Error("Not a redirect error"),
          "__NEXT_ERROR_CODE",
          {
            value: "E260",
            enumerable: false,
            configurable: true,
          },
        );
      }
      return error.digest.split(";", 2)[1];
    }
    function getRedirectStatusCodeFromError(error) {
      if (!(0, _redirecterror.isRedirectError)(error)) {
        throw Object.defineProperty(
          new Error("Not a redirect error"),
          "__NEXT_ERROR_CODE",
          {
            value: "E260",
            enumerable: false,
            configurable: true,
          },
        );
      }
      return Number(error.digest.split(";").at(-2));
    }
    if (
      (typeof exports.default === "function" ||
        (typeof exports.default === "object" && exports.default !== null)) &&
      typeof exports.default.__esModule === "undefined"
    ) {
      Object.defineProperty(exports.default, "__esModule", { value: true });
      Object.assign(exports.default, exports);
      module.exports = exports.default;
    }
  },
});

// ../../../../node_modules/next/dist/client/components/http-access-fallback/http-access-fallback.js
var require_http_access_fallback = __commonJS({
  "../../../../node_modules/next/dist/client/components/http-access-fallback/http-access-fallback.js"(
    exports,
    module,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    function _export(target, all3) {
      for (var name in all3)
        Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name],
        });
    }
    _export(exports, {
      HTTPAccessErrorStatus: function () {
        return HTTPAccessErrorStatus;
      },
      HTTP_ERROR_FALLBACK_ERROR_CODE: function () {
        return HTTP_ERROR_FALLBACK_ERROR_CODE;
      },
      getAccessFallbackErrorTypeByStatus: function () {
        return getAccessFallbackErrorTypeByStatus;
      },
      getAccessFallbackHTTPStatus: function () {
        return getAccessFallbackHTTPStatus;
      },
      isHTTPAccessFallbackError: function () {
        return isHTTPAccessFallbackError;
      },
    });
    var HTTPAccessErrorStatus = {
      NOT_FOUND: 404,
      FORBIDDEN: 403,
      UNAUTHORIZED: 401,
    };
    var ALLOWED_CODES = new Set(Object.values(HTTPAccessErrorStatus));
    var HTTP_ERROR_FALLBACK_ERROR_CODE = "NEXT_HTTP_ERROR_FALLBACK";
    function isHTTPAccessFallbackError(error) {
      if (
        typeof error !== "object" ||
        error === null ||
        !("digest" in error) ||
        typeof error.digest !== "string"
      ) {
        return false;
      }
      const [prefix, httpStatus] = error.digest.split(";");
      return (
        prefix === HTTP_ERROR_FALLBACK_ERROR_CODE &&
        ALLOWED_CODES.has(Number(httpStatus))
      );
    }
    function getAccessFallbackHTTPStatus(error) {
      const httpStatus = error.digest.split(";")[1];
      return Number(httpStatus);
    }
    function getAccessFallbackErrorTypeByStatus(status) {
      switch (status) {
        case 401:
          return "unauthorized";
        case 403:
          return "forbidden";
        case 404:
          return "not-found";
        default:
          return;
      }
    }
    if (
      (typeof exports.default === "function" ||
        (typeof exports.default === "object" && exports.default !== null)) &&
      typeof exports.default.__esModule === "undefined"
    ) {
      Object.defineProperty(exports.default, "__esModule", { value: true });
      Object.assign(exports.default, exports);
      module.exports = exports.default;
    }
  },
});

// ../../../../node_modules/next/dist/client/components/not-found.js
var require_not_found = __commonJS({
  "../../../../node_modules/next/dist/client/components/not-found.js"(
    exports,
    module,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "notFound", {
      enumerable: true,
      get: function () {
        return notFound;
      },
    });
    var _httpaccessfallback = require_http_access_fallback();
    var DIGEST =
      "" + _httpaccessfallback.HTTP_ERROR_FALLBACK_ERROR_CODE + ";404";
    function notFound() {
      const error = Object.defineProperty(
        new Error(DIGEST),
        "__NEXT_ERROR_CODE",
        {
          value: "E394",
          enumerable: false,
          configurable: true,
        },
      );
      error.digest = DIGEST;
      throw error;
    }
    if (
      (typeof exports.default === "function" ||
        (typeof exports.default === "object" && exports.default !== null)) &&
      typeof exports.default.__esModule === "undefined"
    ) {
      Object.defineProperty(exports.default, "__esModule", { value: true });
      Object.assign(exports.default, exports);
      module.exports = exports.default;
    }
  },
});

// ../../../../node_modules/next/dist/client/components/forbidden.js
var require_forbidden = __commonJS({
  "../../../../node_modules/next/dist/client/components/forbidden.js"(
    exports,
    module,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "forbidden", {
      enumerable: true,
      get: function () {
        return forbidden;
      },
    });
    var _httpaccessfallback = require_http_access_fallback();
    var DIGEST =
      "" + _httpaccessfallback.HTTP_ERROR_FALLBACK_ERROR_CODE + ";403";
    function forbidden() {
      if (!process.env.__NEXT_EXPERIMENTAL_AUTH_INTERRUPTS) {
        throw Object.defineProperty(
          new Error(
            "`forbidden()` is experimental and only allowed to be enabled when `experimental.authInterrupts` is enabled.",
          ),
          "__NEXT_ERROR_CODE",
          {
            value: "E488",
            enumerable: false,
            configurable: true,
          },
        );
      }
      const error = Object.defineProperty(
        new Error(DIGEST),
        "__NEXT_ERROR_CODE",
        {
          value: "E394",
          enumerable: false,
          configurable: true,
        },
      );
      error.digest = DIGEST;
      throw error;
    }
    if (
      (typeof exports.default === "function" ||
        (typeof exports.default === "object" && exports.default !== null)) &&
      typeof exports.default.__esModule === "undefined"
    ) {
      Object.defineProperty(exports.default, "__esModule", { value: true });
      Object.assign(exports.default, exports);
      module.exports = exports.default;
    }
  },
});

// ../../../../node_modules/next/dist/client/components/unauthorized.js
var require_unauthorized = __commonJS({
  "../../../../node_modules/next/dist/client/components/unauthorized.js"(
    exports,
    module,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "unauthorized", {
      enumerable: true,
      get: function () {
        return unauthorized;
      },
    });
    var _httpaccessfallback = require_http_access_fallback();
    var DIGEST =
      "" + _httpaccessfallback.HTTP_ERROR_FALLBACK_ERROR_CODE + ";401";
    function unauthorized() {
      if (!process.env.__NEXT_EXPERIMENTAL_AUTH_INTERRUPTS) {
        throw Object.defineProperty(
          new Error(
            "`unauthorized()` is experimental and only allowed to be used when `experimental.authInterrupts` is enabled.",
          ),
          "__NEXT_ERROR_CODE",
          {
            value: "E411",
            enumerable: false,
            configurable: true,
          },
        );
      }
      const error = Object.defineProperty(
        new Error(DIGEST),
        "__NEXT_ERROR_CODE",
        {
          value: "E394",
          enumerable: false,
          configurable: true,
        },
      );
      error.digest = DIGEST;
      throw error;
    }
    if (
      (typeof exports.default === "function" ||
        (typeof exports.default === "object" && exports.default !== null)) &&
      typeof exports.default.__esModule === "undefined"
    ) {
      Object.defineProperty(exports.default, "__esModule", { value: true });
      Object.assign(exports.default, exports);
      module.exports = exports.default;
    }
  },
});

// ../../../../node_modules/next/dist/server/lib/router-utils/is-postpone.js
var require_is_postpone = __commonJS({
  "../../../../node_modules/next/dist/server/lib/router-utils/is-postpone.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "isPostpone", {
      enumerable: true,
      get: function () {
        return isPostpone;
      },
    });
    var REACT_POSTPONE_TYPE = Symbol.for("react.postpone");
    function isPostpone(error) {
      return (
        typeof error === "object" &&
        error !== null &&
        error.$$typeof === REACT_POSTPONE_TYPE
      );
    }
  },
});

// ../../../../node_modules/next/dist/shared/lib/lazy-dynamic/bailout-to-csr.js
var require_bailout_to_csr = __commonJS({
  "../../../../node_modules/next/dist/shared/lib/lazy-dynamic/bailout-to-csr.js"(
    exports,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    function _export(target, all3) {
      for (var name in all3)
        Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name],
        });
    }
    _export(exports, {
      BailoutToCSRError: function () {
        return BailoutToCSRError;
      },
      isBailoutToCSRError: function () {
        return isBailoutToCSRError;
      },
    });
    var BAILOUT_TO_CSR = "BAILOUT_TO_CLIENT_SIDE_RENDERING";
    var BailoutToCSRError = class extends Error {
      constructor(reason) {
        super("Bail out to client-side rendering: " + reason),
          (this.reason = reason),
          (this.digest = BAILOUT_TO_CSR);
      }
    };
    function isBailoutToCSRError(err) {
      if (typeof err !== "object" || err === null || !("digest" in err)) {
        return false;
      }
      return err.digest === BAILOUT_TO_CSR;
    }
  },
});

// ../../../../node_modules/next/dist/client/components/is-next-router-error.js
var require_is_next_router_error = __commonJS({
  "../../../../node_modules/next/dist/client/components/is-next-router-error.js"(
    exports,
    module,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "isNextRouterError", {
      enumerable: true,
      get: function () {
        return isNextRouterError;
      },
    });
    var _httpaccessfallback = require_http_access_fallback();
    var _redirecterror = require_redirect_error();
    function isNextRouterError(error) {
      return (
        (0, _redirecterror.isRedirectError)(error) ||
        (0, _httpaccessfallback.isHTTPAccessFallbackError)(error)
      );
    }
    if (
      (typeof exports.default === "function" ||
        (typeof exports.default === "object" && exports.default !== null)) &&
      typeof exports.default.__esModule === "undefined"
    ) {
      Object.defineProperty(exports.default, "__esModule", { value: true });
      Object.assign(exports.default, exports);
      module.exports = exports.default;
    }
  },
});

// ../../../../node_modules/next/dist/client/components/unstable-rethrow.server.js
var require_unstable_rethrow_server = __commonJS({
  "../../../../node_modules/next/dist/client/components/unstable-rethrow.server.js"(
    exports,
    module,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "unstable_rethrow", {
      enumerable: true,
      get: function () {
        return unstable_rethrow;
      },
    });
    var _dynamicrenderingutils = require_dynamic_rendering_utils();
    var _ispostpone = require_is_postpone();
    var _bailouttocsr = require_bailout_to_csr();
    var _isnextroutererror = require_is_next_router_error();
    var _dynamicrendering = require_dynamic_rendering();
    var _hooksservercontext = require_hooks_server_context();
    function unstable_rethrow(error) {
      if (
        (0, _isnextroutererror.isNextRouterError)(error) ||
        (0, _bailouttocsr.isBailoutToCSRError)(error) ||
        (0, _hooksservercontext.isDynamicServerError)(error) ||
        (0, _dynamicrendering.isDynamicPostpone)(error) ||
        (0, _ispostpone.isPostpone)(error) ||
        (0, _dynamicrenderingutils.isHangingPromiseRejectionError)(error)
      ) {
        throw error;
      }
      if (error instanceof Error && "cause" in error) {
        unstable_rethrow(error.cause);
      }
    }
    if (
      (typeof exports.default === "function" ||
        (typeof exports.default === "object" && exports.default !== null)) &&
      typeof exports.default.__esModule === "undefined"
    ) {
      Object.defineProperty(exports.default, "__esModule", { value: true });
      Object.assign(exports.default, exports);
      module.exports = exports.default;
    }
  },
});

// ../../../../node_modules/next/dist/client/components/unstable-rethrow.browser.js
var require_unstable_rethrow_browser = __commonJS({
  "../../../../node_modules/next/dist/client/components/unstable-rethrow.browser.js"(
    exports,
    module,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "unstable_rethrow", {
      enumerable: true,
      get: function () {
        return unstable_rethrow;
      },
    });
    var _bailouttocsr = require_bailout_to_csr();
    var _isnextroutererror = require_is_next_router_error();
    function unstable_rethrow(error) {
      if (
        (0, _isnextroutererror.isNextRouterError)(error) ||
        (0, _bailouttocsr.isBailoutToCSRError)(error)
      ) {
        throw error;
      }
      if (error instanceof Error && "cause" in error) {
        unstable_rethrow(error.cause);
      }
    }
    if (
      (typeof exports.default === "function" ||
        (typeof exports.default === "object" && exports.default !== null)) &&
      typeof exports.default.__esModule === "undefined"
    ) {
      Object.defineProperty(exports.default, "__esModule", { value: true });
      Object.assign(exports.default, exports);
      module.exports = exports.default;
    }
  },
});

// ../../../../node_modules/next/dist/client/components/unstable-rethrow.js
var require_unstable_rethrow = __commonJS({
  "../../../../node_modules/next/dist/client/components/unstable-rethrow.js"(
    exports,
    module,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "unstable_rethrow", {
      enumerable: true,
      get: function () {
        return unstable_rethrow;
      },
    });
    var unstable_rethrow =
      typeof window === "undefined"
        ? require_unstable_rethrow_server().unstable_rethrow
        : require_unstable_rethrow_browser().unstable_rethrow;
    if (
      (typeof exports.default === "function" ||
        (typeof exports.default === "object" && exports.default !== null)) &&
      typeof exports.default.__esModule === "undefined"
    ) {
      Object.defineProperty(exports.default, "__esModule", { value: true });
      Object.assign(exports.default, exports);
      module.exports = exports.default;
    }
  },
});

// ../../../../node_modules/next/dist/client/components/navigation.react-server.js
var require_navigation_react_server = __commonJS({
  "../../../../node_modules/next/dist/client/components/navigation.react-server.js"(
    exports,
    module,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    function _export(target, all3) {
      for (var name in all3)
        Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name],
        });
    }
    _export(exports, {
      ReadonlyURLSearchParams: function () {
        return ReadonlyURLSearchParams;
      },
      RedirectType: function () {
        return _redirecterror.RedirectType;
      },
      forbidden: function () {
        return _forbidden.forbidden;
      },
      notFound: function () {
        return _notfound.notFound;
      },
      permanentRedirect: function () {
        return _redirect.permanentRedirect;
      },
      redirect: function () {
        return _redirect.redirect;
      },
      unauthorized: function () {
        return _unauthorized.unauthorized;
      },
      unstable_rethrow: function () {
        return _unstablerethrow.unstable_rethrow;
      },
    });
    var _redirect = require_redirect();
    var _redirecterror = require_redirect_error();
    var _notfound = require_not_found();
    var _forbidden = require_forbidden();
    var _unauthorized = require_unauthorized();
    var _unstablerethrow = require_unstable_rethrow();
    var ReadonlyURLSearchParamsError = class extends Error {
      constructor() {
        super(
          "Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams",
        );
      }
    };
    var ReadonlyURLSearchParams = class extends URLSearchParams {
      /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams */
      append() {
        throw new ReadonlyURLSearchParamsError();
      }
      /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams */
      delete() {
        throw new ReadonlyURLSearchParamsError();
      }
      /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams */
      set() {
        throw new ReadonlyURLSearchParamsError();
      }
      /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams */
      sort() {
        throw new ReadonlyURLSearchParamsError();
      }
    };
    if (
      (typeof exports.default === "function" ||
        (typeof exports.default === "object" && exports.default !== null)) &&
      typeof exports.default.__esModule === "undefined"
    ) {
      Object.defineProperty(exports.default, "__esModule", { value: true });
      Object.assign(exports.default, exports);
      module.exports = exports.default;
    }
  },
});

// ../../../../node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs
var require_interop_require_wildcard = __commonJS({
  "../../../../node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs"(
    exports,
  ) {
    "use strict";
    function _getRequireWildcardCache(nodeInterop) {
      if (typeof WeakMap !== "function") return null;
      var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
      var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
      return (_getRequireWildcardCache = function (nodeInterop2) {
        return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
      })(nodeInterop);
    }
    function _interop_require_wildcard(obj, nodeInterop) {
      if (!nodeInterop && obj && obj.__esModule) return obj;
      if (
        obj === null ||
        (typeof obj !== "object" && typeof obj !== "function")
      )
        return { default: obj };
      var cache2 = _getRequireWildcardCache(nodeInterop);
      if (cache2 && cache2.has(obj)) return cache2.get(obj);
      var newObj = { __proto__: null };
      var hasPropertyDescriptor =
        Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var key in obj) {
        if (
          key !== "default" &&
          Object.prototype.hasOwnProperty.call(obj, key)
        ) {
          var desc = hasPropertyDescriptor
            ? Object.getOwnPropertyDescriptor(obj, key)
            : null;
          if (desc && (desc.get || desc.set))
            Object.defineProperty(newObj, key, desc);
          else newObj[key] = obj[key];
        }
      }
      newObj.default = obj;
      if (cache2) cache2.set(obj, newObj);
      return newObj;
    }
    exports._ = _interop_require_wildcard;
  },
});

// ../../../../node_modules/next/dist/shared/lib/server-inserted-html.shared-runtime.js
var require_server_inserted_html_shared_runtime = __commonJS({
  "../../../../node_modules/next/dist/shared/lib/server-inserted-html.shared-runtime.js"(
    exports,
  ) {
    "use client";
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    function _export(target, all3) {
      for (var name in all3)
        Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name],
        });
    }
    _export(exports, {
      ServerInsertedHTMLContext: function () {
        return ServerInsertedHTMLContext;
      },
      useServerInsertedHTML: function () {
        return useServerInsertedHTML;
      },
    });
    var _interop_require_wildcard = require_interop_require_wildcard();
    var _react = /* @__PURE__ */ _interop_require_wildcard._(
      __require("react"),
    );
    var ServerInsertedHTMLContext =
      /* @__PURE__ */ _react.default.createContext(null);
    function useServerInsertedHTML(callback2) {
      const addInsertedServerHTMLCallback = (0, _react.useContext)(
        ServerInsertedHTMLContext,
      );
      if (addInsertedServerHTMLCallback) {
        addInsertedServerHTMLCallback(callback2);
      }
    }
  },
});

// ../../../../node_modules/next/dist/client/components/bailout-to-client-rendering.js
var require_bailout_to_client_rendering = __commonJS({
  "../../../../node_modules/next/dist/client/components/bailout-to-client-rendering.js"(
    exports,
    module,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    Object.defineProperty(exports, "bailoutToClientRendering", {
      enumerable: true,
      get: function () {
        return bailoutToClientRendering;
      },
    });
    var _bailouttocsr = require_bailout_to_csr();
    var _workasyncstorageexternal = require_work_async_storage_external();
    function bailoutToClientRendering(reason) {
      const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
      if (workStore == null ? void 0 : workStore.forceStatic) return;
      if (workStore == null ? void 0 : workStore.isStaticGeneration)
        throw Object.defineProperty(
          new _bailouttocsr.BailoutToCSRError(reason),
          "__NEXT_ERROR_CODE",
          {
            value: "E394",
            enumerable: false,
            configurable: true,
          },
        );
    }
    if (
      (typeof exports.default === "function" ||
        (typeof exports.default === "object" && exports.default !== null)) &&
      typeof exports.default.__esModule === "undefined"
    ) {
      Object.defineProperty(exports.default, "__esModule", { value: true });
      Object.assign(exports.default, exports);
      module.exports = exports.default;
    }
  },
});

// ../../../../node_modules/next/dist/client/components/navigation.js
var require_navigation = __commonJS({
  "../../../../node_modules/next/dist/client/components/navigation.js"(
    exports,
    module,
  ) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    function _export(target, all3) {
      for (var name in all3)
        Object.defineProperty(target, name, {
          enumerable: true,
          get: all3[name],
        });
    }
    _export(exports, {
      ReadonlyURLSearchParams: function () {
        return _navigationreactserver.ReadonlyURLSearchParams;
      },
      RedirectType: function () {
        return _navigationreactserver.RedirectType;
      },
      ServerInsertedHTMLContext: function () {
        return _serverinsertedhtmlsharedruntime.ServerInsertedHTMLContext;
      },
      forbidden: function () {
        return _navigationreactserver.forbidden;
      },
      notFound: function () {
        return _navigationreactserver.notFound;
      },
      permanentRedirect: function () {
        return _navigationreactserver.permanentRedirect;
      },
      redirect: function () {
        return _navigationreactserver.redirect;
      },
      unauthorized: function () {
        return _navigationreactserver.unauthorized;
      },
      unstable_rethrow: function () {
        return _navigationreactserver.unstable_rethrow;
      },
      useParams: function () {
        return useParams;
      },
      usePathname: function () {
        return usePathname;
      },
      useRouter: function () {
        return useRouter;
      },
      useSearchParams: function () {
        return useSearchParams;
      },
      useSelectedLayoutSegment: function () {
        return useSelectedLayoutSegment;
      },
      useSelectedLayoutSegments: function () {
        return useSelectedLayoutSegments;
      },
      useServerInsertedHTML: function () {
        return _serverinsertedhtmlsharedruntime.useServerInsertedHTML;
      },
    });
    var _react = __require("react");
    var _approutercontextsharedruntime =
      require_app_router_context_shared_runtime();
    var _hooksclientcontextsharedruntime =
      require_hooks_client_context_shared_runtime();
    var _getsegmentvalue = require_get_segment_value();
    var _segment = require_segment();
    var _navigationreactserver = require_navigation_react_server();
    var _serverinsertedhtmlsharedruntime =
      require_server_inserted_html_shared_runtime();
    var useDynamicRouteParams =
      typeof window === "undefined"
        ? require_dynamic_rendering().useDynamicRouteParams
        : void 0;
    function useSearchParams() {
      const searchParams = (0, _react.useContext)(
        _hooksclientcontextsharedruntime.SearchParamsContext,
      );
      const readonlySearchParams = (0, _react.useMemo)(() => {
        if (!searchParams) {
          return null;
        }
        return new _navigationreactserver.ReadonlyURLSearchParams(searchParams);
      }, [searchParams]);
      if (typeof window === "undefined") {
        const { bailoutToClientRendering } =
          require_bailout_to_client_rendering();
        bailoutToClientRendering("useSearchParams()");
      }
      return readonlySearchParams;
    }
    function usePathname() {
      useDynamicRouteParams == null
        ? void 0
        : useDynamicRouteParams("usePathname()");
      return (0, _react.useContext)(
        _hooksclientcontextsharedruntime.PathnameContext,
      );
    }
    function useRouter() {
      const router = (0, _react.useContext)(
        _approutercontextsharedruntime.AppRouterContext,
      );
      if (router === null) {
        throw Object.defineProperty(
          new Error("invariant expected app router to be mounted"),
          "__NEXT_ERROR_CODE",
          {
            value: "E238",
            enumerable: false,
            configurable: true,
          },
        );
      }
      return router;
    }
    function useParams() {
      useDynamicRouteParams == null
        ? void 0
        : useDynamicRouteParams("useParams()");
      return (0, _react.useContext)(
        _hooksclientcontextsharedruntime.PathParamsContext,
      );
    }
    function getSelectedLayoutSegmentPath(
      tree,
      parallelRouteKey,
      first,
      segmentPath,
    ) {
      if (first === void 0) first = true;
      if (segmentPath === void 0) segmentPath = [];
      let node;
      if (first) {
        node = tree[1][parallelRouteKey];
      } else {
        const parallelRoutes = tree[1];
        var _parallelRoutes_children;
        node =
          (_parallelRoutes_children = parallelRoutes.children) != null
            ? _parallelRoutes_children
            : Object.values(parallelRoutes)[0];
      }
      if (!node) return segmentPath;
      const segment = node[0];
      let segmentValue = (0, _getsegmentvalue.getSegmentValue)(segment);
      if (!segmentValue || segmentValue.startsWith(_segment.PAGE_SEGMENT_KEY)) {
        return segmentPath;
      }
      segmentPath.push(segmentValue);
      return getSelectedLayoutSegmentPath(
        node,
        parallelRouteKey,
        false,
        segmentPath,
      );
    }
    function useSelectedLayoutSegments(parallelRouteKey) {
      if (parallelRouteKey === void 0) parallelRouteKey = "children";
      useDynamicRouteParams == null
        ? void 0
        : useDynamicRouteParams("useSelectedLayoutSegments()");
      const context = (0, _react.useContext)(
        _approutercontextsharedruntime.LayoutRouterContext,
      );
      if (!context) return null;
      return getSelectedLayoutSegmentPath(context.parentTree, parallelRouteKey);
    }
    function useSelectedLayoutSegment(parallelRouteKey) {
      if (parallelRouteKey === void 0) parallelRouteKey = "children";
      useDynamicRouteParams == null
        ? void 0
        : useDynamicRouteParams("useSelectedLayoutSegment()");
      const selectedLayoutSegments =
        useSelectedLayoutSegments(parallelRouteKey);
      if (!selectedLayoutSegments || selectedLayoutSegments.length === 0) {
        return null;
      }
      const selectedLayoutSegment =
        parallelRouteKey === "children"
          ? selectedLayoutSegments[0]
          : selectedLayoutSegments[selectedLayoutSegments.length - 1];
      return selectedLayoutSegment === _segment.DEFAULT_SEGMENT_KEY
        ? null
        : selectedLayoutSegment;
    }
    if (
      (typeof exports.default === "function" ||
        (typeof exports.default === "object" && exports.default !== null)) &&
      typeof exports.default.__esModule === "undefined"
    ) {
      Object.defineProperty(exports.default, "__esModule", { value: true });
      Object.assign(exports.default, exports);
      module.exports = exports.default;
    }
  },
});

// ../../../../node_modules/next/navigation.js
var require_navigation2 = __commonJS({
  "../../../../node_modules/next/navigation.js"(exports, module) {
    module.exports = require_navigation();
  },
});

// ../../lib/plugin-sdk.ts
function definePlugin(definition) {
  return definition;
}
function registerExtensionPoint(component) {
  return component;
}

// components/payment-method.tsx
import { useState } from "react";
function PaymentMethodComponent({
  apiKey,
  webhookUrl,
  amount,
  currency,
  orderId,
  customerEmail,
  onSuccess,
}) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const handleSubmit = async (e2) => {
    e2.preventDefault();
    setProcessing(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      const fakePaymentId = `pi_${Math.random().toString(36).substring(2, 10)}`;
      if (onSuccess) {
        onSuccess(fakePaymentId);
      }
    } catch (err) {
      console.error("Payment failed:", err);
      setError("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };
  return (
    <div className="p-4 border rounded-lg">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="card-number"
              className="block text-sm font-medium text-gray-700"
            >
              Card Number
            </label>
            <input
              id="card-number"
              type="text"
              placeholder="1234 5678 9012 3456"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={cardNumber}
              onChange={(e2) => setCardNumber(e2.target.value)}
              disabled={processing}
              required
            />
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label
                htmlFor="expiry"
                className="block text-sm font-medium text-gray-700"
              >
                Expiry (MM/YY)
              </label>
              <input
                id="expiry"
                type="text"
                placeholder="MM/YY"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={expiry}
                onChange={(e2) => setExpiry(e2.target.value)}
                disabled={processing}
                required
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="cvc"
                className="block text-sm font-medium text-gray-700"
              >
                CVC
              </label>
              <input
                id="cvc"
                type="text"
                placeholder="123"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={cvc}
                onChange={(e2) => setCvc(e2.target.value)}
                disabled={processing}
                required
              />
            </div>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={processing}
          >
            {processing
              ? "Processing..."
              : `Pay ${(amount / 100).toFixed(2)} ${currency}`}
          </button>
        </div>
      </form>
    </div>
  );
}

// components/admin-settings.tsx
import { useState as useState4 } from "react";

// ../../../../node_modules/axios/lib/helpers/bind.js
function bind(fn, thisArg) {
  return function wrap4() {
    return fn.apply(thisArg, arguments);
  };
}

// ../../../../node_modules/axios/lib/utils.js
var { toString } = Object.prototype;
var { getPrototypeOf } = Object;
var { iterator, toStringTag } = Symbol;
var kindOf = ((cache2) => (thing) => {
  const str = toString.call(thing);
  return cache2[str] || (cache2[str] = str.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null));
var kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type;
};
var typeOfTest = (type) => (thing) => typeof thing === type;
var { isArray } = Array;
var isUndefined = typeOfTest("undefined");
function isBuffer(val) {
  return (
    val !== null &&
    !isUndefined(val) &&
    val.constructor !== null &&
    !isUndefined(val.constructor) &&
    isFunction(val.constructor.isBuffer) &&
    val.constructor.isBuffer(val)
  );
}
var isArrayBuffer = kindOfTest("ArrayBuffer");
function isArrayBufferView(val) {
  let result;
  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && isArrayBuffer(val.buffer);
  }
  return result;
}
var isString = typeOfTest("string");
var isFunction = typeOfTest("function");
var isNumber = typeOfTest("number");
var isObject = (thing) => thing !== null && typeof thing === "object";
var isBoolean = (thing) => thing === true || thing === false;
var isPlainObject = (val) => {
  if (kindOf(val) !== "object") {
    return false;
  }
  const prototype3 = getPrototypeOf(val);
  return (
    (prototype3 === null ||
      prototype3 === Object.prototype ||
      Object.getPrototypeOf(prototype3) === null) &&
    !(toStringTag in val) &&
    !(iterator in val)
  );
};
var isDate = kindOfTest("Date");
var isFile = kindOfTest("File");
var isBlob = kindOfTest("Blob");
var isFileList = kindOfTest("FileList");
var isStream = (val) => isObject(val) && isFunction(val.pipe);
var isFormData = (thing) => {
  let kind;
  return (
    thing &&
    ((typeof FormData === "function" && thing instanceof FormData) ||
      (isFunction(thing.append) &&
        ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
          (kind === "object" &&
            isFunction(thing.toString) &&
            thing.toString() === "[object FormData]"))))
  );
};
var isURLSearchParams = kindOfTest("URLSearchParams");
var [isReadableStream, isRequest, isResponse, isHeaders] = [
  "ReadableStream",
  "Request",
  "Response",
  "Headers",
].map(kindOfTest);
var trim = (str) =>
  str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function forEach(obj, fn, { allOwnKeys = false } = {}) {
  if (obj === null || typeof obj === "undefined") {
    return;
  }
  let i4;
  let l3;
  if (typeof obj !== "object") {
    obj = [obj];
  }
  if (isArray(obj)) {
    for (i4 = 0, l3 = obj.length; i4 < l3; i4++) {
      fn.call(null, obj[i4], i4, obj);
    }
  } else {
    const keys = allOwnKeys
      ? Object.getOwnPropertyNames(obj)
      : Object.keys(obj);
    const len = keys.length;
    let key;
    for (i4 = 0; i4 < len; i4++) {
      key = keys[i4];
      fn.call(null, obj[key], key, obj);
    }
  }
}
function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i4 = keys.length;
  let _key;
  while (i4-- > 0) {
    _key = keys[i4];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}
var _global = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined"
    ? self
    : typeof window !== "undefined"
      ? window
      : global;
})();
var isContextDefined = (context) =>
  !isUndefined(context) && context !== _global;
function merge() {
  const { caseless } = (isContextDefined(this) && this) || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = (caseless && findKey(result, key)) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  };
  for (let i4 = 0, l3 = arguments.length; i4 < l3; i4++) {
    arguments[i4] && forEach(arguments[i4], assignValue);
  }
  return result;
}
var extend = (a3, b2, thisArg, { allOwnKeys } = {}) => {
  forEach(
    b2,
    (val, key) => {
      if (thisArg && isFunction(val)) {
        a3[key] = bind(val, thisArg);
      } else {
        a3[key] = val;
      }
    },
    { allOwnKeys },
  );
  return a3;
};
var stripBOM = (content) => {
  if (content.charCodeAt(0) === 65279) {
    content = content.slice(1);
  }
  return content;
};
var inherits = (constructor, superConstructor, props, descriptors2) => {
  constructor.prototype = Object.create(
    superConstructor.prototype,
    descriptors2,
  );
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, "super", {
    value: superConstructor.prototype,
  });
  props && Object.assign(constructor.prototype, props);
};
var toFlatObject = (sourceObj, destObj, filter2, propFilter) => {
  let props;
  let i4;
  let prop;
  const merged = {};
  destObj = destObj || {};
  if (sourceObj == null) return destObj;
  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i4 = props.length;
    while (i4-- > 0) {
      prop = props[i4];
      if (
        (!propFilter || propFilter(prop, sourceObj, destObj)) &&
        !merged[prop]
      ) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter2 !== false && getPrototypeOf(sourceObj);
  } while (
    sourceObj &&
    (!filter2 || filter2(sourceObj, destObj)) &&
    sourceObj !== Object.prototype
  );
  return destObj;
};
var endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === void 0 || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};
var toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i4 = thing.length;
  if (!isNumber(i4)) return null;
  const arr = new Array(i4);
  while (i4-- > 0) {
    arr[i4] = thing[i4];
  }
  return arr;
};
var isTypedArray = ((TypedArray) => {
  return (thing) => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
var forEachEntry = (obj, fn) => {
  const generator = obj && obj[iterator];
  const _iterator = generator.call(obj);
  let result;
  while ((result = _iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};
var matchAll = (regExp, str) => {
  let matches;
  const arr = [];
  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }
  return arr;
};
var isHTMLForm = kindOfTest("HTMLFormElement");
var toCamelCase = (str) => {
  return str
    .toLowerCase()
    .replace(/[-_\s]([a-z\d])(\w*)/g, function replacer(m, p1, p22) {
      return p1.toUpperCase() + p22;
    });
};
var hasOwnProperty = (
  ({ hasOwnProperty: hasOwnProperty2 }) =>
  (obj, prop) =>
    hasOwnProperty2.call(obj, prop)
)(Object.prototype);
var isRegExp = kindOfTest("RegExp");
var reduceDescriptors = (obj, reducer) => {
  const descriptors2 = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};
  forEach(descriptors2, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });
  Object.defineProperties(obj, reducedDescriptors);
};
var freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    if (
      isFunction(obj) &&
      ["arguments", "caller", "callee"].indexOf(name) !== -1
    ) {
      return false;
    }
    const value = obj[name];
    if (!isFunction(value)) return;
    descriptor.enumerable = false;
    if ("writable" in descriptor) {
      descriptor.writable = false;
      return;
    }
    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error("Can not rewrite read-only method '" + name + "'");
      };
    }
  });
};
var toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};
  const define2 = (arr) => {
    arr.forEach((value) => {
      obj[value] = true;
    });
  };
  isArray(arrayOrString)
    ? define2(arrayOrString)
    : define2(String(arrayOrString).split(delimiter));
  return obj;
};
var noop = () => {};
var toFiniteNumber = (value, defaultValue) => {
  return value != null && Number.isFinite((value = +value))
    ? value
    : defaultValue;
};
function isSpecCompliantForm(thing) {
  return !!(
    thing &&
    isFunction(thing.append) &&
    thing[toStringTag] === "FormData" &&
    thing[iterator]
  );
}
var toJSONObject = (obj) => {
  const stack = new Array(10);
  const visit = (source, i4) => {
    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }
      if (!("toJSON" in source)) {
        stack[i4] = source;
        const target = isArray(source) ? [] : {};
        forEach(source, (value, key) => {
          const reducedValue = visit(value, i4 + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });
        stack[i4] = void 0;
        return target;
      }
    }
    return source;
  };
  return visit(obj, 0);
};
var isAsyncFn = kindOfTest("AsyncFunction");
var isThenable = (thing) =>
  thing &&
  (isObject(thing) || isFunction(thing)) &&
  isFunction(thing.then) &&
  isFunction(thing.catch);
var _setImmediate = ((setImmediateSupported, postMessageSupported) => {
  if (setImmediateSupported) {
    return setImmediate;
  }
  return postMessageSupported
    ? ((token, callbacks) => {
        _global.addEventListener(
          "message",
          ({ source, data }) => {
            if (source === _global && data === token) {
              callbacks.length && callbacks.shift()();
            }
          },
          false,
        );
        return (cb) => {
          callbacks.push(cb);
          _global.postMessage(token, "*");
        };
      })(`axios@${Math.random()}`, [])
    : (cb) => setTimeout(cb);
})(typeof setImmediate === "function", isFunction(_global.postMessage));
var asap =
  typeof queueMicrotask !== "undefined"
    ? queueMicrotask.bind(_global)
    : (typeof process !== "undefined" && process.nextTick) || _setImmediate;
var isIterable = (thing) => thing != null && isFunction(thing[iterator]);
var utils_default = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isReadableStream,
  isRequest,
  isResponse,
  isHeaders,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable,
  setImmediate: _setImmediate,
  asap,
  isIterable,
};

// ../../../../node_modules/axios/lib/core/AxiosError.js
function AxiosError(message2, code, config, request, response) {
  Error.call(this);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error().stack;
  }
  this.message = message2;
  this.name = "AxiosError";
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  if (response) {
    this.response = response;
    this.status = response.status ? response.status : null;
  }
}
utils_default.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils_default.toJSONObject(this.config),
      code: this.code,
      status: this.status,
    };
  },
});
var prototype = AxiosError.prototype;
var descriptors = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL",
  // eslint-disable-next-line func-names
].forEach((code) => {
  descriptors[code] = { value: code };
});
Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype, "isAxiosError", { value: true });
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype);
  utils_default.toFlatObject(
    error,
    axiosError,
    function filter2(obj) {
      return obj !== Error.prototype;
    },
    (prop) => {
      return prop !== "isAxiosError";
    },
  );
  AxiosError.call(axiosError, error.message, code, config, request, response);
  axiosError.cause = error;
  axiosError.name = error.name;
  customProps && Object.assign(axiosError, customProps);
  return axiosError;
};
var AxiosError_default = AxiosError;

// ../../../../node_modules/axios/lib/helpers/null.js
var null_default = null;

// ../../../../node_modules/axios/lib/helpers/toFormData.js
function isVisitable(thing) {
  return utils_default.isPlainObject(thing) || utils_default.isArray(thing);
}
function removeBrackets(key) {
  return utils_default.endsWith(key, "[]") ? key.slice(0, -2) : key;
}
function renderKey(path, key, dots) {
  if (!path) return key;
  return path
    .concat(key)
    .map(function each(token, i4) {
      token = removeBrackets(token);
      return !dots && i4 ? "[" + token + "]" : token;
    })
    .join(dots ? "." : "");
}
function isFlatArray(arr) {
  return utils_default.isArray(arr) && !arr.some(isVisitable);
}
var predicates = utils_default.toFlatObject(
  utils_default,
  {},
  null,
  function filter(prop) {
    return /^is[A-Z]/.test(prop);
  },
);
function toFormData(obj, formData, options) {
  if (!utils_default.isObject(obj)) {
    throw new TypeError("target must be an object");
  }
  formData = formData || new (null_default || FormData)();
  options = utils_default.toFlatObject(
    options,
    {
      metaTokens: true,
      dots: false,
      indexes: false,
    },
    false,
    function defined(option, source) {
      return !utils_default.isUndefined(source[option]);
    },
  );
  const metaTokens = options.metaTokens;
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || (typeof Blob !== "undefined" && Blob);
  const useBlob = _Blob && utils_default.isSpecCompliantForm(formData);
  if (!utils_default.isFunction(visitor)) {
    throw new TypeError("visitor must be a function");
  }
  function convertValue(value) {
    if (value === null) return "";
    if (utils_default.isDate(value)) {
      return value.toISOString();
    }
    if (!useBlob && utils_default.isBlob(value)) {
      throw new AxiosError_default(
        "Blob is not supported. Use a Buffer instead.",
      );
    }
    if (
      utils_default.isArrayBuffer(value) ||
      utils_default.isTypedArray(value)
    ) {
      return useBlob && typeof Blob === "function"
        ? new Blob([value])
        : Buffer.from(value);
    }
    return value;
  }
  function defaultVisitor(value, key, path) {
    let arr = value;
    if (value && !path && typeof value === "object") {
      if (utils_default.endsWith(key, "{}")) {
        key = metaTokens ? key : key.slice(0, -2);
        value = JSON.stringify(value);
      } else if (
        (utils_default.isArray(value) && isFlatArray(value)) ||
        ((utils_default.isFileList(value) ||
          utils_default.endsWith(key, "[]")) &&
          (arr = utils_default.toArray(value)))
      ) {
        key = removeBrackets(key);
        arr.forEach(function each(el, index) {
          !(utils_default.isUndefined(el) || el === null) &&
            formData.append(
              // eslint-disable-next-line no-nested-ternary
              indexes === true
                ? renderKey([key], index, dots)
                : indexes === null
                  ? key
                  : key + "[]",
              convertValue(el),
            );
        });
        return false;
      }
    }
    if (isVisitable(value)) {
      return true;
    }
    formData.append(renderKey(path, key, dots), convertValue(value));
    return false;
  }
  const stack = [];
  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable,
  });
  function build(value, path) {
    if (utils_default.isUndefined(value)) return;
    if (stack.indexOf(value) !== -1) {
      throw Error("Circular reference detected in " + path.join("."));
    }
    stack.push(value);
    utils_default.forEach(value, function each(el, key) {
      const result =
        !(utils_default.isUndefined(el) || el === null) &&
        visitor.call(
          formData,
          el,
          utils_default.isString(key) ? key.trim() : key,
          path,
          exposedHelpers,
        );
      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });
    stack.pop();
  }
  if (!utils_default.isObject(obj)) {
    throw new TypeError("data must be an object");
  }
  build(obj);
  return formData;
}
var toFormData_default = toFormData;

// ../../../../node_modules/axios/lib/helpers/AxiosURLSearchParams.js
function encode(str) {
  const charMap = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0",
  };
  return encodeURIComponent(str).replace(
    /[!'()~]|%20|%00/g,
    function replacer(match) {
      return charMap[match];
    },
  );
}
function AxiosURLSearchParams(params, options) {
  this._pairs = [];
  params && toFormData_default(params, this, options);
}
var prototype2 = AxiosURLSearchParams.prototype;
prototype2.append = function append(name, value) {
  this._pairs.push([name, value]);
};
prototype2.toString = function toString2(encoder3) {
  const _encode = encoder3
    ? function (value) {
        return encoder3.call(this, value, encode);
      }
    : encode;
  return this._pairs
    .map(function each(pair) {
      return _encode(pair[0]) + "=" + _encode(pair[1]);
    }, "")
    .join("&");
};
var AxiosURLSearchParams_default = AxiosURLSearchParams;

// ../../../../node_modules/axios/lib/helpers/buildURL.js
function encode2(val) {
  return encodeURIComponent(val)
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",")
    .replace(/%20/g, "+")
    .replace(/%5B/gi, "[")
    .replace(/%5D/gi, "]");
}
function buildURL(url, params, options) {
  if (!params) {
    return url;
  }
  const _encode = (options && options.encode) || encode2;
  if (utils_default.isFunction(options)) {
    options = {
      serialize: options,
    };
  }
  const serializeFn = options && options.serialize;
  let serializedParams;
  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils_default.isURLSearchParams(params)
      ? params.toString()
      : new AxiosURLSearchParams_default(params, options).toString(_encode);
  }
  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }
  return url;
}

// ../../../../node_modules/axios/lib/core/InterceptorManager.js
var InterceptorManager = class {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null,
    });
    return this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils_default.forEach(this.handlers, function forEachHandler(h3) {
      if (h3 !== null) {
        fn(h3);
      }
    });
  }
};
var InterceptorManager_default = InterceptorManager;

// ../../../../node_modules/axios/lib/defaults/transitional.js
var transitional_default = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false,
};

// ../../../../node_modules/axios/lib/platform/browser/classes/URLSearchParams.js
var URLSearchParams_default =
  typeof URLSearchParams !== "undefined"
    ? URLSearchParams
    : AxiosURLSearchParams_default;

// ../../../../node_modules/axios/lib/platform/browser/classes/FormData.js
var FormData_default = typeof FormData !== "undefined" ? FormData : null;

// ../../../../node_modules/axios/lib/platform/browser/classes/Blob.js
var Blob_default = typeof Blob !== "undefined" ? Blob : null;

// ../../../../node_modules/axios/lib/platform/browser/index.js
var browser_default = {
  isBrowser: true,
  classes: {
    URLSearchParams: URLSearchParams_default,
    FormData: FormData_default,
    Blob: Blob_default,
  },
  protocols: ["http", "https", "file", "blob", "url", "data"],
};

// ../../../../node_modules/axios/lib/platform/common/utils.js
var utils_exports = {};
__export2(utils_exports, {
  hasBrowserEnv: () => hasBrowserEnv,
  hasStandardBrowserEnv: () => hasStandardBrowserEnv,
  hasStandardBrowserWebWorkerEnv: () => hasStandardBrowserWebWorkerEnv,
  navigator: () => _navigator,
  origin: () => origin,
});
var hasBrowserEnv =
  typeof window !== "undefined" && typeof document !== "undefined";
var _navigator = (typeof navigator === "object" && navigator) || void 0;
var hasStandardBrowserEnv =
  hasBrowserEnv &&
  (!_navigator ||
    ["ReactNative", "NativeScript", "NS"].indexOf(_navigator.product) < 0);
var hasStandardBrowserWebWorkerEnv = (() => {
  return (
    typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts === "function"
  );
})();
var origin = (hasBrowserEnv && window.location.href) || "http://localhost";

// ../../../../node_modules/axios/lib/platform/index.js
var platform_default = {
  ...utils_exports,
  ...browser_default,
};

// ../../../../node_modules/axios/lib/helpers/toURLEncodedForm.js
function toURLEncodedForm(data, options) {
  return toFormData_default(
    data,
    new platform_default.classes.URLSearchParams(),
    Object.assign(
      {
        visitor: function (value, key, path, helpers) {
          if (platform_default.isNode && utils_default.isBuffer(value)) {
            this.append(key, value.toString("base64"));
            return false;
          }
          return helpers.defaultVisitor.apply(this, arguments);
        },
      },
      options,
    ),
  );
}

// ../../../../node_modules/axios/lib/helpers/formDataToJSON.js
function parsePropPath(name) {
  return utils_default.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
    return match[0] === "[]" ? "" : match[1] || match[0];
  });
}
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i4;
  const len = keys.length;
  let key;
  for (i4 = 0; i4 < len; i4++) {
    key = keys[i4];
    obj[key] = arr[key];
  }
  return obj;
}
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];
    if (name === "__proto__") return true;
    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && utils_default.isArray(target) ? target.length : name;
    if (isLast) {
      if (utils_default.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }
      return !isNumericKey;
    }
    if (!target[name] || !utils_default.isObject(target[name])) {
      target[name] = [];
    }
    const result = buildPath(path, value, target[name], index);
    if (result && utils_default.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }
    return !isNumericKey;
  }
  if (
    utils_default.isFormData(formData) &&
    utils_default.isFunction(formData.entries)
  ) {
    const obj = {};
    utils_default.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });
    return obj;
  }
  return null;
}
var formDataToJSON_default = formDataToJSON;

// ../../../../node_modules/axios/lib/defaults/index.js
function stringifySafely(rawValue, parser, encoder3) {
  if (utils_default.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils_default.trim(rawValue);
    } catch (e2) {
      if (e2.name !== "SyntaxError") {
        throw e2;
      }
    }
  }
  return (encoder3 || JSON.stringify)(rawValue);
}
var defaults = {
  transitional: transitional_default,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [
    function transformRequest(data, headers2) {
      const contentType = headers2.getContentType() || "";
      const hasJSONContentType = contentType.indexOf("application/json") > -1;
      const isObjectPayload = utils_default.isObject(data);
      if (isObjectPayload && utils_default.isHTMLForm(data)) {
        data = new FormData(data);
      }
      const isFormData2 = utils_default.isFormData(data);
      if (isFormData2) {
        return hasJSONContentType
          ? JSON.stringify(formDataToJSON_default(data))
          : data;
      }
      if (
        utils_default.isArrayBuffer(data) ||
        utils_default.isBuffer(data) ||
        utils_default.isStream(data) ||
        utils_default.isFile(data) ||
        utils_default.isBlob(data) ||
        utils_default.isReadableStream(data)
      ) {
        return data;
      }
      if (utils_default.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils_default.isURLSearchParams(data)) {
        headers2.setContentType(
          "application/x-www-form-urlencoded;charset=utf-8",
          false,
        );
        return data.toString();
      }
      let isFileList2;
      if (isObjectPayload) {
        if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
          return toURLEncodedForm(data, this.formSerializer).toString();
        }
        if (
          (isFileList2 = utils_default.isFileList(data)) ||
          contentType.indexOf("multipart/form-data") > -1
        ) {
          const _FormData = this.env && this.env.FormData;
          return toFormData_default(
            isFileList2 ? { "files[]": data } : data,
            _FormData && new _FormData(),
            this.formSerializer,
          );
        }
      }
      if (isObjectPayload || hasJSONContentType) {
        headers2.setContentType("application/json", false);
        return stringifySafely(data);
      }
      return data;
    },
  ],
  transformResponse: [
    function transformResponse(data) {
      const transitional2 = this.transitional || defaults.transitional;
      const forcedJSONParsing =
        transitional2 && transitional2.forcedJSONParsing;
      const JSONRequested = this.responseType === "json";
      if (
        utils_default.isResponse(data) ||
        utils_default.isReadableStream(data)
      ) {
        return data;
      }
      if (
        data &&
        utils_default.isString(data) &&
        ((forcedJSONParsing && !this.responseType) || JSONRequested)
      ) {
        const silentJSONParsing =
          transitional2 && transitional2.silentJSONParsing;
        const strictJSONParsing = !silentJSONParsing && JSONRequested;
        try {
          return JSON.parse(data);
        } catch (e2) {
          if (strictJSONParsing) {
            if (e2.name === "SyntaxError") {
              throw AxiosError_default.from(
                e2,
                AxiosError_default.ERR_BAD_RESPONSE,
                this,
                null,
                this.response,
              );
            }
            throw e2;
          }
        }
      }
      return data;
    },
  ],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: platform_default.classes.FormData,
    Blob: platform_default.classes.Blob,
  },
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": void 0,
    },
  },
};
utils_default.forEach(
  ["delete", "get", "head", "post", "put", "patch"],
  (method) => {
    defaults.headers[method] = {};
  },
);
var defaults_default = defaults;

// ../../../../node_modules/axios/lib/helpers/parseHeaders.js
var ignoreDuplicateOf = utils_default.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent",
]);
var parseHeaders_default = (rawHeaders) => {
  const parsed = {};
  let key;
  let val;
  let i4;
  rawHeaders &&
    rawHeaders.split("\n").forEach(function parser(line) {
      i4 = line.indexOf(":");
      key = line.substring(0, i4).trim().toLowerCase();
      val = line.substring(i4 + 1).trim();
      if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
        return;
      }
      if (key === "set-cookie") {
        if (parsed[key]) {
          parsed[key].push(val);
        } else {
          parsed[key] = [val];
        }
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
      }
    });
  return parsed;
};

// ../../../../node_modules/axios/lib/core/AxiosHeaders.js
var $internals = Symbol("internals");
function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}
function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }
  return utils_default.isArray(value)
    ? value.map(normalizeValue)
    : String(value);
}
function parseTokens(str) {
  const tokens = /* @__PURE__ */ Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;
  while ((match = tokensRE.exec(str))) {
    tokens[match[1]] = match[2];
  }
  return tokens;
}
var isValidHeaderName = (str) =>
  /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
function matchHeaderValue(context, value, header, filter2, isHeaderNameFilter) {
  if (utils_default.isFunction(filter2)) {
    return filter2.call(this, value, header);
  }
  if (isHeaderNameFilter) {
    value = header;
  }
  if (!utils_default.isString(value)) return;
  if (utils_default.isString(filter2)) {
    return value.indexOf(filter2) !== -1;
  }
  if (utils_default.isRegExp(filter2)) {
    return filter2.test(value);
  }
}
function formatHeader(header) {
  return header
    .trim()
    .toLowerCase()
    .replace(/([a-z\d])(\w*)/g, (w3, char, str) => {
      return char.toUpperCase() + str;
    });
}
function buildAccessors(obj, header) {
  const accessorName = utils_default.toCamelCase(" " + header);
  ["get", "set", "has"].forEach((methodName) => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function (arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true,
    });
  });
}
var AxiosHeaders = class {
  constructor(headers2) {
    headers2 && this.set(headers2);
  }
  set(header, valueOrRewrite, rewrite) {
    const self2 = this;
    function setHeader(_value, _header2, _rewrite) {
      const lHeader = normalizeHeader(_header2);
      if (!lHeader) {
        throw new Error("header name must be a non-empty string");
      }
      const key = utils_default.findKey(self2, lHeader);
      if (
        !key ||
        self2[key] === void 0 ||
        _rewrite === true ||
        (_rewrite === void 0 && self2[key] !== false)
      ) {
        self2[key || _header2] = normalizeValue(_value);
      }
    }
    const setHeaders = (headers2, _rewrite) =>
      utils_default.forEach(headers2, (_value, _header2) =>
        setHeader(_value, _header2, _rewrite),
      );
    if (
      utils_default.isPlainObject(header) ||
      header instanceof this.constructor
    ) {
      setHeaders(header, valueOrRewrite);
    } else if (
      utils_default.isString(header) &&
      (header = header.trim()) &&
      !isValidHeaderName(header)
    ) {
      setHeaders(parseHeaders_default(header), valueOrRewrite);
    } else if (
      utils_default.isObject(header) &&
      utils_default.isIterable(header)
    ) {
      let obj = {},
        dest,
        key;
      for (const entry of header) {
        if (!utils_default.isArray(entry)) {
          throw TypeError("Object iterator must return a key-value pair");
        }
        obj[(key = entry[0])] = (dest = obj[key])
          ? utils_default.isArray(dest)
            ? [...dest, entry[1]]
            : [dest, entry[1]]
          : entry[1];
      }
      setHeaders(obj, valueOrRewrite);
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }
    return this;
  }
  get(header, parser) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils_default.findKey(this, header);
      if (key) {
        const value = this[key];
        if (!parser) {
          return value;
        }
        if (parser === true) {
          return parseTokens(value);
        }
        if (utils_default.isFunction(parser)) {
          return parser.call(this, value, key);
        }
        if (utils_default.isRegExp(parser)) {
          return parser.exec(value);
        }
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(header, matcher) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils_default.findKey(this, header);
      return !!(
        key &&
        this[key] !== void 0 &&
        (!matcher || matchHeaderValue(this, this[key], key, matcher))
      );
    }
    return false;
  }
  delete(header, matcher) {
    const self2 = this;
    let deleted = false;
    function deleteHeader(_header2) {
      _header2 = normalizeHeader(_header2);
      if (_header2) {
        const key = utils_default.findKey(self2, _header2);
        if (
          key &&
          (!matcher || matchHeaderValue(self2, self2[key], key, matcher))
        ) {
          delete self2[key];
          deleted = true;
        }
      }
    }
    if (utils_default.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }
    return deleted;
  }
  clear(matcher) {
    const keys = Object.keys(this);
    let i4 = keys.length;
    let deleted = false;
    while (i4--) {
      const key = keys[i4];
      if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }
    return deleted;
  }
  normalize(format) {
    const self2 = this;
    const headers2 = {};
    utils_default.forEach(this, (value, header) => {
      const key = utils_default.findKey(headers2, header);
      if (key) {
        self2[key] = normalizeValue(value);
        delete self2[header];
        return;
      }
      const normalized = format ? formatHeader(header) : String(header).trim();
      if (normalized !== header) {
        delete self2[header];
      }
      self2[normalized] = normalizeValue(value);
      headers2[normalized] = true;
    });
    return this;
  }
  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }
  toJSON(asStrings) {
    const obj = /* @__PURE__ */ Object.create(null);
    utils_default.forEach(this, (value, header) => {
      value != null &&
        value !== false &&
        (obj[header] =
          asStrings && utils_default.isArray(value) ? value.join(", ") : value);
    });
    return obj;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON())
      .map(([header, value]) => header + ": " + value)
      .join("\n");
  }
  getSetCookie() {
    return this.get("set-cookie") || [];
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }
  static concat(first, ...targets) {
    const computed = new this(first);
    targets.forEach((target) => computed.set(target));
    return computed;
  }
  static accessor(header) {
    const internals =
      (this[$internals] =
      this[$internals] =
        {
          accessors: {},
        });
    const accessors = internals.accessors;
    const prototype3 = this.prototype;
    function defineAccessor(_header2) {
      const lHeader = normalizeHeader(_header2);
      if (!accessors[lHeader]) {
        buildAccessors(prototype3, _header2);
        accessors[lHeader] = true;
      }
    }
    utils_default.isArray(header)
      ? header.forEach(defineAccessor)
      : defineAccessor(header);
    return this;
  }
};
AxiosHeaders.accessor([
  "Content-Type",
  "Content-Length",
  "Accept",
  "Accept-Encoding",
  "User-Agent",
  "Authorization",
]);
utils_default.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1);
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    },
  };
});
utils_default.freezeMethods(AxiosHeaders);
var AxiosHeaders_default = AxiosHeaders;

// ../../../../node_modules/axios/lib/core/transformData.js
function transformData(fns, response) {
  const config = this || defaults_default;
  const context = response || config;
  const headers2 = AxiosHeaders_default.from(context.headers);
  let data = context.data;
  utils_default.forEach(fns, function transform(fn) {
    data = fn.call(
      config,
      data,
      headers2.normalize(),
      response ? response.status : void 0,
    );
  });
  headers2.normalize();
  return data;
}

// ../../../../node_modules/axios/lib/cancel/isCancel.js
function isCancel(value) {
  return !!(value && value.__CANCEL__);
}

// ../../../../node_modules/axios/lib/cancel/CanceledError.js
function CanceledError(message2, config, request) {
  AxiosError_default.call(
    this,
    message2 == null ? "canceled" : message2,
    AxiosError_default.ERR_CANCELED,
    config,
    request,
  );
  this.name = "CanceledError";
}
utils_default.inherits(CanceledError, AxiosError_default, {
  __CANCEL__: true,
});
var CanceledError_default = CanceledError;

// ../../../../node_modules/axios/lib/core/settle.js
function settle(resolve, reject, response) {
  const validateStatus2 = response.config.validateStatus;
  if (
    !response.status ||
    !validateStatus2 ||
    validateStatus2(response.status)
  ) {
    resolve(response);
  } else {
    reject(
      new AxiosError_default(
        "Request failed with status code " + response.status,
        [
          AxiosError_default.ERR_BAD_REQUEST,
          AxiosError_default.ERR_BAD_RESPONSE,
        ][Math.floor(response.status / 100) - 4],
        response.config,
        response.request,
        response,
      ),
    );
  }
}

// ../../../../node_modules/axios/lib/helpers/parseProtocol.js
function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return (match && match[1]) || "";
}

// ../../../../node_modules/axios/lib/helpers/speedometer.js
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;
  min = min !== void 0 ? min : 1e3;
  return function push(chunkLength) {
    const now3 = Date.now();
    const startedAt = timestamps[tail];
    if (!firstSampleTS) {
      firstSampleTS = now3;
    }
    bytes[head] = chunkLength;
    timestamps[head] = now3;
    let i4 = tail;
    let bytesCount = 0;
    while (i4 !== head) {
      bytesCount += bytes[i4++];
      i4 = i4 % samplesCount;
    }
    head = (head + 1) % samplesCount;
    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }
    if (now3 - firstSampleTS < min) {
      return;
    }
    const passed = startedAt && now3 - startedAt;
    return passed ? Math.round((bytesCount * 1e3) / passed) : void 0;
  };
}
var speedometer_default = speedometer;

// ../../../../node_modules/axios/lib/helpers/throttle.js
function throttle(fn, freq) {
  let timestamp = 0;
  let threshold = 1e3 / freq;
  let lastArgs;
  let timer;
  const invoke = (args, now3 = Date.now()) => {
    timestamp = now3;
    lastArgs = null;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    fn.apply(null, args);
  };
  const throttled = (...args) => {
    const now3 = Date.now();
    const passed = now3 - timestamp;
    if (passed >= threshold) {
      invoke(args, now3);
    } else {
      lastArgs = args;
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          invoke(lastArgs);
        }, threshold - passed);
      }
    }
  };
  const flush = () => lastArgs && invoke(lastArgs);
  return [throttled, flush];
}
var throttle_default = throttle;

// ../../../../node_modules/axios/lib/helpers/progressEventReducer.js
var progressEventReducer = (listener, isDownloadStream, freq = 3) => {
  let bytesNotified = 0;
  const _speedometer = speedometer_default(50, 250);
  return throttle_default((e2) => {
    const loaded = e2.loaded;
    const total = e2.lengthComputable ? e2.total : void 0;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;
    bytesNotified = loaded;
    const data = {
      loaded,
      total,
      progress: total ? loaded / total : void 0,
      bytes: progressBytes,
      rate: rate ? rate : void 0,
      estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
      event: e2,
      lengthComputable: total != null,
      [isDownloadStream ? "download" : "upload"]: true,
    };
    listener(data);
  }, freq);
};
var progressEventDecorator = (total, throttled) => {
  const lengthComputable = total != null;
  return [
    (loaded) =>
      throttled[0]({
        lengthComputable,
        total,
        loaded,
      }),
    throttled[1],
  ];
};
var asyncDecorator =
  (fn) =>
  (...args) =>
    utils_default.asap(() => fn(...args));

// ../../../../node_modules/axios/lib/helpers/isURLSameOrigin.js
var isURLSameOrigin_default = platform_default.hasStandardBrowserEnv
  ? ((origin2, isMSIE) => (url) => {
      url = new URL(url, platform_default.origin);
      return (
        origin2.protocol === url.protocol &&
        origin2.host === url.host &&
        (isMSIE || origin2.port === url.port)
      );
    })(
      new URL(platform_default.origin),
      platform_default.navigator &&
        /(msie|trident)/i.test(platform_default.navigator.userAgent),
    )
  : () => true;

// ../../../../node_modules/axios/lib/helpers/cookies.js
var cookies_default = platform_default.hasStandardBrowserEnv
  ? // Standard browser envs support document.cookie
    {
      write(name, value, expires, path, domain, secure) {
        const cookie = [name + "=" + encodeURIComponent(value)];
        utils_default.isNumber(expires) &&
          cookie.push("expires=" + new Date(expires).toGMTString());
        utils_default.isString(path) && cookie.push("path=" + path);
        utils_default.isString(domain) && cookie.push("domain=" + domain);
        secure === true && cookie.push("secure");
        document.cookie = cookie.join("; ");
      },
      read(name) {
        const match = document.cookie.match(
          new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"),
        );
        return match ? decodeURIComponent(match[3]) : null;
      },
      remove(name) {
        this.write(name, "", Date.now() - 864e5);
      },
    }
  : // Non-standard browser env (web workers, react-native) lack needed support.
    {
      write() {},
      read() {
        return null;
      },
      remove() {},
    };

// ../../../../node_modules/axios/lib/helpers/isAbsoluteURL.js
function isAbsoluteURL(url) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

// ../../../../node_modules/axios/lib/helpers/combineURLs.js
function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "")
    : baseURL;
}

// ../../../../node_modules/axios/lib/core/buildFullPath.js
function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
  let isRelativeUrl = !isAbsoluteURL(requestedURL);
  if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}

// ../../../../node_modules/axios/lib/core/mergeConfig.js
var headersToObject = (thing) =>
  thing instanceof AxiosHeaders_default ? { ...thing } : thing;
function mergeConfig(config1, config2) {
  config2 = config2 || {};
  const config = {};
  function getMergedValue(target, source, prop, caseless) {
    if (
      utils_default.isPlainObject(target) &&
      utils_default.isPlainObject(source)
    ) {
      return utils_default.merge.call({ caseless }, target, source);
    } else if (utils_default.isPlainObject(source)) {
      return utils_default.merge({}, source);
    } else if (utils_default.isArray(source)) {
      return source.slice();
    }
    return source;
  }
  function mergeDeepProperties(a3, b2, prop, caseless) {
    if (!utils_default.isUndefined(b2)) {
      return getMergedValue(a3, b2, prop, caseless);
    } else if (!utils_default.isUndefined(a3)) {
      return getMergedValue(void 0, a3, prop, caseless);
    }
  }
  function valueFromConfig2(a3, b2) {
    if (!utils_default.isUndefined(b2)) {
      return getMergedValue(void 0, b2);
    }
  }
  function defaultToConfig2(a3, b2) {
    if (!utils_default.isUndefined(b2)) {
      return getMergedValue(void 0, b2);
    } else if (!utils_default.isUndefined(a3)) {
      return getMergedValue(void 0, a3);
    }
  }
  function mergeDirectKeys(a3, b2, prop) {
    if (prop in config2) {
      return getMergedValue(a3, b2);
    } else if (prop in config1) {
      return getMergedValue(void 0, a3);
    }
  }
  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a3, b2, prop) =>
      mergeDeepProperties(headersToObject(a3), headersToObject(b2), prop, true),
  };
  utils_default.forEach(
    Object.keys(Object.assign({}, config1, config2)),
    function computeConfigValue(prop) {
      const merge3 = mergeMap[prop] || mergeDeepProperties;
      const configValue = merge3(config1[prop], config2[prop], prop);
      (utils_default.isUndefined(configValue) && merge3 !== mergeDirectKeys) ||
        (config[prop] = configValue);
    },
  );
  return config;
}

// ../../../../node_modules/axios/lib/helpers/resolveConfig.js
var resolveConfig_default = (config) => {
  const newConfig = mergeConfig({}, config);
  let {
    data,
    withXSRFToken,
    xsrfHeaderName,
    xsrfCookieName,
    headers: headers2,
    auth: auth2,
  } = newConfig;
  newConfig.headers = headers2 = AxiosHeaders_default.from(headers2);
  newConfig.url = buildURL(
    buildFullPath(
      newConfig.baseURL,
      newConfig.url,
      newConfig.allowAbsoluteUrls,
    ),
    config.params,
    config.paramsSerializer,
  );
  if (auth2) {
    headers2.set(
      "Authorization",
      "Basic " +
        btoa(
          (auth2.username || "") +
            ":" +
            (auth2.password
              ? unescape(encodeURIComponent(auth2.password))
              : ""),
        ),
    );
  }
  let contentType;
  if (utils_default.isFormData(data)) {
    if (
      platform_default.hasStandardBrowserEnv ||
      platform_default.hasStandardBrowserWebWorkerEnv
    ) {
      headers2.setContentType(void 0);
    } else if ((contentType = headers2.getContentType()) !== false) {
      const [type, ...tokens] = contentType
        ? contentType
            .split(";")
            .map((token) => token.trim())
            .filter(Boolean)
        : [];
      headers2.setContentType(
        [type || "multipart/form-data", ...tokens].join("; "),
      );
    }
  }
  if (platform_default.hasStandardBrowserEnv) {
    withXSRFToken &&
      utils_default.isFunction(withXSRFToken) &&
      (withXSRFToken = withXSRFToken(newConfig));
    if (
      withXSRFToken ||
      (withXSRFToken !== false && isURLSameOrigin_default(newConfig.url))
    ) {
      const xsrfValue =
        xsrfHeaderName &&
        xsrfCookieName &&
        cookies_default.read(xsrfCookieName);
      if (xsrfValue) {
        headers2.set(xsrfHeaderName, xsrfValue);
      }
    }
  }
  return newConfig;
};

// ../../../../node_modules/axios/lib/adapters/xhr.js
var isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
var xhr_default =
  isXHRAdapterSupported &&
  function (config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      const _config = resolveConfig_default(config);
      let requestData = _config.data;
      const requestHeaders = AxiosHeaders_default.from(
        _config.headers,
      ).normalize();
      let { responseType, onUploadProgress, onDownloadProgress } = _config;
      let onCanceled;
      let uploadThrottled, downloadThrottled;
      let flushUpload, flushDownload;
      function done() {
        flushUpload && flushUpload();
        flushDownload && flushDownload();
        _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
        _config.signal &&
          _config.signal.removeEventListener("abort", onCanceled);
      }
      let request = new XMLHttpRequest();
      request.open(_config.method.toUpperCase(), _config.url, true);
      request.timeout = _config.timeout;
      function onloadend() {
        if (!request) {
          return;
        }
        const responseHeaders = AxiosHeaders_default.from(
          "getAllResponseHeaders" in request && request.getAllResponseHeaders(),
        );
        const responseData =
          !responseType || responseType === "text" || responseType === "json"
            ? request.responseText
            : request.response;
        const response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request,
        };
        settle(
          function _resolve(value) {
            resolve(value);
            done();
          },
          function _reject(err) {
            reject(err);
            done();
          },
          response,
        );
        request = null;
      }
      if ("onloadend" in request) {
        request.onloadend = onloadend;
      } else {
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          }
          if (
            request.status === 0 &&
            !(request.responseURL && request.responseURL.indexOf("file:") === 0)
          ) {
            return;
          }
          setTimeout(onloadend);
        };
      }
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }
        reject(
          new AxiosError_default(
            "Request aborted",
            AxiosError_default.ECONNABORTED,
            config,
            request,
          ),
        );
        request = null;
      };
      request.onerror = function handleError() {
        reject(
          new AxiosError_default(
            "Network Error",
            AxiosError_default.ERR_NETWORK,
            config,
            request,
          ),
        );
        request = null;
      };
      request.ontimeout = function handleTimeout() {
        let timeoutErrorMessage = _config.timeout
          ? "timeout of " + _config.timeout + "ms exceeded"
          : "timeout exceeded";
        const transitional2 = _config.transitional || transitional_default;
        if (_config.timeoutErrorMessage) {
          timeoutErrorMessage = _config.timeoutErrorMessage;
        }
        reject(
          new AxiosError_default(
            timeoutErrorMessage,
            transitional2.clarifyTimeoutError
              ? AxiosError_default.ETIMEDOUT
              : AxiosError_default.ECONNABORTED,
            config,
            request,
          ),
        );
        request = null;
      };
      requestData === void 0 && requestHeaders.setContentType(null);
      if ("setRequestHeader" in request) {
        utils_default.forEach(
          requestHeaders.toJSON(),
          function setRequestHeader(val, key) {
            request.setRequestHeader(key, val);
          },
        );
      }
      if (!utils_default.isUndefined(_config.withCredentials)) {
        request.withCredentials = !!_config.withCredentials;
      }
      if (responseType && responseType !== "json") {
        request.responseType = _config.responseType;
      }
      if (onDownloadProgress) {
        [downloadThrottled, flushDownload] = progressEventReducer(
          onDownloadProgress,
          true,
        );
        request.addEventListener("progress", downloadThrottled);
      }
      if (onUploadProgress && request.upload) {
        [uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);
        request.upload.addEventListener("progress", uploadThrottled);
        request.upload.addEventListener("loadend", flushUpload);
      }
      if (_config.cancelToken || _config.signal) {
        onCanceled = (cancel) => {
          if (!request) {
            return;
          }
          reject(
            !cancel || cancel.type
              ? new CanceledError_default(null, config, request)
              : cancel,
          );
          request.abort();
          request = null;
        };
        _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
        if (_config.signal) {
          _config.signal.aborted
            ? onCanceled()
            : _config.signal.addEventListener("abort", onCanceled);
        }
      }
      const protocol = parseProtocol(_config.url);
      if (protocol && platform_default.protocols.indexOf(protocol) === -1) {
        reject(
          new AxiosError_default(
            "Unsupported protocol " + protocol + ":",
            AxiosError_default.ERR_BAD_REQUEST,
            config,
          ),
        );
        return;
      }
      request.send(requestData || null);
    });
  };

// ../../../../node_modules/axios/lib/helpers/composeSignals.js
var composeSignals = (signals, timeout) => {
  const { length } = (signals = signals ? signals.filter(Boolean) : []);
  if (timeout || length) {
    let controller = new AbortController();
    let aborted;
    const onabort = function (reason) {
      if (!aborted) {
        aborted = true;
        unsubscribe();
        const err = reason instanceof Error ? reason : this.reason;
        controller.abort(
          err instanceof AxiosError_default
            ? err
            : new CanceledError_default(
                err instanceof Error ? err.message : err,
              ),
        );
      }
    };
    let timer =
      timeout &&
      setTimeout(() => {
        timer = null;
        onabort(
          new AxiosError_default(
            `timeout ${timeout} of ms exceeded`,
            AxiosError_default.ETIMEDOUT,
          ),
        );
      }, timeout);
    const unsubscribe = () => {
      if (signals) {
        timer && clearTimeout(timer);
        timer = null;
        signals.forEach((signal3) => {
          signal3.unsubscribe
            ? signal3.unsubscribe(onabort)
            : signal3.removeEventListener("abort", onabort);
        });
        signals = null;
      }
    };
    signals.forEach((signal3) => signal3.addEventListener("abort", onabort));
    const { signal: signal2 } = controller;
    signal2.unsubscribe = () => utils_default.asap(unsubscribe);
    return signal2;
  }
};
var composeSignals_default = composeSignals;

// ../../../../node_modules/axios/lib/helpers/trackStream.js
var streamChunk = function* (chunk, chunkSize) {
  let len = chunk.byteLength;
  if (!chunkSize || len < chunkSize) {
    yield chunk;
    return;
  }
  let pos = 0;
  let end;
  while (pos < len) {
    end = pos + chunkSize;
    yield chunk.slice(pos, end);
    pos = end;
  }
};
var readBytes = async function* (iterable, chunkSize) {
  for await (const chunk of readStream(iterable)) {
    yield* streamChunk(chunk, chunkSize);
  }
};
var readStream = async function* (stream) {
  if (stream[Symbol.asyncIterator]) {
    yield* stream;
    return;
  }
  const reader = stream.getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      yield value;
    }
  } finally {
    await reader.cancel();
  }
};
var trackStream = (stream, chunkSize, onProgress, onFinish) => {
  const iterator2 = readBytes(stream, chunkSize);
  let bytes = 0;
  let done;
  let _onFinish = (e2) => {
    if (!done) {
      done = true;
      onFinish && onFinish(e2);
    }
  };
  return new ReadableStream(
    {
      async pull(controller) {
        try {
          const { done: done2, value } = await iterator2.next();
          if (done2) {
            _onFinish();
            controller.close();
            return;
          }
          let len = value.byteLength;
          if (onProgress) {
            let loadedBytes = (bytes += len);
            onProgress(loadedBytes);
          }
          controller.enqueue(new Uint8Array(value));
        } catch (err) {
          _onFinish(err);
          throw err;
        }
      },
      cancel(reason) {
        _onFinish(reason);
        return iterator2.return();
      },
    },
    {
      highWaterMark: 2,
    },
  );
};

// ../../../../node_modules/axios/lib/adapters/fetch.js
var isFetchSupported =
  typeof fetch === "function" &&
  typeof Request === "function" &&
  typeof Response === "function";
var isReadableStreamSupported =
  isFetchSupported && typeof ReadableStream === "function";
var encodeText =
  isFetchSupported &&
  (typeof TextEncoder === "function"
    ? (
        (encoder3) => (str) =>
          encoder3.encode(str)
      )(new TextEncoder())
    : async (str) => new Uint8Array(await new Response(str).arrayBuffer()));
var test = (fn, ...args) => {
  try {
    return !!fn(...args);
  } catch (e2) {
    return false;
  }
};
var supportsRequestStream =
  isReadableStreamSupported &&
  test(() => {
    let duplexAccessed = false;
    const hasContentType = new Request(platform_default.origin, {
      body: new ReadableStream(),
      method: "POST",
      get duplex() {
        duplexAccessed = true;
        return "half";
      },
    }).headers.has("Content-Type");
    return duplexAccessed && !hasContentType;
  });
var DEFAULT_CHUNK_SIZE = 64 * 1024;
var supportsResponseStream =
  isReadableStreamSupported &&
  test(() => utils_default.isReadableStream(new Response("").body));
var resolvers = {
  stream: supportsResponseStream && ((res) => res.body),
};
isFetchSupported &&
  ((res) => {
    ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((type) => {
      !resolvers[type] &&
        (resolvers[type] = utils_default.isFunction(res[type])
          ? (res2) => res2[type]()
          : (_3, config) => {
              throw new AxiosError_default(
                `Response type '${type}' is not supported`,
                AxiosError_default.ERR_NOT_SUPPORT,
                config,
              );
            });
    });
  })(new Response());
var getBodyLength = async (body) => {
  if (body == null) {
    return 0;
  }
  if (utils_default.isBlob(body)) {
    return body.size;
  }
  if (utils_default.isSpecCompliantForm(body)) {
    const _request = new Request(platform_default.origin, {
      method: "POST",
      body,
    });
    return (await _request.arrayBuffer()).byteLength;
  }
  if (
    utils_default.isArrayBufferView(body) ||
    utils_default.isArrayBuffer(body)
  ) {
    return body.byteLength;
  }
  if (utils_default.isURLSearchParams(body)) {
    body = body + "";
  }
  if (utils_default.isString(body)) {
    return (await encodeText(body)).byteLength;
  }
};
var resolveBodyLength = async (headers2, body) => {
  const length = utils_default.toFiniteNumber(headers2.getContentLength());
  return length == null ? getBodyLength(body) : length;
};
var fetch_default =
  isFetchSupported &&
  (async (config) => {
    let {
      url,
      method,
      data,
      signal: signal2,
      cancelToken,
      timeout,
      onDownloadProgress,
      onUploadProgress,
      responseType,
      headers: headers2,
      withCredentials = "same-origin",
      fetchOptions,
    } = resolveConfig_default(config);
    responseType = responseType ? (responseType + "").toLowerCase() : "text";
    let composedSignal = composeSignals_default(
      [signal2, cancelToken && cancelToken.toAbortSignal()],
      timeout,
    );
    let request;
    const unsubscribe =
      composedSignal &&
      composedSignal.unsubscribe &&
      (() => {
        composedSignal.unsubscribe();
      });
    let requestContentLength;
    try {
      if (
        onUploadProgress &&
        supportsRequestStream &&
        method !== "get" &&
        method !== "head" &&
        (requestContentLength = await resolveBodyLength(headers2, data)) !== 0
      ) {
        let _request = new Request(url, {
          method: "POST",
          body: data,
          duplex: "half",
        });
        let contentTypeHeader;
        if (
          utils_default.isFormData(data) &&
          (contentTypeHeader = _request.headers.get("content-type"))
        ) {
          headers2.setContentType(contentTypeHeader);
        }
        if (_request.body) {
          const [onProgress, flush] = progressEventDecorator(
            requestContentLength,
            progressEventReducer(asyncDecorator(onUploadProgress)),
          );
          data = trackStream(
            _request.body,
            DEFAULT_CHUNK_SIZE,
            onProgress,
            flush,
          );
        }
      }
      if (!utils_default.isString(withCredentials)) {
        withCredentials = withCredentials ? "include" : "omit";
      }
      const isCredentialsSupported = "credentials" in Request.prototype;
      request = new Request(url, {
        ...fetchOptions,
        signal: composedSignal,
        method: method.toUpperCase(),
        headers: headers2.normalize().toJSON(),
        body: data,
        duplex: "half",
        credentials: isCredentialsSupported ? withCredentials : void 0,
      });
      let response = await fetch(request);
      const isStreamResponse =
        supportsResponseStream &&
        (responseType === "stream" || responseType === "response");
      if (
        supportsResponseStream &&
        (onDownloadProgress || (isStreamResponse && unsubscribe))
      ) {
        const options = {};
        ["status", "statusText", "headers"].forEach((prop) => {
          options[prop] = response[prop];
        });
        const responseContentLength = utils_default.toFiniteNumber(
          response.headers.get("content-length"),
        );
        const [onProgress, flush] =
          (onDownloadProgress &&
            progressEventDecorator(
              responseContentLength,
              progressEventReducer(asyncDecorator(onDownloadProgress), true),
            )) ||
          [];
        response = new Response(
          trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
            flush && flush();
            unsubscribe && unsubscribe();
          }),
          options,
        );
      }
      responseType = responseType || "text";
      let responseData = await resolvers[
        utils_default.findKey(resolvers, responseType) || "text"
      ](response, config);
      !isStreamResponse && unsubscribe && unsubscribe();
      return await new Promise((resolve, reject) => {
        settle(resolve, reject, {
          data: responseData,
          headers: AxiosHeaders_default.from(response.headers),
          status: response.status,
          statusText: response.statusText,
          config,
          request,
        });
      });
    } catch (err) {
      unsubscribe && unsubscribe();
      if (
        err &&
        err.name === "TypeError" &&
        /Load failed|fetch/i.test(err.message)
      ) {
        throw Object.assign(
          new AxiosError_default(
            "Network Error",
            AxiosError_default.ERR_NETWORK,
            config,
            request,
          ),
          {
            cause: err.cause || err,
          },
        );
      }
      throw AxiosError_default.from(err, err && err.code, config, request);
    }
  });

// ../../../../node_modules/axios/lib/adapters/adapters.js
var knownAdapters = {
  http: null_default,
  xhr: xhr_default,
  fetch: fetch_default,
};
utils_default.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, "name", { value });
    } catch (e2) {}
    Object.defineProperty(fn, "adapterName", { value });
  }
});
var renderReason = (reason) => `- ${reason}`;
var isResolvedHandle = (adapter) =>
  utils_default.isFunction(adapter) || adapter === null || adapter === false;
var adapters_default = {
  getAdapter: (adapters) => {
    adapters = utils_default.isArray(adapters) ? adapters : [adapters];
    const { length } = adapters;
    let nameOrAdapter;
    let adapter;
    const rejectedReasons = {};
    for (let i4 = 0; i4 < length; i4++) {
      nameOrAdapter = adapters[i4];
      let id;
      adapter = nameOrAdapter;
      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
        if (adapter === void 0) {
          throw new AxiosError_default(`Unknown adapter '${id}'`);
        }
      }
      if (adapter) {
        break;
      }
      rejectedReasons[id || "#" + i4] = adapter;
    }
    if (!adapter) {
      const reasons = Object.entries(rejectedReasons).map(
        ([id, state2]) =>
          `adapter ${id} ` +
          (state2 === false
            ? "is not supported by the environment"
            : "is not available in the build"),
      );
      let s3 = length
        ? reasons.length > 1
          ? "since :\n" + reasons.map(renderReason).join("\n")
          : " " + renderReason(reasons[0])
        : "as no adapter specified";
      throw new AxiosError_default(
        `There is no suitable adapter to dispatch the request ` + s3,
        "ERR_NOT_SUPPORT",
      );
    }
    return adapter;
  },
  adapters: knownAdapters,
};

// ../../../../node_modules/axios/lib/core/dispatchRequest.js
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
  if (config.signal && config.signal.aborted) {
    throw new CanceledError_default(null, config);
  }
}
function dispatchRequest(config) {
  throwIfCancellationRequested(config);
  config.headers = AxiosHeaders_default.from(config.headers);
  config.data = transformData.call(config, config.transformRequest);
  if (["post", "put", "patch"].indexOf(config.method) !== -1) {
    config.headers.setContentType("application/x-www-form-urlencoded", false);
  }
  const adapter = adapters_default.getAdapter(
    config.adapter || defaults_default.adapter,
  );
  return adapter(config).then(
    function onAdapterResolution(response) {
      throwIfCancellationRequested(config);
      response.data = transformData.call(
        config,
        config.transformResponse,
        response,
      );
      response.headers = AxiosHeaders_default.from(response.headers);
      return response;
    },
    function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config);
        if (reason && reason.response) {
          reason.response.data = transformData.call(
            config,
            config.transformResponse,
            reason.response,
          );
          reason.response.headers = AxiosHeaders_default.from(
            reason.response.headers,
          );
        }
      }
      return Promise.reject(reason);
    },
  );
}

// ../../../../node_modules/axios/lib/env/data.js
var VERSION = "1.9.0";

// ../../../../node_modules/axios/lib/helpers/validator.js
var validators = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach(
  (type, i4) => {
    validators[type] = function validator(thing) {
      return typeof thing === type || "a" + (i4 < 1 ? "n " : " ") + type;
    };
  },
);
var deprecatedWarnings = {};
validators.transitional = function transitional(validator, version, message2) {
  function formatMessage(opt, desc) {
    return (
      "[Axios v" +
      VERSION +
      "] Transitional option '" +
      opt +
      "'" +
      desc +
      (message2 ? ". " + message2 : "")
    );
  }
  return (value, opt, opts) => {
    if (validator === false) {
      throw new AxiosError_default(
        formatMessage(
          opt,
          " has been removed" + (version ? " in " + version : ""),
        ),
        AxiosError_default.ERR_DEPRECATED,
      );
    }
    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      console.warn(
        formatMessage(
          opt,
          " has been deprecated since v" +
            version +
            " and will be removed in the near future",
        ),
      );
    }
    return validator ? validator(value, opt, opts) : true;
  };
};
validators.spelling = function spelling(correctSpelling) {
  return (value, opt) => {
    console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
    return true;
  };
};
function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== "object") {
    throw new AxiosError_default(
      "options must be an object",
      AxiosError_default.ERR_BAD_OPTION_VALUE,
    );
  }
  const keys = Object.keys(options);
  let i4 = keys.length;
  while (i4-- > 0) {
    const opt = keys[i4];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === void 0 || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError_default(
          "option " + opt + " must be " + result,
          AxiosError_default.ERR_BAD_OPTION_VALUE,
        );
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError_default(
        "Unknown option " + opt,
        AxiosError_default.ERR_BAD_OPTION,
      );
    }
  }
}
var validator_default = {
  assertOptions,
  validators,
};

// ../../../../node_modules/axios/lib/core/Axios.js
var validators2 = validator_default.validators;
var Axios = class {
  constructor(instanceConfig) {
    this.defaults = instanceConfig || {};
    this.interceptors = {
      request: new InterceptorManager_default(),
      response: new InterceptorManager_default(),
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(configOrUrl, config) {
    try {
      return await this._request(configOrUrl, config);
    } catch (err) {
      if (err instanceof Error) {
        let dummy = {};
        Error.captureStackTrace
          ? Error.captureStackTrace(dummy)
          : (dummy = new Error());
        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, "") : "";
        try {
          if (!err.stack) {
            err.stack = stack;
          } else if (
            stack &&
            !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ""))
          ) {
            err.stack += "\n" + stack;
          }
        } catch (e2) {}
      }
      throw err;
    }
  }
  _request(configOrUrl, config) {
    if (typeof configOrUrl === "string") {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }
    config = mergeConfig(this.defaults, config);
    const {
      transitional: transitional2,
      paramsSerializer,
      headers: headers2,
    } = config;
    if (transitional2 !== void 0) {
      validator_default.assertOptions(
        transitional2,
        {
          silentJSONParsing: validators2.transitional(validators2.boolean),
          forcedJSONParsing: validators2.transitional(validators2.boolean),
          clarifyTimeoutError: validators2.transitional(validators2.boolean),
        },
        false,
      );
    }
    if (paramsSerializer != null) {
      if (utils_default.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer,
        };
      } else {
        validator_default.assertOptions(
          paramsSerializer,
          {
            encode: validators2.function,
            serialize: validators2.function,
          },
          true,
        );
      }
    }
    if (config.allowAbsoluteUrls !== void 0) {
    } else if (this.defaults.allowAbsoluteUrls !== void 0) {
      config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
    } else {
      config.allowAbsoluteUrls = true;
    }
    validator_default.assertOptions(
      config,
      {
        baseUrl: validators2.spelling("baseURL"),
        withXsrfToken: validators2.spelling("withXSRFToken"),
      },
      true,
    );
    config.method = (
      config.method ||
      this.defaults.method ||
      "get"
    ).toLowerCase();
    let contextHeaders =
      headers2 && utils_default.merge(headers2.common, headers2[config.method]);
    headers2 &&
      utils_default.forEach(
        ["delete", "get", "head", "post", "put", "patch", "common"],
        (method) => {
          delete headers2[method];
        },
      );
    config.headers = AxiosHeaders_default.concat(contextHeaders, headers2);
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(
      function unshiftRequestInterceptors(interceptor) {
        if (
          typeof interceptor.runWhen === "function" &&
          interceptor.runWhen(config) === false
        ) {
          return;
        }
        synchronousRequestInterceptors =
          synchronousRequestInterceptors && interceptor.synchronous;
        requestInterceptorChain.unshift(
          interceptor.fulfilled,
          interceptor.rejected,
        );
      },
    );
    const responseInterceptorChain = [];
    this.interceptors.response.forEach(
      function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(
          interceptor.fulfilled,
          interceptor.rejected,
        );
      },
    );
    let promise;
    let i4 = 0;
    let len;
    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), void 0];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;
      promise = Promise.resolve(config);
      while (i4 < len) {
        promise = promise.then(chain[i4++], chain[i4++]);
      }
      return promise;
    }
    len = requestInterceptorChain.length;
    let newConfig = config;
    i4 = 0;
    while (i4 < len) {
      const onFulfilled = requestInterceptorChain[i4++];
      const onRejected = requestInterceptorChain[i4++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }
    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }
    i4 = 0;
    len = responseInterceptorChain.length;
    while (i4 < len) {
      promise = promise.then(
        responseInterceptorChain[i4++],
        responseInterceptorChain[i4++],
      );
    }
    return promise;
  }
  getUri(config) {
    config = mergeConfig(this.defaults, config);
    const fullPath = buildFullPath(
      config.baseURL,
      config.url,
      config.allowAbsoluteUrls,
    );
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
};
utils_default.forEach(
  ["delete", "get", "head", "options"],
  function forEachMethodNoData(method) {
    Axios.prototype[method] = function (url, config) {
      return this.request(
        mergeConfig(config || {}, {
          method,
          url,
          data: (config || {}).data,
        }),
      );
    };
  },
);
utils_default.forEach(
  ["post", "put", "patch"],
  function forEachMethodWithData(method) {
    function generateHTTPMethod(isForm) {
      return function httpMethod(url, data, config) {
        return this.request(
          mergeConfig(config || {}, {
            method,
            headers: isForm
              ? {
                  "Content-Type": "multipart/form-data",
                }
              : {},
            url,
            data,
          }),
        );
      };
    }
    Axios.prototype[method] = generateHTTPMethod();
    Axios.prototype[method + "Form"] = generateHTTPMethod(true);
  },
);
var Axios_default = Axios;

// ../../../../node_modules/axios/lib/cancel/CancelToken.js
var CancelToken = class {
  constructor(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("executor must be a function.");
    }
    let resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });
    const token = this;
    this.promise.then((cancel) => {
      if (!token._listeners) return;
      let i4 = token._listeners.length;
      while (i4-- > 0) {
        token._listeners[i4](cancel);
      }
      token._listeners = null;
    });
    this.promise.then = (onfulfilled) => {
      let _resolve;
      const promise = new Promise((resolve) => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);
      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };
      return promise;
    };
    executor(function cancel(message2, config, request) {
      if (token.reason) {
        return;
      }
      token.reason = new CanceledError_default(message2, config, request);
      resolvePromise(token.reason);
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }
    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }
  toAbortSignal() {
    const controller = new AbortController();
    const abort = (err) => {
      controller.abort(err);
    };
    this.subscribe(abort);
    controller.signal.unsubscribe = () => this.unsubscribe(abort);
    return controller.signal;
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c3) {
      cancel = c3;
    });
    return {
      token,
      cancel,
    };
  }
};
var CancelToken_default = CancelToken;

// ../../../../node_modules/axios/lib/helpers/spread.js
function spread(callback2) {
  return function wrap4(arr) {
    return callback2.apply(null, arr);
  };
}

// ../../../../node_modules/axios/lib/helpers/isAxiosError.js
function isAxiosError(payload) {
  return utils_default.isObject(payload) && payload.isAxiosError === true;
}

// ../../../../node_modules/axios/lib/helpers/HttpStatusCode.js
var HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};
Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});
var HttpStatusCode_default = HttpStatusCode;

// ../../../../node_modules/axios/lib/axios.js
function createInstance(defaultConfig) {
  const context = new Axios_default(defaultConfig);
  const instance = bind(Axios_default.prototype.request, context);
  utils_default.extend(instance, Axios_default.prototype, context, {
    allOwnKeys: true,
  });
  utils_default.extend(instance, context, null, { allOwnKeys: true });
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };
  return instance;
}
var axios = createInstance(defaults_default);
axios.Axios = Axios_default;
axios.CanceledError = CanceledError_default;
axios.CancelToken = CancelToken_default;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = toFormData_default;
axios.AxiosError = AxiosError_default;
axios.Cancel = axios.CanceledError;
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = spread;
axios.isAxiosError = isAxiosError;
axios.mergeConfig = mergeConfig;
axios.AxiosHeaders = AxiosHeaders_default;
axios.formToJSON = (thing) =>
  formDataToJSON_default(
    utils_default.isHTMLForm(thing) ? new FormData(thing) : thing,
  );
axios.getAdapter = adapters_default.getAdapter;
axios.HttpStatusCode = HttpStatusCode_default;
axios.default = axios;
var axios_default = axios;

// ../../../../node_modules/axios/index.js
var {
  Axios: Axios2,
  AxiosError: AxiosError2,
  CanceledError: CanceledError2,
  isCancel: isCancel2,
  CancelToken: CancelToken2,
  VERSION: VERSION2,
  all: all2,
  Cancel,
  isAxiosError: isAxiosError2,
  spread: spread2,
  toFormData: toFormData2,
  AxiosHeaders: AxiosHeaders2,
  HttpStatusCode: HttpStatusCode2,
  formToJSON,
  getAdapter,
  mergeConfig: mergeConfig2,
} = axios_default;

// ../../../../node_modules/next-auth/react.js
import { jsx as _jsx } from "react/jsx-runtime";
import * as React2 from "react";

// ../../../../node_modules/next-auth/lib/client.js
import * as React from "react";

// ../../../../node_modules/@auth/core/errors.js
var AuthError = class extends Error {
  /** @internal */
  constructor(message2, errorOptions) {
    if (message2 instanceof Error) {
      super(void 0, {
        cause: { err: message2, ...message2.cause, ...errorOptions },
      });
    } else if (typeof message2 === "string") {
      if (errorOptions instanceof Error) {
        errorOptions = { err: errorOptions, ...errorOptions.cause };
      }
      super(message2, errorOptions);
    } else {
      super(void 0, message2);
    }
    this.name = this.constructor.name;
    this.type = this.constructor.type ?? "AuthError";
    this.kind = this.constructor.kind ?? "error";
    Error.captureStackTrace?.(this, this.constructor);
    const url = `https://errors.authjs.dev#${this.type.toLowerCase()}`;
    this.message += `${this.message ? ". " : ""}Read more at ${url}`;
  }
};
var SignInError = class extends AuthError {};
SignInError.kind = "signIn";
var AdapterError = class extends AuthError {};
AdapterError.type = "AdapterError";
var AccessDenied = class extends AuthError {};
AccessDenied.type = "AccessDenied";
var CallbackRouteError = class extends AuthError {};
CallbackRouteError.type = "CallbackRouteError";
var ErrorPageLoop = class extends AuthError {};
ErrorPageLoop.type = "ErrorPageLoop";
var EventError = class extends AuthError {};
EventError.type = "EventError";
var InvalidCallbackUrl = class extends AuthError {};
InvalidCallbackUrl.type = "InvalidCallbackUrl";
var CredentialsSignin = class extends SignInError {
  constructor() {
    super(...arguments);
    this.code = "credentials";
  }
};
CredentialsSignin.type = "CredentialsSignin";
var InvalidEndpoints = class extends AuthError {};
InvalidEndpoints.type = "InvalidEndpoints";
var InvalidCheck = class extends AuthError {};
InvalidCheck.type = "InvalidCheck";
var JWTSessionError = class extends AuthError {};
JWTSessionError.type = "JWTSessionError";
var MissingAdapter = class extends AuthError {};
MissingAdapter.type = "MissingAdapter";
var MissingAdapterMethods = class extends AuthError {};
MissingAdapterMethods.type = "MissingAdapterMethods";
var MissingAuthorize = class extends AuthError {};
MissingAuthorize.type = "MissingAuthorize";
var MissingSecret = class extends AuthError {};
MissingSecret.type = "MissingSecret";
var OAuthAccountNotLinked = class extends SignInError {};
OAuthAccountNotLinked.type = "OAuthAccountNotLinked";
var OAuthCallbackError = class extends SignInError {};
OAuthCallbackError.type = "OAuthCallbackError";
var OAuthProfileParseError = class extends AuthError {};
OAuthProfileParseError.type = "OAuthProfileParseError";
var SessionTokenError = class extends AuthError {};
SessionTokenError.type = "SessionTokenError";
var OAuthSignInError = class extends SignInError {};
OAuthSignInError.type = "OAuthSignInError";
var EmailSignInError = class extends SignInError {};
EmailSignInError.type = "EmailSignInError";
var SignOutError = class extends AuthError {};
SignOutError.type = "SignOutError";
var UnknownAction = class extends AuthError {};
UnknownAction.type = "UnknownAction";
var UnsupportedStrategy = class extends AuthError {};
UnsupportedStrategy.type = "UnsupportedStrategy";
var InvalidProvider = class extends AuthError {};
InvalidProvider.type = "InvalidProvider";
var UntrustedHost = class extends AuthError {};
UntrustedHost.type = "UntrustedHost";
var Verification = class extends AuthError {};
Verification.type = "Verification";
var MissingCSRF = class extends SignInError {};
MissingCSRF.type = "MissingCSRF";
var clientErrors = /* @__PURE__ */ new Set([
  "CredentialsSignin",
  "OAuthAccountNotLinked",
  "OAuthCallbackError",
  "AccessDenied",
  "Verification",
  "MissingCSRF",
  "AccountNotLinked",
  "WebAuthnVerificationError",
]);
function isClientError(error) {
  if (error instanceof AuthError) return clientErrors.has(error.type);
  return false;
}
var DuplicateConditionalUI = class extends AuthError {};
DuplicateConditionalUI.type = "DuplicateConditionalUI";
var MissingWebAuthnAutocomplete = class extends AuthError {};
MissingWebAuthnAutocomplete.type = "MissingWebAuthnAutocomplete";
var WebAuthnVerificationError = class extends AuthError {};
WebAuthnVerificationError.type = "WebAuthnVerificationError";
var AccountNotLinked = class extends SignInError {};
AccountNotLinked.type = "AccountNotLinked";
var ExperimentalFeatureNotEnabled = class extends AuthError {};
ExperimentalFeatureNotEnabled.type = "ExperimentalFeatureNotEnabled";

// ../../../../node_modules/next-auth/lib/client.js
var ClientFetchError = class extends AuthError {};
async function fetchData(path, __NEXTAUTH2, logger2, req = {}) {
  const url = `${apiBaseUrl(__NEXTAUTH2)}/${path}`;
  try {
    const options = {
      headers: {
        "Content-Type": "application/json",
        ...(req?.headers?.cookie ? { cookie: req.headers.cookie } : {}),
      },
    };
    if (req?.body) {
      options.body = JSON.stringify(req.body);
      options.method = "POST";
    }
    const res = await fetch(url, options);
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
  } catch (error) {
    logger2.error(new ClientFetchError(error.message, error));
    return null;
  }
}
function apiBaseUrl(__NEXTAUTH2) {
  if (typeof window === "undefined") {
    return `${__NEXTAUTH2.baseUrlServer}${__NEXTAUTH2.basePathServer}`;
  }
  return __NEXTAUTH2.basePath;
}
function parseUrl(url) {
  const defaultUrl = new URL("http://localhost:3000/api/auth");
  if (url && !url.startsWith("http")) {
    url = `https://${url}`;
  }
  const _url = new URL(url || defaultUrl);
  const path = (
    _url.pathname === "/" ? defaultUrl.pathname : _url.pathname
  ).replace(/\/$/, "");
  const base = `${_url.origin}${path}`;
  return {
    origin: _url.origin,
    host: _url.host,
    path,
    base,
    toString: () => base,
  };
}

// ../../../../node_modules/next-auth/react.js
var __NEXTAUTH = {
  baseUrl: parseUrl(process.env.NEXTAUTH_URL ?? process.env.VERCEL_URL).origin,
  basePath: parseUrl(process.env.NEXTAUTH_URL).path,
  baseUrlServer: parseUrl(
    process.env.NEXTAUTH_URL_INTERNAL ??
      process.env.NEXTAUTH_URL ??
      process.env.VERCEL_URL,
  ).origin,
  basePathServer: parseUrl(
    process.env.NEXTAUTH_URL_INTERNAL ?? process.env.NEXTAUTH_URL,
  ).path,
  _lastSync: 0,
  _session: void 0,
  _getSession: () => {},
};
var broadcastChannel = null;
function getNewBroadcastChannel() {
  return new BroadcastChannel("next-auth");
}
function broadcast() {
  if (typeof BroadcastChannel === "undefined") {
    return {
      postMessage: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
    };
  }
  if (broadcastChannel === null) {
    broadcastChannel = getNewBroadcastChannel();
  }
  return broadcastChannel;
}
var logger = {
  debug: console.debug,
  error: console.error,
  warn: console.warn,
};
var SessionContext = React2.createContext?.(void 0);
async function getSession(params) {
  const session2 = await fetchData("session", __NEXTAUTH, logger, params);
  if (params?.broadcast ?? true) {
    const broadcastChannel2 = getNewBroadcastChannel();
    broadcastChannel2.postMessage({
      event: "session",
      data: { trigger: "getSession" },
    });
  }
  return session2;
}
async function getCsrfToken() {
  const response = await fetchData("csrf", __NEXTAUTH, logger);
  return response?.csrfToken ?? "";
}
async function signOut(options) {
  const {
    redirect: redirect2 = true,
    redirectTo = options?.callbackUrl ?? window.location.href,
  } = options ?? {};
  const baseUrl = apiBaseUrl(__NEXTAUTH);
  const csrfToken = await getCsrfToken();
  const res = await fetch(`${baseUrl}/signout`, {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Auth-Return-Redirect": "1",
    },
    body: new URLSearchParams({ csrfToken, callbackUrl: redirectTo }),
  });
  const data = await res.json();
  broadcast().postMessage({ event: "session", data: { trigger: "signout" } });
  if (redirect2) {
    const url = data.url ?? redirectTo;
    window.location.href = url;
    if (url.includes("#")) window.location.reload();
    return;
  }
  await __NEXTAUTH._getSession({ event: "storage" });
  return data;
}

// ../../../../node_modules/@auth/core/lib/utils/cookie.js
var __classPrivateFieldSet = function (receiver, state2, value, kind, f4) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f4)
    throw new TypeError("Private accessor was defined without a setter");
  if (
    typeof state2 === "function"
      ? receiver !== state2 || !f4
      : !state2.has(receiver)
  )
    throw new TypeError(
      "Cannot write private member to an object whose class did not declare it",
    );
  return (
    kind === "a"
      ? f4.call(receiver, value)
      : f4
        ? (f4.value = value)
        : state2.set(receiver, value),
    value
  );
};
var __classPrivateFieldGet = function (receiver, state2, kind, f4) {
  if (kind === "a" && !f4)
    throw new TypeError("Private accessor was defined without a getter");
  if (
    typeof state2 === "function"
      ? receiver !== state2 || !f4
      : !state2.has(receiver)
  )
    throw new TypeError(
      "Cannot read private member from an object whose class did not declare it",
    );
  return kind === "m"
    ? f4
    : kind === "a"
      ? f4.call(receiver)
      : f4
        ? f4.value
        : state2.get(receiver);
};
var _SessionStore_instances;
var _SessionStore_chunks;
var _SessionStore_option;
var _SessionStore_logger;
var _SessionStore_chunk;
var _SessionStore_clean;
var ALLOWED_COOKIE_SIZE = 4096;
var ESTIMATED_EMPTY_COOKIE_SIZE = 160;
var CHUNK_SIZE = ALLOWED_COOKIE_SIZE - ESTIMATED_EMPTY_COOKIE_SIZE;
function defaultCookies(useSecureCookies) {
  const cookiePrefix = useSecureCookies ? "__Secure-" : "";
  return {
    // default cookie options
    sessionToken: {
      name: `${cookiePrefix}authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    callbackUrl: {
      name: `${cookiePrefix}authjs.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    csrfToken: {
      // Default to __Host- for CSRF token for additional protection if using useSecureCookies
      // NB: The `__Host-` prefix is stricter than the `__Secure-` prefix.
      name: `${useSecureCookies ? "__Host-" : ""}authjs.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    pkceCodeVerifier: {
      name: `${cookiePrefix}authjs.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        maxAge: 60 * 15,
        // 15 minutes in seconds
      },
    },
    state: {
      name: `${cookiePrefix}authjs.state`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        maxAge: 60 * 15,
        // 15 minutes in seconds
      },
    },
    nonce: {
      name: `${cookiePrefix}authjs.nonce`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    webauthnChallenge: {
      name: `${cookiePrefix}authjs.challenge`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        maxAge: 60 * 15,
        // 15 minutes in seconds
      },
    },
  };
}
var SessionStore = class {
  constructor(option, cookies2, logger2) {
    _SessionStore_instances.add(this);
    _SessionStore_chunks.set(this, {});
    _SessionStore_option.set(this, void 0);
    _SessionStore_logger.set(this, void 0);
    __classPrivateFieldSet(this, _SessionStore_logger, logger2, "f");
    __classPrivateFieldSet(this, _SessionStore_option, option, "f");
    if (!cookies2) return;
    const { name: sessionCookiePrefix } = option;
    for (const [name, value] of Object.entries(cookies2)) {
      if (!name.startsWith(sessionCookiePrefix) || !value) continue;
      __classPrivateFieldGet(this, _SessionStore_chunks, "f")[name] = value;
    }
  }
  /**
   * The JWT Session or database Session ID
   * constructed from the cookie chunks.
   */
  get value() {
    const sortedKeys = Object.keys(
      __classPrivateFieldGet(this, _SessionStore_chunks, "f"),
    ).sort((a3, b2) => {
      const aSuffix = parseInt(a3.split(".").pop() || "0");
      const bSuffix = parseInt(b2.split(".").pop() || "0");
      return aSuffix - bSuffix;
    });
    return sortedKeys
      .map(
        (key) => __classPrivateFieldGet(this, _SessionStore_chunks, "f")[key],
      )
      .join("");
  }
  /**
   * Given a cookie value, return new cookies, chunked, to fit the allowed cookie size.
   * If the cookie has changed from chunked to unchunked or vice versa,
   * it deletes the old cookies as well.
   */
  chunk(value, options) {
    const cookies2 = __classPrivateFieldGet(
      this,
      _SessionStore_instances,
      "m",
      _SessionStore_clean,
    ).call(this);
    const chunked = __classPrivateFieldGet(
      this,
      _SessionStore_instances,
      "m",
      _SessionStore_chunk,
    ).call(this, {
      name: __classPrivateFieldGet(this, _SessionStore_option, "f").name,
      value,
      options: {
        ...__classPrivateFieldGet(this, _SessionStore_option, "f").options,
        ...options,
      },
    });
    for (const chunk of chunked) {
      cookies2[chunk.name] = chunk;
    }
    return Object.values(cookies2);
  }
  /** Returns a list of cookies that should be cleaned. */
  clean() {
    return Object.values(
      __classPrivateFieldGet(
        this,
        _SessionStore_instances,
        "m",
        _SessionStore_clean,
      ).call(this),
    );
  }
};
(_SessionStore_chunks = /* @__PURE__ */ new WeakMap()),
  (_SessionStore_option = /* @__PURE__ */ new WeakMap()),
  (_SessionStore_logger = /* @__PURE__ */ new WeakMap()),
  (_SessionStore_instances = /* @__PURE__ */ new WeakSet()),
  (_SessionStore_chunk = function _SessionStore_chunk2(cookie) {
    const chunkCount = Math.ceil(cookie.value.length / CHUNK_SIZE);
    if (chunkCount === 1) {
      __classPrivateFieldGet(this, _SessionStore_chunks, "f")[cookie.name] =
        cookie.value;
      return [cookie];
    }
    const cookies2 = [];
    for (let i4 = 0; i4 < chunkCount; i4++) {
      const name = `${cookie.name}.${i4}`;
      const value = cookie.value.substr(i4 * CHUNK_SIZE, CHUNK_SIZE);
      cookies2.push({ ...cookie, name, value });
      __classPrivateFieldGet(this, _SessionStore_chunks, "f")[name] = value;
    }
    __classPrivateFieldGet(this, _SessionStore_logger, "f").debug(
      "CHUNKING_SESSION_COOKIE",
      {
        message: `Session cookie exceeds allowed ${ALLOWED_COOKIE_SIZE} bytes.`,
        emptyCookieSize: ESTIMATED_EMPTY_COOKIE_SIZE,
        valueSize: cookie.value.length,
        chunks: cookies2.map(
          (c3) => c3.value.length + ESTIMATED_EMPTY_COOKIE_SIZE,
        ),
      },
    );
    return cookies2;
  }),
  (_SessionStore_clean = function _SessionStore_clean2() {
    const cleanedChunks = {};
    for (const name in __classPrivateFieldGet(
      this,
      _SessionStore_chunks,
      "f",
    )) {
      delete __classPrivateFieldGet(this, _SessionStore_chunks, "f")?.[name];
      cleanedChunks[name] = {
        name,
        value: "",
        options: {
          ...__classPrivateFieldGet(this, _SessionStore_option, "f").options,
          maxAge: 0,
        },
      };
    }
    return cleanedChunks;
  });

// ../../../../node_modules/@auth/core/lib/utils/assert.js
var warned = false;
function isValidHttpUrl(url, baseUrl) {
  try {
    return /^https?:/.test(
      new URL(url, url.startsWith("/") ? baseUrl : void 0).protocol,
    );
  } catch {
    return false;
  }
}
function isSemverString(version) {
  return /^v\d+(?:\.\d+){0,2}$/.test(version);
}
var hasCredentials = false;
var hasEmail = false;
var hasWebAuthn = false;
var emailMethods = [
  "createVerificationToken",
  "useVerificationToken",
  "getUserByEmail",
];
var sessionMethods = [
  "createUser",
  "getUser",
  "getUserByEmail",
  "getUserByAccount",
  "updateUser",
  "linkAccount",
  "createSession",
  "getSessionAndUser",
  "updateSession",
  "deleteSession",
];
var webauthnMethods = [
  "createUser",
  "getUser",
  "linkAccount",
  "getAccount",
  "getAuthenticator",
  "createAuthenticator",
  "listAuthenticatorsByUserId",
  "updateAuthenticatorCounter",
];
function assertConfig(request, options) {
  const { url } = request;
  const warnings = [];
  if (!warned && options.debug) warnings.push("debug-enabled");
  if (!options.trustHost) {
    return new UntrustedHost(`Host must be trusted. URL was: ${request.url}`);
  }
  if (!options.secret?.length) {
    return new MissingSecret("Please define a `secret`");
  }
  const callbackUrlParam = request.query?.callbackUrl;
  if (callbackUrlParam && !isValidHttpUrl(callbackUrlParam, url.origin)) {
    return new InvalidCallbackUrl(
      `Invalid callback URL. Received: ${callbackUrlParam}`,
    );
  }
  const { callbackUrl: defaultCallbackUrl } = defaultCookies(
    options.useSecureCookies ?? url.protocol === "https:",
  );
  const callbackUrlCookie =
    request.cookies?.[
      options.cookies?.callbackUrl?.name ?? defaultCallbackUrl.name
    ];
  if (callbackUrlCookie && !isValidHttpUrl(callbackUrlCookie, url.origin)) {
    return new InvalidCallbackUrl(
      `Invalid callback URL. Received: ${callbackUrlCookie}`,
    );
  }
  let hasConditionalUIProvider = false;
  for (const p3 of options.providers) {
    const provider = typeof p3 === "function" ? p3() : p3;
    if (
      (provider.type === "oauth" || provider.type === "oidc") &&
      !(provider.issuer ?? provider.options?.issuer)
    ) {
      const { authorization: a3, token: t2, userinfo: u4 } = provider;
      let key;
      if (typeof a3 !== "string" && !a3?.url) key = "authorization";
      else if (typeof t2 !== "string" && !t2?.url) key = "token";
      else if (typeof u4 !== "string" && !u4?.url) key = "userinfo";
      if (key) {
        return new InvalidEndpoints(
          `Provider "${provider.id}" is missing both \`issuer\` and \`${key}\` endpoint config. At least one of them is required`,
        );
      }
    }
    if (provider.type === "credentials") hasCredentials = true;
    else if (provider.type === "email") hasEmail = true;
    else if (provider.type === "webauthn") {
      hasWebAuthn = true;
      if (
        provider.simpleWebAuthnBrowserVersion &&
        !isSemverString(provider.simpleWebAuthnBrowserVersion)
      ) {
        return new AuthError(
          `Invalid provider config for "${provider.id}": simpleWebAuthnBrowserVersion "${provider.simpleWebAuthnBrowserVersion}" must be a valid semver string.`,
        );
      }
      if (provider.enableConditionalUI) {
        if (hasConditionalUIProvider) {
          return new DuplicateConditionalUI(
            `Multiple webauthn providers have 'enableConditionalUI' set to True. Only one provider can have this option enabled at a time`,
          );
        }
        hasConditionalUIProvider = true;
        const hasWebauthnFormField = Object.values(provider.formFields).some(
          (f4) =>
            f4.autocomplete &&
            f4.autocomplete.toString().indexOf("webauthn") > -1,
        );
        if (!hasWebauthnFormField) {
          return new MissingWebAuthnAutocomplete(
            `Provider "${provider.id}" has 'enableConditionalUI' set to True, but none of its formFields have 'webauthn' in their autocomplete param`,
          );
        }
      }
    }
  }
  if (hasCredentials) {
    const dbStrategy = options.session?.strategy === "database";
    const onlyCredentials = !options.providers.some(
      (p3) => (typeof p3 === "function" ? p3() : p3).type !== "credentials",
    );
    if (dbStrategy && onlyCredentials) {
      return new UnsupportedStrategy(
        "Signing in with credentials only supported if JWT strategy is enabled",
      );
    }
    const credentialsNoAuthorize = options.providers.some((p3) => {
      const provider = typeof p3 === "function" ? p3() : p3;
      return provider.type === "credentials" && !provider.authorize;
    });
    if (credentialsNoAuthorize) {
      return new MissingAuthorize(
        "Must define an authorize() handler to use credentials authentication provider",
      );
    }
  }
  const { adapter, session: session2 } = options;
  const requiredMethods = [];
  if (
    hasEmail ||
    session2?.strategy === "database" ||
    (!session2?.strategy && adapter)
  ) {
    if (hasEmail) {
      if (!adapter)
        return new MissingAdapter("Email login requires an adapter");
      requiredMethods.push(...emailMethods);
    } else {
      if (!adapter)
        return new MissingAdapter("Database session requires an adapter");
      requiredMethods.push(...sessionMethods);
    }
  }
  if (hasWebAuthn) {
    if (options.experimental?.enableWebAuthn) {
      warnings.push("experimental-webauthn");
    } else {
      return new ExperimentalFeatureNotEnabled(
        "WebAuthn is an experimental feature. To enable it, set `experimental.enableWebAuthn` to `true` in your config",
      );
    }
    if (!adapter) return new MissingAdapter("WebAuthn requires an adapter");
    requiredMethods.push(...webauthnMethods);
  }
  if (adapter) {
    const missing = requiredMethods.filter((m) => !(m in adapter));
    if (missing.length) {
      return new MissingAdapterMethods(
        `Required adapter methods were missing: ${missing.join(", ")}`,
      );
    }
  }
  if (!warned) warned = true;
  return warnings;
}

// ../../../../node_modules/@panva/hkdf/dist/web/runtime/hkdf.js
var getGlobal = () => {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  throw new Error("unable to locate global object");
};
var hkdf_default = async (digest, ikm, salt, info, keylen) => {
  const {
    crypto: { subtle },
  } = getGlobal();
  return new Uint8Array(
    await subtle.deriveBits(
      {
        name: "HKDF",
        hash: `SHA-${digest.substr(3)}`,
        salt,
        info,
      },
      await subtle.importKey("raw", ikm, "HKDF", false, ["deriveBits"]),
      keylen << 3,
    ),
  );
};

// ../../../../node_modules/@panva/hkdf/dist/web/index.js
function normalizeDigest(digest) {
  switch (digest) {
    case "sha256":
    case "sha384":
    case "sha512":
    case "sha1":
      return digest;
    default:
      throw new TypeError('unsupported "digest" value');
  }
}
function normalizeUint8Array(input, label) {
  if (typeof input === "string") return new TextEncoder().encode(input);
  if (!(input instanceof Uint8Array))
    throw new TypeError(
      `"${label}"" must be an instance of Uint8Array or a string`,
    );
  return input;
}
function normalizeIkm(input) {
  const ikm = normalizeUint8Array(input, "ikm");
  if (!ikm.byteLength)
    throw new TypeError(`"ikm" must be at least one byte in length`);
  return ikm;
}
function normalizeInfo(input) {
  const info = normalizeUint8Array(input, "info");
  if (info.byteLength > 1024) {
    throw TypeError('"info" must not contain more than 1024 bytes');
  }
  return info;
}
function normalizeKeylen(input, digest) {
  if (typeof input !== "number" || !Number.isInteger(input) || input < 1) {
    throw new TypeError('"keylen" must be a positive integer');
  }
  const hashlen = parseInt(digest.substr(3), 10) >> 3 || 20;
  if (input > 255 * hashlen) {
    throw new TypeError('"keylen" too large');
  }
  return input;
}
async function hkdf(digest, ikm, salt, info, keylen) {
  return hkdf_default(
    normalizeDigest(digest),
    normalizeIkm(ikm),
    normalizeUint8Array(salt, "salt"),
    normalizeInfo(info),
    normalizeKeylen(keylen, digest),
  );
}

// ../../../../node_modules/jose/dist/webapi/util/base64url.js
var base64url_exports = {};
__export2(base64url_exports, {
  decode: () => decode,
  encode: () => encode3,
});

// ../../../../node_modules/jose/dist/webapi/lib/buffer_utils.js
var encoder = new TextEncoder();
var decoder = new TextDecoder();
var MAX_INT32 = 2 ** 32;
function concat(...buffers) {
  const size = buffers.reduce((acc, { length }) => acc + length, 0);
  const buf2 = new Uint8Array(size);
  let i4 = 0;
  for (const buffer of buffers) {
    buf2.set(buffer, i4);
    i4 += buffer.length;
  }
  return buf2;
}
function writeUInt32BE(buf2, value, offset) {
  if (value < 0 || value >= MAX_INT32) {
    throw new RangeError(
      `value must be >= 0 and <= ${MAX_INT32 - 1}. Received ${value}`,
    );
  }
  buf2.set([value >>> 24, value >>> 16, value >>> 8, value & 255], offset);
}
function uint64be(value) {
  const high = Math.floor(value / MAX_INT32);
  const low = value % MAX_INT32;
  const buf2 = new Uint8Array(8);
  writeUInt32BE(buf2, high, 0);
  writeUInt32BE(buf2, low, 4);
  return buf2;
}
function uint32be(value) {
  const buf2 = new Uint8Array(4);
  writeUInt32BE(buf2, value);
  return buf2;
}

// ../../../../node_modules/jose/dist/webapi/lib/base64.js
function encodeBase64(input) {
  if (Uint8Array.prototype.toBase64) {
    return input.toBase64();
  }
  const CHUNK_SIZE3 = 32768;
  const arr = [];
  for (let i4 = 0; i4 < input.length; i4 += CHUNK_SIZE3) {
    arr.push(
      String.fromCharCode.apply(null, input.subarray(i4, i4 + CHUNK_SIZE3)),
    );
  }
  return btoa(arr.join(""));
}
function decodeBase64(encoded) {
  if (Uint8Array.fromBase64) {
    return Uint8Array.fromBase64(encoded);
  }
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i4 = 0; i4 < binary.length; i4++) {
    bytes[i4] = binary.charCodeAt(i4);
  }
  return bytes;
}

// ../../../../node_modules/jose/dist/webapi/util/base64url.js
function decode(input) {
  if (Uint8Array.fromBase64) {
    return Uint8Array.fromBase64(
      typeof input === "string" ? input : decoder.decode(input),
      {
        alphabet: "base64url",
      },
    );
  }
  let encoded = input;
  if (encoded instanceof Uint8Array) {
    encoded = decoder.decode(encoded);
  }
  encoded = encoded.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
  try {
    return decodeBase64(encoded);
  } catch {
    throw new TypeError("The input to be decoded is not correctly encoded.");
  }
}
function encode3(input) {
  let unencoded = input;
  if (typeof unencoded === "string") {
    unencoded = encoder.encode(unencoded);
  }
  if (Uint8Array.prototype.toBase64) {
    return unencoded.toBase64({ alphabet: "base64url", omitPadding: true });
  }
  return encodeBase64(unencoded)
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

// ../../../../node_modules/jose/dist/webapi/util/errors.js
var JOSEError = class extends Error {
  constructor(message2, options) {
    super(message2, options);
    __publicField(this, "code", "ERR_JOSE_GENERIC");
    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }
};
__publicField(JOSEError, "code", "ERR_JOSE_GENERIC");
var JWTClaimValidationFailed = class extends JOSEError {
  constructor(
    message2,
    payload,
    claim = "unspecified",
    reason = "unspecified",
  ) {
    super(message2, { cause: { claim, reason, payload } });
    __publicField(this, "code", "ERR_JWT_CLAIM_VALIDATION_FAILED");
    __publicField(this, "claim");
    __publicField(this, "reason");
    __publicField(this, "payload");
    this.claim = claim;
    this.reason = reason;
    this.payload = payload;
  }
};
__publicField(
  JWTClaimValidationFailed,
  "code",
  "ERR_JWT_CLAIM_VALIDATION_FAILED",
);
var JWTExpired = class extends JOSEError {
  constructor(
    message2,
    payload,
    claim = "unspecified",
    reason = "unspecified",
  ) {
    super(message2, { cause: { claim, reason, payload } });
    __publicField(this, "code", "ERR_JWT_EXPIRED");
    __publicField(this, "claim");
    __publicField(this, "reason");
    __publicField(this, "payload");
    this.claim = claim;
    this.reason = reason;
    this.payload = payload;
  }
};
__publicField(JWTExpired, "code", "ERR_JWT_EXPIRED");
var JOSEAlgNotAllowed = class extends JOSEError {
  constructor() {
    super(...arguments);
    __publicField(this, "code", "ERR_JOSE_ALG_NOT_ALLOWED");
  }
};
__publicField(JOSEAlgNotAllowed, "code", "ERR_JOSE_ALG_NOT_ALLOWED");
var JOSENotSupported = class extends JOSEError {
  constructor() {
    super(...arguments);
    __publicField(this, "code", "ERR_JOSE_NOT_SUPPORTED");
  }
};
__publicField(JOSENotSupported, "code", "ERR_JOSE_NOT_SUPPORTED");
var JWEDecryptionFailed = class extends JOSEError {
  constructor(message2 = "decryption operation failed", options) {
    super(message2, options);
    __publicField(this, "code", "ERR_JWE_DECRYPTION_FAILED");
  }
};
__publicField(JWEDecryptionFailed, "code", "ERR_JWE_DECRYPTION_FAILED");
var JWEInvalid = class extends JOSEError {
  constructor() {
    super(...arguments);
    __publicField(this, "code", "ERR_JWE_INVALID");
  }
};
__publicField(JWEInvalid, "code", "ERR_JWE_INVALID");
var JWTInvalid = class extends JOSEError {
  constructor() {
    super(...arguments);
    __publicField(this, "code", "ERR_JWT_INVALID");
  }
};
__publicField(JWTInvalid, "code", "ERR_JWT_INVALID");
var JWKInvalid = class extends JOSEError {
  constructor() {
    super(...arguments);
    __publicField(this, "code", "ERR_JWK_INVALID");
  }
};
__publicField(JWKInvalid, "code", "ERR_JWK_INVALID");
var _a;
var JWKSMultipleMatchingKeys = class extends JOSEError {
  constructor(
    message2 = "multiple matching keys found in the JSON Web Key Set",
    options,
  ) {
    super(message2, options);
    __publicField(this, _a);
    __publicField(this, "code", "ERR_JWKS_MULTIPLE_MATCHING_KEYS");
  }
};
_a = Symbol.asyncIterator;
__publicField(
  JWKSMultipleMatchingKeys,
  "code",
  "ERR_JWKS_MULTIPLE_MATCHING_KEYS",
);

// ../../../../node_modules/jose/dist/webapi/lib/iv.js
function bitLength(alg2) {
  switch (alg2) {
    case "A128GCM":
    case "A128GCMKW":
    case "A192GCM":
    case "A192GCMKW":
    case "A256GCM":
    case "A256GCMKW":
      return 96;
    case "A128CBC-HS256":
    case "A192CBC-HS384":
    case "A256CBC-HS512":
      return 128;
    default:
      throw new JOSENotSupported(`Unsupported JWE Algorithm: ${alg2}`);
  }
}
var iv_default = (alg2) =>
  crypto.getRandomValues(new Uint8Array(bitLength(alg2) >> 3));

// ../../../../node_modules/jose/dist/webapi/lib/check_iv_length.js
var check_iv_length_default = (enc2, iv) => {
  if (iv.length << 3 !== bitLength(enc2)) {
    throw new JWEInvalid("Invalid Initialization Vector length");
  }
};

// ../../../../node_modules/jose/dist/webapi/lib/check_cek_length.js
var check_cek_length_default = (cek, expected) => {
  const actual = cek.byteLength << 3;
  if (actual !== expected) {
    throw new JWEInvalid(
      `Invalid Content Encryption Key length. Expected ${expected} bits, got ${actual} bits`,
    );
  }
};

// ../../../../node_modules/jose/dist/webapi/lib/crypto_key.js
function unusable(name, prop = "algorithm.name") {
  return new TypeError(
    `CryptoKey does not support this operation, its ${prop} must be ${name}`,
  );
}
function isAlgorithm(algorithm, name) {
  return algorithm.name === name;
}
function getHashLength(hash) {
  return parseInt(hash.name.slice(4), 10);
}
function checkUsage(key, usage) {
  if (usage && !key.usages.includes(usage)) {
    throw new TypeError(
      `CryptoKey does not support this operation, its usages must include ${usage}.`,
    );
  }
}
function checkEncCryptoKey(key, alg2, usage) {
  switch (alg2) {
    case "A128GCM":
    case "A192GCM":
    case "A256GCM": {
      if (!isAlgorithm(key.algorithm, "AES-GCM")) throw unusable("AES-GCM");
      const expected = parseInt(alg2.slice(1, 4), 10);
      const actual = key.algorithm.length;
      if (actual !== expected) throw unusable(expected, "algorithm.length");
      break;
    }
    case "A128KW":
    case "A192KW":
    case "A256KW": {
      if (!isAlgorithm(key.algorithm, "AES-KW")) throw unusable("AES-KW");
      const expected = parseInt(alg2.slice(1, 4), 10);
      const actual = key.algorithm.length;
      if (actual !== expected) throw unusable(expected, "algorithm.length");
      break;
    }
    case "ECDH": {
      switch (key.algorithm.name) {
        case "ECDH":
        case "X25519":
          break;
        default:
          throw unusable("ECDH or X25519");
      }
      break;
    }
    case "PBES2-HS256+A128KW":
    case "PBES2-HS384+A192KW":
    case "PBES2-HS512+A256KW":
      if (!isAlgorithm(key.algorithm, "PBKDF2")) throw unusable("PBKDF2");
      break;
    case "RSA-OAEP":
    case "RSA-OAEP-256":
    case "RSA-OAEP-384":
    case "RSA-OAEP-512": {
      if (!isAlgorithm(key.algorithm, "RSA-OAEP")) throw unusable("RSA-OAEP");
      const expected = parseInt(alg2.slice(9), 10) || 1;
      const actual = getHashLength(key.algorithm.hash);
      if (actual !== expected)
        throw unusable(`SHA-${expected}`, "algorithm.hash");
      break;
    }
    default:
      throw new TypeError("CryptoKey does not support this operation");
  }
  checkUsage(key, usage);
}

// ../../../../node_modules/jose/dist/webapi/lib/invalid_key_input.js
function message(msg, actual, ...types) {
  types = types.filter(Boolean);
  if (types.length > 2) {
    const last = types.pop();
    msg += `one of type ${types.join(", ")}, or ${last}.`;
  } else if (types.length === 2) {
    msg += `one of type ${types[0]} or ${types[1]}.`;
  } else {
    msg += `of type ${types[0]}.`;
  }
  if (actual == null) {
    msg += ` Received ${actual}`;
  } else if (typeof actual === "function" && actual.name) {
    msg += ` Received function ${actual.name}`;
  } else if (typeof actual === "object" && actual != null) {
    if (actual.constructor?.name) {
      msg += ` Received an instance of ${actual.constructor.name}`;
    }
  }
  return msg;
}
var invalid_key_input_default = (actual, ...types) => {
  return message("Key must be ", actual, ...types);
};
function withAlg(alg2, actual, ...types) {
  return message(`Key for the ${alg2} algorithm must be `, actual, ...types);
}

// ../../../../node_modules/jose/dist/webapi/lib/is_key_like.js
function assertCryptoKey(key) {
  if (!isCryptoKey(key)) {
    throw new Error("CryptoKey instance expected");
  }
}
function isCryptoKey(key) {
  return key?.[Symbol.toStringTag] === "CryptoKey";
}
function isKeyObject(key) {
  return key?.[Symbol.toStringTag] === "KeyObject";
}
var is_key_like_default = (key) => {
  return isCryptoKey(key) || isKeyObject(key);
};

// ../../../../node_modules/jose/dist/webapi/lib/decrypt.js
async function timingSafeEqual(a3, b2) {
  if (!(a3 instanceof Uint8Array)) {
    throw new TypeError("First argument must be a buffer");
  }
  if (!(b2 instanceof Uint8Array)) {
    throw new TypeError("Second argument must be a buffer");
  }
  const algorithm = { name: "HMAC", hash: "SHA-256" };
  const key = await crypto.subtle.generateKey(algorithm, false, ["sign"]);
  const aHmac = new Uint8Array(await crypto.subtle.sign(algorithm, key, a3));
  const bHmac = new Uint8Array(await crypto.subtle.sign(algorithm, key, b2));
  let out = 0;
  let i4 = -1;
  while (++i4 < 32) {
    out |= aHmac[i4] ^ bHmac[i4];
  }
  return out === 0;
}
async function cbcDecrypt(enc2, cek, ciphertext, iv, tag2, aad) {
  if (!(cek instanceof Uint8Array)) {
    throw new TypeError(invalid_key_input_default(cek, "Uint8Array"));
  }
  const keySize = parseInt(enc2.slice(1, 4), 10);
  const encKey = await crypto.subtle.importKey(
    "raw",
    cek.subarray(keySize >> 3),
    "AES-CBC",
    false,
    ["decrypt"],
  );
  const macKey = await crypto.subtle.importKey(
    "raw",
    cek.subarray(0, keySize >> 3),
    {
      hash: `SHA-${keySize << 1}`,
      name: "HMAC",
    },
    false,
    ["sign"],
  );
  const macData = concat(aad, iv, ciphertext, uint64be(aad.length << 3));
  const expectedTag = new Uint8Array(
    (await crypto.subtle.sign("HMAC", macKey, macData)).slice(0, keySize >> 3),
  );
  let macCheckPassed;
  try {
    macCheckPassed = await timingSafeEqual(tag2, expectedTag);
  } catch {}
  if (!macCheckPassed) {
    throw new JWEDecryptionFailed();
  }
  let plaintext;
  try {
    plaintext = new Uint8Array(
      await crypto.subtle.decrypt({ iv, name: "AES-CBC" }, encKey, ciphertext),
    );
  } catch {}
  if (!plaintext) {
    throw new JWEDecryptionFailed();
  }
  return plaintext;
}
async function gcmDecrypt(enc2, cek, ciphertext, iv, tag2, aad) {
  let encKey;
  if (cek instanceof Uint8Array) {
    encKey = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, [
      "decrypt",
    ]);
  } else {
    checkEncCryptoKey(cek, enc2, "decrypt");
    encKey = cek;
  }
  try {
    return new Uint8Array(
      await crypto.subtle.decrypt(
        {
          additionalData: aad,
          iv,
          name: "AES-GCM",
          tagLength: 128,
        },
        encKey,
        concat(ciphertext, tag2),
      ),
    );
  } catch {
    throw new JWEDecryptionFailed();
  }
}
var decrypt_default = async (enc2, cek, ciphertext, iv, tag2, aad) => {
  if (!isCryptoKey(cek) && !(cek instanceof Uint8Array)) {
    throw new TypeError(
      invalid_key_input_default(
        cek,
        "CryptoKey",
        "KeyObject",
        "Uint8Array",
        "JSON Web Key",
      ),
    );
  }
  if (!iv) {
    throw new JWEInvalid("JWE Initialization Vector missing");
  }
  if (!tag2) {
    throw new JWEInvalid("JWE Authentication Tag missing");
  }
  check_iv_length_default(enc2, iv);
  switch (enc2) {
    case "A128CBC-HS256":
    case "A192CBC-HS384":
    case "A256CBC-HS512":
      if (cek instanceof Uint8Array)
        check_cek_length_default(cek, parseInt(enc2.slice(-3), 10));
      return cbcDecrypt(enc2, cek, ciphertext, iv, tag2, aad);
    case "A128GCM":
    case "A192GCM":
    case "A256GCM":
      if (cek instanceof Uint8Array)
        check_cek_length_default(cek, parseInt(enc2.slice(1, 4), 10));
      return gcmDecrypt(enc2, cek, ciphertext, iv, tag2, aad);
    default:
      throw new JOSENotSupported(
        "Unsupported JWE Content Encryption Algorithm",
      );
  }
};

// ../../../../node_modules/jose/dist/webapi/lib/is_disjoint.js
var is_disjoint_default = (...headers2) => {
  const sources = headers2.filter(Boolean);
  if (sources.length === 0 || sources.length === 1) {
    return true;
  }
  let acc;
  for (const header of sources) {
    const parameters = Object.keys(header);
    if (!acc || acc.size === 0) {
      acc = new Set(parameters);
      continue;
    }
    for (const parameter of parameters) {
      if (acc.has(parameter)) {
        return false;
      }
      acc.add(parameter);
    }
  }
  return true;
};

// ../../../../node_modules/jose/dist/webapi/lib/is_object.js
function isObjectLike(value) {
  return typeof value === "object" && value !== null;
}
var is_object_default = (input) => {
  if (
    !isObjectLike(input) ||
    Object.prototype.toString.call(input) !== "[object Object]"
  ) {
    return false;
  }
  if (Object.getPrototypeOf(input) === null) {
    return true;
  }
  let proto = input;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(input) === proto;
};

// ../../../../node_modules/jose/dist/webapi/lib/aeskw.js
function checkKeySize(key, alg2) {
  if (key.algorithm.length !== parseInt(alg2.slice(1, 4), 10)) {
    throw new TypeError(`Invalid key size for alg: ${alg2}`);
  }
}
function getCryptoKey(key, alg2, usage) {
  if (key instanceof Uint8Array) {
    return crypto.subtle.importKey("raw", key, "AES-KW", true, [usage]);
  }
  checkEncCryptoKey(key, alg2, usage);
  return key;
}
async function wrap(alg2, key, cek) {
  const cryptoKey = await getCryptoKey(key, alg2, "wrapKey");
  checkKeySize(cryptoKey, alg2);
  const cryptoKeyCek = await crypto.subtle.importKey(
    "raw",
    cek,
    { hash: "SHA-256", name: "HMAC" },
    true,
    ["sign"],
  );
  return new Uint8Array(
    await crypto.subtle.wrapKey("raw", cryptoKeyCek, cryptoKey, "AES-KW"),
  );
}
async function unwrap(alg2, key, encryptedKey) {
  const cryptoKey = await getCryptoKey(key, alg2, "unwrapKey");
  checkKeySize(cryptoKey, alg2);
  const cryptoKeyCek = await crypto.subtle.unwrapKey(
    "raw",
    encryptedKey,
    cryptoKey,
    "AES-KW",
    { hash: "SHA-256", name: "HMAC" },
    true,
    ["sign"],
  );
  return new Uint8Array(await crypto.subtle.exportKey("raw", cryptoKeyCek));
}

// ../../../../node_modules/jose/dist/webapi/lib/digest.js
var digest_default = async (algorithm, data) => {
  const subtleDigest = `SHA-${algorithm.slice(-3)}`;
  return new Uint8Array(await crypto.subtle.digest(subtleDigest, data));
};

// ../../../../node_modules/jose/dist/webapi/lib/ecdhes.js
function lengthAndInput(input) {
  return concat(uint32be(input.length), input);
}
async function concatKdf(secret, bits, value) {
  const iterations = Math.ceil((bits >> 3) / 32);
  const res = new Uint8Array(iterations * 32);
  for (let iter = 0; iter < iterations; iter++) {
    const buf2 = new Uint8Array(4 + secret.length + value.length);
    buf2.set(uint32be(iter + 1));
    buf2.set(secret, 4);
    buf2.set(value, 4 + secret.length);
    res.set(await digest_default("sha256", buf2), iter * 32);
  }
  return res.slice(0, bits >> 3);
}
async function deriveKey(
  publicKey,
  privateKey,
  algorithm,
  keyLength,
  apu = new Uint8Array(0),
  apv = new Uint8Array(0),
) {
  checkEncCryptoKey(publicKey, "ECDH");
  checkEncCryptoKey(privateKey, "ECDH", "deriveBits");
  const value = concat(
    lengthAndInput(encoder.encode(algorithm)),
    lengthAndInput(apu),
    lengthAndInput(apv),
    uint32be(keyLength),
  );
  let length;
  if (publicKey.algorithm.name === "X25519") {
    length = 256;
  } else {
    length =
      Math.ceil(parseInt(publicKey.algorithm.namedCurve.slice(-3), 10) / 8) <<
      3;
  }
  const sharedSecret = new Uint8Array(
    await crypto.subtle.deriveBits(
      {
        name: publicKey.algorithm.name,
        public: publicKey,
      },
      privateKey,
      length,
    ),
  );
  return concatKdf(sharedSecret, keyLength, value);
}
function allowed(key) {
  switch (key.algorithm.namedCurve) {
    case "P-256":
    case "P-384":
    case "P-521":
      return true;
    default:
      return key.algorithm.name === "X25519";
  }
}

// ../../../../node_modules/jose/dist/webapi/lib/pbes2kw.js
function getCryptoKey2(key, alg2) {
  if (key instanceof Uint8Array) {
    return crypto.subtle.importKey("raw", key, "PBKDF2", false, ["deriveBits"]);
  }
  checkEncCryptoKey(key, alg2, "deriveBits");
  return key;
}
var concatSalt = (alg2, p2sInput) =>
  concat(encoder.encode(alg2), new Uint8Array([0]), p2sInput);
async function deriveKey2(p2s, alg2, p2c, key) {
  if (!(p2s instanceof Uint8Array) || p2s.length < 8) {
    throw new JWEInvalid("PBES2 Salt Input must be 8 or more octets");
  }
  const salt = concatSalt(alg2, p2s);
  const keylen = parseInt(alg2.slice(13, 16), 10);
  const subtleAlg = {
    hash: `SHA-${alg2.slice(8, 11)}`,
    iterations: p2c,
    name: "PBKDF2",
    salt,
  };
  const cryptoKey = await getCryptoKey2(key, alg2);
  return new Uint8Array(
    await crypto.subtle.deriveBits(subtleAlg, cryptoKey, keylen),
  );
}
async function wrap2(
  alg2,
  key,
  cek,
  p2c = 2048,
  p2s = crypto.getRandomValues(new Uint8Array(16)),
) {
  const derived = await deriveKey2(p2s, alg2, p2c, key);
  const encryptedKey = await wrap(alg2.slice(-6), derived, cek);
  return { encryptedKey, p2c, p2s: encode3(p2s) };
}
async function unwrap2(alg2, key, encryptedKey, p2c, p2s) {
  const derived = await deriveKey2(p2s, alg2, p2c, key);
  return unwrap(alg2.slice(-6), derived, encryptedKey);
}

// ../../../../node_modules/jose/dist/webapi/lib/check_key_length.js
var check_key_length_default = (alg2, key) => {
  if (alg2.startsWith("RS") || alg2.startsWith("PS")) {
    const { modulusLength } = key.algorithm;
    if (typeof modulusLength !== "number" || modulusLength < 2048) {
      throw new TypeError(
        `${alg2} requires key modulusLength to be 2048 bits or larger`,
      );
    }
  }
};

// ../../../../node_modules/jose/dist/webapi/lib/rsaes.js
var subtleAlgorithm = (alg2) => {
  switch (alg2) {
    case "RSA-OAEP":
    case "RSA-OAEP-256":
    case "RSA-OAEP-384":
    case "RSA-OAEP-512":
      return "RSA-OAEP";
    default:
      throw new JOSENotSupported(
        `alg ${alg2} is not supported either by JOSE or your javascript runtime`,
      );
  }
};
async function encrypt(alg2, key, cek) {
  checkEncCryptoKey(key, alg2, "encrypt");
  check_key_length_default(alg2, key);
  return new Uint8Array(
    await crypto.subtle.encrypt(subtleAlgorithm(alg2), key, cek),
  );
}
async function decrypt(alg2, key, encryptedKey) {
  checkEncCryptoKey(key, alg2, "decrypt");
  check_key_length_default(alg2, key);
  return new Uint8Array(
    await crypto.subtle.decrypt(subtleAlgorithm(alg2), key, encryptedKey),
  );
}

// ../../../../node_modules/jose/dist/webapi/lib/cek.js
function bitLength2(alg2) {
  switch (alg2) {
    case "A128GCM":
      return 128;
    case "A192GCM":
      return 192;
    case "A256GCM":
    case "A128CBC-HS256":
      return 256;
    case "A192CBC-HS384":
      return 384;
    case "A256CBC-HS512":
      return 512;
    default:
      throw new JOSENotSupported(`Unsupported JWE Algorithm: ${alg2}`);
  }
}
var cek_default = (alg2) =>
  crypto.getRandomValues(new Uint8Array(bitLength2(alg2) >> 3));

// ../../../../node_modules/jose/dist/webapi/lib/jwk_to_key.js
function subtleMapping(jwk) {
  let algorithm;
  let keyUsages;
  switch (jwk.kty) {
    case "RSA": {
      switch (jwk.alg) {
        case "PS256":
        case "PS384":
        case "PS512":
          algorithm = { name: "RSA-PSS", hash: `SHA-${jwk.alg.slice(-3)}` };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "RS256":
        case "RS384":
        case "RS512":
          algorithm = {
            name: "RSASSA-PKCS1-v1_5",
            hash: `SHA-${jwk.alg.slice(-3)}`,
          };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "RSA-OAEP":
        case "RSA-OAEP-256":
        case "RSA-OAEP-384":
        case "RSA-OAEP-512":
          algorithm = {
            name: "RSA-OAEP",
            hash: `SHA-${parseInt(jwk.alg.slice(-3), 10) || 1}`,
          };
          keyUsages = jwk.d ? ["decrypt", "unwrapKey"] : ["encrypt", "wrapKey"];
          break;
        default:
          throw new JOSENotSupported(
            'Invalid or unsupported JWK "alg" (Algorithm) Parameter value',
          );
      }
      break;
    }
    case "EC": {
      switch (jwk.alg) {
        case "ES256":
          algorithm = { name: "ECDSA", namedCurve: "P-256" };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "ES384":
          algorithm = { name: "ECDSA", namedCurve: "P-384" };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "ES512":
          algorithm = { name: "ECDSA", namedCurve: "P-521" };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "ECDH-ES":
        case "ECDH-ES+A128KW":
        case "ECDH-ES+A192KW":
        case "ECDH-ES+A256KW":
          algorithm = { name: "ECDH", namedCurve: jwk.crv };
          keyUsages = jwk.d ? ["deriveBits"] : [];
          break;
        default:
          throw new JOSENotSupported(
            'Invalid or unsupported JWK "alg" (Algorithm) Parameter value',
          );
      }
      break;
    }
    case "OKP": {
      switch (jwk.alg) {
        case "Ed25519":
        case "EdDSA":
          algorithm = { name: "Ed25519" };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "ECDH-ES":
        case "ECDH-ES+A128KW":
        case "ECDH-ES+A192KW":
        case "ECDH-ES+A256KW":
          algorithm = { name: jwk.crv };
          keyUsages = jwk.d ? ["deriveBits"] : [];
          break;
        default:
          throw new JOSENotSupported(
            'Invalid or unsupported JWK "alg" (Algorithm) Parameter value',
          );
      }
      break;
    }
    default:
      throw new JOSENotSupported(
        'Invalid or unsupported JWK "kty" (Key Type) Parameter value',
      );
  }
  return { algorithm, keyUsages };
}
var jwk_to_key_default = async (jwk) => {
  if (!jwk.alg) {
    throw new TypeError(
      '"alg" argument is required when "jwk.alg" is not present',
    );
  }
  const { algorithm, keyUsages } = subtleMapping(jwk);
  const keyData = { ...jwk };
  delete keyData.alg;
  delete keyData.use;
  return crypto.subtle.importKey(
    "jwk",
    keyData,
    algorithm,
    jwk.ext ?? (jwk.d ? false : true),
    jwk.key_ops ?? keyUsages,
  );
};

// ../../../../node_modules/jose/dist/webapi/key/import.js
async function importJWK(jwk, alg2, options) {
  if (!is_object_default(jwk)) {
    throw new TypeError("JWK must be an object");
  }
  let ext;
  alg2 ?? (alg2 = jwk.alg);
  ext ?? (ext = options?.extractable ?? jwk.ext);
  switch (jwk.kty) {
    case "oct":
      if (typeof jwk.k !== "string" || !jwk.k) {
        throw new TypeError('missing "k" (Key Value) Parameter value');
      }
      return decode(jwk.k);
    case "RSA":
      if ("oth" in jwk && jwk.oth !== void 0) {
        throw new JOSENotSupported(
          'RSA JWK "oth" (Other Primes Info) Parameter value is not supported',
        );
      }
    case "EC":
    case "OKP":
      return jwk_to_key_default({ ...jwk, alg: alg2, ext });
    default:
      throw new JOSENotSupported(
        'Unsupported "kty" (Key Type) Parameter value',
      );
  }
}

// ../../../../node_modules/jose/dist/webapi/lib/encrypt.js
async function cbcEncrypt(enc2, plaintext, cek, iv, aad) {
  if (!(cek instanceof Uint8Array)) {
    throw new TypeError(invalid_key_input_default(cek, "Uint8Array"));
  }
  const keySize = parseInt(enc2.slice(1, 4), 10);
  const encKey = await crypto.subtle.importKey(
    "raw",
    cek.subarray(keySize >> 3),
    "AES-CBC",
    false,
    ["encrypt"],
  );
  const macKey = await crypto.subtle.importKey(
    "raw",
    cek.subarray(0, keySize >> 3),
    {
      hash: `SHA-${keySize << 1}`,
      name: "HMAC",
    },
    false,
    ["sign"],
  );
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt(
      {
        iv,
        name: "AES-CBC",
      },
      encKey,
      plaintext,
    ),
  );
  const macData = concat(aad, iv, ciphertext, uint64be(aad.length << 3));
  const tag2 = new Uint8Array(
    (await crypto.subtle.sign("HMAC", macKey, macData)).slice(0, keySize >> 3),
  );
  return { ciphertext, tag: tag2, iv };
}
async function gcmEncrypt(enc2, plaintext, cek, iv, aad) {
  let encKey;
  if (cek instanceof Uint8Array) {
    encKey = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, [
      "encrypt",
    ]);
  } else {
    checkEncCryptoKey(cek, enc2, "encrypt");
    encKey = cek;
  }
  const encrypted = new Uint8Array(
    await crypto.subtle.encrypt(
      {
        additionalData: aad,
        iv,
        name: "AES-GCM",
        tagLength: 128,
      },
      encKey,
      plaintext,
    ),
  );
  const tag2 = encrypted.slice(-16);
  const ciphertext = encrypted.slice(0, -16);
  return { ciphertext, tag: tag2, iv };
}
var encrypt_default = async (enc2, plaintext, cek, iv, aad) => {
  if (!isCryptoKey(cek) && !(cek instanceof Uint8Array)) {
    throw new TypeError(
      invalid_key_input_default(
        cek,
        "CryptoKey",
        "KeyObject",
        "Uint8Array",
        "JSON Web Key",
      ),
    );
  }
  if (iv) {
    check_iv_length_default(enc2, iv);
  } else {
    iv = iv_default(enc2);
  }
  switch (enc2) {
    case "A128CBC-HS256":
    case "A192CBC-HS384":
    case "A256CBC-HS512":
      if (cek instanceof Uint8Array) {
        check_cek_length_default(cek, parseInt(enc2.slice(-3), 10));
      }
      return cbcEncrypt(enc2, plaintext, cek, iv, aad);
    case "A128GCM":
    case "A192GCM":
    case "A256GCM":
      if (cek instanceof Uint8Array) {
        check_cek_length_default(cek, parseInt(enc2.slice(1, 4), 10));
      }
      return gcmEncrypt(enc2, plaintext, cek, iv, aad);
    default:
      throw new JOSENotSupported(
        "Unsupported JWE Content Encryption Algorithm",
      );
  }
};

// ../../../../node_modules/jose/dist/webapi/lib/aesgcmkw.js
async function wrap3(alg2, key, cek, iv) {
  const jweAlgorithm = alg2.slice(0, 7);
  const wrapped = await encrypt_default(
    jweAlgorithm,
    cek,
    key,
    iv,
    new Uint8Array(0),
  );
  return {
    encryptedKey: wrapped.ciphertext,
    iv: encode3(wrapped.iv),
    tag: encode3(wrapped.tag),
  };
}
async function unwrap3(alg2, key, encryptedKey, iv, tag2) {
  const jweAlgorithm = alg2.slice(0, 7);
  return decrypt_default(
    jweAlgorithm,
    key,
    encryptedKey,
    iv,
    tag2,
    new Uint8Array(0),
  );
}

// ../../../../node_modules/jose/dist/webapi/lib/decrypt_key_management.js
var decrypt_key_management_default = async (
  alg2,
  key,
  encryptedKey,
  joseHeader,
  options,
) => {
  switch (alg2) {
    case "dir": {
      if (encryptedKey !== void 0)
        throw new JWEInvalid("Encountered unexpected JWE Encrypted Key");
      return key;
    }
    case "ECDH-ES":
      if (encryptedKey !== void 0)
        throw new JWEInvalid("Encountered unexpected JWE Encrypted Key");
    case "ECDH-ES+A128KW":
    case "ECDH-ES+A192KW":
    case "ECDH-ES+A256KW": {
      if (!is_object_default(joseHeader.epk))
        throw new JWEInvalid(
          `JOSE Header "epk" (Ephemeral Public Key) missing or invalid`,
        );
      assertCryptoKey(key);
      if (!allowed(key))
        throw new JOSENotSupported(
          "ECDH with the provided key is not allowed or not supported by your javascript runtime",
        );
      const epk = await importJWK(joseHeader.epk, alg2);
      assertCryptoKey(epk);
      let partyUInfo;
      let partyVInfo;
      if (joseHeader.apu !== void 0) {
        if (typeof joseHeader.apu !== "string")
          throw new JWEInvalid(
            `JOSE Header "apu" (Agreement PartyUInfo) invalid`,
          );
        try {
          partyUInfo = decode(joseHeader.apu);
        } catch {
          throw new JWEInvalid("Failed to base64url decode the apu");
        }
      }
      if (joseHeader.apv !== void 0) {
        if (typeof joseHeader.apv !== "string")
          throw new JWEInvalid(
            `JOSE Header "apv" (Agreement PartyVInfo) invalid`,
          );
        try {
          partyVInfo = decode(joseHeader.apv);
        } catch {
          throw new JWEInvalid("Failed to base64url decode the apv");
        }
      }
      const sharedSecret = await deriveKey(
        epk,
        key,
        alg2 === "ECDH-ES" ? joseHeader.enc : alg2,
        alg2 === "ECDH-ES"
          ? bitLength2(joseHeader.enc)
          : parseInt(alg2.slice(-5, -2), 10),
        partyUInfo,
        partyVInfo,
      );
      if (alg2 === "ECDH-ES") return sharedSecret;
      if (encryptedKey === void 0)
        throw new JWEInvalid("JWE Encrypted Key missing");
      return unwrap(alg2.slice(-6), sharedSecret, encryptedKey);
    }
    case "RSA-OAEP":
    case "RSA-OAEP-256":
    case "RSA-OAEP-384":
    case "RSA-OAEP-512": {
      if (encryptedKey === void 0)
        throw new JWEInvalid("JWE Encrypted Key missing");
      assertCryptoKey(key);
      return decrypt(alg2, key, encryptedKey);
    }
    case "PBES2-HS256+A128KW":
    case "PBES2-HS384+A192KW":
    case "PBES2-HS512+A256KW": {
      if (encryptedKey === void 0)
        throw new JWEInvalid("JWE Encrypted Key missing");
      if (typeof joseHeader.p2c !== "number")
        throw new JWEInvalid(
          `JOSE Header "p2c" (PBES2 Count) missing or invalid`,
        );
      const p2cLimit = options?.maxPBES2Count || 1e4;
      if (joseHeader.p2c > p2cLimit)
        throw new JWEInvalid(
          `JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds`,
        );
      if (typeof joseHeader.p2s !== "string")
        throw new JWEInvalid(
          `JOSE Header "p2s" (PBES2 Salt) missing or invalid`,
        );
      let p2s;
      try {
        p2s = decode(joseHeader.p2s);
      } catch {
        throw new JWEInvalid("Failed to base64url decode the p2s");
      }
      return unwrap2(alg2, key, encryptedKey, joseHeader.p2c, p2s);
    }
    case "A128KW":
    case "A192KW":
    case "A256KW": {
      if (encryptedKey === void 0)
        throw new JWEInvalid("JWE Encrypted Key missing");
      return unwrap(alg2, key, encryptedKey);
    }
    case "A128GCMKW":
    case "A192GCMKW":
    case "A256GCMKW": {
      if (encryptedKey === void 0)
        throw new JWEInvalid("JWE Encrypted Key missing");
      if (typeof joseHeader.iv !== "string")
        throw new JWEInvalid(
          `JOSE Header "iv" (Initialization Vector) missing or invalid`,
        );
      if (typeof joseHeader.tag !== "string")
        throw new JWEInvalid(
          `JOSE Header "tag" (Authentication Tag) missing or invalid`,
        );
      let iv;
      try {
        iv = decode(joseHeader.iv);
      } catch {
        throw new JWEInvalid("Failed to base64url decode the iv");
      }
      let tag2;
      try {
        tag2 = decode(joseHeader.tag);
      } catch {
        throw new JWEInvalid("Failed to base64url decode the tag");
      }
      return unwrap3(alg2, key, encryptedKey, iv, tag2);
    }
    default: {
      throw new JOSENotSupported(
        'Invalid or unsupported "alg" (JWE Algorithm) header value',
      );
    }
  }
};

// ../../../../node_modules/jose/dist/webapi/lib/validate_crit.js
var validate_crit_default = (
  Err,
  recognizedDefault,
  recognizedOption,
  protectedHeader,
  joseHeader,
) => {
  if (joseHeader.crit !== void 0 && protectedHeader?.crit === void 0) {
    throw new Err(
      '"crit" (Critical) Header Parameter MUST be integrity protected',
    );
  }
  if (!protectedHeader || protectedHeader.crit === void 0) {
    return /* @__PURE__ */ new Set();
  }
  if (
    !Array.isArray(protectedHeader.crit) ||
    protectedHeader.crit.length === 0 ||
    protectedHeader.crit.some(
      (input) => typeof input !== "string" || input.length === 0,
    )
  ) {
    throw new Err(
      '"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present',
    );
  }
  let recognized;
  if (recognizedOption !== void 0) {
    recognized = new Map([
      ...Object.entries(recognizedOption),
      ...recognizedDefault.entries(),
    ]);
  } else {
    recognized = recognizedDefault;
  }
  for (const parameter of protectedHeader.crit) {
    if (!recognized.has(parameter)) {
      throw new JOSENotSupported(
        `Extension Header Parameter "${parameter}" is not recognized`,
      );
    }
    if (joseHeader[parameter] === void 0) {
      throw new Err(`Extension Header Parameter "${parameter}" is missing`);
    }
    if (recognized.get(parameter) && protectedHeader[parameter] === void 0) {
      throw new Err(
        `Extension Header Parameter "${parameter}" MUST be integrity protected`,
      );
    }
  }
  return new Set(protectedHeader.crit);
};

// ../../../../node_modules/jose/dist/webapi/lib/validate_algorithms.js
var validate_algorithms_default = (option, algorithms) => {
  if (
    algorithms !== void 0 &&
    (!Array.isArray(algorithms) ||
      algorithms.some((s3) => typeof s3 !== "string"))
  ) {
    throw new TypeError(`"${option}" option must be an array of strings`);
  }
  if (!algorithms) {
    return void 0;
  }
  return new Set(algorithms);
};

// ../../../../node_modules/jose/dist/webapi/lib/is_jwk.js
function isJWK(key) {
  return is_object_default(key) && typeof key.kty === "string";
}
function isPrivateJWK(key) {
  return key.kty !== "oct" && typeof key.d === "string";
}
function isPublicJWK(key) {
  return key.kty !== "oct" && typeof key.d === "undefined";
}
function isSecretJWK(key) {
  return key.kty === "oct" && typeof key.k === "string";
}

// ../../../../node_modules/jose/dist/webapi/lib/normalize_key.js
var cache;
var handleJWK = async (key, jwk, alg2, freeze = false) => {
  cache || (cache = /* @__PURE__ */ new WeakMap());
  let cached = cache.get(key);
  if (cached?.[alg2]) {
    return cached[alg2];
  }
  const cryptoKey = await jwk_to_key_default({ ...jwk, alg: alg2 });
  if (freeze) Object.freeze(key);
  if (!cached) {
    cache.set(key, { [alg2]: cryptoKey });
  } else {
    cached[alg2] = cryptoKey;
  }
  return cryptoKey;
};
var handleKeyObject = (keyObject, alg2) => {
  cache || (cache = /* @__PURE__ */ new WeakMap());
  let cached = cache.get(keyObject);
  if (cached?.[alg2]) {
    return cached[alg2];
  }
  const isPublic = keyObject.type === "public";
  const extractable = isPublic ? true : false;
  let cryptoKey;
  if (keyObject.asymmetricKeyType === "x25519") {
    switch (alg2) {
      case "ECDH-ES":
      case "ECDH-ES+A128KW":
      case "ECDH-ES+A192KW":
      case "ECDH-ES+A256KW":
        break;
      default:
        throw new TypeError(
          "given KeyObject instance cannot be used for this algorithm",
        );
    }
    cryptoKey = keyObject.toCryptoKey(
      keyObject.asymmetricKeyType,
      extractable,
      isPublic ? [] : ["deriveBits"],
    );
  }
  if (keyObject.asymmetricKeyType === "ed25519") {
    if (alg2 !== "EdDSA" && alg2 !== "Ed25519") {
      throw new TypeError(
        "given KeyObject instance cannot be used for this algorithm",
      );
    }
    cryptoKey = keyObject.toCryptoKey(
      keyObject.asymmetricKeyType,
      extractable,
      [isPublic ? "verify" : "sign"],
    );
  }
  if (keyObject.asymmetricKeyType === "rsa") {
    let hash;
    switch (alg2) {
      case "RSA-OAEP":
        hash = "SHA-1";
        break;
      case "RS256":
      case "PS256":
      case "RSA-OAEP-256":
        hash = "SHA-256";
        break;
      case "RS384":
      case "PS384":
      case "RSA-OAEP-384":
        hash = "SHA-384";
        break;
      case "RS512":
      case "PS512":
      case "RSA-OAEP-512":
        hash = "SHA-512";
        break;
      default:
        throw new TypeError(
          "given KeyObject instance cannot be used for this algorithm",
        );
    }
    if (alg2.startsWith("RSA-OAEP")) {
      return keyObject.toCryptoKey(
        {
          name: "RSA-OAEP",
          hash,
        },
        extractable,
        isPublic ? ["encrypt"] : ["decrypt"],
      );
    }
    cryptoKey = keyObject.toCryptoKey(
      {
        name: alg2.startsWith("PS") ? "RSA-PSS" : "RSASSA-PKCS1-v1_5",
        hash,
      },
      extractable,
      [isPublic ? "verify" : "sign"],
    );
  }
  if (keyObject.asymmetricKeyType === "ec") {
    const nist = /* @__PURE__ */ new Map([
      ["prime256v1", "P-256"],
      ["secp384r1", "P-384"],
      ["secp521r1", "P-521"],
    ]);
    const namedCurve = nist.get(keyObject.asymmetricKeyDetails?.namedCurve);
    if (!namedCurve) {
      throw new TypeError(
        "given KeyObject instance cannot be used for this algorithm",
      );
    }
    if (alg2 === "ES256" && namedCurve === "P-256") {
      cryptoKey = keyObject.toCryptoKey(
        {
          name: "ECDSA",
          namedCurve,
        },
        extractable,
        [isPublic ? "verify" : "sign"],
      );
    }
    if (alg2 === "ES384" && namedCurve === "P-384") {
      cryptoKey = keyObject.toCryptoKey(
        {
          name: "ECDSA",
          namedCurve,
        },
        extractable,
        [isPublic ? "verify" : "sign"],
      );
    }
    if (alg2 === "ES512" && namedCurve === "P-521") {
      cryptoKey = keyObject.toCryptoKey(
        {
          name: "ECDSA",
          namedCurve,
        },
        extractable,
        [isPublic ? "verify" : "sign"],
      );
    }
    if (alg2.startsWith("ECDH-ES")) {
      cryptoKey = keyObject.toCryptoKey(
        {
          name: "ECDH",
          namedCurve,
        },
        extractable,
        isPublic ? [] : ["deriveBits"],
      );
    }
  }
  if (!cryptoKey) {
    throw new TypeError(
      "given KeyObject instance cannot be used for this algorithm",
    );
  }
  if (!cached) {
    cache.set(keyObject, { [alg2]: cryptoKey });
  } else {
    cached[alg2] = cryptoKey;
  }
  return cryptoKey;
};
var normalize_key_default = async (key, alg2) => {
  if (key instanceof Uint8Array) {
    return key;
  }
  if (isCryptoKey(key)) {
    return key;
  }
  if (isKeyObject(key)) {
    if (key.type === "secret") {
      return key.export();
    }
    if ("toCryptoKey" in key && typeof key.toCryptoKey === "function") {
      try {
        return handleKeyObject(key, alg2);
      } catch (err) {
        if (err instanceof TypeError) {
          throw err;
        }
      }
    }
    let jwk = key.export({ format: "jwk" });
    return handleJWK(key, jwk, alg2);
  }
  if (isJWK(key)) {
    if (key.k) {
      return decode(key.k);
    }
    return handleJWK(key, key, alg2, true);
  }
  throw new Error("unreachable");
};

// ../../../../node_modules/jose/dist/webapi/lib/check_key_type.js
var tag = (key) => key?.[Symbol.toStringTag];
var jwkMatchesOp = (alg2, key, usage) => {
  if (key.use !== void 0) {
    let expected;
    switch (usage) {
      case "sign":
      case "verify":
        expected = "sig";
        break;
      case "encrypt":
      case "decrypt":
        expected = "enc";
        break;
    }
    if (key.use !== expected) {
      throw new TypeError(
        `Invalid key for this operation, its "use" must be "${expected}" when present`,
      );
    }
  }
  if (key.alg !== void 0 && key.alg !== alg2) {
    throw new TypeError(
      `Invalid key for this operation, its "alg" must be "${alg2}" when present`,
    );
  }
  if (Array.isArray(key.key_ops)) {
    let expectedKeyOp;
    switch (true) {
      case usage === "sign" || usage === "verify":
      case alg2 === "dir":
      case alg2.includes("CBC-HS"):
        expectedKeyOp = usage;
        break;
      case alg2.startsWith("PBES2"):
        expectedKeyOp = "deriveBits";
        break;
      case /^A\d{3}(?:GCM)?(?:KW)?$/.test(alg2):
        if (!alg2.includes("GCM") && alg2.endsWith("KW")) {
          expectedKeyOp = usage === "encrypt" ? "wrapKey" : "unwrapKey";
        } else {
          expectedKeyOp = usage;
        }
        break;
      case usage === "encrypt" && alg2.startsWith("RSA"):
        expectedKeyOp = "wrapKey";
        break;
      case usage === "decrypt":
        expectedKeyOp = alg2.startsWith("RSA") ? "unwrapKey" : "deriveBits";
        break;
    }
    if (expectedKeyOp && key.key_ops?.includes?.(expectedKeyOp) === false) {
      throw new TypeError(
        `Invalid key for this operation, its "key_ops" must include "${expectedKeyOp}" when present`,
      );
    }
  }
  return true;
};
var symmetricTypeCheck = (alg2, key, usage) => {
  if (key instanceof Uint8Array) return;
  if (isJWK(key)) {
    if (isSecretJWK(key) && jwkMatchesOp(alg2, key, usage)) return;
    throw new TypeError(
      `JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present`,
    );
  }
  if (!is_key_like_default(key)) {
    throw new TypeError(
      withAlg(
        alg2,
        key,
        "CryptoKey",
        "KeyObject",
        "JSON Web Key",
        "Uint8Array",
      ),
    );
  }
  if (key.type !== "secret") {
    throw new TypeError(
      `${tag(key)} instances for symmetric algorithms must be of type "secret"`,
    );
  }
};
var asymmetricTypeCheck = (alg2, key, usage) => {
  if (isJWK(key)) {
    switch (usage) {
      case "decrypt":
      case "sign":
        if (isPrivateJWK(key) && jwkMatchesOp(alg2, key, usage)) return;
        throw new TypeError(`JSON Web Key for this operation be a private JWK`);
      case "encrypt":
      case "verify":
        if (isPublicJWK(key) && jwkMatchesOp(alg2, key, usage)) return;
        throw new TypeError(`JSON Web Key for this operation be a public JWK`);
    }
  }
  if (!is_key_like_default(key)) {
    throw new TypeError(
      withAlg(alg2, key, "CryptoKey", "KeyObject", "JSON Web Key"),
    );
  }
  if (key.type === "secret") {
    throw new TypeError(
      `${tag(key)} instances for asymmetric algorithms must not be of type "secret"`,
    );
  }
  if (key.type === "public") {
    switch (usage) {
      case "sign":
        throw new TypeError(
          `${tag(key)} instances for asymmetric algorithm signing must be of type "private"`,
        );
      case "decrypt":
        throw new TypeError(
          `${tag(key)} instances for asymmetric algorithm decryption must be of type "private"`,
        );
      default:
        break;
    }
  }
  if (key.type === "private") {
    switch (usage) {
      case "verify":
        throw new TypeError(
          `${tag(key)} instances for asymmetric algorithm verifying must be of type "public"`,
        );
      case "encrypt":
        throw new TypeError(
          `${tag(key)} instances for asymmetric algorithm encryption must be of type "public"`,
        );
      default:
        break;
    }
  }
};
var check_key_type_default = (alg2, key, usage) => {
  const symmetric =
    alg2.startsWith("HS") ||
    alg2 === "dir" ||
    alg2.startsWith("PBES2") ||
    /^A(?:128|192|256)(?:GCM)?(?:KW)?$/.test(alg2) ||
    /^A(?:128|192|256)CBC-HS(?:256|384|512)$/.test(alg2);
  if (symmetric) {
    symmetricTypeCheck(alg2, key, usage);
  } else {
    asymmetricTypeCheck(alg2, key, usage);
  }
};

// ../../../../node_modules/jose/dist/webapi/jwe/flattened/decrypt.js
async function flattenedDecrypt(jwe, key, options) {
  if (!is_object_default(jwe)) {
    throw new JWEInvalid("Flattened JWE must be an object");
  }
  if (
    jwe.protected === void 0 &&
    jwe.header === void 0 &&
    jwe.unprotected === void 0
  ) {
    throw new JWEInvalid("JOSE Header missing");
  }
  if (jwe.iv !== void 0 && typeof jwe.iv !== "string") {
    throw new JWEInvalid("JWE Initialization Vector incorrect type");
  }
  if (typeof jwe.ciphertext !== "string") {
    throw new JWEInvalid("JWE Ciphertext missing or incorrect type");
  }
  if (jwe.tag !== void 0 && typeof jwe.tag !== "string") {
    throw new JWEInvalid("JWE Authentication Tag incorrect type");
  }
  if (jwe.protected !== void 0 && typeof jwe.protected !== "string") {
    throw new JWEInvalid("JWE Protected Header incorrect type");
  }
  if (jwe.encrypted_key !== void 0 && typeof jwe.encrypted_key !== "string") {
    throw new JWEInvalid("JWE Encrypted Key incorrect type");
  }
  if (jwe.aad !== void 0 && typeof jwe.aad !== "string") {
    throw new JWEInvalid("JWE AAD incorrect type");
  }
  if (jwe.header !== void 0 && !is_object_default(jwe.header)) {
    throw new JWEInvalid("JWE Shared Unprotected Header incorrect type");
  }
  if (jwe.unprotected !== void 0 && !is_object_default(jwe.unprotected)) {
    throw new JWEInvalid("JWE Per-Recipient Unprotected Header incorrect type");
  }
  let parsedProt;
  if (jwe.protected) {
    try {
      const protectedHeader2 = decode(jwe.protected);
      parsedProt = JSON.parse(decoder.decode(protectedHeader2));
    } catch {
      throw new JWEInvalid("JWE Protected Header is invalid");
    }
  }
  if (!is_disjoint_default(parsedProt, jwe.header, jwe.unprotected)) {
    throw new JWEInvalid(
      "JWE Protected, JWE Unprotected Header, and JWE Per-Recipient Unprotected Header Parameter names must be disjoint",
    );
  }
  const joseHeader = {
    ...parsedProt,
    ...jwe.header,
    ...jwe.unprotected,
  };
  validate_crit_default(
    JWEInvalid,
    /* @__PURE__ */ new Map(),
    options?.crit,
    parsedProt,
    joseHeader,
  );
  if (joseHeader.zip !== void 0) {
    throw new JOSENotSupported(
      'JWE "zip" (Compression Algorithm) Header Parameter is not supported.',
    );
  }
  const { alg: alg2, enc: enc2 } = joseHeader;
  if (typeof alg2 !== "string" || !alg2) {
    throw new JWEInvalid("missing JWE Algorithm (alg) in JWE Header");
  }
  if (typeof enc2 !== "string" || !enc2) {
    throw new JWEInvalid(
      "missing JWE Encryption Algorithm (enc) in JWE Header",
    );
  }
  const keyManagementAlgorithms =
    options &&
    validate_algorithms_default(
      "keyManagementAlgorithms",
      options.keyManagementAlgorithms,
    );
  const contentEncryptionAlgorithms =
    options &&
    validate_algorithms_default(
      "contentEncryptionAlgorithms",
      options.contentEncryptionAlgorithms,
    );
  if (
    (keyManagementAlgorithms && !keyManagementAlgorithms.has(alg2)) ||
    (!keyManagementAlgorithms && alg2.startsWith("PBES2"))
  ) {
    throw new JOSEAlgNotAllowed(
      '"alg" (Algorithm) Header Parameter value not allowed',
    );
  }
  if (contentEncryptionAlgorithms && !contentEncryptionAlgorithms.has(enc2)) {
    throw new JOSEAlgNotAllowed(
      '"enc" (Encryption Algorithm) Header Parameter value not allowed',
    );
  }
  let encryptedKey;
  if (jwe.encrypted_key !== void 0) {
    try {
      encryptedKey = decode(jwe.encrypted_key);
    } catch {
      throw new JWEInvalid("Failed to base64url decode the encrypted_key");
    }
  }
  let resolvedKey = false;
  if (typeof key === "function") {
    key = await key(parsedProt, jwe);
    resolvedKey = true;
  }
  check_key_type_default(alg2 === "dir" ? enc2 : alg2, key, "decrypt");
  const k3 = await normalize_key_default(key, alg2);
  let cek;
  try {
    cek = await decrypt_key_management_default(
      alg2,
      k3,
      encryptedKey,
      joseHeader,
      options,
    );
  } catch (err) {
    if (
      err instanceof TypeError ||
      err instanceof JWEInvalid ||
      err instanceof JOSENotSupported
    ) {
      throw err;
    }
    cek = cek_default(enc2);
  }
  let iv;
  let tag2;
  if (jwe.iv !== void 0) {
    try {
      iv = decode(jwe.iv);
    } catch {
      throw new JWEInvalid("Failed to base64url decode the iv");
    }
  }
  if (jwe.tag !== void 0) {
    try {
      tag2 = decode(jwe.tag);
    } catch {
      throw new JWEInvalid("Failed to base64url decode the tag");
    }
  }
  const protectedHeader = encoder.encode(jwe.protected ?? "");
  let additionalData;
  if (jwe.aad !== void 0) {
    additionalData = concat(
      protectedHeader,
      encoder.encode("."),
      encoder.encode(jwe.aad),
    );
  } else {
    additionalData = protectedHeader;
  }
  let ciphertext;
  try {
    ciphertext = decode(jwe.ciphertext);
  } catch {
    throw new JWEInvalid("Failed to base64url decode the ciphertext");
  }
  const plaintext = await decrypt_default(
    enc2,
    cek,
    ciphertext,
    iv,
    tag2,
    additionalData,
  );
  const result = { plaintext };
  if (jwe.protected !== void 0) {
    result.protectedHeader = parsedProt;
  }
  if (jwe.aad !== void 0) {
    try {
      result.additionalAuthenticatedData = decode(jwe.aad);
    } catch {
      throw new JWEInvalid("Failed to base64url decode the aad");
    }
  }
  if (jwe.unprotected !== void 0) {
    result.sharedUnprotectedHeader = jwe.unprotected;
  }
  if (jwe.header !== void 0) {
    result.unprotectedHeader = jwe.header;
  }
  if (resolvedKey) {
    return { ...result, key: k3 };
  }
  return result;
}

// ../../../../node_modules/jose/dist/webapi/jwe/compact/decrypt.js
async function compactDecrypt(jwe, key, options) {
  if (jwe instanceof Uint8Array) {
    jwe = decoder.decode(jwe);
  }
  if (typeof jwe !== "string") {
    throw new JWEInvalid("Compact JWE must be a string or Uint8Array");
  }
  const {
    0: protectedHeader,
    1: encryptedKey,
    2: iv,
    3: ciphertext,
    4: tag2,
    length,
  } = jwe.split(".");
  if (length !== 5) {
    throw new JWEInvalid("Invalid Compact JWE");
  }
  const decrypted = await flattenedDecrypt(
    {
      ciphertext,
      iv: iv || void 0,
      protected: protectedHeader,
      tag: tag2 || void 0,
      encrypted_key: encryptedKey || void 0,
    },
    key,
    options,
  );
  const result = {
    plaintext: decrypted.plaintext,
    protectedHeader: decrypted.protectedHeader,
  };
  if (typeof key === "function") {
    return { ...result, key: decrypted.key };
  }
  return result;
}

// ../../../../node_modules/jose/dist/webapi/lib/private_symbols.js
var unprotected = Symbol();

// ../../../../node_modules/jose/dist/webapi/lib/key_to_jwk.js
async function keyToJWK(key) {
  if (isKeyObject(key)) {
    if (key.type === "secret") {
      key = key.export();
    } else {
      return key.export({ format: "jwk" });
    }
  }
  if (key instanceof Uint8Array) {
    return {
      kty: "oct",
      k: encode3(key),
    };
  }
  if (!isCryptoKey(key)) {
    throw new TypeError(
      invalid_key_input_default(key, "CryptoKey", "KeyObject", "Uint8Array"),
    );
  }
  if (!key.extractable) {
    throw new TypeError(
      "non-extractable CryptoKey cannot be exported as a JWK",
    );
  }
  const {
    ext,
    key_ops,
    alg: alg2,
    use,
    ...jwk
  } = await crypto.subtle.exportKey("jwk", key);
  return jwk;
}

// ../../../../node_modules/jose/dist/webapi/key/export.js
async function exportJWK(key) {
  return keyToJWK(key);
}

// ../../../../node_modules/jose/dist/webapi/lib/encrypt_key_management.js
var encrypt_key_management_default = async (
  alg2,
  enc2,
  key,
  providedCek,
  providedParameters = {},
) => {
  let encryptedKey;
  let parameters;
  let cek;
  switch (alg2) {
    case "dir": {
      cek = key;
      break;
    }
    case "ECDH-ES":
    case "ECDH-ES+A128KW":
    case "ECDH-ES+A192KW":
    case "ECDH-ES+A256KW": {
      assertCryptoKey(key);
      if (!allowed(key)) {
        throw new JOSENotSupported(
          "ECDH with the provided key is not allowed or not supported by your javascript runtime",
        );
      }
      const { apu, apv } = providedParameters;
      let ephemeralKey;
      if (providedParameters.epk) {
        ephemeralKey = await normalize_key_default(
          providedParameters.epk,
          alg2,
        );
      } else {
        ephemeralKey = (
          await crypto.subtle.generateKey(key.algorithm, true, ["deriveBits"])
        ).privateKey;
      }
      const { x: x3, y: y2, crv, kty } = await exportJWK(ephemeralKey);
      const sharedSecret = await deriveKey(
        key,
        ephemeralKey,
        alg2 === "ECDH-ES" ? enc2 : alg2,
        alg2 === "ECDH-ES"
          ? bitLength2(enc2)
          : parseInt(alg2.slice(-5, -2), 10),
        apu,
        apv,
      );
      parameters = { epk: { x: x3, crv, kty } };
      if (kty === "EC") parameters.epk.y = y2;
      if (apu) parameters.apu = encode3(apu);
      if (apv) parameters.apv = encode3(apv);
      if (alg2 === "ECDH-ES") {
        cek = sharedSecret;
        break;
      }
      cek = providedCek || cek_default(enc2);
      const kwAlg = alg2.slice(-6);
      encryptedKey = await wrap(kwAlg, sharedSecret, cek);
      break;
    }
    case "RSA-OAEP":
    case "RSA-OAEP-256":
    case "RSA-OAEP-384":
    case "RSA-OAEP-512": {
      cek = providedCek || cek_default(enc2);
      assertCryptoKey(key);
      encryptedKey = await encrypt(alg2, key, cek);
      break;
    }
    case "PBES2-HS256+A128KW":
    case "PBES2-HS384+A192KW":
    case "PBES2-HS512+A256KW": {
      cek = providedCek || cek_default(enc2);
      const { p2c, p2s } = providedParameters;
      ({ encryptedKey, ...parameters } = await wrap2(alg2, key, cek, p2c, p2s));
      break;
    }
    case "A128KW":
    case "A192KW":
    case "A256KW": {
      cek = providedCek || cek_default(enc2);
      encryptedKey = await wrap(alg2, key, cek);
      break;
    }
    case "A128GCMKW":
    case "A192GCMKW":
    case "A256GCMKW": {
      cek = providedCek || cek_default(enc2);
      const { iv } = providedParameters;
      ({ encryptedKey, ...parameters } = await wrap3(alg2, key, cek, iv));
      break;
    }
    default: {
      throw new JOSENotSupported(
        'Invalid or unsupported "alg" (JWE Algorithm) header value',
      );
    }
  }
  return { cek, encryptedKey, parameters };
};

// ../../../../node_modules/jose/dist/webapi/jwe/flattened/encrypt.js
var _plaintext,
  _protectedHeader,
  _sharedUnprotectedHeader,
  _unprotectedHeader,
  _aad,
  _cek,
  _iv,
  _keyManagementParameters;
var FlattenedEncrypt = class {
  constructor(plaintext) {
    __privateAdd(this, _plaintext, void 0);
    __privateAdd(this, _protectedHeader, void 0);
    __privateAdd(this, _sharedUnprotectedHeader, void 0);
    __privateAdd(this, _unprotectedHeader, void 0);
    __privateAdd(this, _aad, void 0);
    __privateAdd(this, _cek, void 0);
    __privateAdd(this, _iv, void 0);
    __privateAdd(this, _keyManagementParameters, void 0);
    if (!(plaintext instanceof Uint8Array)) {
      throw new TypeError("plaintext must be an instance of Uint8Array");
    }
    __privateSet(this, _plaintext, plaintext);
  }
  setKeyManagementParameters(parameters) {
    if (__privateGet(this, _keyManagementParameters)) {
      throw new TypeError("setKeyManagementParameters can only be called once");
    }
    __privateSet(this, _keyManagementParameters, parameters);
    return this;
  }
  setProtectedHeader(protectedHeader) {
    if (__privateGet(this, _protectedHeader)) {
      throw new TypeError("setProtectedHeader can only be called once");
    }
    __privateSet(this, _protectedHeader, protectedHeader);
    return this;
  }
  setSharedUnprotectedHeader(sharedUnprotectedHeader) {
    if (__privateGet(this, _sharedUnprotectedHeader)) {
      throw new TypeError("setSharedUnprotectedHeader can only be called once");
    }
    __privateSet(this, _sharedUnprotectedHeader, sharedUnprotectedHeader);
    return this;
  }
  setUnprotectedHeader(unprotectedHeader) {
    if (__privateGet(this, _unprotectedHeader)) {
      throw new TypeError("setUnprotectedHeader can only be called once");
    }
    __privateSet(this, _unprotectedHeader, unprotectedHeader);
    return this;
  }
  setAdditionalAuthenticatedData(aad) {
    __privateSet(this, _aad, aad);
    return this;
  }
  setContentEncryptionKey(cek) {
    if (__privateGet(this, _cek)) {
      throw new TypeError("setContentEncryptionKey can only be called once");
    }
    __privateSet(this, _cek, cek);
    return this;
  }
  setInitializationVector(iv) {
    if (__privateGet(this, _iv)) {
      throw new TypeError("setInitializationVector can only be called once");
    }
    __privateSet(this, _iv, iv);
    return this;
  }
  async encrypt(key, options) {
    if (
      !__privateGet(this, _protectedHeader) &&
      !__privateGet(this, _unprotectedHeader) &&
      !__privateGet(this, _sharedUnprotectedHeader)
    ) {
      throw new JWEInvalid(
        "either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()",
      );
    }
    if (
      !is_disjoint_default(
        __privateGet(this, _protectedHeader),
        __privateGet(this, _unprotectedHeader),
        __privateGet(this, _sharedUnprotectedHeader),
      )
    ) {
      throw new JWEInvalid(
        "JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint",
      );
    }
    const joseHeader = {
      ...__privateGet(this, _protectedHeader),
      ...__privateGet(this, _unprotectedHeader),
      ...__privateGet(this, _sharedUnprotectedHeader),
    };
    validate_crit_default(
      JWEInvalid,
      /* @__PURE__ */ new Map(),
      options?.crit,
      __privateGet(this, _protectedHeader),
      joseHeader,
    );
    if (joseHeader.zip !== void 0) {
      throw new JOSENotSupported(
        'JWE "zip" (Compression Algorithm) Header Parameter is not supported.',
      );
    }
    const { alg: alg2, enc: enc2 } = joseHeader;
    if (typeof alg2 !== "string" || !alg2) {
      throw new JWEInvalid(
        'JWE "alg" (Algorithm) Header Parameter missing or invalid',
      );
    }
    if (typeof enc2 !== "string" || !enc2) {
      throw new JWEInvalid(
        'JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid',
      );
    }
    let encryptedKey;
    if (__privateGet(this, _cek) && (alg2 === "dir" || alg2 === "ECDH-ES")) {
      throw new TypeError(
        `setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${alg2}`,
      );
    }
    check_key_type_default(alg2 === "dir" ? enc2 : alg2, key, "encrypt");
    let cek;
    {
      let parameters;
      const k3 = await normalize_key_default(key, alg2);
      ({ cek, encryptedKey, parameters } = await encrypt_key_management_default(
        alg2,
        enc2,
        k3,
        __privateGet(this, _cek),
        __privateGet(this, _keyManagementParameters),
      ));
      if (parameters) {
        if (options && unprotected in options) {
          if (!__privateGet(this, _unprotectedHeader)) {
            this.setUnprotectedHeader(parameters);
          } else {
            __privateSet(this, _unprotectedHeader, {
              ...__privateGet(this, _unprotectedHeader),
              ...parameters,
            });
          }
        } else if (!__privateGet(this, _protectedHeader)) {
          this.setProtectedHeader(parameters);
        } else {
          __privateSet(this, _protectedHeader, {
            ...__privateGet(this, _protectedHeader),
            ...parameters,
          });
        }
      }
    }
    let additionalData;
    let protectedHeader;
    let aadMember;
    if (__privateGet(this, _protectedHeader)) {
      protectedHeader = encoder.encode(
        encode3(JSON.stringify(__privateGet(this, _protectedHeader))),
      );
    } else {
      protectedHeader = encoder.encode("");
    }
    if (__privateGet(this, _aad)) {
      aadMember = encode3(__privateGet(this, _aad));
      additionalData = concat(
        protectedHeader,
        encoder.encode("."),
        encoder.encode(aadMember),
      );
    } else {
      additionalData = protectedHeader;
    }
    const {
      ciphertext,
      tag: tag2,
      iv,
    } = await encrypt_default(
      enc2,
      __privateGet(this, _plaintext),
      cek,
      __privateGet(this, _iv),
      additionalData,
    );
    const jwe = {
      ciphertext: encode3(ciphertext),
    };
    if (iv) {
      jwe.iv = encode3(iv);
    }
    if (tag2) {
      jwe.tag = encode3(tag2);
    }
    if (encryptedKey) {
      jwe.encrypted_key = encode3(encryptedKey);
    }
    if (aadMember) {
      jwe.aad = aadMember;
    }
    if (__privateGet(this, _protectedHeader)) {
      jwe.protected = decoder.decode(protectedHeader);
    }
    if (__privateGet(this, _sharedUnprotectedHeader)) {
      jwe.unprotected = __privateGet(this, _sharedUnprotectedHeader);
    }
    if (__privateGet(this, _unprotectedHeader)) {
      jwe.header = __privateGet(this, _unprotectedHeader);
    }
    return jwe;
  }
};
_plaintext = new WeakMap();
_protectedHeader = new WeakMap();
_sharedUnprotectedHeader = new WeakMap();
_unprotectedHeader = new WeakMap();
_aad = new WeakMap();
_cek = new WeakMap();
_iv = new WeakMap();
_keyManagementParameters = new WeakMap();

// ../../../../node_modules/jose/dist/webapi/lib/epoch.js
var epoch_default = (date) => Math.floor(date.getTime() / 1e3);

// ../../../../node_modules/jose/dist/webapi/lib/secs.js
var minute = 60;
var hour = minute * 60;
var day = hour * 24;
var week = day * 7;
var year = day * 365.25;
var REGEX =
  /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i;
var secs_default = (str) => {
  const matched = REGEX.exec(str);
  if (!matched || (matched[4] && matched[1])) {
    throw new TypeError("Invalid time period format");
  }
  const value = parseFloat(matched[2]);
  const unit = matched[3].toLowerCase();
  let numericDate;
  switch (unit) {
    case "sec":
    case "secs":
    case "second":
    case "seconds":
    case "s":
      numericDate = Math.round(value);
      break;
    case "minute":
    case "minutes":
    case "min":
    case "mins":
    case "m":
      numericDate = Math.round(value * minute);
      break;
    case "hour":
    case "hours":
    case "hr":
    case "hrs":
    case "h":
      numericDate = Math.round(value * hour);
      break;
    case "day":
    case "days":
    case "d":
      numericDate = Math.round(value * day);
      break;
    case "week":
    case "weeks":
    case "w":
      numericDate = Math.round(value * week);
      break;
    default:
      numericDate = Math.round(value * year);
      break;
  }
  if (matched[1] === "-" || matched[4] === "ago") {
    return -numericDate;
  }
  return numericDate;
};

// ../../../../node_modules/jose/dist/webapi/lib/jwt_claims_set.js
function validateInput(label, input) {
  if (!Number.isFinite(input)) {
    throw new TypeError(`Invalid ${label} input`);
  }
  return input;
}
var normalizeTyp = (value) => {
  if (value.includes("/")) {
    return value.toLowerCase();
  }
  return `application/${value.toLowerCase()}`;
};
var checkAudiencePresence = (audPayload, audOption) => {
  if (typeof audPayload === "string") {
    return audOption.includes(audPayload);
  }
  if (Array.isArray(audPayload)) {
    return audOption.some(Set.prototype.has.bind(new Set(audPayload)));
  }
  return false;
};
function validateClaimsSet(protectedHeader, encodedPayload, options = {}) {
  let payload;
  try {
    payload = JSON.parse(decoder.decode(encodedPayload));
  } catch {}
  if (!is_object_default(payload)) {
    throw new JWTInvalid("JWT Claims Set must be a top-level JSON object");
  }
  const { typ } = options;
  if (
    typ &&
    (typeof protectedHeader.typ !== "string" ||
      normalizeTyp(protectedHeader.typ) !== normalizeTyp(typ))
  ) {
    throw new JWTClaimValidationFailed(
      'unexpected "typ" JWT header value',
      payload,
      "typ",
      "check_failed",
    );
  }
  const {
    requiredClaims = [],
    issuer,
    subject,
    audience,
    maxTokenAge,
  } = options;
  const presenceCheck = [...requiredClaims];
  if (maxTokenAge !== void 0) presenceCheck.push("iat");
  if (audience !== void 0) presenceCheck.push("aud");
  if (subject !== void 0) presenceCheck.push("sub");
  if (issuer !== void 0) presenceCheck.push("iss");
  for (const claim of new Set(presenceCheck.reverse())) {
    if (!(claim in payload)) {
      throw new JWTClaimValidationFailed(
        `missing required "${claim}" claim`,
        payload,
        claim,
        "missing",
      );
    }
  }
  if (
    issuer &&
    !(Array.isArray(issuer) ? issuer : [issuer]).includes(payload.iss)
  ) {
    throw new JWTClaimValidationFailed(
      'unexpected "iss" claim value',
      payload,
      "iss",
      "check_failed",
    );
  }
  if (subject && payload.sub !== subject) {
    throw new JWTClaimValidationFailed(
      'unexpected "sub" claim value',
      payload,
      "sub",
      "check_failed",
    );
  }
  if (
    audience &&
    !checkAudiencePresence(
      payload.aud,
      typeof audience === "string" ? [audience] : audience,
    )
  ) {
    throw new JWTClaimValidationFailed(
      'unexpected "aud" claim value',
      payload,
      "aud",
      "check_failed",
    );
  }
  let tolerance;
  switch (typeof options.clockTolerance) {
    case "string":
      tolerance = secs_default(options.clockTolerance);
      break;
    case "number":
      tolerance = options.clockTolerance;
      break;
    case "undefined":
      tolerance = 0;
      break;
    default:
      throw new TypeError("Invalid clockTolerance option type");
  }
  const { currentDate } = options;
  const now3 = epoch_default(currentDate || /* @__PURE__ */ new Date());
  if (
    (payload.iat !== void 0 || maxTokenAge) &&
    typeof payload.iat !== "number"
  ) {
    throw new JWTClaimValidationFailed(
      '"iat" claim must be a number',
      payload,
      "iat",
      "invalid",
    );
  }
  if (payload.nbf !== void 0) {
    if (typeof payload.nbf !== "number") {
      throw new JWTClaimValidationFailed(
        '"nbf" claim must be a number',
        payload,
        "nbf",
        "invalid",
      );
    }
    if (payload.nbf > now3 + tolerance) {
      throw new JWTClaimValidationFailed(
        '"nbf" claim timestamp check failed',
        payload,
        "nbf",
        "check_failed",
      );
    }
  }
  if (payload.exp !== void 0) {
    if (typeof payload.exp !== "number") {
      throw new JWTClaimValidationFailed(
        '"exp" claim must be a number',
        payload,
        "exp",
        "invalid",
      );
    }
    if (payload.exp <= now3 - tolerance) {
      throw new JWTExpired(
        '"exp" claim timestamp check failed',
        payload,
        "exp",
        "check_failed",
      );
    }
  }
  if (maxTokenAge) {
    const age = now3 - payload.iat;
    const max =
      typeof maxTokenAge === "number" ? maxTokenAge : secs_default(maxTokenAge);
    if (age - tolerance > max) {
      throw new JWTExpired(
        '"iat" claim timestamp check failed (too far in the past)',
        payload,
        "iat",
        "check_failed",
      );
    }
    if (age < 0 - tolerance) {
      throw new JWTClaimValidationFailed(
        '"iat" claim timestamp check failed (it should be in the past)',
        payload,
        "iat",
        "check_failed",
      );
    }
  }
  return payload;
}
var _payload;
var JWTClaimsBuilder = class {
  constructor(payload) {
    __privateAdd(this, _payload, void 0);
    if (!is_object_default(payload)) {
      throw new TypeError("JWT Claims Set MUST be an object");
    }
    __privateSet(this, _payload, structuredClone(payload));
  }
  data() {
    return encoder.encode(JSON.stringify(__privateGet(this, _payload)));
  }
  get iss() {
    return __privateGet(this, _payload).iss;
  }
  set iss(value) {
    __privateGet(this, _payload).iss = value;
  }
  get sub() {
    return __privateGet(this, _payload).sub;
  }
  set sub(value) {
    __privateGet(this, _payload).sub = value;
  }
  get aud() {
    return __privateGet(this, _payload).aud;
  }
  set aud(value) {
    __privateGet(this, _payload).aud = value;
  }
  set jti(value) {
    __privateGet(this, _payload).jti = value;
  }
  set nbf(value) {
    if (typeof value === "number") {
      __privateGet(this, _payload).nbf = validateInput("setNotBefore", value);
    } else if (value instanceof Date) {
      __privateGet(this, _payload).nbf = validateInput(
        "setNotBefore",
        epoch_default(value),
      );
    } else {
      __privateGet(this, _payload).nbf =
        epoch_default(/* @__PURE__ */ new Date()) + secs_default(value);
    }
  }
  set exp(value) {
    if (typeof value === "number") {
      __privateGet(this, _payload).exp = validateInput(
        "setExpirationTime",
        value,
      );
    } else if (value instanceof Date) {
      __privateGet(this, _payload).exp = validateInput(
        "setExpirationTime",
        epoch_default(value),
      );
    } else {
      __privateGet(this, _payload).exp =
        epoch_default(/* @__PURE__ */ new Date()) + secs_default(value);
    }
  }
  set iat(value) {
    if (typeof value === "undefined") {
      __privateGet(this, _payload).iat = epoch_default(
        /* @__PURE__ */ new Date(),
      );
    } else if (value instanceof Date) {
      __privateGet(this, _payload).iat = validateInput(
        "setIssuedAt",
        epoch_default(value),
      );
    } else if (typeof value === "string") {
      __privateGet(this, _payload).iat = validateInput(
        "setIssuedAt",
        epoch_default(/* @__PURE__ */ new Date()) + secs_default(value),
      );
    } else {
      __privateGet(this, _payload).iat = validateInput("setIssuedAt", value);
    }
  }
};
_payload = new WeakMap();

// ../../../../node_modules/jose/dist/webapi/jwt/decrypt.js
async function jwtDecrypt(jwt, key, options) {
  const decrypted = await compactDecrypt(jwt, key, options);
  const payload = validateClaimsSet(
    decrypted.protectedHeader,
    decrypted.plaintext,
    options,
  );
  const { protectedHeader } = decrypted;
  if (protectedHeader.iss !== void 0 && protectedHeader.iss !== payload.iss) {
    throw new JWTClaimValidationFailed(
      'replicated "iss" claim header parameter mismatch',
      payload,
      "iss",
      "mismatch",
    );
  }
  if (protectedHeader.sub !== void 0 && protectedHeader.sub !== payload.sub) {
    throw new JWTClaimValidationFailed(
      'replicated "sub" claim header parameter mismatch',
      payload,
      "sub",
      "mismatch",
    );
  }
  if (
    protectedHeader.aud !== void 0 &&
    JSON.stringify(protectedHeader.aud) !== JSON.stringify(payload.aud)
  ) {
    throw new JWTClaimValidationFailed(
      'replicated "aud" claim header parameter mismatch',
      payload,
      "aud",
      "mismatch",
    );
  }
  const result = { payload, protectedHeader };
  if (typeof key === "function") {
    return { ...result, key: decrypted.key };
  }
  return result;
}

// ../../../../node_modules/jose/dist/webapi/jwe/compact/encrypt.js
var _flattened;
var CompactEncrypt = class {
  constructor(plaintext) {
    __privateAdd(this, _flattened, void 0);
    __privateSet(this, _flattened, new FlattenedEncrypt(plaintext));
  }
  setContentEncryptionKey(cek) {
    __privateGet(this, _flattened).setContentEncryptionKey(cek);
    return this;
  }
  setInitializationVector(iv) {
    __privateGet(this, _flattened).setInitializationVector(iv);
    return this;
  }
  setProtectedHeader(protectedHeader) {
    __privateGet(this, _flattened).setProtectedHeader(protectedHeader);
    return this;
  }
  setKeyManagementParameters(parameters) {
    __privateGet(this, _flattened).setKeyManagementParameters(parameters);
    return this;
  }
  async encrypt(key, options) {
    const jwe = await __privateGet(this, _flattened).encrypt(key, options);
    return [
      jwe.protected,
      jwe.encrypted_key,
      jwe.iv,
      jwe.ciphertext,
      jwe.tag,
    ].join(".");
  }
};
_flattened = new WeakMap();

// ../../../../node_modules/jose/dist/webapi/jwt/encrypt.js
var _cek2,
  _iv2,
  _keyManagementParameters2,
  _protectedHeader2,
  _replicateIssuerAsHeader,
  _replicateSubjectAsHeader,
  _replicateAudienceAsHeader,
  _jwt;
var EncryptJWT = class {
  constructor(payload = {}) {
    __privateAdd(this, _cek2, void 0);
    __privateAdd(this, _iv2, void 0);
    __privateAdd(this, _keyManagementParameters2, void 0);
    __privateAdd(this, _protectedHeader2, void 0);
    __privateAdd(this, _replicateIssuerAsHeader, void 0);
    __privateAdd(this, _replicateSubjectAsHeader, void 0);
    __privateAdd(this, _replicateAudienceAsHeader, void 0);
    __privateAdd(this, _jwt, void 0);
    __privateSet(this, _jwt, new JWTClaimsBuilder(payload));
  }
  setIssuer(issuer) {
    __privateGet(this, _jwt).iss = issuer;
    return this;
  }
  setSubject(subject) {
    __privateGet(this, _jwt).sub = subject;
    return this;
  }
  setAudience(audience) {
    __privateGet(this, _jwt).aud = audience;
    return this;
  }
  setJti(jwtId) {
    __privateGet(this, _jwt).jti = jwtId;
    return this;
  }
  setNotBefore(input) {
    __privateGet(this, _jwt).nbf = input;
    return this;
  }
  setExpirationTime(input) {
    __privateGet(this, _jwt).exp = input;
    return this;
  }
  setIssuedAt(input) {
    __privateGet(this, _jwt).iat = input;
    return this;
  }
  setProtectedHeader(protectedHeader) {
    if (__privateGet(this, _protectedHeader2)) {
      throw new TypeError("setProtectedHeader can only be called once");
    }
    __privateSet(this, _protectedHeader2, protectedHeader);
    return this;
  }
  setKeyManagementParameters(parameters) {
    if (__privateGet(this, _keyManagementParameters2)) {
      throw new TypeError("setKeyManagementParameters can only be called once");
    }
    __privateSet(this, _keyManagementParameters2, parameters);
    return this;
  }
  setContentEncryptionKey(cek) {
    if (__privateGet(this, _cek2)) {
      throw new TypeError("setContentEncryptionKey can only be called once");
    }
    __privateSet(this, _cek2, cek);
    return this;
  }
  setInitializationVector(iv) {
    if (__privateGet(this, _iv2)) {
      throw new TypeError("setInitializationVector can only be called once");
    }
    __privateSet(this, _iv2, iv);
    return this;
  }
  replicateIssuerAsHeader() {
    __privateSet(this, _replicateIssuerAsHeader, true);
    return this;
  }
  replicateSubjectAsHeader() {
    __privateSet(this, _replicateSubjectAsHeader, true);
    return this;
  }
  replicateAudienceAsHeader() {
    __privateSet(this, _replicateAudienceAsHeader, true);
    return this;
  }
  async encrypt(key, options) {
    const enc2 = new CompactEncrypt(__privateGet(this, _jwt).data());
    if (
      __privateGet(this, _protectedHeader2) &&
      (__privateGet(this, _replicateIssuerAsHeader) ||
        __privateGet(this, _replicateSubjectAsHeader) ||
        __privateGet(this, _replicateAudienceAsHeader))
    ) {
      __privateSet(this, _protectedHeader2, {
        ...__privateGet(this, _protectedHeader2),
        iss: __privateGet(this, _replicateIssuerAsHeader)
          ? __privateGet(this, _jwt).iss
          : void 0,
        sub: __privateGet(this, _replicateSubjectAsHeader)
          ? __privateGet(this, _jwt).sub
          : void 0,
        aud: __privateGet(this, _replicateAudienceAsHeader)
          ? __privateGet(this, _jwt).aud
          : void 0,
      });
    }
    enc2.setProtectedHeader(__privateGet(this, _protectedHeader2));
    if (__privateGet(this, _iv2)) {
      enc2.setInitializationVector(__privateGet(this, _iv2));
    }
    if (__privateGet(this, _cek2)) {
      enc2.setContentEncryptionKey(__privateGet(this, _cek2));
    }
    if (__privateGet(this, _keyManagementParameters2)) {
      enc2.setKeyManagementParameters(
        __privateGet(this, _keyManagementParameters2),
      );
    }
    return enc2.encrypt(key, options);
  }
};
_cek2 = new WeakMap();
_iv2 = new WeakMap();
_keyManagementParameters2 = new WeakMap();
_protectedHeader2 = new WeakMap();
_replicateIssuerAsHeader = new WeakMap();
_replicateSubjectAsHeader = new WeakMap();
_replicateAudienceAsHeader = new WeakMap();
_jwt = new WeakMap();

// ../../../../node_modules/jose/dist/webapi/jwk/thumbprint.js
var check = (value, description) => {
  if (typeof value !== "string" || !value) {
    throw new JWKInvalid(`${description} missing or invalid`);
  }
};
async function calculateJwkThumbprint(key, digestAlgorithm) {
  let jwk;
  if (isJWK(key)) {
    jwk = key;
  } else if (is_key_like_default(key)) {
    jwk = await exportJWK(key);
  } else {
    throw new TypeError(
      invalid_key_input_default(key, "CryptoKey", "KeyObject", "JSON Web Key"),
    );
  }
  digestAlgorithm ?? (digestAlgorithm = "sha256");
  if (
    digestAlgorithm !== "sha256" &&
    digestAlgorithm !== "sha384" &&
    digestAlgorithm !== "sha512"
  ) {
    throw new TypeError(
      'digestAlgorithm must one of "sha256", "sha384", or "sha512"',
    );
  }
  let components;
  switch (jwk.kty) {
    case "EC":
      check(jwk.crv, '"crv" (Curve) Parameter');
      check(jwk.x, '"x" (X Coordinate) Parameter');
      check(jwk.y, '"y" (Y Coordinate) Parameter');
      components = { crv: jwk.crv, kty: jwk.kty, x: jwk.x, y: jwk.y };
      break;
    case "OKP":
      check(jwk.crv, '"crv" (Subtype of Key Pair) Parameter');
      check(jwk.x, '"x" (Public Key) Parameter');
      components = { crv: jwk.crv, kty: jwk.kty, x: jwk.x };
      break;
    case "RSA":
      check(jwk.e, '"e" (Exponent) Parameter');
      check(jwk.n, '"n" (Modulus) Parameter');
      components = { e: jwk.e, kty: jwk.kty, n: jwk.n };
      break;
    case "oct":
      check(jwk.k, '"k" (Key Value) Parameter');
      components = { k: jwk.k, kty: jwk.kty };
      break;
    default:
      throw new JOSENotSupported(
        '"kty" (Key Type) Parameter missing or unsupported',
      );
  }
  const data = encoder.encode(JSON.stringify(components));
  return encode3(await digest_default(digestAlgorithm, data));
}

// ../../../../node_modules/jose/dist/webapi/util/decode_jwt.js
function decodeJwt(jwt) {
  if (typeof jwt !== "string")
    throw new JWTInvalid(
      "JWTs must use Compact JWS serialization, JWT must be a string",
    );
  const { 1: payload, length } = jwt.split(".");
  if (length === 5)
    throw new JWTInvalid(
      "Only JWTs using Compact JWS serialization can be decoded",
    );
  if (length !== 3) throw new JWTInvalid("Invalid JWT");
  if (!payload) throw new JWTInvalid("JWTs must contain a payload");
  let decoded;
  try {
    decoded = decode(payload);
  } catch {
    throw new JWTInvalid("Failed to base64url decode the payload");
  }
  let result;
  try {
    result = JSON.parse(decoder.decode(decoded));
  } catch {
    throw new JWTInvalid("Failed to parse the decoded payload as JSON");
  }
  if (!is_object_default(result))
    throw new JWTInvalid("Invalid JWT Claims Set");
  return result;
}

// ../../../../node_modules/@auth/core/lib/vendored/cookie.js
var cookie_exports = {};
__export2(cookie_exports, {
  parse: () => parse,
  serialize: () => serialize,
});
var cookieNameRegExp = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
var cookieValueRegExp =
  /^("?)[\u0021\u0023-\u002B\u002D-\u003A\u003C-\u005B\u005D-\u007E]*\1$/;
var domainValueRegExp =
  /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
var __toString = Object.prototype.toString;
var NullObject = /* @__PURE__ */ (() => {
  const C3 = function () {};
  C3.prototype = /* @__PURE__ */ Object.create(null);
  return C3;
})();
function parse(str, options) {
  const obj = new NullObject();
  const len = str.length;
  if (len < 2) return obj;
  const dec = options?.decode || decode2;
  let index = 0;
  do {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) break;
    const colonIdx = str.indexOf(";", index);
    const endIdx = colonIdx === -1 ? len : colonIdx;
    if (eqIdx > endIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const keyStartIdx = startIndex(str, index, eqIdx);
    const keyEndIdx = endIndex(str, eqIdx, keyStartIdx);
    const key = str.slice(keyStartIdx, keyEndIdx);
    if (obj[key] === void 0) {
      let valStartIdx = startIndex(str, eqIdx + 1, endIdx);
      let valEndIdx = endIndex(str, endIdx, valStartIdx);
      const value = dec(str.slice(valStartIdx, valEndIdx));
      obj[key] = value;
    }
    index = endIdx + 1;
  } while (index < len);
  return obj;
}
function startIndex(str, index, max) {
  do {
    const code = str.charCodeAt(index);
    if (code !== 32 && code !== 9) return index;
  } while (++index < max);
  return max;
}
function endIndex(str, index, min) {
  while (index > min) {
    const code = str.charCodeAt(--index);
    if (code !== 32 && code !== 9) return index + 1;
  }
  return min;
}
function serialize(name, val, options) {
  const enc2 = options?.encode || encodeURIComponent;
  if (!cookieNameRegExp.test(name)) {
    throw new TypeError(`argument name is invalid: ${name}`);
  }
  const value = enc2(val);
  if (!cookieValueRegExp.test(value)) {
    throw new TypeError(`argument val is invalid: ${val}`);
  }
  let str = name + "=" + value;
  if (!options) return str;
  if (options.maxAge !== void 0) {
    if (!Number.isInteger(options.maxAge)) {
      throw new TypeError(`option maxAge is invalid: ${options.maxAge}`);
    }
    str += "; Max-Age=" + options.maxAge;
  }
  if (options.domain) {
    if (!domainValueRegExp.test(options.domain)) {
      throw new TypeError(`option domain is invalid: ${options.domain}`);
    }
    str += "; Domain=" + options.domain;
  }
  if (options.path) {
    if (!pathValueRegExp.test(options.path)) {
      throw new TypeError(`option path is invalid: ${options.path}`);
    }
    str += "; Path=" + options.path;
  }
  if (options.expires) {
    if (
      !isDate2(options.expires) ||
      !Number.isFinite(options.expires.valueOf())
    ) {
      throw new TypeError(`option expires is invalid: ${options.expires}`);
    }
    str += "; Expires=" + options.expires.toUTCString();
  }
  if (options.httpOnly) {
    str += "; HttpOnly";
  }
  if (options.secure) {
    str += "; Secure";
  }
  if (options.partitioned) {
    str += "; Partitioned";
  }
  if (options.priority) {
    const priority =
      typeof options.priority === "string"
        ? options.priority.toLowerCase()
        : void 0;
    switch (priority) {
      case "low":
        str += "; Priority=Low";
        break;
      case "medium":
        str += "; Priority=Medium";
        break;
      case "high":
        str += "; Priority=High";
        break;
      default:
        throw new TypeError(`option priority is invalid: ${options.priority}`);
    }
  }
  if (options.sameSite) {
    const sameSite =
      typeof options.sameSite === "string"
        ? options.sameSite.toLowerCase()
        : options.sameSite;
    switch (sameSite) {
      case true:
      case "strict":
        str += "; SameSite=Strict";
        break;
      case "lax":
        str += "; SameSite=Lax";
        break;
      case "none":
        str += "; SameSite=None";
        break;
      default:
        throw new TypeError(`option sameSite is invalid: ${options.sameSite}`);
    }
  }
  return str;
}
function decode2(str) {
  if (str.indexOf("%") === -1) return str;
  try {
    return decodeURIComponent(str);
  } catch (e2) {
    return str;
  }
}
function isDate2(val) {
  return __toString.call(val) === "[object Date]";
}

// ../../../../node_modules/@auth/core/jwt.js
var { parse: parseCookie } = cookie_exports;
var DEFAULT_MAX_AGE = 30 * 24 * 60 * 60;
var now2 = () => (Date.now() / 1e3) | 0;
var alg = "dir";
var enc = "A256CBC-HS512";
async function encode4(params) {
  const { token = {}, secret, maxAge = DEFAULT_MAX_AGE, salt } = params;
  const secrets = Array.isArray(secret) ? secret : [secret];
  const encryptionSecret = await getDerivedEncryptionKey(enc, secrets[0], salt);
  const thumbprint = await calculateJwkThumbprint(
    { kty: "oct", k: base64url_exports.encode(encryptionSecret) },
    `sha${encryptionSecret.byteLength << 3}`,
  );
  return await new EncryptJWT(token)
    .setProtectedHeader({ alg, enc, kid: thumbprint })
    .setIssuedAt()
    .setExpirationTime(now2() + maxAge)
    .setJti(crypto.randomUUID())
    .encrypt(encryptionSecret);
}
async function decode3(params) {
  const { token, secret, salt } = params;
  const secrets = Array.isArray(secret) ? secret : [secret];
  if (!token) return null;
  const { payload } = await jwtDecrypt(
    token,
    async ({ kid, enc: enc2 }) => {
      for (const secret2 of secrets) {
        const encryptionSecret = await getDerivedEncryptionKey(
          enc2,
          secret2,
          salt,
        );
        if (kid === void 0) return encryptionSecret;
        const thumbprint = await calculateJwkThumbprint(
          { kty: "oct", k: base64url_exports.encode(encryptionSecret) },
          `sha${encryptionSecret.byteLength << 3}`,
        );
        if (kid === thumbprint) return encryptionSecret;
      }
      throw new Error("no matching decryption secret");
    },
    {
      clockTolerance: 15,
      keyManagementAlgorithms: [alg],
      contentEncryptionAlgorithms: [enc, "A256GCM"],
    },
  );
  return payload;
}
async function getDerivedEncryptionKey(enc2, keyMaterial, salt) {
  let length;
  switch (enc2) {
    case "A256CBC-HS512":
      length = 64;
      break;
    case "A256GCM":
      length = 32;
      break;
    default:
      throw new Error("Unsupported JWT Content Encryption Algorithm");
  }
  return await hkdf(
    "sha256",
    keyMaterial,
    salt,
    `Auth.js Generated Encryption Key (${salt})`,
    length,
  );
}

// ../../../../node_modules/@auth/core/lib/utils/callback-url.js
async function createCallbackUrl({ options, paramValue, cookieValue }) {
  const { url, callbacks } = options;
  let callbackUrl = url.origin;
  if (paramValue) {
    callbackUrl = await callbacks.redirect({
      url: paramValue,
      baseUrl: url.origin,
    });
  } else if (cookieValue) {
    callbackUrl = await callbacks.redirect({
      url: cookieValue,
      baseUrl: url.origin,
    });
  }
  return {
    callbackUrl,
    // Save callback URL in a cookie so that it can be used for subsequent requests in signin/signout/callback flow
    callbackUrlCookie: callbackUrl !== cookieValue ? callbackUrl : void 0,
  };
}

// ../../../../node_modules/@auth/core/lib/utils/logger.js
var red = "\x1B[31m";
var yellow = "\x1B[33m";
var grey = "\x1B[90m";
var reset = "\x1B[0m";
var defaultLogger = {
  error(error) {
    const name = error instanceof AuthError ? error.type : error.name;
    console.error(`${red}[auth][error]${reset} ${name}: ${error.message}`);
    if (
      error.cause &&
      typeof error.cause === "object" &&
      "err" in error.cause &&
      error.cause.err instanceof Error
    ) {
      const { err, ...data } = error.cause;
      console.error(`${red}[auth][cause]${reset}:`, err.stack);
      if (data)
        console.error(
          `${red}[auth][details]${reset}:`,
          JSON.stringify(data, null, 2),
        );
    } else if (error.stack) {
      console.error(error.stack.replace(/.*/, "").substring(1));
    }
  },
  warn(code) {
    const url = `https://warnings.authjs.dev`;
    console.warn(`${yellow}[auth][warn][${code}]${reset}`, `Read more: ${url}`);
  },
  debug(message2, metadata) {
    console.log(
      `${grey}[auth][debug]:${reset} ${message2}`,
      JSON.stringify(metadata, null, 2),
    );
  },
};
function setLogger(config) {
  const newLogger = {
    ...defaultLogger,
  };
  if (!config.debug) newLogger.debug = () => {};
  if (config.logger?.error) newLogger.error = config.logger.error;
  if (config.logger?.warn) newLogger.warn = config.logger.warn;
  if (config.logger?.debug) newLogger.debug = config.logger.debug;
  config.logger ?? (config.logger = newLogger);
  return newLogger;
}

// ../../../../node_modules/@auth/core/lib/utils/actions.js
var actions = [
  "providers",
  "session",
  "csrf",
  "signin",
  "signout",
  "callback",
  "verify-request",
  "error",
  "webauthn-options",
];
function isAuthAction(action) {
  return actions.includes(action);
}

// ../../../../node_modules/@auth/core/lib/utils/web.js
var { parse: parseCookie2, serialize: serializeCookie } = cookie_exports;
async function getBody(req) {
  if (!("body" in req) || !req.body || req.method !== "POST") return;
  const contentType = req.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return await req.json();
  } else if (contentType?.includes("application/x-www-form-urlencoded")) {
    const params = new URLSearchParams(await req.text());
    return Object.fromEntries(params);
  }
}
async function toInternalRequest(req, config) {
  try {
    if (req.method !== "GET" && req.method !== "POST")
      throw new UnknownAction("Only GET and POST requests are supported");
    config.basePath ?? (config.basePath = "/auth");
    const url = new URL(req.url);
    const { action, providerId } = parseActionAndProviderId(
      url.pathname,
      config.basePath,
    );
    return {
      url,
      action,
      providerId,
      method: req.method,
      headers: Object.fromEntries(req.headers),
      body: req.body ? await getBody(req) : void 0,
      cookies: parseCookie2(req.headers.get("cookie") ?? "") ?? {},
      error: url.searchParams.get("error") ?? void 0,
      query: Object.fromEntries(url.searchParams),
    };
  } catch (e2) {
    const logger2 = setLogger(config);
    logger2.error(e2);
    logger2.debug("request", req);
  }
}
function toRequest(request) {
  return new Request(request.url, {
    headers: request.headers,
    method: request.method,
    body:
      request.method === "POST" ? JSON.stringify(request.body ?? {}) : void 0,
  });
}
function toResponse(res) {
  const headers2 = new Headers(res.headers);
  res.cookies?.forEach((cookie) => {
    const { name, value, options } = cookie;
    const cookieHeader = serializeCookie(name, value, options);
    if (headers2.has("Set-Cookie")) headers2.append("Set-Cookie", cookieHeader);
    else headers2.set("Set-Cookie", cookieHeader);
  });
  let body = res.body;
  if (headers2.get("content-type") === "application/json")
    body = JSON.stringify(res.body);
  else if (headers2.get("content-type") === "application/x-www-form-urlencoded")
    body = new URLSearchParams(res.body).toString();
  const status = res.redirect ? 302 : (res.status ?? 200);
  const response = new Response(body, { headers: headers2, status });
  if (res.redirect) response.headers.set("Location", res.redirect);
  return response;
}
async function createHash(message2) {
  const data = new TextEncoder().encode(message2);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b2) => b2.toString(16).padStart(2, "0"))
    .join("")
    .toString();
}
function randomString(size) {
  const i2hex = (i4) => ("0" + i4.toString(16)).slice(-2);
  const r3 = (a3, i4) => a3 + i2hex(i4);
  const bytes = crypto.getRandomValues(new Uint8Array(size));
  return Array.from(bytes).reduce(r3, "");
}
function parseActionAndProviderId(pathname, base) {
  const a3 = pathname.match(new RegExp(`^${base}(.+)`));
  if (a3 === null)
    throw new UnknownAction(`Cannot parse action at ${pathname}`);
  const actionAndProviderId = a3.at(-1);
  const b2 = actionAndProviderId.replace(/^\//, "").split("/").filter(Boolean);
  if (b2.length !== 1 && b2.length !== 2)
    throw new UnknownAction(`Cannot parse action at ${pathname}`);
  const [action, providerId] = b2;
  if (!isAuthAction(action))
    throw new UnknownAction(`Cannot parse action at ${pathname}`);
  if (
    providerId &&
    !["signin", "callback", "webauthn-options"].includes(action)
  )
    throw new UnknownAction(`Cannot parse action at ${pathname}`);
  return { action, providerId };
}

// ../../../../node_modules/@auth/core/lib/actions/callback/oauth/csrf-token.js
async function createCSRFToken({ options, cookieValue, isPost, bodyValue }) {
  if (cookieValue) {
    const [csrfToken2, csrfTokenHash2] = cookieValue.split("|");
    const expectedCsrfTokenHash = await createHash(
      `${csrfToken2}${options.secret}`,
    );
    if (csrfTokenHash2 === expectedCsrfTokenHash) {
      const csrfTokenVerified = isPost && csrfToken2 === bodyValue;
      return { csrfTokenVerified, csrfToken: csrfToken2 };
    }
  }
  const csrfToken = randomString(32);
  const csrfTokenHash = await createHash(`${csrfToken}${options.secret}`);
  const cookie = `${csrfToken}|${csrfTokenHash}`;
  return { cookie, csrfToken };
}
function validateCSRF(action, verified) {
  if (verified) return;
  throw new MissingCSRF(`CSRF token was missing during an action ${action}`);
}

// ../../../../node_modules/@auth/core/lib/utils/merge.js
function isObject2(item) {
  return item !== null && typeof item === "object";
}
function merge2(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();
  if (isObject2(target) && isObject2(source)) {
    for (const key in source) {
      if (isObject2(source[key])) {
        if (!isObject2(target[key]))
          target[key] = Array.isArray(source[key]) ? [] : {};
        merge2(target[key], source[key]);
      } else if (source[key] !== void 0) target[key] = source[key];
    }
  }
  return merge2(target, ...sources);
}

// ../../../../node_modules/@auth/core/lib/symbols.js
var skipCSRFCheck = Symbol("skip-csrf-check");
var raw = Symbol("return-type-raw");
var customFetch = Symbol("custom-fetch");
var conformInternal = Symbol("conform-internal");

// ../../../../node_modules/@auth/core/lib/utils/providers.js
function parseProviders(params) {
  const { providerId, config } = params;
  const url = new URL(config.basePath ?? "/auth", params.url.origin);
  const providers = config.providers.map((p3) => {
    const provider2 = typeof p3 === "function" ? p3() : p3;
    const { options: userOptions, ...defaults2 } = provider2;
    const id = userOptions?.id ?? defaults2.id;
    const merged = merge2(defaults2, userOptions, {
      signinUrl: `${url}/signin/${id}`,
      callbackUrl: `${url}/callback/${id}`,
    });
    if (provider2.type === "oauth" || provider2.type === "oidc") {
      merged.redirectProxyUrl ??
        (merged.redirectProxyUrl =
          userOptions?.redirectProxyUrl ?? config.redirectProxyUrl);
      const normalized = normalizeOAuth(merged);
      if (
        normalized.authorization?.url.searchParams.get("response_mode") ===
        "form_post"
      ) {
        delete normalized.redirectProxyUrl;
      }
      normalized[customFetch] ??
        (normalized[customFetch] = userOptions?.[customFetch]);
      return normalized;
    }
    return merged;
  });
  const provider = providers.find(({ id }) => id === providerId);
  if (providerId && !provider) {
    const availableProviders = providers.map((p3) => p3.id).join(", ");
    throw new Error(
      `Provider with id "${providerId}" not found. Available providers: [${availableProviders}].`,
    );
  }
  return { providers, provider };
}
function normalizeOAuth(c3) {
  if (c3.issuer)
    c3.wellKnown ??
      (c3.wellKnown = `${c3.issuer}/.well-known/openid-configuration`);
  const authorization = normalizeEndpoint(c3.authorization, c3.issuer);
  if (authorization && !authorization.url?.searchParams.has("scope")) {
    authorization.url.searchParams.set("scope", "openid profile email");
  }
  const token = normalizeEndpoint(c3.token, c3.issuer);
  const userinfo = normalizeEndpoint(c3.userinfo, c3.issuer);
  const checks = c3.checks ?? ["pkce"];
  if (c3.redirectProxyUrl) {
    if (!checks.includes("state")) checks.push("state");
    c3.redirectProxyUrl = `${c3.redirectProxyUrl}/callback/${c3.id}`;
  }
  return {
    ...c3,
    authorization,
    token,
    checks,
    userinfo,
    profile: c3.profile ?? defaultProfile,
    account: c3.account ?? defaultAccount,
  };
}
var defaultProfile = (profile) => {
  return stripUndefined({
    id: profile.sub ?? profile.id ?? crypto.randomUUID(),
    name: profile.name ?? profile.nickname ?? profile.preferred_username,
    email: profile.email,
    image: profile.picture,
  });
};
var defaultAccount = (account) => {
  return stripUndefined({
    access_token: account.access_token,
    id_token: account.id_token,
    refresh_token: account.refresh_token,
    expires_at: account.expires_at,
    scope: account.scope,
    token_type: account.token_type,
    session_state: account.session_state,
  });
};
function stripUndefined(o3) {
  const result = {};
  for (const [k3, v2] of Object.entries(o3)) {
    if (v2 !== void 0) result[k3] = v2;
  }
  return result;
}
function normalizeEndpoint(e2, issuer) {
  if (!e2 && issuer) return;
  if (typeof e2 === "string") {
    return { url: new URL(e2) };
  }
  const url = new URL(e2?.url ?? "https://authjs.dev");
  if (e2?.params != null) {
    for (let [key, value] of Object.entries(e2.params)) {
      if (key === "claims") {
        value = JSON.stringify(value);
      }
      url.searchParams.set(key, String(value));
    }
  }
  return {
    url,
    request: e2?.request,
    conform: e2?.conform,
    ...(e2?.clientPrivateKey
      ? { clientPrivateKey: e2?.clientPrivateKey }
      : null),
  };
}
function isOIDCProvider(provider) {
  return provider.type === "oidc";
}

// ../../../../node_modules/@auth/core/lib/init.js
var defaultCallbacks = {
  signIn() {
    return true;
  },
  redirect({ url, baseUrl }) {
    if (url.startsWith("/")) return `${baseUrl}${url}`;
    else if (new URL(url).origin === baseUrl) return url;
    return baseUrl;
  },
  session({ session: session2 }) {
    return {
      user: {
        name: session2.user?.name,
        email: session2.user?.email,
        image: session2.user?.image,
      },
      expires: session2.expires?.toISOString?.() ?? session2.expires,
    };
  },
  jwt({ token }) {
    return token;
  },
};
async function init({
  authOptions: config,
  providerId,
  action,
  url,
  cookies: reqCookies,
  callbackUrl: reqCallbackUrl,
  csrfToken: reqCsrfToken,
  csrfDisabled,
  isPost,
}) {
  const logger2 = setLogger(config);
  const { providers, provider } = parseProviders({ url, providerId, config });
  const maxAge = 30 * 24 * 60 * 60;
  let isOnRedirectProxy = false;
  if (
    (provider?.type === "oauth" || provider?.type === "oidc") &&
    provider.redirectProxyUrl
  ) {
    try {
      isOnRedirectProxy =
        new URL(provider.redirectProxyUrl).origin === url.origin;
    } catch {
      throw new TypeError(
        `redirectProxyUrl must be a valid URL. Received: ${provider.redirectProxyUrl}`,
      );
    }
  }
  const options = {
    debug: false,
    pages: {},
    theme: {
      colorScheme: "auto",
      logo: "",
      brandColor: "",
      buttonText: "",
    },
    // Custom options override defaults
    ...config,
    // These computed settings can have values in userOptions but we override them
    // and are request-specific.
    url,
    action,
    // @ts-expect-errors
    provider,
    cookies: merge2(
      defaultCookies(config.useSecureCookies ?? url.protocol === "https:"),
      config.cookies,
    ),
    providers,
    // Session options
    session: {
      // If no adapter specified, force use of JSON Web Tokens (stateless)
      strategy: config.adapter ? "database" : "jwt",
      maxAge,
      updateAge: 24 * 60 * 60,
      generateSessionToken: () => crypto.randomUUID(),
      ...config.session,
    },
    // JWT options
    jwt: {
      secret: config.secret,
      // Asserted in assert.ts
      maxAge: config.session?.maxAge ?? maxAge,
      // default to same as `session.maxAge`
      encode: encode4,
      decode: decode3,
      ...config.jwt,
    },
    // Event messages
    events: eventsErrorHandler(config.events ?? {}, logger2),
    adapter: adapterErrorHandler(config.adapter, logger2),
    // Callback functions
    callbacks: { ...defaultCallbacks, ...config.callbacks },
    logger: logger2,
    callbackUrl: url.origin,
    isOnRedirectProxy,
    experimental: {
      ...config.experimental,
    },
  };
  const cookies2 = [];
  if (csrfDisabled) {
    options.csrfTokenVerified = true;
  } else {
    const {
      csrfToken,
      cookie: csrfCookie,
      csrfTokenVerified,
    } = await createCSRFToken({
      options,
      cookieValue: reqCookies?.[options.cookies.csrfToken.name],
      isPost,
      bodyValue: reqCsrfToken,
    });
    options.csrfToken = csrfToken;
    options.csrfTokenVerified = csrfTokenVerified;
    if (csrfCookie) {
      cookies2.push({
        name: options.cookies.csrfToken.name,
        value: csrfCookie,
        options: options.cookies.csrfToken.options,
      });
    }
  }
  const { callbackUrl, callbackUrlCookie } = await createCallbackUrl({
    options,
    cookieValue: reqCookies?.[options.cookies.callbackUrl.name],
    paramValue: reqCallbackUrl,
  });
  options.callbackUrl = callbackUrl;
  if (callbackUrlCookie) {
    cookies2.push({
      name: options.cookies.callbackUrl.name,
      value: callbackUrlCookie,
      options: options.cookies.callbackUrl.options,
    });
  }
  return { options, cookies: cookies2 };
}
function eventsErrorHandler(methods, logger2) {
  return Object.keys(methods).reduce((acc, name) => {
    acc[name] = async (...args) => {
      try {
        const method = methods[name];
        return await method(...args);
      } catch (e2) {
        logger2.error(new EventError(e2));
      }
    };
    return acc;
  }, {});
}
function adapterErrorHandler(adapter, logger2) {
  if (!adapter) return;
  return Object.keys(adapter).reduce((acc, name) => {
    acc[name] = async (...args) => {
      try {
        logger2.debug(`adapter_${name}`, { args });
        const method = adapter[name];
        return await method(...args);
      } catch (e2) {
        const error = new AdapterError(e2);
        logger2.error(error);
        throw error;
      }
    };
    return acc;
  }, {});
}

// ../../../../node_modules/preact/dist/preact.module.js
var n;
var l;
var u;
var t;
var i;
var o;
var r;
var f;
var e;
var c;
var s;
var a;
var h = {};
var v = [];
var p = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
var y = Array.isArray;
function d(n2, l3) {
  for (var u4 in l3) n2[u4] = l3[u4];
  return n2;
}
function w(n2) {
  n2 && n2.parentNode && n2.parentNode.removeChild(n2);
}
function _(l3, u4, t2) {
  var i4,
    o3,
    r3,
    f4 = {};
  for (r3 in u4)
    "key" == r3
      ? (i4 = u4[r3])
      : "ref" == r3
        ? (o3 = u4[r3])
        : (f4[r3] = u4[r3]);
  if (
    (arguments.length > 2 &&
      (f4.children = arguments.length > 3 ? n.call(arguments, 2) : t2),
    "function" == typeof l3 && null != l3.defaultProps)
  )
    for (r3 in l3.defaultProps)
      void 0 === f4[r3] && (f4[r3] = l3.defaultProps[r3]);
  return g(l3, f4, i4, o3, null);
}
function g(n2, t2, i4, o3, r3) {
  var f4 = {
    type: n2,
    props: t2,
    key: i4,
    ref: o3,
    __k: null,
    __: null,
    __b: 0,
    __e: null,
    __d: void 0,
    __c: null,
    constructor: void 0,
    __v: null == r3 ? ++u : r3,
    __i: -1,
    __u: 0,
  };
  return null == r3 && null != l.vnode && l.vnode(f4), f4;
}
function b(n2) {
  return n2.children;
}
function k(n2, l3) {
  (this.props = n2), (this.context = l3);
}
function x(n2, l3) {
  if (null == l3) return n2.__ ? x(n2.__, n2.__i + 1) : null;
  for (var u4; l3 < n2.__k.length; l3++)
    if (null != (u4 = n2.__k[l3]) && null != u4.__e) return u4.__e;
  return "function" == typeof n2.type ? x(n2) : null;
}
function C(n2) {
  var l3, u4;
  if (null != (n2 = n2.__) && null != n2.__c) {
    for (n2.__e = n2.__c.base = null, l3 = 0; l3 < n2.__k.length; l3++)
      if (null != (u4 = n2.__k[l3]) && null != u4.__e) {
        n2.__e = n2.__c.base = u4.__e;
        break;
      }
    return C(n2);
  }
}
function S(n2) {
  ((!n2.__d && (n2.__d = true) && i.push(n2) && !M.__r++) ||
    o !== l.debounceRendering) &&
    ((o = l.debounceRendering) || r)(M);
}
function M() {
  var n2, u4, t2, o3, r3, e2, c3, s3;
  for (i.sort(f); (n2 = i.shift()); )
    n2.__d &&
      ((u4 = i.length),
      (o3 = void 0),
      (e2 = (r3 = (t2 = n2).__v).__e),
      (c3 = []),
      (s3 = []),
      t2.__P &&
        (((o3 = d({}, r3)).__v = r3.__v + 1),
        l.vnode && l.vnode(o3),
        O(
          t2.__P,
          o3,
          r3,
          t2.__n,
          t2.__P.namespaceURI,
          32 & r3.__u ? [e2] : null,
          c3,
          null == e2 ? x(r3) : e2,
          !!(32 & r3.__u),
          s3,
        ),
        (o3.__v = r3.__v),
        (o3.__.__k[o3.__i] = o3),
        j(c3, o3, s3),
        o3.__e != e2 && C(o3)),
      i.length > u4 && i.sort(f));
  M.__r = 0;
}
function P(n2, l3, u4, t2, i4, o3, r3, f4, e2, c3, s3) {
  var a3,
    p3,
    y2,
    d3,
    w3,
    _3 = (t2 && t2.__k) || v,
    g2 = l3.length;
  for (u4.__d = e2, $(u4, l3, _3), e2 = u4.__d, a3 = 0; a3 < g2; a3++)
    null != (y2 = u4.__k[a3]) &&
      ((p3 = -1 === y2.__i ? h : _3[y2.__i] || h),
      (y2.__i = a3),
      O(n2, y2, p3, i4, o3, r3, f4, e2, c3, s3),
      (d3 = y2.__e),
      y2.ref &&
        p3.ref != y2.ref &&
        (p3.ref && N(p3.ref, null, y2), s3.push(y2.ref, y2.__c || d3, y2)),
      null == w3 && null != d3 && (w3 = d3),
      65536 & y2.__u || p3.__k === y2.__k
        ? (e2 = I(y2, e2, n2))
        : "function" == typeof y2.type && void 0 !== y2.__d
          ? (e2 = y2.__d)
          : d3 && (e2 = d3.nextSibling),
      (y2.__d = void 0),
      (y2.__u &= -196609));
  (u4.__d = e2), (u4.__e = w3);
}
function $(n2, l3, u4) {
  var t2,
    i4,
    o3,
    r3,
    f4,
    e2 = l3.length,
    c3 = u4.length,
    s3 = c3,
    a3 = 0;
  for (n2.__k = [], t2 = 0; t2 < e2; t2++)
    null != (i4 = l3[t2]) && "boolean" != typeof i4 && "function" != typeof i4
      ? ((r3 = t2 + a3),
        ((i4 = n2.__k[t2] =
          "string" == typeof i4 ||
          "number" == typeof i4 ||
          "bigint" == typeof i4 ||
          i4.constructor == String
            ? g(null, i4, null, null, null)
            : y(i4)
              ? g(b, { children: i4 }, null, null, null)
              : void 0 === i4.constructor && i4.__b > 0
                ? g(i4.type, i4.props, i4.key, i4.ref ? i4.ref : null, i4.__v)
                : i4).__ = n2),
        (i4.__b = n2.__b + 1),
        (o3 = null),
        -1 !== (f4 = i4.__i = L(i4, u4, r3, s3)) &&
          (s3--, (o3 = u4[f4]) && (o3.__u |= 131072)),
        null == o3 || null === o3.__v
          ? (-1 == f4 && a3--,
            "function" != typeof i4.type && (i4.__u |= 65536))
          : f4 !== r3 &&
            (f4 == r3 - 1
              ? a3--
              : f4 == r3 + 1
                ? a3++
                : (f4 > r3 ? a3-- : a3++, (i4.__u |= 65536))))
      : (i4 = n2.__k[t2] = null);
  if (s3)
    for (t2 = 0; t2 < c3; t2++)
      null != (o3 = u4[t2]) &&
        0 == (131072 & o3.__u) &&
        (o3.__e == n2.__d && (n2.__d = x(o3)), V(o3, o3));
}
function I(n2, l3, u4) {
  var t2, i4;
  if ("function" == typeof n2.type) {
    for (t2 = n2.__k, i4 = 0; t2 && i4 < t2.length; i4++)
      t2[i4] && ((t2[i4].__ = n2), (l3 = I(t2[i4], l3, u4)));
    return l3;
  }
  n2.__e != l3 &&
    (l3 && n2.type && !u4.contains(l3) && (l3 = x(n2)),
    u4.insertBefore(n2.__e, l3 || null),
    (l3 = n2.__e));
  do {
    l3 = l3 && l3.nextSibling;
  } while (null != l3 && 8 === l3.nodeType);
  return l3;
}
function L(n2, l3, u4, t2) {
  var i4 = n2.key,
    o3 = n2.type,
    r3 = u4 - 1,
    f4 = u4 + 1,
    e2 = l3[u4];
  if (
    null === e2 ||
    (e2 && i4 == e2.key && o3 === e2.type && 0 == (131072 & e2.__u))
  )
    return u4;
  if (t2 > (null != e2 && 0 == (131072 & e2.__u) ? 1 : 0))
    for (; r3 >= 0 || f4 < l3.length; ) {
      if (r3 >= 0) {
        if (
          (e2 = l3[r3]) &&
          0 == (131072 & e2.__u) &&
          i4 == e2.key &&
          o3 === e2.type
        )
          return r3;
        r3--;
      }
      if (f4 < l3.length) {
        if (
          (e2 = l3[f4]) &&
          0 == (131072 & e2.__u) &&
          i4 == e2.key &&
          o3 === e2.type
        )
          return f4;
        f4++;
      }
    }
  return -1;
}
function T(n2, l3, u4) {
  "-" === l3[0]
    ? n2.setProperty(l3, null == u4 ? "" : u4)
    : (n2[l3] =
        null == u4 ? "" : "number" != typeof u4 || p.test(l3) ? u4 : u4 + "px");
}
function A(n2, l3, u4, t2, i4) {
  var o3;
  n: if ("style" === l3)
    if ("string" == typeof u4) n2.style.cssText = u4;
    else {
      if (("string" == typeof t2 && (n2.style.cssText = t2 = ""), t2))
        for (l3 in t2) (u4 && l3 in u4) || T(n2.style, l3, "");
      if (u4)
        for (l3 in u4) (t2 && u4[l3] === t2[l3]) || T(n2.style, l3, u4[l3]);
    }
  else if ("o" === l3[0] && "n" === l3[1])
    (o3 = l3 !== (l3 = l3.replace(/(PointerCapture)$|Capture$/i, "$1"))),
      (l3 =
        l3.toLowerCase() in n2 || "onFocusOut" === l3 || "onFocusIn" === l3
          ? l3.toLowerCase().slice(2)
          : l3.slice(2)),
      n2.l || (n2.l = {}),
      (n2.l[l3 + o3] = u4),
      u4
        ? t2
          ? (u4.u = t2.u)
          : ((u4.u = e), n2.addEventListener(l3, o3 ? s : c, o3))
        : n2.removeEventListener(l3, o3 ? s : c, o3);
  else {
    if ("http://www.w3.org/2000/svg" == i4)
      l3 = l3.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if (
      "width" != l3 &&
      "height" != l3 &&
      "href" != l3 &&
      "list" != l3 &&
      "form" != l3 &&
      "tabIndex" != l3 &&
      "download" != l3 &&
      "rowSpan" != l3 &&
      "colSpan" != l3 &&
      "role" != l3 &&
      "popover" != l3 &&
      l3 in n2
    )
      try {
        n2[l3] = null == u4 ? "" : u4;
        break n;
      } catch (n3) {}
    "function" == typeof u4 ||
      (null == u4 || (false === u4 && "-" !== l3[4])
        ? n2.removeAttribute(l3)
        : n2.setAttribute(l3, "popover" == l3 && 1 == u4 ? "" : u4));
  }
}
function F(n2) {
  return function (u4) {
    if (this.l) {
      var t2 = this.l[u4.type + n2];
      if (null == u4.t) u4.t = e++;
      else if (u4.t < t2.u) return;
      return t2(l.event ? l.event(u4) : u4);
    }
  };
}
function O(n2, u4, t2, i4, o3, r3, f4, e2, c3, s3) {
  var a3,
    h3,
    v2,
    p3,
    w3,
    _3,
    g2,
    m,
    x3,
    C3,
    S2,
    M2,
    $2,
    I2,
    H,
    L3,
    T3 = u4.type;
  if (void 0 !== u4.constructor) return null;
  128 & t2.__u && ((c3 = !!(32 & t2.__u)), (r3 = [(e2 = u4.__e = t2.__e)])),
    (a3 = l.__b) && a3(u4);
  n: if ("function" == typeof T3)
    try {
      if (
        ((m = u4.props),
        (x3 = "prototype" in T3 && T3.prototype.render),
        (C3 = (a3 = T3.contextType) && i4[a3.__c]),
        (S2 = a3 ? (C3 ? C3.props.value : a3.__) : i4),
        t2.__c
          ? (g2 = (h3 = u4.__c = t2.__c).__ = h3.__E)
          : (x3
              ? (u4.__c = h3 = new T3(m, S2))
              : ((u4.__c = h3 = new k(m, S2)),
                (h3.constructor = T3),
                (h3.render = q)),
            C3 && C3.sub(h3),
            (h3.props = m),
            h3.state || (h3.state = {}),
            (h3.context = S2),
            (h3.__n = i4),
            (v2 = h3.__d = true),
            (h3.__h = []),
            (h3._sb = [])),
        x3 && null == h3.__s && (h3.__s = h3.state),
        x3 &&
          null != T3.getDerivedStateFromProps &&
          (h3.__s == h3.state && (h3.__s = d({}, h3.__s)),
          d(h3.__s, T3.getDerivedStateFromProps(m, h3.__s))),
        (p3 = h3.props),
        (w3 = h3.state),
        (h3.__v = u4),
        v2)
      )
        x3 &&
          null == T3.getDerivedStateFromProps &&
          null != h3.componentWillMount &&
          h3.componentWillMount(),
          x3 &&
            null != h3.componentDidMount &&
            h3.__h.push(h3.componentDidMount);
      else {
        if (
          (x3 &&
            null == T3.getDerivedStateFromProps &&
            m !== p3 &&
            null != h3.componentWillReceiveProps &&
            h3.componentWillReceiveProps(m, S2),
          !h3.__e &&
            ((null != h3.shouldComponentUpdate &&
              false === h3.shouldComponentUpdate(m, h3.__s, S2)) ||
              u4.__v === t2.__v))
        ) {
          for (
            u4.__v !== t2.__v &&
              ((h3.props = m), (h3.state = h3.__s), (h3.__d = false)),
              u4.__e = t2.__e,
              u4.__k = t2.__k,
              u4.__k.some(function (n3) {
                n3 && (n3.__ = u4);
              }),
              M2 = 0;
            M2 < h3._sb.length;
            M2++
          )
            h3.__h.push(h3._sb[M2]);
          (h3._sb = []), h3.__h.length && f4.push(h3);
          break n;
        }
        null != h3.componentWillUpdate && h3.componentWillUpdate(m, h3.__s, S2),
          x3 &&
            null != h3.componentDidUpdate &&
            h3.__h.push(function () {
              h3.componentDidUpdate(p3, w3, _3);
            });
      }
      if (
        ((h3.context = S2),
        (h3.props = m),
        (h3.__P = n2),
        (h3.__e = false),
        ($2 = l.__r),
        (I2 = 0),
        x3)
      ) {
        for (
          h3.state = h3.__s,
            h3.__d = false,
            $2 && $2(u4),
            a3 = h3.render(h3.props, h3.state, h3.context),
            H = 0;
          H < h3._sb.length;
          H++
        )
          h3.__h.push(h3._sb[H]);
        h3._sb = [];
      } else
        do {
          (h3.__d = false),
            $2 && $2(u4),
            (a3 = h3.render(h3.props, h3.state, h3.context)),
            (h3.state = h3.__s);
        } while (h3.__d && ++I2 < 25);
      (h3.state = h3.__s),
        null != h3.getChildContext && (i4 = d(d({}, i4), h3.getChildContext())),
        x3 &&
          !v2 &&
          null != h3.getSnapshotBeforeUpdate &&
          (_3 = h3.getSnapshotBeforeUpdate(p3, w3)),
        P(
          n2,
          y(
            (L3 =
              null != a3 && a3.type === b && null == a3.key
                ? a3.props.children
                : a3),
          )
            ? L3
            : [L3],
          u4,
          t2,
          i4,
          o3,
          r3,
          f4,
          e2,
          c3,
          s3,
        ),
        (h3.base = u4.__e),
        (u4.__u &= -161),
        h3.__h.length && f4.push(h3),
        g2 && (h3.__E = h3.__ = null);
    } catch (n3) {
      if (((u4.__v = null), c3 || null != r3)) {
        for (
          u4.__u |= c3 ? 160 : 128;
          e2 && 8 === e2.nodeType && e2.nextSibling;

        )
          e2 = e2.nextSibling;
        (r3[r3.indexOf(e2)] = null), (u4.__e = e2);
      } else (u4.__e = t2.__e), (u4.__k = t2.__k);
      l.__e(n3, u4, t2);
    }
  else
    null == r3 && u4.__v === t2.__v
      ? ((u4.__k = t2.__k), (u4.__e = t2.__e))
      : (u4.__e = z(t2.__e, u4, t2, i4, o3, r3, f4, c3, s3));
  (a3 = l.diffed) && a3(u4);
}
function j(n2, u4, t2) {
  u4.__d = void 0;
  for (var i4 = 0; i4 < t2.length; i4++) N(t2[i4], t2[++i4], t2[++i4]);
  l.__c && l.__c(u4, n2),
    n2.some(function (u5) {
      try {
        (n2 = u5.__h),
          (u5.__h = []),
          n2.some(function (n3) {
            n3.call(u5);
          });
      } catch (n3) {
        l.__e(n3, u5.__v);
      }
    });
}
function z(u4, t2, i4, o3, r3, f4, e2, c3, s3) {
  var a3,
    v2,
    p3,
    d3,
    _3,
    g2,
    m,
    b2 = i4.props,
    k3 = t2.props,
    C3 = t2.type;
  if (
    ("svg" === C3
      ? (r3 = "http://www.w3.org/2000/svg")
      : "math" === C3
        ? (r3 = "http://www.w3.org/1998/Math/MathML")
        : r3 || (r3 = "http://www.w3.org/1999/xhtml"),
    null != f4)
  ) {
    for (a3 = 0; a3 < f4.length; a3++)
      if (
        (_3 = f4[a3]) &&
        "setAttribute" in _3 == !!C3 &&
        (C3 ? _3.localName === C3 : 3 === _3.nodeType)
      ) {
        (u4 = _3), (f4[a3] = null);
        break;
      }
  }
  if (null == u4) {
    if (null === C3) return document.createTextNode(k3);
    (u4 = document.createElementNS(r3, C3, k3.is && k3)),
      c3 && (l.__m && l.__m(t2, f4), (c3 = false)),
      (f4 = null);
  }
  if (null === C3) b2 === k3 || (c3 && u4.data === k3) || (u4.data = k3);
  else {
    if (
      ((f4 = f4 && n.call(u4.childNodes)),
      (b2 = i4.props || h),
      !c3 && null != f4)
    )
      for (b2 = {}, a3 = 0; a3 < u4.attributes.length; a3++)
        b2[(_3 = u4.attributes[a3]).name] = _3.value;
    for (a3 in b2)
      if (((_3 = b2[a3]), "children" == a3));
      else if ("dangerouslySetInnerHTML" == a3) p3 = _3;
      else if (!(a3 in k3)) {
        if (
          ("value" == a3 && "defaultValue" in k3) ||
          ("checked" == a3 && "defaultChecked" in k3)
        )
          continue;
        A(u4, a3, null, _3, r3);
      }
    for (a3 in k3)
      (_3 = k3[a3]),
        "children" == a3
          ? (d3 = _3)
          : "dangerouslySetInnerHTML" == a3
            ? (v2 = _3)
            : "value" == a3
              ? (g2 = _3)
              : "checked" == a3
                ? (m = _3)
                : (c3 && "function" != typeof _3) ||
                  b2[a3] === _3 ||
                  A(u4, a3, _3, b2[a3], r3);
    if (v2)
      c3 ||
        (p3 && (v2.__html === p3.__html || v2.__html === u4.innerHTML)) ||
        (u4.innerHTML = v2.__html),
        (t2.__k = []);
    else if (
      (p3 && (u4.innerHTML = ""),
      P(
        u4,
        y(d3) ? d3 : [d3],
        t2,
        i4,
        o3,
        "foreignObject" === C3 ? "http://www.w3.org/1999/xhtml" : r3,
        f4,
        e2,
        f4 ? f4[0] : i4.__k && x(i4, 0),
        c3,
        s3,
      ),
      null != f4)
    )
      for (a3 = f4.length; a3--; ) w(f4[a3]);
    c3 ||
      ((a3 = "value"),
      "progress" === C3 && null == g2
        ? u4.removeAttribute("value")
        : void 0 !== g2 &&
          (g2 !== u4[a3] ||
            ("progress" === C3 && !g2) ||
            ("option" === C3 && g2 !== b2[a3])) &&
          A(u4, a3, g2, b2[a3], r3),
      (a3 = "checked"),
      void 0 !== m && m !== u4[a3] && A(u4, a3, m, b2[a3], r3));
  }
  return u4;
}
function N(n2, u4, t2) {
  try {
    if ("function" == typeof n2) {
      var i4 = "function" == typeof n2.__u;
      i4 && n2.__u(), (i4 && null == u4) || (n2.__u = n2(u4));
    } else n2.current = u4;
  } catch (n3) {
    l.__e(n3, t2);
  }
}
function V(n2, u4, t2) {
  var i4, o3;
  if (
    (l.unmount && l.unmount(n2),
    (i4 = n2.ref) && ((i4.current && i4.current !== n2.__e) || N(i4, null, u4)),
    null != (i4 = n2.__c))
  ) {
    if (i4.componentWillUnmount)
      try {
        i4.componentWillUnmount();
      } catch (n3) {
        l.__e(n3, u4);
      }
    i4.base = i4.__P = null;
  }
  if ((i4 = n2.__k))
    for (o3 = 0; o3 < i4.length; o3++)
      i4[o3] && V(i4[o3], u4, t2 || "function" != typeof n2.type);
  t2 || w(n2.__e), (n2.__c = n2.__ = n2.__e = n2.__d = void 0);
}
function q(n2, l3, u4) {
  return this.constructor(n2, u4);
}
(n = v.slice),
  (l = {
    __e: function (n2, l3, u4, t2) {
      for (var i4, o3, r3; (l3 = l3.__); )
        if ((i4 = l3.__c) && !i4.__)
          try {
            if (
              ((o3 = i4.constructor) &&
                null != o3.getDerivedStateFromError &&
                (i4.setState(o3.getDerivedStateFromError(n2)), (r3 = i4.__d)),
              null != i4.componentDidCatch &&
                (i4.componentDidCatch(n2, t2 || {}), (r3 = i4.__d)),
              r3)
            )
              return (i4.__E = i4);
          } catch (l4) {
            n2 = l4;
          }
      throw n2;
    },
  }),
  (u = 0),
  (t = function (n2) {
    return null != n2 && null == n2.constructor;
  }),
  (k.prototype.setState = function (n2, l3) {
    var u4;
    (u4 =
      null != this.__s && this.__s !== this.state
        ? this.__s
        : (this.__s = d({}, this.state))),
      "function" == typeof n2 && (n2 = n2(d({}, u4), this.props)),
      n2 && d(u4, n2),
      null != n2 && this.__v && (l3 && this._sb.push(l3), S(this));
  }),
  (k.prototype.forceUpdate = function (n2) {
    this.__v && ((this.__e = true), n2 && this.__h.push(n2), S(this));
  }),
  (k.prototype.render = b),
  (i = []),
  (r =
    "function" == typeof Promise
      ? Promise.prototype.then.bind(Promise.resolve())
      : setTimeout),
  (f = function (n2, l3) {
    return n2.__v.__b - l3.__v.__b;
  }),
  (M.__r = 0),
  (e = 0),
  (c = F(false)),
  (s = F(true)),
  (a = 0);

// ../../../../node_modules/preact-render-to-string/dist/index.module.js
var r2 = /[\s\n\\/='"\0<>]/;
var o2 = /^(xlink|xmlns|xml)([A-Z])/;
var i2 =
  /^accessK|^auto[A-Z]|^cell|^ch|^col|cont|cross|dateT|encT|form[A-Z]|frame|hrefL|inputM|maxL|minL|noV|playsI|popoverT|readO|rowS|src[A-Z]|tabI|useM|item[A-Z]/;
var a2 =
  /^ac|^ali|arabic|basel|cap|clipPath$|clipRule$|color|dominant|enable|fill|flood|font|glyph[^R]|horiz|image|letter|lighting|marker[^WUH]|overline|panose|pointe|paint|rendering|shape|stop|strikethrough|stroke|text[^L]|transform|underline|unicode|units|^v[^i]|^w|^xH/;
var c2 = /* @__PURE__ */ new Set(["draggable", "spellcheck"]);
var s2 = /["&<]/;
function l2(e2) {
  if (0 === e2.length || false === s2.test(e2)) return e2;
  for (var t2 = 0, n2 = 0, r3 = "", o3 = ""; n2 < e2.length; n2++) {
    switch (e2.charCodeAt(n2)) {
      case 34:
        o3 = "&quot;";
        break;
      case 38:
        o3 = "&amp;";
        break;
      case 60:
        o3 = "&lt;";
        break;
      default:
        continue;
    }
    n2 !== t2 && (r3 += e2.slice(t2, n2)), (r3 += o3), (t2 = n2 + 1);
  }
  return n2 !== t2 && (r3 += e2.slice(t2, n2)), r3;
}
var u2 = {};
var f2 = /* @__PURE__ */ new Set([
  "animation-iteration-count",
  "border-image-outset",
  "border-image-slice",
  "border-image-width",
  "box-flex",
  "box-flex-group",
  "box-ordinal-group",
  "column-count",
  "fill-opacity",
  "flex",
  "flex-grow",
  "flex-negative",
  "flex-order",
  "flex-positive",
  "flex-shrink",
  "flood-opacity",
  "font-weight",
  "grid-column",
  "grid-row",
  "line-clamp",
  "line-height",
  "opacity",
  "order",
  "orphans",
  "stop-opacity",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke-width",
  "tab-size",
  "widows",
  "z-index",
  "zoom",
]);
var p2 = /[A-Z]/g;
function h2(e2) {
  var t2 = "";
  for (var n2 in e2) {
    var r3 = e2[n2];
    if (null != r3 && "" !== r3) {
      var o3 =
          "-" == n2[0]
            ? n2
            : u2[n2] || (u2[n2] = n2.replace(p2, "-$&").toLowerCase()),
        i4 = ";";
      "number" != typeof r3 ||
        o3.startsWith("--") ||
        f2.has(o3) ||
        (i4 = "px;"),
        (t2 = t2 + o3 + ":" + r3 + i4);
    }
  }
  return t2 || void 0;
}
function d2() {
  this.__d = true;
}
function _2(e2, t2) {
  return {
    __v: e2,
    context: t2,
    props: e2.props,
    setState: d2,
    forceUpdate: d2,
    __d: true,
    __h: new Array(0),
  };
}
var k2;
var w2;
var x2;
var C2;
var A2 = {};
var L2 = [];
var E = Array.isArray;
var T2 = Object.assign;
var j2 = "";
function D(r3, o3, i4) {
  var a3 = l.__s;
  (l.__s = true), (k2 = l.__b), (w2 = l.diffed), (x2 = l.__r), (C2 = l.unmount);
  var c3 = _(b, null);
  c3.__k = [r3];
  try {
    var s3 = U(r3, o3 || A2, false, void 0, c3, false, i4);
    return E(s3) ? s3.join(j2) : s3;
  } catch (e2) {
    if (e2.then)
      throw new Error('Use "renderToStringAsync" for suspenseful rendering.');
    throw e2;
  } finally {
    l.__c && l.__c(r3, L2), (l.__s = a3), (L2.length = 0);
  }
}
function P2(e2, t2) {
  var n2,
    r3 = e2.type,
    o3 = true;
  return (
    e2.__c
      ? ((o3 = false), ((n2 = e2.__c).state = n2.__s))
      : (n2 = new r3(e2.props, t2)),
    (e2.__c = n2),
    (n2.__v = e2),
    (n2.props = e2.props),
    (n2.context = t2),
    (n2.__d = true),
    null == n2.state && (n2.state = A2),
    null == n2.__s && (n2.__s = n2.state),
    r3.getDerivedStateFromProps
      ? (n2.state = T2(
          {},
          n2.state,
          r3.getDerivedStateFromProps(n2.props, n2.state),
        ))
      : o3 && n2.componentWillMount
        ? (n2.componentWillMount(),
          (n2.state = n2.__s !== n2.state ? n2.__s : n2.state))
        : !o3 && n2.componentWillUpdate && n2.componentWillUpdate(),
    x2 && x2(e2),
    n2.render(n2.props, n2.state, t2)
  );
}
function U(t2, s3, u4, f4, p3, d3, v2) {
  if (null == t2 || true === t2 || false === t2 || t2 === j2) return j2;
  var m = typeof t2;
  if ("object" != m)
    return "function" == m ? j2 : "string" == m ? l2(t2) : t2 + j2;
  if (E(t2)) {
    var y2,
      g2 = j2;
    p3.__k = t2;
    for (var b2 = 0; b2 < t2.length; b2++) {
      var S2 = t2[b2];
      if (null != S2 && "boolean" != typeof S2) {
        var L3,
          D2 = U(S2, s3, u4, f4, p3, d3, v2);
        "string" == typeof D2
          ? (g2 += D2)
          : (y2 || (y2 = []),
            g2 && y2.push(g2),
            (g2 = j2),
            E(D2) ? (L3 = y2).push.apply(L3, D2) : y2.push(D2));
      }
    }
    return y2 ? (g2 && y2.push(g2), y2) : g2;
  }
  if (void 0 !== t2.constructor) return j2;
  (t2.__ = p3), k2 && k2(t2);
  var F2 = t2.type,
    M2 = t2.props;
  if ("function" == typeof F2) {
    var W,
      $2,
      z2,
      H = s3;
    if (F2 === b) {
      if ("tpl" in M2) {
        for (var N2 = j2, q2 = 0; q2 < M2.tpl.length; q2++)
          if (((N2 += M2.tpl[q2]), M2.exprs && q2 < M2.exprs.length)) {
            var B = M2.exprs[q2];
            if (null == B) continue;
            "object" != typeof B || (void 0 !== B.constructor && !E(B))
              ? (N2 += B)
              : (N2 += U(B, s3, u4, f4, t2, d3, v2));
          }
        return N2;
      }
      if ("UNSTABLE_comment" in M2)
        return "<!--" + l2(M2.UNSTABLE_comment) + "-->";
      $2 = M2.children;
    } else {
      if (null != (W = F2.contextType)) {
        var I2 = s3[W.__c];
        H = I2 ? I2.props.value : W.__;
      }
      var O2 = F2.prototype && "function" == typeof F2.prototype.render;
      if (O2) ($2 = P2(t2, H)), (z2 = t2.__c);
      else {
        t2.__c = z2 = _2(t2, H);
        for (var R = 0; z2.__d && R++ < 25; )
          (z2.__d = false), x2 && x2(t2), ($2 = F2.call(z2, M2, H));
        z2.__d = true;
      }
      if (
        (null != z2.getChildContext && (s3 = T2({}, s3, z2.getChildContext())),
        O2 &&
          l.errorBoundaries &&
          (F2.getDerivedStateFromError || z2.componentDidCatch))
      ) {
        $2 =
          null != $2 && $2.type === b && null == $2.key && null == $2.props.tpl
            ? $2.props.children
            : $2;
        try {
          return U($2, s3, u4, f4, t2, d3, v2);
        } catch (e2) {
          return (
            F2.getDerivedStateFromError &&
              (z2.__s = F2.getDerivedStateFromError(e2)),
            z2.componentDidCatch && z2.componentDidCatch(e2, A2),
            z2.__d
              ? (($2 = P2(t2, s3)),
                null != (z2 = t2.__c).getChildContext &&
                  (s3 = T2({}, s3, z2.getChildContext())),
                U(
                  ($2 =
                    null != $2 &&
                    $2.type === b &&
                    null == $2.key &&
                    null == $2.props.tpl
                      ? $2.props.children
                      : $2),
                  s3,
                  u4,
                  f4,
                  t2,
                  d3,
                  v2,
                ))
              : j2
          );
        } finally {
          w2 && w2(t2), (t2.__ = null), C2 && C2(t2);
        }
      }
    }
    $2 =
      null != $2 && $2.type === b && null == $2.key && null == $2.props.tpl
        ? $2.props.children
        : $2;
    try {
      var V2 = U($2, s3, u4, f4, t2, d3, v2);
      return w2 && w2(t2), (t2.__ = null), l.unmount && l.unmount(t2), V2;
    } catch (n2) {
      if (!d3 && v2 && v2.onError) {
        var K = v2.onError(n2, t2, function (e2) {
          return U(e2, s3, u4, f4, t2, d3, v2);
        });
        if (void 0 !== K) return K;
        var G = l.__e;
        return G && G(n2, t2), j2;
      }
      if (!d3) throw n2;
      if (!n2 || "function" != typeof n2.then) throw n2;
      return n2.then(function e2() {
        try {
          return U($2, s3, u4, f4, t2, d3, v2);
        } catch (n3) {
          if (!n3 || "function" != typeof n3.then) throw n3;
          return n3.then(function () {
            return U($2, s3, u4, f4, t2, d3, v2);
          }, e2);
        }
      });
    }
  }
  var J,
    Q = "<" + F2,
    X = j2;
  for (var Y in M2) {
    var ee = M2[Y];
    if ("function" != typeof ee || "class" === Y || "className" === Y) {
      switch (Y) {
        case "children":
          J = ee;
          continue;
        case "key":
        case "ref":
        case "__self":
        case "__source":
          continue;
        case "htmlFor":
          if ("for" in M2) continue;
          Y = "for";
          break;
        case "className":
          if ("class" in M2) continue;
          Y = "class";
          break;
        case "defaultChecked":
          Y = "checked";
          break;
        case "defaultSelected":
          Y = "selected";
          break;
        case "defaultValue":
        case "value":
          switch (((Y = "value"), F2)) {
            case "textarea":
              J = ee;
              continue;
            case "select":
              f4 = ee;
              continue;
            case "option":
              f4 != ee || "selected" in M2 || (Q += " selected");
          }
          break;
        case "dangerouslySetInnerHTML":
          X = ee && ee.__html;
          continue;
        case "style":
          "object" == typeof ee && (ee = h2(ee));
          break;
        case "acceptCharset":
          Y = "accept-charset";
          break;
        case "httpEquiv":
          Y = "http-equiv";
          break;
        default:
          if (o2.test(Y)) Y = Y.replace(o2, "$1:$2").toLowerCase();
          else {
            if (r2.test(Y)) continue;
            ("-" !== Y[4] && !c2.has(Y)) || null == ee
              ? u4
                ? a2.test(Y) &&
                  (Y =
                    "panose1" === Y
                      ? "panose-1"
                      : Y.replace(/([A-Z])/g, "-$1").toLowerCase())
                : i2.test(Y) && (Y = Y.toLowerCase())
              : (ee += j2);
          }
      }
      null != ee &&
        false !== ee &&
        (Q =
          true === ee || ee === j2
            ? Q + " " + Y
            : Q +
              " " +
              Y +
              '="' +
              ("string" == typeof ee ? l2(ee) : ee + j2) +
              '"');
    }
  }
  if (r2.test(F2))
    throw new Error(F2 + " is not a valid HTML tag name in " + Q + ">");
  if (
    (X ||
      ("string" == typeof J
        ? (X = l2(J))
        : null != J &&
          false !== J &&
          true !== J &&
          (X = U(
            J,
            s3,
            "svg" === F2 || ("foreignObject" !== F2 && u4),
            f4,
            t2,
            d3,
            v2,
          ))),
    w2 && w2(t2),
    (t2.__ = null),
    C2 && C2(t2),
    !X && Z.has(F2))
  )
    return Q + "/>";
  var te = "</" + F2 + ">",
    ne = Q + ">";
  return E(X)
    ? [ne].concat(X, [te])
    : "string" != typeof X
      ? [ne, X, te]
      : ne + X + te;
}
var Z = /* @__PURE__ */ new Set([
  "area",
  "base",
  "br",
  "col",
  "command",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

// ../../../../node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js
var f3 = 0;
var i3 = Array.isArray;
function u3(e2, t2, n2, o3, i4, u4) {
  t2 || (t2 = {});
  var a3,
    c3,
    l3 = t2;
  "ref" in t2 && ((a3 = t2.ref), delete t2.ref);
  var p3 = {
    type: e2,
    props: l3,
    key: n2,
    ref: a3,
    __k: null,
    __: null,
    __b: 0,
    __e: null,
    __d: void 0,
    __c: null,
    constructor: void 0,
    __v: --f3,
    __i: -1,
    __u: 0,
    __source: i4,
    __self: u4,
  };
  if ("function" == typeof e2 && (a3 = e2.defaultProps))
    for (c3 in a3) void 0 === l3[c3] && (l3[c3] = a3[c3]);
  return l.vnode && l.vnode(p3), p3;
}

// ../../../../node_modules/@auth/core/lib/pages/error.js
function ErrorPage(props) {
  const { url, error = "default", theme } = props;
  const signinPageUrl = `${url}/signin`;
  const errors = {
    default: {
      status: 200,
      heading: "Error",
      message: u3("p", {
        children: u3("a", {
          className: "site",
          href: url?.origin,
          children: url?.host,
        }),
      }),
    },
    Configuration: {
      status: 500,
      heading: "Server error",
      message: u3("div", {
        children: [
          u3("p", {
            children: "There is a problem with the server configuration.",
          }),
          u3("p", { children: "Check the server logs for more information." }),
        ],
      }),
    },
    AccessDenied: {
      status: 403,
      heading: "Access Denied",
      message: u3("div", {
        children: [
          u3("p", { children: "You do not have permission to sign in." }),
          u3("p", {
            children: u3("a", {
              className: "button",
              href: signinPageUrl,
              children: "Sign in",
            }),
          }),
        ],
      }),
    },
    Verification: {
      status: 403,
      heading: "Unable to sign in",
      message: u3("div", {
        children: [
          u3("p", { children: "The sign in link is no longer valid." }),
          u3("p", {
            children: "It may have been used already or it may have expired.",
          }),
        ],
      }),
      signin: u3("a", {
        className: "button",
        href: signinPageUrl,
        children: "Sign in",
      }),
    },
  };
  const {
    status,
    heading,
    message: message2,
    signin,
  } = errors[error] ?? errors.default;
  return {
    status,
    html: u3("div", {
      className: "error",
      children: [
        theme?.brandColor &&
          u3("style", {
            dangerouslySetInnerHTML: {
              __html: `
        :root {
          --brand-color: ${theme?.brandColor}
        }
      `,
            },
          }),
        u3("div", {
          className: "card",
          children: [
            theme?.logo &&
              u3("img", { src: theme?.logo, alt: "Logo", className: "logo" }),
            u3("h1", { children: heading }),
            u3("div", { className: "message", children: message2 }),
            signin,
          ],
        }),
      ],
    }),
  };
}

// ../../../../node_modules/@auth/core/lib/utils/webauthn-client.js
async function webauthnScript(authURL, providerID) {
  const WebAuthnBrowser = window.SimpleWebAuthnBrowser;
  async function fetchOptions(action) {
    const url = new URL(`${authURL}/webauthn-options/${providerID}`);
    if (action) url.searchParams.append("action", action);
    const formFields = getFormFields();
    formFields.forEach((field) => {
      url.searchParams.append(field.name, field.value);
    });
    const res = await fetch(url);
    if (!res.ok) {
      console.error("Failed to fetch options", res);
      return;
    }
    return res.json();
  }
  function getForm() {
    const formID = `#${providerID}-form`;
    const form = document.querySelector(formID);
    if (!form) throw new Error(`Form '${formID}' not found`);
    return form;
  }
  function getFormFields() {
    const form = getForm();
    const formFields = Array.from(
      form.querySelectorAll("input[data-form-field]"),
    );
    return formFields;
  }
  async function submitForm(action, data) {
    const form = getForm();
    if (action) {
      const actionInput = document.createElement("input");
      actionInput.type = "hidden";
      actionInput.name = "action";
      actionInput.value = action;
      form.appendChild(actionInput);
    }
    if (data) {
      const dataInput = document.createElement("input");
      dataInput.type = "hidden";
      dataInput.name = "data";
      dataInput.value = JSON.stringify(data);
      form.appendChild(dataInput);
    }
    return form.submit();
  }
  async function authenticationFlow(options, autofill) {
    const authResp = await WebAuthnBrowser.startAuthentication(
      options,
      autofill,
    );
    return await submitForm("authenticate", authResp);
  }
  async function registrationFlow(options) {
    const formFields = getFormFields();
    formFields.forEach((field) => {
      if (field.required && !field.value) {
        throw new Error(`Missing required field: ${field.name}`);
      }
    });
    const regResp = await WebAuthnBrowser.startRegistration(options);
    return await submitForm("register", regResp);
  }
  async function autofillAuthentication() {
    if (!WebAuthnBrowser.browserSupportsWebAuthnAutofill()) return;
    const res = await fetchOptions("authenticate");
    if (!res) {
      console.error("Failed to fetch option for autofill authentication");
      return;
    }
    try {
      await authenticationFlow(res.options, true);
    } catch (e2) {
      console.error(e2);
    }
  }
  async function setupForm() {
    const form = getForm();
    if (!WebAuthnBrowser.browserSupportsWebAuthn()) {
      form.style.display = "none";
      return;
    }
    if (form) {
      form.addEventListener("submit", async (e2) => {
        e2.preventDefault();
        const res = await fetchOptions(void 0);
        if (!res) {
          console.error("Failed to fetch options for form submission");
          return;
        }
        if (res.action === "authenticate") {
          try {
            await authenticationFlow(res.options, false);
          } catch (e3) {
            console.error(e3);
          }
        } else if (res.action === "register") {
          try {
            await registrationFlow(res.options);
          } catch (e3) {
            console.error(e3);
          }
        }
      });
    }
  }
  setupForm();
  autofillAuthentication();
}

// ../../../../node_modules/@auth/core/lib/pages/signin.js
var signinErrors = {
  default: "Unable to sign in.",
  Signin: "Try signing in with a different account.",
  OAuthSignin: "Try signing in with a different account.",
  OAuthCallbackError: "Try signing in with a different account.",
  OAuthCreateAccount: "Try signing in with a different account.",
  EmailCreateAccount: "Try signing in with a different account.",
  Callback: "Try signing in with a different account.",
  OAuthAccountNotLinked:
    "To confirm your identity, sign in with the same account you used originally.",
  EmailSignin: "The e-mail could not be sent.",
  CredentialsSignin:
    "Sign in failed. Check the details you provided are correct.",
  SessionRequired: "Please sign in to access this page.",
};
function ConditionalUIScript(providerID) {
  const startConditionalUIScript = `
const currentURL = window.location.href;
const authURL = currentURL.substring(0, currentURL.lastIndexOf('/'));
(${webauthnScript})(authURL, "${providerID}");
`;
  return u3(b, {
    children: u3("script", {
      dangerouslySetInnerHTML: { __html: startConditionalUIScript },
    }),
  });
}
function SigninPage(props) {
  const {
    csrfToken,
    providers = [],
    callbackUrl,
    theme,
    email,
    error: errorType,
  } = props;
  if (typeof document !== "undefined" && theme?.brandColor) {
    document.documentElement.style.setProperty(
      "--brand-color",
      theme.brandColor,
    );
  }
  if (typeof document !== "undefined" && theme?.buttonText) {
    document.documentElement.style.setProperty(
      "--button-text-color",
      theme.buttonText,
    );
  }
  const error = errorType && (signinErrors[errorType] ?? signinErrors.default);
  const providerLogoPath = "https://authjs.dev/img/providers";
  const conditionalUIProviderID = providers.find(
    (provider) => provider.type === "webauthn" && provider.enableConditionalUI,
  )?.id;
  return u3("div", {
    className: "signin",
    children: [
      theme?.brandColor &&
        u3("style", {
          dangerouslySetInnerHTML: {
            __html: `:root {--brand-color: ${theme.brandColor}}`,
          },
        }),
      theme?.buttonText &&
        u3("style", {
          dangerouslySetInnerHTML: {
            __html: `
        :root {
          --button-text-color: ${theme.buttonText}
        }
      `,
          },
        }),
      u3("div", {
        className: "card",
        children: [
          error &&
            u3("div", {
              className: "error",
              children: u3("p", { children: error }),
            }),
          theme?.logo &&
            u3("img", { src: theme.logo, alt: "Logo", className: "logo" }),
          providers.map((provider, i4) => {
            let bg, brandColor, logo;
            if (provider.type === "oauth" || provider.type === "oidc") {
              ({
                bg = "#fff",
                brandColor,
                logo = `${providerLogoPath}/${provider.id}.svg`,
              } = provider.style ?? {});
            }
            const color = brandColor ?? bg ?? "#fff";
            return u3(
              "div",
              {
                className: "provider",
                children: [
                  provider.type === "oauth" || provider.type === "oidc"
                    ? u3("form", {
                        action: provider.signinUrl,
                        method: "POST",
                        children: [
                          u3("input", {
                            type: "hidden",
                            name: "csrfToken",
                            value: csrfToken,
                          }),
                          callbackUrl &&
                            u3("input", {
                              type: "hidden",
                              name: "callbackUrl",
                              value: callbackUrl,
                            }),
                          u3("button", {
                            type: "submit",
                            className: "button",
                            style: {
                              "--provider-brand-color": color,
                            },
                            tabIndex: 0,
                            children: [
                              u3("span", {
                                style: {
                                  filter:
                                    "invert(1) grayscale(1) brightness(1.3) contrast(9000)",
                                  "mix-blend-mode": "luminosity",
                                  opacity: 0.95,
                                },
                                children: ["Sign in with ", provider.name],
                              }),
                              logo &&
                                u3("img", {
                                  loading: "lazy",
                                  height: 24,
                                  src: logo,
                                }),
                            ],
                          }),
                        ],
                      })
                    : null,
                  (provider.type === "email" ||
                    provider.type === "credentials" ||
                    provider.type === "webauthn") &&
                    i4 > 0 &&
                    providers[i4 - 1].type !== "email" &&
                    providers[i4 - 1].type !== "credentials" &&
                    providers[i4 - 1].type !== "webauthn" &&
                    u3("hr", {}),
                  provider.type === "email" &&
                    u3("form", {
                      action: provider.signinUrl,
                      method: "POST",
                      children: [
                        u3("input", {
                          type: "hidden",
                          name: "csrfToken",
                          value: csrfToken,
                        }),
                        u3("label", {
                          className: "section-header",
                          htmlFor: `input-email-for-${provider.id}-provider`,
                          children: "Email",
                        }),
                        u3("input", {
                          id: `input-email-for-${provider.id}-provider`,
                          autoFocus: true,
                          type: "email",
                          name: "email",
                          value: email,
                          placeholder: "email@example.com",
                          required: true,
                        }),
                        u3("button", {
                          id: "submitButton",
                          type: "submit",
                          tabIndex: 0,
                          children: ["Sign in with ", provider.name],
                        }),
                      ],
                    }),
                  provider.type === "credentials" &&
                    u3("form", {
                      action: provider.callbackUrl,
                      method: "POST",
                      children: [
                        u3("input", {
                          type: "hidden",
                          name: "csrfToken",
                          value: csrfToken,
                        }),
                        Object.keys(provider.credentials).map((credential) => {
                          return u3(
                            "div",
                            {
                              children: [
                                u3("label", {
                                  className: "section-header",
                                  htmlFor: `input-${credential}-for-${provider.id}-provider`,
                                  children:
                                    provider.credentials[credential].label ??
                                    credential,
                                }),
                                u3("input", {
                                  name: credential,
                                  id: `input-${credential}-for-${provider.id}-provider`,
                                  type:
                                    provider.credentials[credential].type ??
                                    "text",
                                  placeholder:
                                    provider.credentials[credential]
                                      .placeholder ?? "",
                                  ...provider.credentials[credential],
                                }),
                              ],
                            },
                            `input-group-${provider.id}`,
                          );
                        }),
                        u3("button", {
                          id: "submitButton",
                          type: "submit",
                          tabIndex: 0,
                          children: ["Sign in with ", provider.name],
                        }),
                      ],
                    }),
                  provider.type === "webauthn" &&
                    u3("form", {
                      action: provider.callbackUrl,
                      method: "POST",
                      id: `${provider.id}-form`,
                      children: [
                        u3("input", {
                          type: "hidden",
                          name: "csrfToken",
                          value: csrfToken,
                        }),
                        Object.keys(provider.formFields).map((field) => {
                          return u3(
                            "div",
                            {
                              children: [
                                u3("label", {
                                  className: "section-header",
                                  htmlFor: `input-${field}-for-${provider.id}-provider`,
                                  children:
                                    provider.formFields[field].label ?? field,
                                }),
                                u3("input", {
                                  name: field,
                                  "data-form-field": true,
                                  id: `input-${field}-for-${provider.id}-provider`,
                                  type:
                                    provider.formFields[field].type ?? "text",
                                  placeholder:
                                    provider.formFields[field].placeholder ??
                                    "",
                                  ...provider.formFields[field],
                                }),
                              ],
                            },
                            `input-group-${provider.id}`,
                          );
                        }),
                        u3("button", {
                          id: `submitButton-${provider.id}`,
                          type: "submit",
                          tabIndex: 0,
                          children: ["Sign in with ", provider.name],
                        }),
                      ],
                    }),
                  (provider.type === "email" ||
                    provider.type === "credentials" ||
                    provider.type === "webauthn") &&
                    i4 + 1 < providers.length &&
                    u3("hr", {}),
                ],
              },
              provider.id,
            );
          }),
        ],
      }),
      conditionalUIProviderID && ConditionalUIScript(conditionalUIProviderID),
    ],
  });
}

// ../../../../node_modules/@auth/core/lib/pages/signout.js
function SignoutPage(props) {
  const { url, csrfToken, theme } = props;
  return u3("div", {
    className: "signout",
    children: [
      theme?.brandColor &&
        u3("style", {
          dangerouslySetInnerHTML: {
            __html: `
        :root {
          --brand-color: ${theme.brandColor}
        }
      `,
          },
        }),
      theme?.buttonText &&
        u3("style", {
          dangerouslySetInnerHTML: {
            __html: `
        :root {
          --button-text-color: ${theme.buttonText}
        }
      `,
          },
        }),
      u3("div", {
        className: "card",
        children: [
          theme?.logo &&
            u3("img", { src: theme.logo, alt: "Logo", className: "logo" }),
          u3("h1", { children: "Signout" }),
          u3("p", { children: "Are you sure you want to sign out?" }),
          u3("form", {
            action: url?.toString(),
            method: "POST",
            children: [
              u3("input", {
                type: "hidden",
                name: "csrfToken",
                value: csrfToken,
              }),
              u3("button", {
                id: "submitButton",
                type: "submit",
                children: "Sign out",
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// ../../../../node_modules/@auth/core/lib/pages/styles.js
var styles_default = `:root {
  --border-width: 1px;
  --border-radius: 0.5rem;
  --color-error: #c94b4b;
  --color-info: #157efb;
  --color-info-hover: #0f6ddb;
  --color-info-text: #fff;
}

.__next-auth-theme-auto,
.__next-auth-theme-light {
  --color-background: #ececec;
  --color-background-hover: rgba(236, 236, 236, 0.8);
  --color-background-card: #fff;
  --color-text: #000;
  --color-primary: #444;
  --color-control-border: #bbb;
  --color-button-active-background: #f9f9f9;
  --color-button-active-border: #aaa;
  --color-separator: #ccc;
  --provider-bg: #fff;
  --provider-bg-hover: color-mix(
    in srgb,
    var(--provider-brand-color) 30%,
    #fff
  );
}

.__next-auth-theme-dark {
  --color-background: #161b22;
  --color-background-hover: rgba(22, 27, 34, 0.8);
  --color-background-card: #0d1117;
  --color-text: #fff;
  --color-primary: #ccc;
  --color-control-border: #555;
  --color-button-active-background: #060606;
  --color-button-active-border: #666;
  --color-separator: #444;
  --provider-bg: #161b22;
  --provider-bg-hover: color-mix(
    in srgb,
    var(--provider-brand-color) 30%,
    #000
  );
}

.__next-auth-theme-dark img[src$="42-school.svg"],
  .__next-auth-theme-dark img[src$="apple.svg"],
  .__next-auth-theme-dark img[src$="boxyhq-saml.svg"],
  .__next-auth-theme-dark img[src$="eveonline.svg"],
  .__next-auth-theme-dark img[src$="github.svg"],
  .__next-auth-theme-dark img[src$="mailchimp.svg"],
  .__next-auth-theme-dark img[src$="medium.svg"],
  .__next-auth-theme-dark img[src$="okta.svg"],
  .__next-auth-theme-dark img[src$="patreon.svg"],
  .__next-auth-theme-dark img[src$="ping-id.svg"],
  .__next-auth-theme-dark img[src$="roblox.svg"],
  .__next-auth-theme-dark img[src$="threads.svg"],
  .__next-auth-theme-dark img[src$="wikimedia.svg"] {
    filter: invert(1);
  }

.__next-auth-theme-dark #submitButton {
    background-color: var(--provider-bg, var(--color-info));
  }

@media (prefers-color-scheme: dark) {
  .__next-auth-theme-auto {
    --color-background: #161b22;
    --color-background-hover: rgba(22, 27, 34, 0.8);
    --color-background-card: #0d1117;
    --color-text: #fff;
    --color-primary: #ccc;
    --color-control-border: #555;
    --color-button-active-background: #060606;
    --color-button-active-border: #666;
    --color-separator: #444;
    --provider-bg: #161b22;
    --provider-bg-hover: color-mix(
      in srgb,
      var(--provider-brand-color) 30%,
      #000
    );
  }
    .__next-auth-theme-auto img[src$="42-school.svg"],
    .__next-auth-theme-auto img[src$="apple.svg"],
    .__next-auth-theme-auto img[src$="boxyhq-saml.svg"],
    .__next-auth-theme-auto img[src$="eveonline.svg"],
    .__next-auth-theme-auto img[src$="github.svg"],
    .__next-auth-theme-auto img[src$="mailchimp.svg"],
    .__next-auth-theme-auto img[src$="medium.svg"],
    .__next-auth-theme-auto img[src$="okta.svg"],
    .__next-auth-theme-auto img[src$="patreon.svg"],
    .__next-auth-theme-auto img[src$="ping-id.svg"],
    .__next-auth-theme-auto img[src$="roblox.svg"],
    .__next-auth-theme-auto img[src$="threads.svg"],
    .__next-auth-theme-auto img[src$="wikimedia.svg"] {
      filter: invert(1);
    }
    .__next-auth-theme-auto #submitButton {
      background-color: var(--provider-bg, var(--color-info));
    }
}

html {
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: inherit;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--color-background);
  margin: 0;
  padding: 0;
  font-family:
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial,
    "Noto Sans",
    sans-serif,
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Segoe UI Symbol",
    "Noto Color Emoji";
}

h1 {
  margin-bottom: 1.5rem;
  padding: 0 1rem;
  font-weight: 400;
  color: var(--color-text);
}

p {
  margin-bottom: 1.5rem;
  padding: 0 1rem;
  color: var(--color-text);
}

form {
  margin: 0;
  padding: 0;
}

label {
  font-weight: 500;
  text-align: left;
  margin-bottom: 0.25rem;
  display: block;
  color: var(--color-text);
}

input[type] {
  box-sizing: border-box;
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  border: var(--border-width) solid var(--color-control-border);
  background: var(--color-background-card);
  font-size: 1rem;
  border-radius: var(--border-radius);
  color: var(--color-text);
}

p {
  font-size: 1.1rem;
  line-height: 2rem;
}

a.button {
  text-decoration: none;
  line-height: 1rem;
}

a.button:link,
  a.button:visited {
    background-color: var(--color-background);
    color: var(--color-primary);
  }

button,
a.button {
  padding: 0.75rem 1rem;
  color: var(--provider-color, var(--color-primary));
  background-color: var(--provider-bg, var(--color-background));
  border: 1px solid #00000031;
  font-size: 0.9rem;
  height: 50px;
  border-radius: var(--border-radius);
  transition: background-color 250ms ease-in-out;
  font-weight: 300;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

:is(button,a.button):hover {
    background-color: var(--provider-bg-hover, var(--color-background-hover));
    cursor: pointer;
  }

:is(button,a.button):active {
    cursor: pointer;
  }

:is(button,a.button) span {
    color: var(--provider-bg);
  }

#submitButton {
  color: var(--button-text-color, var(--color-info-text));
  background-color: var(--brand-color, var(--color-info));
  width: 100%;
}

#submitButton:hover {
    background-color: var(
      --button-hover-bg,
      var(--color-info-hover)
    ) !important;
  }

a.site {
  color: var(--color-primary);
  text-decoration: none;
  font-size: 1rem;
  line-height: 2rem;
}

a.site:hover {
    text-decoration: underline;
  }

.page {
  position: absolute;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.page > div {
    text-align: center;
  }

.error a.button {
    padding-left: 2rem;
    padding-right: 2rem;
    margin-top: 0.5rem;
  }

.error .message {
    margin-bottom: 1.5rem;
  }

.signin input[type="text"] {
    margin-left: auto;
    margin-right: auto;
    display: block;
  }

.signin hr {
    display: block;
    border: 0;
    border-top: 1px solid var(--color-separator);
    margin: 2rem auto 1rem auto;
    overflow: visible;
  }

.signin hr::before {
      content: "or";
      background: var(--color-background-card);
      color: #888;
      padding: 0 0.4rem;
      position: relative;
      top: -0.7rem;
    }

.signin .error {
    background: #f5f5f5;
    font-weight: 500;
    border-radius: 0.3rem;
    background: var(--color-error);
  }

.signin .error p {
      text-align: left;
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
      line-height: 1.2rem;
      color: var(--color-info-text);
    }

.signin > div,
  .signin form {
    display: block;
  }

.signin > div input[type], .signin form input[type] {
      margin-bottom: 0.5rem;
    }

.signin > div button, .signin form button {
      width: 100%;
    }

.signin .provider + .provider {
    margin-top: 1rem;
  }

.logo {
  display: inline-block;
  max-width: 150px;
  margin: 1.25rem 0;
  max-height: 70px;
}

.card {
  background-color: var(--color-background-card);
  border-radius: 1rem;
  padding: 1.25rem 2rem;
}

.card .header {
    color: var(--color-primary);
  }

.card input[type]::-moz-placeholder {
    color: color-mix(
      in srgb,
      var(--color-text) 20%,
      var(--color-button-active-background)
    );
  }

.card input[type]::placeholder {
    color: color-mix(
      in srgb,
      var(--color-text) 20%,
      var(--color-button-active-background)
    );
  }

.card input[type] {
    background: color-mix(in srgb, var(--color-background-card) 95%, black);
  }

.section-header {
  color: var(--color-text);
}

@media screen and (min-width: 450px) {
  .card {
    margin: 2rem 0;
    width: 368px;
  }
}

@media screen and (max-width: 450px) {
  .card {
    margin: 1rem 0;
    width: 343px;
  }
}
`;

// ../../../../node_modules/@auth/core/lib/pages/verify-request.js
function VerifyRequestPage(props) {
  const { url, theme } = props;
  return u3("div", {
    className: "verify-request",
    children: [
      theme.brandColor &&
        u3("style", {
          dangerouslySetInnerHTML: {
            __html: `
        :root {
          --brand-color: ${theme.brandColor}
        }
      `,
          },
        }),
      u3("div", {
        className: "card",
        children: [
          theme.logo &&
            u3("img", { src: theme.logo, alt: "Logo", className: "logo" }),
          u3("h1", { children: "Check your email" }),
          u3("p", {
            children: "A sign in link has been sent to your email address.",
          }),
          u3("p", {
            children: u3("a", {
              className: "site",
              href: url.origin,
              children: url.host,
            }),
          }),
        ],
      }),
    ],
  });
}

// ../../../../node_modules/@auth/core/lib/pages/index.js
function send({ html, title, status, cookies: cookies2, theme, headTags }) {
  return {
    cookies: cookies2,
    status,
    headers: { "Content-Type": "text/html" },
    body: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${styles_default}</style><title>${title}</title>${headTags ?? ""}</head><body class="__next-auth-theme-${theme?.colorScheme ?? "auto"}"><div class="page">${D(html)}</div></body></html>`,
  };
}
function renderPage(params) {
  const { url, theme, query, cookies: cookies2, pages, providers } = params;
  return {
    csrf(skip, options, cookies3) {
      if (!skip) {
        return {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "private, no-cache, no-store",
            Expires: "0",
            Pragma: "no-cache",
          },
          body: { csrfToken: options.csrfToken },
          cookies: cookies3,
        };
      }
      options.logger.warn("csrf-disabled");
      cookies3.push({
        name: options.cookies.csrfToken.name,
        value: "",
        options: { ...options.cookies.csrfToken.options, maxAge: 0 },
      });
      return { status: 404, cookies: cookies3 };
    },
    providers(providers2) {
      return {
        headers: { "Content-Type": "application/json" },
        body: providers2.reduce(
          (acc, { id, name, type, signinUrl, callbackUrl }) => {
            acc[id] = { id, name, type, signinUrl, callbackUrl };
            return acc;
          },
          {},
        ),
      };
    },
    signin(providerId, error) {
      if (providerId) throw new UnknownAction("Unsupported action");
      if (pages?.signIn) {
        let signinUrl = `${pages.signIn}${pages.signIn.includes("?") ? "&" : "?"}${new URLSearchParams({ callbackUrl: params.callbackUrl ?? "/" })}`;
        if (error) signinUrl = `${signinUrl}&${new URLSearchParams({ error })}`;
        return { redirect: signinUrl, cookies: cookies2 };
      }
      const webauthnProvider = providers?.find(
        (p3) =>
          p3.type === "webauthn" &&
          p3.enableConditionalUI &&
          !!p3.simpleWebAuthnBrowserVersion,
      );
      let simpleWebAuthnBrowserScript = "";
      if (webauthnProvider) {
        const { simpleWebAuthnBrowserVersion } = webauthnProvider;
        simpleWebAuthnBrowserScript = `<script src="https://unpkg.com/@simplewebauthn/browser@${simpleWebAuthnBrowserVersion}/dist/bundle/index.umd.min.js" crossorigin="anonymous"><\/script>`;
      }
      return send({
        cookies: cookies2,
        theme,
        html: SigninPage({
          csrfToken: params.csrfToken,
          // We only want to render providers
          providers: params.providers?.filter(
            (provider) =>
              // Always render oauth and email type providers
              ["email", "oauth", "oidc"].includes(provider.type) || // Only render credentials type provider if credentials are defined
              (provider.type === "credentials" && provider.credentials) || // Only render webauthn type provider if formFields are defined
              (provider.type === "webauthn" && provider.formFields) || // Don't render other provider types
              false,
          ),
          callbackUrl: params.callbackUrl,
          theme: params.theme,
          error,
          ...query,
        }),
        title: "Sign In",
        headTags: simpleWebAuthnBrowserScript,
      });
    },
    signout() {
      if (pages?.signOut) return { redirect: pages.signOut, cookies: cookies2 };
      return send({
        cookies: cookies2,
        theme,
        html: SignoutPage({ csrfToken: params.csrfToken, url, theme }),
        title: "Sign Out",
      });
    },
    verifyRequest(props) {
      if (pages?.verifyRequest)
        return {
          redirect: `${pages.verifyRequest}${url?.search ?? ""}`,
          cookies: cookies2,
        };
      return send({
        cookies: cookies2,
        theme,
        html: VerifyRequestPage({ url, theme, ...props }),
        title: "Verify Request",
      });
    },
    error(error) {
      if (pages?.error) {
        return {
          redirect: `${pages.error}${pages.error.includes("?") ? "&" : "?"}error=${error}`,
          cookies: cookies2,
        };
      }
      return send({
        cookies: cookies2,
        theme,
        // @ts-expect-error fix error type
        ...ErrorPage({ url, theme, error }),
        title: "Error",
      });
    },
  };
}

// ../../../../node_modules/@auth/core/lib/utils/date.js
function fromDate(time, date = Date.now()) {
  return new Date(date + time * 1e3);
}

// ../../../../node_modules/@auth/core/lib/actions/callback/handle-login.js
async function handleLoginOrRegister(
  sessionToken,
  _profile,
  _account,
  options,
) {
  if (!_account?.providerAccountId || !_account.type)
    throw new Error("Missing or invalid provider account");
  if (!["email", "oauth", "oidc", "webauthn"].includes(_account.type))
    throw new Error("Provider not supported");
  const {
    adapter,
    jwt,
    events,
    session: { strategy: sessionStrategy, generateSessionToken },
  } = options;
  if (!adapter) {
    return { user: _profile, account: _account };
  }
  const profile = _profile;
  let account = _account;
  const {
    createUser,
    updateUser,
    getUser,
    getUserByAccount,
    getUserByEmail,
    linkAccount,
    createSession,
    getSessionAndUser,
    deleteSession,
  } = adapter;
  let session2 = null;
  let user = null;
  let isNewUser = false;
  const useJwtSession = sessionStrategy === "jwt";
  if (sessionToken) {
    if (useJwtSession) {
      try {
        const salt = options.cookies.sessionToken.name;
        session2 = await jwt.decode({ ...jwt, token: sessionToken, salt });
        if (session2 && "sub" in session2 && session2.sub) {
          user = await getUser(session2.sub);
        }
      } catch {}
    } else {
      const userAndSession = await getSessionAndUser(sessionToken);
      if (userAndSession) {
        session2 = userAndSession.session;
        user = userAndSession.user;
      }
    }
  }
  if (account.type === "email") {
    const userByEmail = await getUserByEmail(profile.email);
    if (userByEmail) {
      if (user?.id !== userByEmail.id && !useJwtSession && sessionToken) {
        await deleteSession(sessionToken);
      }
      user = await updateUser({
        id: userByEmail.id,
        emailVerified: /* @__PURE__ */ new Date(),
      });
      await events.updateUser?.({ user });
    } else {
      user = await createUser({
        ...profile,
        emailVerified: /* @__PURE__ */ new Date(),
      });
      await events.createUser?.({ user });
      isNewUser = true;
    }
    session2 = useJwtSession
      ? {}
      : await createSession({
          sessionToken: generateSessionToken(),
          userId: user.id,
          expires: fromDate(options.session.maxAge),
        });
    return { session: session2, user, isNewUser };
  } else if (account.type === "webauthn") {
    const userByAccount2 = await getUserByAccount({
      providerAccountId: account.providerAccountId,
      provider: account.provider,
    });
    if (userByAccount2) {
      if (user) {
        if (userByAccount2.id === user.id) {
          const currentAccount2 = { ...account, userId: user.id };
          return {
            session: session2,
            user,
            isNewUser,
            account: currentAccount2,
          };
        }
        throw new AccountNotLinked(
          "The account is already associated with another user",
          { provider: account.provider },
        );
      }
      session2 = useJwtSession
        ? {}
        : await createSession({
            sessionToken: generateSessionToken(),
            userId: userByAccount2.id,
            expires: fromDate(options.session.maxAge),
          });
      const currentAccount = {
        ...account,
        userId: userByAccount2.id,
      };
      return {
        session: session2,
        user: userByAccount2,
        isNewUser,
        account: currentAccount,
      };
    } else {
      if (user) {
        await linkAccount({ ...account, userId: user.id });
        await events.linkAccount?.({ user, account, profile });
        const currentAccount2 = { ...account, userId: user.id };
        return { session: session2, user, isNewUser, account: currentAccount2 };
      }
      const userByEmail = profile.email
        ? await getUserByEmail(profile.email)
        : null;
      if (userByEmail) {
        throw new AccountNotLinked(
          "Another account already exists with the same e-mail address",
          { provider: account.provider },
        );
      } else {
        user = await createUser({ ...profile });
      }
      await events.createUser?.({ user });
      await linkAccount({ ...account, userId: user.id });
      await events.linkAccount?.({ user, account, profile });
      session2 = useJwtSession
        ? {}
        : await createSession({
            sessionToken: generateSessionToken(),
            userId: user.id,
            expires: fromDate(options.session.maxAge),
          });
      const currentAccount = { ...account, userId: user.id };
      return {
        session: session2,
        user,
        isNewUser: true,
        account: currentAccount,
      };
    }
  }
  const userByAccount = await getUserByAccount({
    providerAccountId: account.providerAccountId,
    provider: account.provider,
  });
  if (userByAccount) {
    if (user) {
      if (userByAccount.id === user.id) {
        return { session: session2, user, isNewUser };
      }
      throw new OAuthAccountNotLinked(
        "The account is already associated with another user",
        { provider: account.provider },
      );
    }
    session2 = useJwtSession
      ? {}
      : await createSession({
          sessionToken: generateSessionToken(),
          userId: userByAccount.id,
          expires: fromDate(options.session.maxAge),
        });
    return { session: session2, user: userByAccount, isNewUser };
  } else {
    const { provider: p3 } = options;
    const { type, provider, providerAccountId, userId, ...tokenSet } = account;
    const defaults2 = { providerAccountId, provider, type, userId };
    account = Object.assign(p3.account(tokenSet) ?? {}, defaults2);
    if (user) {
      await linkAccount({ ...account, userId: user.id });
      await events.linkAccount?.({ user, account, profile });
      return { session: session2, user, isNewUser };
    }
    const userByEmail = profile.email
      ? await getUserByEmail(profile.email)
      : null;
    if (userByEmail) {
      const provider2 = options.provider;
      if (provider2?.allowDangerousEmailAccountLinking) {
        user = userByEmail;
        isNewUser = false;
      } else {
        throw new OAuthAccountNotLinked(
          "Another account already exists with the same e-mail address",
          { provider: account.provider },
        );
      }
    } else {
      user = await createUser({ ...profile, emailVerified: null });
      isNewUser = true;
    }
    await events.createUser?.({ user });
    await linkAccount({ ...account, userId: user.id });
    await events.linkAccount?.({ user, account, profile });
    session2 = useJwtSession
      ? {}
      : await createSession({
          sessionToken: generateSessionToken(),
          userId: user.id,
          expires: fromDate(options.session.maxAge),
        });
    return { session: session2, user, isNewUser };
  }
}

// ../../../../node_modules/oauth4webapi/build/index.js
var USER_AGENT;
if (
  typeof navigator === "undefined" ||
  !navigator.userAgent?.startsWith?.("Mozilla/5.0 ")
) {
  const NAME = "oauth4webapi";
  const VERSION3 = "v3.5.1";
  USER_AGENT = `${NAME}/${VERSION3}`;
}
function looseInstanceOf(input, expected) {
  if (input == null) {
    return false;
  }
  try {
    return (
      input instanceof expected ||
      Object.getPrototypeOf(input)[Symbol.toStringTag] ===
        expected.prototype[Symbol.toStringTag]
    );
  } catch {
    return false;
  }
}
var ERR_INVALID_ARG_VALUE = "ERR_INVALID_ARG_VALUE";
var ERR_INVALID_ARG_TYPE = "ERR_INVALID_ARG_TYPE";
function CodedTypeError(message2, code, cause) {
  const err = new TypeError(message2, { cause });
  Object.assign(err, { code });
  return err;
}
var allowInsecureRequests = Symbol();
var clockSkew = Symbol();
var clockTolerance = Symbol();
var customFetch2 = Symbol();
var modifyAssertion = Symbol();
var jweDecrypt = Symbol();
var jwksCache = Symbol();
var encoder2 = new TextEncoder();
var decoder2 = new TextDecoder();
function buf(input) {
  if (typeof input === "string") {
    return encoder2.encode(input);
  }
  return decoder2.decode(input);
}
var CHUNK_SIZE2 = 32768;
function encodeBase64Url(input) {
  if (input instanceof ArrayBuffer) {
    input = new Uint8Array(input);
  }
  const arr = [];
  for (let i4 = 0; i4 < input.byteLength; i4 += CHUNK_SIZE2) {
    arr.push(
      String.fromCharCode.apply(null, input.subarray(i4, i4 + CHUNK_SIZE2)),
    );
  }
  return btoa(arr.join(""))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}
function decodeBase64Url(input) {
  try {
    const binary = atob(
      input.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, ""),
    );
    const bytes = new Uint8Array(binary.length);
    for (let i4 = 0; i4 < binary.length; i4++) {
      bytes[i4] = binary.charCodeAt(i4);
    }
    return bytes;
  } catch (cause) {
    throw CodedTypeError(
      "The input to be decoded is not correctly encoded.",
      ERR_INVALID_ARG_VALUE,
      cause,
    );
  }
}
function b64u(input) {
  if (typeof input === "string") {
    return decodeBase64Url(input);
  }
  return encodeBase64Url(input);
}
var UnsupportedOperationError = class extends Error {
  constructor(message2, options) {
    super(message2, options);
    __publicField(this, "code");
    this.name = this.constructor.name;
    this.code = UNSUPPORTED_OPERATION;
    Error.captureStackTrace?.(this, this.constructor);
  }
};
var OperationProcessingError = class extends Error {
  constructor(message2, options) {
    super(message2, options);
    __publicField(this, "code");
    this.name = this.constructor.name;
    if (options?.code) {
      this.code = options?.code;
    }
    Error.captureStackTrace?.(this, this.constructor);
  }
};
function OPE(message2, code, cause) {
  return new OperationProcessingError(message2, { code, cause });
}
function assertCryptoKey2(key, it) {
  if (!(key instanceof CryptoKey)) {
    throw CodedTypeError(`${it} must be a CryptoKey`, ERR_INVALID_ARG_TYPE);
  }
}
function assertPrivateKey(key, it) {
  assertCryptoKey2(key, it);
  if (key.type !== "private") {
    throw CodedTypeError(
      `${it} must be a private CryptoKey`,
      ERR_INVALID_ARG_VALUE,
    );
  }
}
function assertPublicKey(key, it) {
  assertCryptoKey2(key, it);
  if (key.type !== "public") {
    throw CodedTypeError(
      `${it} must be a public CryptoKey`,
      ERR_INVALID_ARG_VALUE,
    );
  }
}
function isJsonObject(input) {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return false;
  }
  return true;
}
function prepareHeaders(input) {
  if (looseInstanceOf(input, Headers)) {
    input = Object.fromEntries(input.entries());
  }
  const headers2 = new Headers(input);
  if (USER_AGENT && !headers2.has("user-agent")) {
    headers2.set("user-agent", USER_AGENT);
  }
  if (headers2.has("authorization")) {
    throw CodedTypeError(
      '"options.headers" must not include the "authorization" header name',
      ERR_INVALID_ARG_VALUE,
    );
  }
  return headers2;
}
function signal(value) {
  if (typeof value === "function") {
    value = value();
  }
  if (!(value instanceof AbortSignal)) {
    throw CodedTypeError(
      '"options.signal" must return or be an instance of AbortSignal',
      ERR_INVALID_ARG_TYPE,
    );
  }
  return value;
}
function replaceDoubleSlash(pathname) {
  if (pathname.includes("//")) {
    return pathname.replace("//", "/");
  }
  return pathname;
}
function prependWellKnown(url, wellKnown) {
  if (url.pathname === "/") {
    url.pathname = wellKnown;
  } else {
    url.pathname = replaceDoubleSlash(`${wellKnown}/${url.pathname}`);
  }
  return url;
}
function appendWellKnown(url, wellKnown) {
  url.pathname = replaceDoubleSlash(`${url.pathname}/${wellKnown}`);
  return url;
}
async function performDiscovery(input, urlName, transform, options) {
  if (!(input instanceof URL)) {
    throw CodedTypeError(
      `"${urlName}" must be an instance of URL`,
      ERR_INVALID_ARG_TYPE,
    );
  }
  checkProtocol(input, options?.[allowInsecureRequests] !== true);
  const url = transform(new URL(input.href));
  const headers2 = prepareHeaders(options?.headers);
  headers2.set("accept", "application/json");
  return (options?.[customFetch2] || fetch)(url.href, {
    body: void 0,
    headers: Object.fromEntries(headers2.entries()),
    method: "GET",
    redirect: "manual",
    signal: options?.signal ? signal(options.signal) : void 0,
  });
}
async function discoveryRequest(issuerIdentifier, options) {
  return performDiscovery(
    issuerIdentifier,
    "issuerIdentifier",
    (url) => {
      switch (options?.algorithm) {
        case void 0:
        case "oidc":
          appendWellKnown(url, ".well-known/openid-configuration");
          break;
        case "oauth2":
          prependWellKnown(url, ".well-known/oauth-authorization-server");
          break;
        default:
          throw CodedTypeError(
            '"options.algorithm" must be "oidc" (default), or "oauth2"',
            ERR_INVALID_ARG_VALUE,
          );
      }
      return url;
    },
    options,
  );
}
function assertNumber(input, allow0, it, code, cause) {
  try {
    if (typeof input !== "number" || !Number.isFinite(input)) {
      throw CodedTypeError(
        `${it} must be a number`,
        ERR_INVALID_ARG_TYPE,
        cause,
      );
    }
    if (input > 0) return;
    if (allow0) {
      if (input !== 0) {
        throw CodedTypeError(
          `${it} must be a non-negative number`,
          ERR_INVALID_ARG_VALUE,
          cause,
        );
      }
      return;
    }
    throw CodedTypeError(
      `${it} must be a positive number`,
      ERR_INVALID_ARG_VALUE,
      cause,
    );
  } catch (err) {
    if (code) {
      throw OPE(err.message, code, cause);
    }
    throw err;
  }
}
function assertString(input, it, code, cause) {
  try {
    if (typeof input !== "string") {
      throw CodedTypeError(
        `${it} must be a string`,
        ERR_INVALID_ARG_TYPE,
        cause,
      );
    }
    if (input.length === 0) {
      throw CodedTypeError(
        `${it} must not be empty`,
        ERR_INVALID_ARG_VALUE,
        cause,
      );
    }
  } catch (err) {
    if (code) {
      throw OPE(err.message, code, cause);
    }
    throw err;
  }
}
async function processDiscoveryResponse(expectedIssuerIdentifier, response) {
  const expected = expectedIssuerIdentifier;
  if (!(expected instanceof URL) && expected !== _nodiscoverycheck) {
    throw CodedTypeError(
      '"expectedIssuerIdentifier" must be an instance of URL',
      ERR_INVALID_ARG_TYPE,
    );
  }
  if (!looseInstanceOf(response, Response)) {
    throw CodedTypeError(
      '"response" must be an instance of Response',
      ERR_INVALID_ARG_TYPE,
    );
  }
  if (response.status !== 200) {
    throw OPE(
      '"response" is not a conform Authorization Server Metadata response (unexpected HTTP status code)',
      RESPONSE_IS_NOT_CONFORM,
      response,
    );
  }
  assertReadableResponse(response);
  const json = await getResponseJsonBody(response);
  assertString(
    json.issuer,
    '"response" body "issuer" property',
    INVALID_RESPONSE,
    { body: json },
  );
  if (
    expected !== _nodiscoverycheck &&
    new URL(json.issuer).href !== expected.href
  ) {
    throw OPE(
      '"response" body "issuer" property does not match the expected value',
      JSON_ATTRIBUTE_COMPARISON,
      { expected: expected.href, body: json, attribute: "issuer" },
    );
  }
  return json;
}
function assertApplicationJson(response) {
  assertContentType(response, "application/json");
}
function notJson(response, ...types) {
  let msg = '"response" content-type must be ';
  if (types.length > 2) {
    const last = types.pop();
    msg += `${types.join(", ")}, or ${last}`;
  } else if (types.length === 2) {
    msg += `${types[0]} or ${types[1]}`;
  } else {
    msg += types[0];
  }
  return OPE(msg, RESPONSE_IS_NOT_JSON, response);
}
function assertContentType(response, contentType) {
  if (getContentType(response) !== contentType) {
    throw notJson(response, contentType);
  }
}
function randomBytes() {
  return b64u(crypto.getRandomValues(new Uint8Array(32)));
}
function generateRandomCodeVerifier() {
  return randomBytes();
}
function generateRandomState() {
  return randomBytes();
}
function generateRandomNonce() {
  return randomBytes();
}
async function calculatePKCECodeChallenge(codeVerifier) {
  assertString(codeVerifier, "codeVerifier");
  return b64u(await crypto.subtle.digest("SHA-256", buf(codeVerifier)));
}
function getKeyAndKid(input) {
  if (input instanceof CryptoKey) {
    return { key: input };
  }
  if (!(input?.key instanceof CryptoKey)) {
    return {};
  }
  if (input.kid !== void 0) {
    assertString(input.kid, '"kid"');
  }
  return {
    key: input.key,
    kid: input.kid,
  };
}
function psAlg(key) {
  switch (key.algorithm.hash.name) {
    case "SHA-256":
      return "PS256";
    case "SHA-384":
      return "PS384";
    case "SHA-512":
      return "PS512";
    default:
      throw new UnsupportedOperationError(
        "unsupported RsaHashedKeyAlgorithm hash name",
        {
          cause: key,
        },
      );
  }
}
function rsAlg(key) {
  switch (key.algorithm.hash.name) {
    case "SHA-256":
      return "RS256";
    case "SHA-384":
      return "RS384";
    case "SHA-512":
      return "RS512";
    default:
      throw new UnsupportedOperationError(
        "unsupported RsaHashedKeyAlgorithm hash name",
        {
          cause: key,
        },
      );
  }
}
function esAlg(key) {
  switch (key.algorithm.namedCurve) {
    case "P-256":
      return "ES256";
    case "P-384":
      return "ES384";
    case "P-521":
      return "ES512";
    default:
      throw new UnsupportedOperationError(
        "unsupported EcKeyAlgorithm namedCurve",
        { cause: key },
      );
  }
}
function keyToJws(key) {
  switch (key.algorithm.name) {
    case "RSA-PSS":
      return psAlg(key);
    case "RSASSA-PKCS1-v1_5":
      return rsAlg(key);
    case "ECDSA":
      return esAlg(key);
    case "Ed25519":
    case "EdDSA":
      return "Ed25519";
    default:
      throw new UnsupportedOperationError(
        "unsupported CryptoKey algorithm name",
        { cause: key },
      );
  }
}
function getClockSkew(client) {
  const skew = client?.[clockSkew];
  return typeof skew === "number" && Number.isFinite(skew) ? skew : 0;
}
function getClockTolerance(client) {
  const tolerance = client?.[clockTolerance];
  return typeof tolerance === "number" &&
    Number.isFinite(tolerance) &&
    Math.sign(tolerance) !== -1
    ? tolerance
    : 30;
}
function epochTime() {
  return Math.floor(Date.now() / 1e3);
}
function assertAs(as) {
  if (typeof as !== "object" || as === null) {
    throw CodedTypeError('"as" must be an object', ERR_INVALID_ARG_TYPE);
  }
  assertString(as.issuer, '"as.issuer"');
}
function assertClient(client) {
  if (typeof client !== "object" || client === null) {
    throw CodedTypeError('"client" must be an object', ERR_INVALID_ARG_TYPE);
  }
  assertString(client.client_id, '"client.client_id"');
}
function ClientSecretPost(clientSecret) {
  assertString(clientSecret, '"clientSecret"');
  return (_as, client, body, _headers) => {
    body.set("client_id", client.client_id);
    body.set("client_secret", clientSecret);
  };
}
function clientAssertionPayload(as, client) {
  const now3 = epochTime() + getClockSkew(client);
  return {
    jti: randomBytes(),
    aud: as.issuer,
    exp: now3 + 60,
    iat: now3,
    nbf: now3,
    iss: client.client_id,
    sub: client.client_id,
  };
}
function PrivateKeyJwt(clientPrivateKey, options) {
  const { key, kid } = getKeyAndKid(clientPrivateKey);
  assertPrivateKey(key, '"clientPrivateKey.key"');
  return async (as, client, body, _headers) => {
    const header = { alg: keyToJws(key), kid };
    const payload = clientAssertionPayload(as, client);
    options?.[modifyAssertion]?.(header, payload);
    body.set("client_id", client.client_id);
    body.set(
      "client_assertion_type",
      "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    );
    body.set("client_assertion", await signJwt(header, payload, key));
  };
}
function ClientSecretJwt(clientSecret, options) {
  assertString(clientSecret, '"clientSecret"');
  const modify = options?.[modifyAssertion];
  let key;
  return async (as, client, body, _headers) => {
    key ||
      (key = await crypto.subtle.importKey(
        "raw",
        buf(clientSecret),
        { hash: "SHA-256", name: "HMAC" },
        false,
        ["sign"],
      ));
    const header = { alg: "HS256" };
    const payload = clientAssertionPayload(as, client);
    modify?.(header, payload);
    const data = `${b64u(buf(JSON.stringify(header)))}.${b64u(buf(JSON.stringify(payload)))}`;
    const hmac = await crypto.subtle.sign(key.algorithm, key, buf(data));
    body.set("client_id", client.client_id);
    body.set(
      "client_assertion_type",
      "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    );
    body.set("client_assertion", `${data}.${b64u(new Uint8Array(hmac))}`);
  };
}
function None() {
  return (_as, client, body, _headers) => {
    body.set("client_id", client.client_id);
  };
}
async function signJwt(header, payload, key) {
  if (!key.usages.includes("sign")) {
    throw CodedTypeError(
      'CryptoKey instances used for signing assertions must include "sign" in their "usages"',
      ERR_INVALID_ARG_VALUE,
    );
  }
  const input = `${b64u(buf(JSON.stringify(header)))}.${b64u(buf(JSON.stringify(payload)))}`;
  const signature = b64u(
    await crypto.subtle.sign(keyToSubtle(key), key, buf(input)),
  );
  return `${input}.${signature}`;
}
var jwkCache;
async function getSetPublicJwkCache(key) {
  const {
    kty,
    e: e2,
    n: n2,
    x: x3,
    y: y2,
    crv,
  } = await crypto.subtle.exportKey("jwk", key);
  const jwk = { kty, e: e2, n: n2, x: x3, y: y2, crv };
  jwkCache.set(key, jwk);
  return jwk;
}
async function publicJwk(key) {
  jwkCache || (jwkCache = /* @__PURE__ */ new WeakMap());
  return jwkCache.get(key) || getSetPublicJwkCache(key);
}
var URLParse = URL.parse
  ? (url, base) => URL.parse(url, base)
  : (url, base) => {
      try {
        return new URL(url, base);
      } catch {
        return null;
      }
    };
function checkProtocol(url, enforceHttps) {
  if (enforceHttps && url.protocol !== "https:") {
    throw OPE(
      "only requests to HTTPS are allowed",
      HTTP_REQUEST_FORBIDDEN,
      url,
    );
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw OPE(
      "only HTTP and HTTPS requests are allowed",
      REQUEST_PROTOCOL_FORBIDDEN,
      url,
    );
  }
}
function validateEndpoint(value, endpoint, useMtlsAlias, enforceHttps) {
  let url;
  if (typeof value !== "string" || !(url = URLParse(value))) {
    throw OPE(
      `authorization server metadata does not contain a valid ${useMtlsAlias ? `"as.mtls_endpoint_aliases.${endpoint}"` : `"as.${endpoint}"`}`,
      value === void 0 ? MISSING_SERVER_METADATA : INVALID_SERVER_METADATA,
      {
        attribute: useMtlsAlias
          ? `mtls_endpoint_aliases.${endpoint}`
          : endpoint,
      },
    );
  }
  checkProtocol(url, enforceHttps);
  return url;
}
function resolveEndpoint(as, endpoint, useMtlsAlias, enforceHttps) {
  if (
    useMtlsAlias &&
    as.mtls_endpoint_aliases &&
    endpoint in as.mtls_endpoint_aliases
  ) {
    return validateEndpoint(
      as.mtls_endpoint_aliases[endpoint],
      endpoint,
      useMtlsAlias,
      enforceHttps,
    );
  }
  return validateEndpoint(as[endpoint], endpoint, useMtlsAlias, enforceHttps);
}
var _header,
  _privateKey,
  _publicKey,
  _clockSkew,
  _modifyAssertion,
  _map,
  _jkt,
  _get,
  get_fn,
  _set,
  set_fn;
var DPoPHandler = class {
  constructor(client, keyPair, options) {
    __privateAdd(this, _get);
    __privateAdd(this, _set);
    __privateAdd(this, _header, void 0);
    __privateAdd(this, _privateKey, void 0);
    __privateAdd(this, _publicKey, void 0);
    __privateAdd(this, _clockSkew, void 0);
    __privateAdd(this, _modifyAssertion, void 0);
    __privateAdd(this, _map, void 0);
    __privateAdd(this, _jkt, void 0);
    assertPrivateKey(keyPair?.privateKey, '"DPoP.privateKey"');
    assertPublicKey(keyPair?.publicKey, '"DPoP.publicKey"');
    if (!keyPair.publicKey.extractable) {
      throw CodedTypeError(
        '"DPoP.publicKey.extractable" must be true',
        ERR_INVALID_ARG_VALUE,
      );
    }
    __privateSet(this, _modifyAssertion, options?.[modifyAssertion]);
    __privateSet(this, _clockSkew, getClockSkew(client));
    __privateSet(this, _privateKey, keyPair.privateKey);
    __privateSet(this, _publicKey, keyPair.publicKey);
    branded.add(this);
  }
  async calculateThumbprint() {
    if (!__privateGet(this, _jkt)) {
      const jwk = await crypto.subtle.exportKey(
        "jwk",
        __privateGet(this, _publicKey),
      );
      let components;
      switch (jwk.kty) {
        case "EC":
          components = { crv: jwk.crv, kty: jwk.kty, x: jwk.x, y: jwk.y };
          break;
        case "OKP":
          components = { crv: jwk.crv, kty: jwk.kty, x: jwk.x };
          break;
        case "RSA":
          components = { e: jwk.e, kty: jwk.kty, n: jwk.n };
          break;
        default:
          throw new UnsupportedOperationError("unsupported JWK", {
            cause: { jwk },
          });
      }
      __privateGet(this, _jkt) ||
        __privateSet(
          this,
          _jkt,
          b64u(
            await crypto.subtle.digest(
              { name: "SHA-256" },
              buf(JSON.stringify(components)),
            ),
          ),
        );
    }
    return __privateGet(this, _jkt);
  }
  async addProof(url, headers2, htm, accessToken) {
    var _a2;
    __privateGet(this, _header) ||
      __privateSet(this, _header, {
        alg: keyToJws(__privateGet(this, _privateKey)),
        typ: "dpop+jwt",
        jwk: await publicJwk(__privateGet(this, _publicKey)),
      });
    const nonce2 = __privateMethod(this, _get, get_fn).call(this, url.origin);
    const now3 = epochTime() + __privateGet(this, _clockSkew);
    const payload = {
      iat: now3,
      jti: randomBytes(),
      htm,
      nonce: nonce2,
      htu: `${url.origin}${url.pathname}`,
      ath: accessToken
        ? b64u(await crypto.subtle.digest("SHA-256", buf(accessToken)))
        : void 0,
    };
    (_a2 = __privateGet(this, _modifyAssertion)) == null
      ? void 0
      : _a2.call(this, __privateGet(this, _header), payload);
    headers2.set(
      "dpop",
      await signJwt(
        __privateGet(this, _header),
        payload,
        __privateGet(this, _privateKey),
      ),
    );
  }
  cacheNonce(response) {
    try {
      const nonce2 = response.headers.get("dpop-nonce");
      if (nonce2) {
        __privateMethod(this, _set, set_fn).call(
          this,
          new URL(response.url).origin,
          nonce2,
        );
      }
    } catch {}
  }
};
_header = new WeakMap();
_privateKey = new WeakMap();
_publicKey = new WeakMap();
_clockSkew = new WeakMap();
_modifyAssertion = new WeakMap();
_map = new WeakMap();
_jkt = new WeakMap();
_get = new WeakSet();
get_fn = function (key) {
  __privateGet(this, _map) ||
    __privateSet(this, _map, /* @__PURE__ */ new Map());
  let item = __privateGet(this, _map).get(key);
  if (item) {
    __privateGet(this, _map).delete(key);
    __privateGet(this, _map).set(key, item);
  }
  return item;
};
_set = new WeakSet();
set_fn = function (key, val) {
  __privateGet(this, _map) ||
    __privateSet(this, _map, /* @__PURE__ */ new Map());
  __privateGet(this, _map).delete(key);
  if (__privateGet(this, _map).size === 100) {
    __privateGet(this, _map).delete(
      __privateGet(this, _map).keys().next().value,
    );
  }
  __privateGet(this, _map).set(key, val);
};
var ResponseBodyError = class extends Error {
  constructor(message2, options) {
    super(message2, options);
    __publicField(this, "cause");
    __publicField(this, "code");
    __publicField(this, "error");
    __publicField(this, "status");
    __publicField(this, "error_description");
    __publicField(this, "response");
    this.name = this.constructor.name;
    this.code = RESPONSE_BODY_ERROR;
    this.cause = options.cause;
    this.error = options.cause.error;
    this.status = options.response.status;
    this.error_description = options.cause.error_description;
    Object.defineProperty(this, "response", {
      enumerable: false,
      value: options.response,
    });
    Error.captureStackTrace?.(this, this.constructor);
  }
};
var AuthorizationResponseError = class extends Error {
  constructor(message2, options) {
    super(message2, options);
    __publicField(this, "cause");
    __publicField(this, "code");
    __publicField(this, "error");
    __publicField(this, "error_description");
    this.name = this.constructor.name;
    this.code = AUTHORIZATION_RESPONSE_ERROR;
    this.cause = options.cause;
    this.error = options.cause.get("error");
    this.error_description = options.cause.get("error_description") ?? void 0;
    Error.captureStackTrace?.(this, this.constructor);
  }
};
var WWWAuthenticateChallengeError = class extends Error {
  constructor(message2, options) {
    super(message2, options);
    __publicField(this, "cause");
    __publicField(this, "code");
    __publicField(this, "response");
    __publicField(this, "status");
    this.name = this.constructor.name;
    this.code = WWW_AUTHENTICATE_CHALLENGE;
    this.cause = options.cause;
    this.status = options.response.status;
    this.response = options.response;
    Object.defineProperty(this, "response", { enumerable: false });
    Error.captureStackTrace?.(this, this.constructor);
  }
};
var tokenMatch = "[a-zA-Z0-9!#$%&\\'\\*\\+\\-\\.\\^_`\\|~]+";
var token68Match = "[a-zA-Z0-9\\-\\._\\~\\+\\/]+[=]{0,2}";
var quotedMatch = '"((?:[^"\\\\]|\\\\.)*)"';
var quotedParamMatcher = "(" + tokenMatch + ")\\s*=\\s*" + quotedMatch;
var paramMatcher = "(" + tokenMatch + ")\\s*=\\s*(" + tokenMatch + ")";
var schemeRE = new RegExp("^[,\\s]*(" + tokenMatch + ")\\s(.*)");
var quotedParamRE = new RegExp("^[,\\s]*" + quotedParamMatcher + "[,\\s]*(.*)");
var unquotedParamRE = new RegExp("^[,\\s]*" + paramMatcher + "[,\\s]*(.*)");
var token68ParamRE = new RegExp("^(" + token68Match + ")(?:$|[,\\s])(.*)");
function parseWwwAuthenticateChallenges(response) {
  if (!looseInstanceOf(response, Response)) {
    throw CodedTypeError(
      '"response" must be an instance of Response',
      ERR_INVALID_ARG_TYPE,
    );
  }
  const header = response.headers.get("www-authenticate");
  if (header === null) {
    return void 0;
  }
  const challenges = [];
  let rest = header;
  while (rest) {
    let match = rest.match(schemeRE);
    const scheme = match?.["1"].toLowerCase();
    rest = match?.["2"];
    if (!scheme) {
      return void 0;
    }
    const parameters = {};
    let token68;
    while (rest) {
      let key;
      let value;
      if ((match = rest.match(quotedParamRE))) {
        [, key, value, rest] = match;
        if (value.includes("\\")) {
          try {
            value = JSON.parse(`"${value}"`);
          } catch {}
        }
        parameters[key.toLowerCase()] = value;
        continue;
      }
      if ((match = rest.match(unquotedParamRE))) {
        [, key, value, rest] = match;
        parameters[key.toLowerCase()] = value;
        continue;
      }
      if ((match = rest.match(token68ParamRE))) {
        if (Object.keys(parameters).length) {
          break;
        }
        [, token68, rest] = match;
        break;
      }
      return void 0;
    }
    const challenge = { scheme, parameters };
    if (token68) {
      challenge.token68 = token68;
    }
    challenges.push(challenge);
  }
  if (!challenges.length) {
    return void 0;
  }
  return challenges;
}
async function parseOAuthResponseErrorBody(response) {
  if (response.status > 399 && response.status < 500) {
    assertReadableResponse(response);
    assertApplicationJson(response);
    try {
      const json = await response.clone().json();
      if (
        isJsonObject(json) &&
        typeof json.error === "string" &&
        json.error.length
      ) {
        return json;
      }
    } catch {}
  }
  return void 0;
}
async function checkOAuthBodyError(response, expected, label) {
  if (response.status !== expected) {
    let err;
    if ((err = await parseOAuthResponseErrorBody(response))) {
      await response.body?.cancel();
      throw new ResponseBodyError(
        "server responded with an error in the response body",
        {
          cause: err,
          response,
        },
      );
    }
    throw OPE(
      `"response" is not a conform ${label} response (unexpected HTTP status code)`,
      RESPONSE_IS_NOT_CONFORM,
      response,
    );
  }
}
function assertDPoP(option) {
  if (!branded.has(option)) {
    throw CodedTypeError(
      '"options.DPoP" is not a valid DPoPHandle',
      ERR_INVALID_ARG_VALUE,
    );
  }
}
async function resourceRequest(
  accessToken,
  method,
  url,
  headers2,
  body,
  options,
) {
  assertString(accessToken, '"accessToken"');
  if (!(url instanceof URL)) {
    throw CodedTypeError(
      '"url" must be an instance of URL',
      ERR_INVALID_ARG_TYPE,
    );
  }
  checkProtocol(url, options?.[allowInsecureRequests] !== true);
  headers2 = prepareHeaders(headers2);
  if (options?.DPoP) {
    assertDPoP(options.DPoP);
    await options.DPoP.addProof(
      url,
      headers2,
      method.toUpperCase(),
      accessToken,
    );
  }
  headers2.set(
    "authorization",
    `${headers2.has("dpop") ? "DPoP" : "Bearer"} ${accessToken}`,
  );
  const response = await (options?.[customFetch2] || fetch)(url.href, {
    body,
    headers: Object.fromEntries(headers2.entries()),
    method,
    redirect: "manual",
    signal: options?.signal ? signal(options.signal) : void 0,
  });
  options?.DPoP?.cacheNonce(response);
  return response;
}
async function userInfoRequest(as, client, accessToken, options) {
  assertAs(as);
  assertClient(client);
  const url = resolveEndpoint(
    as,
    "userinfo_endpoint",
    client.use_mtls_endpoint_aliases,
    options?.[allowInsecureRequests] !== true,
  );
  const headers2 = prepareHeaders(options?.headers);
  if (client.userinfo_signed_response_alg) {
    headers2.set("accept", "application/jwt");
  } else {
    headers2.set("accept", "application/json");
    headers2.append("accept", "application/jwt");
  }
  return resourceRequest(accessToken, "GET", url, headers2, null, {
    ...options,
    [clockSkew]: getClockSkew(client),
  });
}
var skipSubjectCheck = Symbol();
function getContentType(input) {
  return input.headers.get("content-type")?.split(";")[0];
}
async function processUserInfoResponse(
  as,
  client,
  expectedSubject,
  response,
  options,
) {
  assertAs(as);
  assertClient(client);
  if (!looseInstanceOf(response, Response)) {
    throw CodedTypeError(
      '"response" must be an instance of Response',
      ERR_INVALID_ARG_TYPE,
    );
  }
  checkAuthenticationChallenges(response);
  if (response.status !== 200) {
    throw OPE(
      '"response" is not a conform UserInfo Endpoint response (unexpected HTTP status code)',
      RESPONSE_IS_NOT_CONFORM,
      response,
    );
  }
  assertReadableResponse(response);
  let json;
  if (getContentType(response) === "application/jwt") {
    const { claims, jwt } = await validateJwt(
      await response.text(),
      checkSigningAlgorithm.bind(
        void 0,
        client.userinfo_signed_response_alg,
        as.userinfo_signing_alg_values_supported,
        void 0,
      ),
      getClockSkew(client),
      getClockTolerance(client),
      options?.[jweDecrypt],
    )
      .then(validateOptionalAudience.bind(void 0, client.client_id))
      .then(validateOptionalIssuer.bind(void 0, as));
    jwtRefs.set(response, jwt);
    json = claims;
  } else {
    if (client.userinfo_signed_response_alg) {
      throw OPE(
        "JWT UserInfo Response expected",
        JWT_USERINFO_EXPECTED,
        response,
      );
    }
    json = await getResponseJsonBody(response);
  }
  assertString(json.sub, '"response" body "sub" property', INVALID_RESPONSE, {
    body: json,
  });
  switch (expectedSubject) {
    case skipSubjectCheck:
      break;
    default:
      assertString(expectedSubject, '"expectedSubject"');
      if (json.sub !== expectedSubject) {
        throw OPE(
          'unexpected "response" body "sub" property value',
          JSON_ATTRIBUTE_COMPARISON,
          {
            expected: expectedSubject,
            body: json,
            attribute: "sub",
          },
        );
      }
  }
  return json;
}
async function authenticatedRequest(
  as,
  client,
  clientAuthentication,
  url,
  body,
  headers2,
  options,
) {
  await clientAuthentication(as, client, body, headers2);
  headers2.set(
    "content-type",
    "application/x-www-form-urlencoded;charset=UTF-8",
  );
  return (options?.[customFetch2] || fetch)(url.href, {
    body,
    headers: Object.fromEntries(headers2.entries()),
    method: "POST",
    redirect: "manual",
    signal: options?.signal ? signal(options.signal) : void 0,
  });
}
async function tokenEndpointRequest(
  as,
  client,
  clientAuthentication,
  grantType,
  parameters,
  options,
) {
  const url = resolveEndpoint(
    as,
    "token_endpoint",
    client.use_mtls_endpoint_aliases,
    options?.[allowInsecureRequests] !== true,
  );
  parameters.set("grant_type", grantType);
  const headers2 = prepareHeaders(options?.headers);
  headers2.set("accept", "application/json");
  if (options?.DPoP !== void 0) {
    assertDPoP(options.DPoP);
    await options.DPoP.addProof(url, headers2, "POST");
  }
  const response = await authenticatedRequest(
    as,
    client,
    clientAuthentication,
    url,
    parameters,
    headers2,
    options,
  );
  options?.DPoP?.cacheNonce(response);
  return response;
}
var idTokenClaims = /* @__PURE__ */ new WeakMap();
var jwtRefs = /* @__PURE__ */ new WeakMap();
function getValidatedIdTokenClaims(ref) {
  if (!ref.id_token) {
    return void 0;
  }
  const claims = idTokenClaims.get(ref);
  if (!claims) {
    throw CodedTypeError(
      '"ref" was already garbage collected or did not resolve from the proper sources',
      ERR_INVALID_ARG_VALUE,
    );
  }
  return claims;
}
async function processGenericAccessTokenResponse(
  as,
  client,
  response,
  additionalRequiredIdTokenClaims,
  options,
) {
  assertAs(as);
  assertClient(client);
  if (!looseInstanceOf(response, Response)) {
    throw CodedTypeError(
      '"response" must be an instance of Response',
      ERR_INVALID_ARG_TYPE,
    );
  }
  checkAuthenticationChallenges(response);
  await checkOAuthBodyError(response, 200, "Token Endpoint");
  assertReadableResponse(response);
  const json = await getResponseJsonBody(response);
  assertString(
    json.access_token,
    '"response" body "access_token" property',
    INVALID_RESPONSE,
    {
      body: json,
    },
  );
  assertString(
    json.token_type,
    '"response" body "token_type" property',
    INVALID_RESPONSE,
    {
      body: json,
    },
  );
  json.token_type = json.token_type.toLowerCase();
  if (json.token_type !== "dpop" && json.token_type !== "bearer") {
    throw new UnsupportedOperationError("unsupported `token_type` value", {
      cause: { body: json },
    });
  }
  if (json.expires_in !== void 0) {
    let expiresIn =
      typeof json.expires_in !== "number"
        ? parseFloat(json.expires_in)
        : json.expires_in;
    assertNumber(
      expiresIn,
      false,
      '"response" body "expires_in" property',
      INVALID_RESPONSE,
      {
        body: json,
      },
    );
    json.expires_in = expiresIn;
  }
  if (json.refresh_token !== void 0) {
    assertString(
      json.refresh_token,
      '"response" body "refresh_token" property',
      INVALID_RESPONSE,
      {
        body: json,
      },
    );
  }
  if (json.scope !== void 0 && typeof json.scope !== "string") {
    throw OPE(
      '"response" body "scope" property must be a string',
      INVALID_RESPONSE,
      { body: json },
    );
  }
  if (json.id_token !== void 0) {
    assertString(
      json.id_token,
      '"response" body "id_token" property',
      INVALID_RESPONSE,
      {
        body: json,
      },
    );
    const requiredClaims = ["aud", "exp", "iat", "iss", "sub"];
    if (client.require_auth_time === true) {
      requiredClaims.push("auth_time");
    }
    if (client.default_max_age !== void 0) {
      assertNumber(client.default_max_age, false, '"client.default_max_age"');
      requiredClaims.push("auth_time");
    }
    if (additionalRequiredIdTokenClaims?.length) {
      requiredClaims.push(...additionalRequiredIdTokenClaims);
    }
    const { claims, jwt } = await validateJwt(
      json.id_token,
      checkSigningAlgorithm.bind(
        void 0,
        client.id_token_signed_response_alg,
        as.id_token_signing_alg_values_supported,
        "RS256",
      ),
      getClockSkew(client),
      getClockTolerance(client),
      options?.[jweDecrypt],
    )
      .then(validatePresence.bind(void 0, requiredClaims))
      .then(validateIssuer.bind(void 0, as))
      .then(validateAudience.bind(void 0, client.client_id));
    if (Array.isArray(claims.aud) && claims.aud.length !== 1) {
      if (claims.azp === void 0) {
        throw OPE(
          'ID Token "aud" (audience) claim includes additional untrusted audiences',
          JWT_CLAIM_COMPARISON,
          { claims, claim: "aud" },
        );
      }
      if (claims.azp !== client.client_id) {
        throw OPE(
          'unexpected ID Token "azp" (authorized party) claim value',
          JWT_CLAIM_COMPARISON,
          { expected: client.client_id, claims, claim: "azp" },
        );
      }
    }
    if (claims.auth_time !== void 0) {
      assertNumber(
        claims.auth_time,
        false,
        'ID Token "auth_time" (authentication time)',
        INVALID_RESPONSE,
        { claims },
      );
    }
    jwtRefs.set(response, jwt);
    idTokenClaims.set(json, claims);
  }
  return json;
}
function checkAuthenticationChallenges(response) {
  let challenges;
  if ((challenges = parseWwwAuthenticateChallenges(response))) {
    throw new WWWAuthenticateChallengeError(
      "server responded with a challenge in the WWW-Authenticate HTTP Header",
      { cause: challenges, response },
    );
  }
}
function validateOptionalAudience(expected, result) {
  if (result.claims.aud !== void 0) {
    return validateAudience(expected, result);
  }
  return result;
}
function validateAudience(expected, result) {
  if (Array.isArray(result.claims.aud)) {
    if (!result.claims.aud.includes(expected)) {
      throw OPE(
        'unexpected JWT "aud" (audience) claim value',
        JWT_CLAIM_COMPARISON,
        {
          expected,
          claims: result.claims,
          claim: "aud",
        },
      );
    }
  } else if (result.claims.aud !== expected) {
    throw OPE(
      'unexpected JWT "aud" (audience) claim value',
      JWT_CLAIM_COMPARISON,
      {
        expected,
        claims: result.claims,
        claim: "aud",
      },
    );
  }
  return result;
}
function validateOptionalIssuer(as, result) {
  if (result.claims.iss !== void 0) {
    return validateIssuer(as, result);
  }
  return result;
}
function validateIssuer(as, result) {
  const expected = as[_expectedIssuer]?.(result) ?? as.issuer;
  if (result.claims.iss !== expected) {
    throw OPE(
      'unexpected JWT "iss" (issuer) claim value',
      JWT_CLAIM_COMPARISON,
      {
        expected,
        claims: result.claims,
        claim: "iss",
      },
    );
  }
  return result;
}
var branded = /* @__PURE__ */ new WeakSet();
function brand(searchParams) {
  branded.add(searchParams);
  return searchParams;
}
async function authorizationCodeGrantRequest(
  as,
  client,
  clientAuthentication,
  callbackParameters,
  redirectUri,
  codeVerifier,
  options,
) {
  assertAs(as);
  assertClient(client);
  if (!branded.has(callbackParameters)) {
    throw CodedTypeError(
      '"callbackParameters" must be an instance of URLSearchParams obtained from "validateAuthResponse()", or "validateJwtAuthResponse()',
      ERR_INVALID_ARG_VALUE,
    );
  }
  assertString(redirectUri, '"redirectUri"');
  const code = getURLSearchParameter(callbackParameters, "code");
  if (!code) {
    throw OPE(
      'no authorization code in "callbackParameters"',
      INVALID_RESPONSE,
    );
  }
  const parameters = new URLSearchParams(options?.additionalParameters);
  parameters.set("redirect_uri", redirectUri);
  parameters.set("code", code);
  if (codeVerifier !== _nopkce) {
    assertString(codeVerifier, '"codeVerifier"');
    parameters.set("code_verifier", codeVerifier);
  }
  return tokenEndpointRequest(
    as,
    client,
    clientAuthentication,
    "authorization_code",
    parameters,
    options,
  );
}
var jwtClaimNames = {
  aud: "audience",
  c_hash: "code hash",
  client_id: "client id",
  exp: "expiration time",
  iat: "issued at",
  iss: "issuer",
  jti: "jwt id",
  nonce: "nonce",
  s_hash: "state hash",
  sub: "subject",
  ath: "access token hash",
  htm: "http method",
  htu: "http uri",
  cnf: "confirmation",
  auth_time: "authentication time",
};
function validatePresence(required, result) {
  for (const claim of required) {
    if (result.claims[claim] === void 0) {
      throw OPE(
        `JWT "${claim}" (${jwtClaimNames[claim]}) claim missing`,
        INVALID_RESPONSE,
        {
          claims: result.claims,
        },
      );
    }
  }
  return result;
}
var expectNoNonce = Symbol();
var skipAuthTimeCheck = Symbol();
async function processAuthorizationCodeResponse(as, client, response, options) {
  if (
    typeof options?.expectedNonce === "string" ||
    typeof options?.maxAge === "number" ||
    options?.requireIdToken
  ) {
    return processAuthorizationCodeOpenIDResponse(
      as,
      client,
      response,
      options.expectedNonce,
      options.maxAge,
      {
        [jweDecrypt]: options[jweDecrypt],
      },
    );
  }
  return processAuthorizationCodeOAuth2Response(as, client, response, options);
}
async function processAuthorizationCodeOpenIDResponse(
  as,
  client,
  response,
  expectedNonce,
  maxAge,
  options,
) {
  const additionalRequiredClaims = [];
  switch (expectedNonce) {
    case void 0:
      expectedNonce = expectNoNonce;
      break;
    case expectNoNonce:
      break;
    default:
      assertString(expectedNonce, '"expectedNonce" argument');
      additionalRequiredClaims.push("nonce");
  }
  maxAge ?? (maxAge = client.default_max_age);
  switch (maxAge) {
    case void 0:
      maxAge = skipAuthTimeCheck;
      break;
    case skipAuthTimeCheck:
      break;
    default:
      assertNumber(maxAge, false, '"maxAge" argument');
      additionalRequiredClaims.push("auth_time");
  }
  const result = await processGenericAccessTokenResponse(
    as,
    client,
    response,
    additionalRequiredClaims,
    options,
  );
  assertString(
    result.id_token,
    '"response" body "id_token" property',
    INVALID_RESPONSE,
    {
      body: result,
    },
  );
  const claims = getValidatedIdTokenClaims(result);
  if (maxAge !== skipAuthTimeCheck) {
    const now3 = epochTime() + getClockSkew(client);
    const tolerance = getClockTolerance(client);
    if (claims.auth_time + maxAge < now3 - tolerance) {
      throw OPE(
        "too much time has elapsed since the last End-User authentication",
        JWT_TIMESTAMP_CHECK,
        { claims, now: now3, tolerance, claim: "auth_time" },
      );
    }
  }
  if (expectedNonce === expectNoNonce) {
    if (claims.nonce !== void 0) {
      throw OPE(
        'unexpected ID Token "nonce" claim value',
        JWT_CLAIM_COMPARISON,
        {
          expected: void 0,
          claims,
          claim: "nonce",
        },
      );
    }
  } else if (claims.nonce !== expectedNonce) {
    throw OPE('unexpected ID Token "nonce" claim value', JWT_CLAIM_COMPARISON, {
      expected: expectedNonce,
      claims,
      claim: "nonce",
    });
  }
  return result;
}
async function processAuthorizationCodeOAuth2Response(
  as,
  client,
  response,
  options,
) {
  const result = await processGenericAccessTokenResponse(
    as,
    client,
    response,
    void 0,
    options,
  );
  const claims = getValidatedIdTokenClaims(result);
  if (claims) {
    if (client.default_max_age !== void 0) {
      assertNumber(client.default_max_age, false, '"client.default_max_age"');
      const now3 = epochTime() + getClockSkew(client);
      const tolerance = getClockTolerance(client);
      if (claims.auth_time + client.default_max_age < now3 - tolerance) {
        throw OPE(
          "too much time has elapsed since the last End-User authentication",
          JWT_TIMESTAMP_CHECK,
          { claims, now: now3, tolerance, claim: "auth_time" },
        );
      }
    }
    if (claims.nonce !== void 0) {
      throw OPE(
        'unexpected ID Token "nonce" claim value',
        JWT_CLAIM_COMPARISON,
        {
          expected: void 0,
          claims,
          claim: "nonce",
        },
      );
    }
  }
  return result;
}
var WWW_AUTHENTICATE_CHALLENGE = "OAUTH_WWW_AUTHENTICATE_CHALLENGE";
var RESPONSE_BODY_ERROR = "OAUTH_RESPONSE_BODY_ERROR";
var UNSUPPORTED_OPERATION = "OAUTH_UNSUPPORTED_OPERATION";
var AUTHORIZATION_RESPONSE_ERROR = "OAUTH_AUTHORIZATION_RESPONSE_ERROR";
var JWT_USERINFO_EXPECTED = "OAUTH_JWT_USERINFO_EXPECTED";
var PARSE_ERROR = "OAUTH_PARSE_ERROR";
var INVALID_RESPONSE = "OAUTH_INVALID_RESPONSE";
var RESPONSE_IS_NOT_JSON = "OAUTH_RESPONSE_IS_NOT_JSON";
var RESPONSE_IS_NOT_CONFORM = "OAUTH_RESPONSE_IS_NOT_CONFORM";
var HTTP_REQUEST_FORBIDDEN = "OAUTH_HTTP_REQUEST_FORBIDDEN";
var REQUEST_PROTOCOL_FORBIDDEN = "OAUTH_REQUEST_PROTOCOL_FORBIDDEN";
var JWT_TIMESTAMP_CHECK = "OAUTH_JWT_TIMESTAMP_CHECK_FAILED";
var JWT_CLAIM_COMPARISON = "OAUTH_JWT_CLAIM_COMPARISON_FAILED";
var JSON_ATTRIBUTE_COMPARISON = "OAUTH_JSON_ATTRIBUTE_COMPARISON_FAILED";
var MISSING_SERVER_METADATA = "OAUTH_MISSING_SERVER_METADATA";
var INVALID_SERVER_METADATA = "OAUTH_INVALID_SERVER_METADATA";
function assertReadableResponse(response) {
  if (response.bodyUsed) {
    throw CodedTypeError(
      '"response" body has been used already',
      ERR_INVALID_ARG_VALUE,
    );
  }
}
function checkRsaKeyAlgorithm(key) {
  const { algorithm } = key;
  if (
    typeof algorithm.modulusLength !== "number" ||
    algorithm.modulusLength < 2048
  ) {
    throw new UnsupportedOperationError(
      `unsupported ${algorithm.name} modulusLength`,
      {
        cause: key,
      },
    );
  }
}
function ecdsaHashName(key) {
  const { algorithm } = key;
  switch (algorithm.namedCurve) {
    case "P-256":
      return "SHA-256";
    case "P-384":
      return "SHA-384";
    case "P-521":
      return "SHA-512";
    default:
      throw new UnsupportedOperationError("unsupported ECDSA namedCurve", {
        cause: key,
      });
  }
}
function keyToSubtle(key) {
  switch (key.algorithm.name) {
    case "ECDSA":
      return {
        name: key.algorithm.name,
        hash: ecdsaHashName(key),
      };
    case "RSA-PSS": {
      checkRsaKeyAlgorithm(key);
      switch (key.algorithm.hash.name) {
        case "SHA-256":
        case "SHA-384":
        case "SHA-512":
          return {
            name: key.algorithm.name,
            saltLength: parseInt(key.algorithm.hash.name.slice(-3), 10) >> 3,
          };
        default:
          throw new UnsupportedOperationError("unsupported RSA-PSS hash name", {
            cause: key,
          });
      }
    }
    case "RSASSA-PKCS1-v1_5":
      checkRsaKeyAlgorithm(key);
      return key.algorithm.name;
    case "Ed25519":
      return key.algorithm.name;
  }
  throw new UnsupportedOperationError("unsupported CryptoKey algorithm name", {
    cause: key,
  });
}
async function validateJwt(
  jws,
  checkAlg,
  clockSkew2,
  clockTolerance2,
  decryptJwt,
) {
  let { 0: protectedHeader, 1: payload, length } = jws.split(".");
  if (length === 5) {
    if (decryptJwt !== void 0) {
      jws = await decryptJwt(jws);
      ({ 0: protectedHeader, 1: payload, length } = jws.split("."));
    } else {
      throw new UnsupportedOperationError("JWE decryption is not configured", {
        cause: jws,
      });
    }
  }
  if (length !== 3) {
    throw OPE("Invalid JWT", INVALID_RESPONSE, jws);
  }
  let header;
  try {
    header = JSON.parse(buf(b64u(protectedHeader)));
  } catch (cause) {
    throw OPE(
      "failed to parse JWT Header body as base64url encoded JSON",
      PARSE_ERROR,
      cause,
    );
  }
  if (!isJsonObject(header)) {
    throw OPE("JWT Header must be a top level object", INVALID_RESPONSE, jws);
  }
  checkAlg(header);
  if (header.crit !== void 0) {
    throw new UnsupportedOperationError(
      'no JWT "crit" header parameter extensions are supported',
      {
        cause: { header },
      },
    );
  }
  let claims;
  try {
    claims = JSON.parse(buf(b64u(payload)));
  } catch (cause) {
    throw OPE(
      "failed to parse JWT Payload body as base64url encoded JSON",
      PARSE_ERROR,
      cause,
    );
  }
  if (!isJsonObject(claims)) {
    throw OPE("JWT Payload must be a top level object", INVALID_RESPONSE, jws);
  }
  const now3 = epochTime() + clockSkew2;
  if (claims.exp !== void 0) {
    if (typeof claims.exp !== "number") {
      throw OPE(
        'unexpected JWT "exp" (expiration time) claim type',
        INVALID_RESPONSE,
        { claims },
      );
    }
    if (claims.exp <= now3 - clockTolerance2) {
      throw OPE(
        'unexpected JWT "exp" (expiration time) claim value, expiration is past current timestamp',
        JWT_TIMESTAMP_CHECK,
        { claims, now: now3, tolerance: clockTolerance2, claim: "exp" },
      );
    }
  }
  if (claims.iat !== void 0) {
    if (typeof claims.iat !== "number") {
      throw OPE(
        'unexpected JWT "iat" (issued at) claim type',
        INVALID_RESPONSE,
        { claims },
      );
    }
  }
  if (claims.iss !== void 0) {
    if (typeof claims.iss !== "string") {
      throw OPE('unexpected JWT "iss" (issuer) claim type', INVALID_RESPONSE, {
        claims,
      });
    }
  }
  if (claims.nbf !== void 0) {
    if (typeof claims.nbf !== "number") {
      throw OPE(
        'unexpected JWT "nbf" (not before) claim type',
        INVALID_RESPONSE,
        { claims },
      );
    }
    if (claims.nbf > now3 + clockTolerance2) {
      throw OPE(
        'unexpected JWT "nbf" (not before) claim value',
        JWT_TIMESTAMP_CHECK,
        {
          claims,
          now: now3,
          tolerance: clockTolerance2,
          claim: "nbf",
        },
      );
    }
  }
  if (claims.aud !== void 0) {
    if (typeof claims.aud !== "string" && !Array.isArray(claims.aud)) {
      throw OPE(
        'unexpected JWT "aud" (audience) claim type',
        INVALID_RESPONSE,
        { claims },
      );
    }
  }
  return { header, claims, jwt: jws };
}
function checkSigningAlgorithm(client, issuer, fallback, header) {
  if (client !== void 0) {
    if (
      typeof client === "string"
        ? header.alg !== client
        : !client.includes(header.alg)
    ) {
      throw OPE('unexpected JWT "alg" header parameter', INVALID_RESPONSE, {
        header,
        expected: client,
        reason: "client configuration",
      });
    }
    return;
  }
  if (Array.isArray(issuer)) {
    if (!issuer.includes(header.alg)) {
      throw OPE('unexpected JWT "alg" header parameter', INVALID_RESPONSE, {
        header,
        expected: issuer,
        reason: "authorization server metadata",
      });
    }
    return;
  }
  if (fallback !== void 0) {
    if (
      typeof fallback === "string"
        ? header.alg !== fallback
        : typeof fallback === "function"
          ? !fallback(header.alg)
          : !fallback.includes(header.alg)
    ) {
      throw OPE('unexpected JWT "alg" header parameter', INVALID_RESPONSE, {
        header,
        expected: fallback,
        reason: "default value",
      });
    }
    return;
  }
  throw OPE(
    'missing client or server configuration to verify used JWT "alg" header parameter',
    void 0,
    { client, issuer, fallback },
  );
}
function getURLSearchParameter(parameters, name) {
  const { 0: value, length } = parameters.getAll(name);
  if (length > 1) {
    throw OPE(
      `"${name}" parameter must be provided only once`,
      INVALID_RESPONSE,
    );
  }
  return value;
}
var skipStateCheck = Symbol();
var expectNoState = Symbol();
function validateAuthResponse(as, client, parameters, expectedState) {
  assertAs(as);
  assertClient(client);
  if (parameters instanceof URL) {
    parameters = parameters.searchParams;
  }
  if (!(parameters instanceof URLSearchParams)) {
    throw CodedTypeError(
      '"parameters" must be an instance of URLSearchParams, or URL',
      ERR_INVALID_ARG_TYPE,
    );
  }
  if (getURLSearchParameter(parameters, "response")) {
    throw OPE(
      '"parameters" contains a JARM response, use validateJwtAuthResponse() instead of validateAuthResponse()',
      INVALID_RESPONSE,
      { parameters },
    );
  }
  const iss = getURLSearchParameter(parameters, "iss");
  const state2 = getURLSearchParameter(parameters, "state");
  if (!iss && as.authorization_response_iss_parameter_supported) {
    throw OPE('response parameter "iss" (issuer) missing', INVALID_RESPONSE, {
      parameters,
    });
  }
  if (iss && iss !== as.issuer) {
    throw OPE(
      'unexpected "iss" (issuer) response parameter value',
      INVALID_RESPONSE,
      {
        expected: as.issuer,
        parameters,
      },
    );
  }
  switch (expectedState) {
    case void 0:
    case expectNoState:
      if (state2 !== void 0) {
        throw OPE(
          'unexpected "state" response parameter encountered',
          INVALID_RESPONSE,
          {
            expected: void 0,
            parameters,
          },
        );
      }
      break;
    case skipStateCheck:
      break;
    default:
      assertString(expectedState, '"expectedState" argument');
      if (state2 !== expectedState) {
        throw OPE(
          state2 === void 0
            ? 'response parameter "state" missing'
            : 'unexpected "state" response parameter value',
          INVALID_RESPONSE,
          { expected: expectedState, parameters },
        );
      }
  }
  const error = getURLSearchParameter(parameters, "error");
  if (error) {
    throw new AuthorizationResponseError(
      "authorization response from the server is an error",
      {
        cause: parameters,
      },
    );
  }
  const id_token = getURLSearchParameter(parameters, "id_token");
  const token = getURLSearchParameter(parameters, "token");
  if (id_token !== void 0 || token !== void 0) {
    throw new UnsupportedOperationError(
      "implicit and hybrid flows are not supported",
    );
  }
  return brand(new URLSearchParams(parameters));
}
async function getResponseJsonBody(response, check2 = assertApplicationJson) {
  let json;
  try {
    json = await response.json();
  } catch (cause) {
    check2(response);
    throw OPE('failed to parse "response" body as JSON', PARSE_ERROR, cause);
  }
  if (!isJsonObject(json)) {
    throw OPE('"response" body must be a top level object', INVALID_RESPONSE, {
      body: json,
    });
  }
  return json;
}
var _nopkce = Symbol();
var _nodiscoverycheck = Symbol();
var _expectedIssuer = Symbol();

// ../../../../node_modules/@auth/core/lib/actions/callback/oauth/checks.js
var COOKIE_TTL = 60 * 15;
async function sealCookie(name, payload, options) {
  const { cookies: cookies2, logger: logger2 } = options;
  const cookie = cookies2[name];
  const expires = /* @__PURE__ */ new Date();
  expires.setTime(expires.getTime() + COOKIE_TTL * 1e3);
  logger2.debug(`CREATE_${name.toUpperCase()}`, {
    name: cookie.name,
    payload,
    COOKIE_TTL,
    expires,
  });
  const encoded = await encode4({
    ...options.jwt,
    maxAge: COOKIE_TTL,
    token: { value: payload },
    salt: cookie.name,
  });
  const cookieOptions = { ...cookie.options, expires };
  return { name: cookie.name, value: encoded, options: cookieOptions };
}
async function parseCookie3(name, value, options) {
  try {
    const { logger: logger2, cookies: cookies2, jwt } = options;
    logger2.debug(`PARSE_${name.toUpperCase()}`, { cookie: value });
    if (!value) throw new InvalidCheck(`${name} cookie was missing`);
    const parsed = await decode3({
      ...jwt,
      token: value,
      salt: cookies2[name].name,
    });
    if (parsed?.value) return parsed.value;
    throw new Error("Invalid cookie");
  } catch (error) {
    throw new InvalidCheck(`${name} value could not be parsed`, {
      cause: error,
    });
  }
}
function clearCookie(name, options, resCookies) {
  const { logger: logger2, cookies: cookies2 } = options;
  const cookie = cookies2[name];
  logger2.debug(`CLEAR_${name.toUpperCase()}`, { cookie });
  resCookies.push({
    name: cookie.name,
    value: "",
    options: { ...cookies2[name].options, maxAge: 0 },
  });
}
function useCookie(check2, name) {
  return async function (cookies2, resCookies, options) {
    const { provider, logger: logger2 } = options;
    if (!provider?.checks?.includes(check2)) return;
    const cookieValue = cookies2?.[options.cookies[name].name];
    logger2.debug(`USE_${name.toUpperCase()}`, { value: cookieValue });
    const parsed = await parseCookie3(name, cookieValue, options);
    clearCookie(name, options, resCookies);
    return parsed;
  };
}
var pkce = {
  /** Creates a PKCE code challenge and verifier pair. The verifier in stored in the cookie. */
  async create(options) {
    const code_verifier = generateRandomCodeVerifier();
    const value = await calculatePKCECodeChallenge(code_verifier);
    const cookie = await sealCookie("pkceCodeVerifier", code_verifier, options);
    return { cookie, value };
  },
  /**
   * Returns code_verifier if the provider is configured to use PKCE,
   * and clears the container cookie afterwards.
   * An error is thrown if the code_verifier is missing or invalid.
   */
  use: useCookie("pkce", "pkceCodeVerifier"),
};
var STATE_MAX_AGE = 60 * 15;
var encodedStateSalt = "encodedState";
var state = {
  /** Creates a state cookie with an optionally encoded body. */
  async create(options, origin2) {
    const { provider } = options;
    if (!provider.checks.includes("state")) {
      if (origin2) {
        throw new InvalidCheck(
          "State data was provided but the provider is not configured to use state",
        );
      }
      return;
    }
    const payload = {
      origin: origin2,
      random: generateRandomState(),
    };
    const value = await encode4({
      secret: options.jwt.secret,
      token: payload,
      salt: encodedStateSalt,
      maxAge: STATE_MAX_AGE,
    });
    const cookie = await sealCookie("state", value, options);
    return { cookie, value };
  },
  /**
   * Returns state if the provider is configured to use state,
   * and clears the container cookie afterwards.
   * An error is thrown if the state is missing or invalid.
   */
  use: useCookie("state", "state"),
  /** Decodes the state. If it could not be decoded, it throws an error. */
  async decode(state2, options) {
    try {
      options.logger.debug("DECODE_STATE", { state: state2 });
      const payload = await decode3({
        secret: options.jwt.secret,
        token: state2,
        salt: encodedStateSalt,
      });
      if (payload) return payload;
      throw new Error("Invalid state");
    } catch (error) {
      throw new InvalidCheck("State could not be decoded", { cause: error });
    }
  },
};
var nonce = {
  async create(options) {
    if (!options.provider.checks.includes("nonce")) return;
    const value = generateRandomNonce();
    const cookie = await sealCookie("nonce", value, options);
    return { cookie, value };
  },
  /**
   * Returns nonce if the provider is configured to use nonce,
   * and clears the container cookie afterwards.
   * An error is thrown if the nonce is missing or invalid.
   * @see https://openid.net/specs/openid-connect-core-1_0.html#NonceNotes
   * @see https://danielfett.de/2020/05/16/pkce-vs-nonce-equivalent-or-not/#nonce
   */
  use: useCookie("nonce", "nonce"),
};
var WEBAUTHN_CHALLENGE_MAX_AGE = 60 * 15;
var webauthnChallengeSalt = "encodedWebauthnChallenge";
var webauthnChallenge = {
  async create(options, challenge, registerData) {
    return {
      cookie: await sealCookie(
        "webauthnChallenge",
        await encode4({
          secret: options.jwt.secret,
          token: { challenge, registerData },
          salt: webauthnChallengeSalt,
          maxAge: WEBAUTHN_CHALLENGE_MAX_AGE,
        }),
        options,
      ),
    };
  },
  /** Returns WebAuthn challenge if present. */
  async use(options, cookies2, resCookies) {
    const cookieValue = cookies2?.[options.cookies.webauthnChallenge.name];
    const parsed = await parseCookie3(
      "webauthnChallenge",
      cookieValue,
      options,
    );
    const payload = await decode3({
      secret: options.jwt.secret,
      token: parsed,
      salt: webauthnChallengeSalt,
    });
    clearCookie("webauthnChallenge", options, resCookies);
    if (!payload) throw new InvalidCheck("WebAuthn challenge was missing");
    return payload;
  },
};

// ../../../../node_modules/@auth/core/lib/actions/callback/oauth/callback.js
function formUrlEncode(token) {
  return encodeURIComponent(token).replace(/%20/g, "+");
}
function clientSecretBasic(clientId, clientSecret) {
  const username = formUrlEncode(clientId);
  const password = formUrlEncode(clientSecret);
  const credentials = btoa(`${username}:${password}`);
  return `Basic ${credentials}`;
}
async function handleOAuth(params, cookies2, options) {
  const { logger: logger2, provider } = options;
  let as;
  const { token, userinfo } = provider;
  if (
    (!token?.url || token.url.host === "authjs.dev") &&
    (!userinfo?.url || userinfo.url.host === "authjs.dev")
  ) {
    const issuer = new URL(provider.issuer);
    const discoveryResponse = await discoveryRequest(issuer, {
      [allowInsecureRequests]: true,
      [customFetch2]: provider[customFetch],
    });
    as = await processDiscoveryResponse(issuer, discoveryResponse);
    if (!as.token_endpoint)
      throw new TypeError(
        "TODO: Authorization server did not provide a token endpoint.",
      );
    if (!as.userinfo_endpoint)
      throw new TypeError(
        "TODO: Authorization server did not provide a userinfo endpoint.",
      );
  } else {
    as = {
      issuer: provider.issuer ?? "https://authjs.dev",
      // TODO: review fallback issuer
      token_endpoint: token?.url.toString(),
      userinfo_endpoint: userinfo?.url.toString(),
    };
  }
  const client = {
    client_id: provider.clientId,
    ...provider.client,
  };
  let clientAuth;
  switch (client.token_endpoint_auth_method) {
    case void 0:
    case "client_secret_basic":
      clientAuth = (_as, _client, _body, headers2) => {
        headers2.set(
          "authorization",
          clientSecretBasic(provider.clientId, provider.clientSecret),
        );
      };
      break;
    case "client_secret_post":
      clientAuth = ClientSecretPost(provider.clientSecret);
      break;
    case "client_secret_jwt":
      clientAuth = ClientSecretJwt(provider.clientSecret);
      break;
    case "private_key_jwt":
      clientAuth = PrivateKeyJwt(provider.token.clientPrivateKey, {
        // TODO: review in the next breaking change
        [modifyAssertion](_header2, payload) {
          payload.aud = [as.issuer, as.token_endpoint];
        },
      });
      break;
    case "none":
      clientAuth = None();
      break;
    default:
      throw new Error("unsupported client authentication method");
  }
  const resCookies = [];
  const state2 = await state.use(cookies2, resCookies, options);
  let codeGrantParams;
  try {
    codeGrantParams = validateAuthResponse(
      as,
      client,
      new URLSearchParams(params),
      provider.checks.includes("state") ? state2 : skipStateCheck,
    );
  } catch (err) {
    if (err instanceof AuthorizationResponseError) {
      const cause = {
        providerId: provider.id,
        ...Object.fromEntries(err.cause.entries()),
      };
      logger2.debug("OAuthCallbackError", cause);
      throw new OAuthCallbackError("OAuth Provider returned an error", cause);
    }
    throw err;
  }
  const codeVerifier = await pkce.use(cookies2, resCookies, options);
  let redirect_uri = provider.callbackUrl;
  if (!options.isOnRedirectProxy && provider.redirectProxyUrl) {
    redirect_uri = provider.redirectProxyUrl;
  }
  let codeGrantResponse = await authorizationCodeGrantRequest(
    as,
    client,
    clientAuth,
    codeGrantParams,
    redirect_uri,
    codeVerifier ?? "decoy",
    {
      // TODO: move away from allowing insecure HTTP requests
      [allowInsecureRequests]: true,
      [customFetch2]: (...args) => {
        if (!provider.checks.includes("pkce")) {
          args[1].body.delete("code_verifier");
        }
        return (provider[customFetch] ?? fetch)(...args);
      },
    },
  );
  if (provider.token?.conform) {
    codeGrantResponse =
      (await provider.token.conform(codeGrantResponse.clone())) ??
      codeGrantResponse;
  }
  let profile = {};
  const requireIdToken = isOIDCProvider(provider);
  if (provider[conformInternal]) {
    switch (provider.id) {
      case "microsoft-entra-id":
      case "azure-ad": {
        const responseJson = await codeGrantResponse.clone().json();
        if (responseJson.error) {
          const cause = {
            providerId: provider.id,
            ...responseJson,
          };
          throw new OAuthCallbackError(
            `OAuth Provider returned an error: ${responseJson.error}`,
            cause,
          );
        }
        const { tid } = decodeJwt(responseJson.id_token);
        if (typeof tid === "string") {
          const tenantRe = /microsoftonline\.com\/(\w+)\/v2\.0/;
          const tenantId = as.issuer?.match(tenantRe)?.[1] ?? "common";
          const issuer = new URL(as.issuer.replace(tenantId, tid));
          const discoveryResponse = await discoveryRequest(issuer, {
            [customFetch2]: provider[customFetch],
          });
          as = await processDiscoveryResponse(issuer, discoveryResponse);
        }
        break;
      }
      default:
        break;
    }
  }
  const processedCodeResponse = await processAuthorizationCodeResponse(
    as,
    client,
    codeGrantResponse,
    {
      expectedNonce: await nonce.use(cookies2, resCookies, options),
      requireIdToken,
    },
  );
  const tokens = processedCodeResponse;
  if (requireIdToken) {
    const idTokenClaims2 = getValidatedIdTokenClaims(processedCodeResponse);
    profile = idTokenClaims2;
    if (provider[conformInternal] && provider.id === "apple") {
      try {
        profile.user = JSON.parse(params?.user);
      } catch {}
    }
    if (provider.idToken === false) {
      const userinfoResponse = await userInfoRequest(
        as,
        client,
        processedCodeResponse.access_token,
        {
          [customFetch2]: provider[customFetch],
          // TODO: move away from allowing insecure HTTP requests
          [allowInsecureRequests]: true,
        },
      );
      profile = await processUserInfoResponse(
        as,
        client,
        idTokenClaims2.sub,
        userinfoResponse,
      );
    }
  } else {
    if (userinfo?.request) {
      const _profile = await userinfo.request({ tokens, provider });
      if (_profile instanceof Object) profile = _profile;
    } else if (userinfo?.url) {
      const userinfoResponse = await userInfoRequest(
        as,
        client,
        processedCodeResponse.access_token,
        {
          [customFetch2]: provider[customFetch],
          // TODO: move away from allowing insecure HTTP requests
          [allowInsecureRequests]: true,
        },
      );
      profile = await userinfoResponse.json();
    } else {
      throw new TypeError("No userinfo endpoint configured");
    }
  }
  if (tokens.expires_in) {
    tokens.expires_at =
      Math.floor(Date.now() / 1e3) + Number(tokens.expires_in);
  }
  const profileResult = await getUserAndAccount(
    profile,
    provider,
    tokens,
    logger2,
  );
  return { ...profileResult, profile, cookies: resCookies };
}
async function getUserAndAccount(OAuthProfile, provider, tokens, logger2) {
  try {
    const userFromProfile = await provider.profile(OAuthProfile, tokens);
    const user = {
      ...userFromProfile,
      // The user's id is intentionally not set based on the profile id, as
      // the user should remain independent of the provider and the profile id
      // is saved on the Account already, as `providerAccountId`.
      id: crypto.randomUUID(),
      email: userFromProfile.email?.toLowerCase(),
    };
    return {
      user,
      account: {
        ...tokens,
        provider: provider.id,
        type: provider.type,
        providerAccountId: userFromProfile.id ?? crypto.randomUUID(),
      },
    };
  } catch (e2) {
    logger2.debug("getProfile error details", OAuthProfile);
    logger2.error(new OAuthProfileParseError(e2, { provider: provider.id }));
  }
}

// ../../../../node_modules/@auth/core/lib/utils/webauthn-utils.js
function inferWebAuthnOptions(action, loggedIn, userInfoResponse) {
  const { user, exists = false } = userInfoResponse ?? {};
  switch (action) {
    case "authenticate": {
      return "authenticate";
    }
    case "register": {
      if (user && loggedIn === exists) return "register";
      break;
    }
    case void 0: {
      if (!loggedIn) {
        if (user) {
          if (exists) {
            return "authenticate";
          } else {
            return "register";
          }
        } else {
          return "authenticate";
        }
      }
      break;
    }
  }
  return null;
}
async function getRegistrationResponse(options, request, user, resCookies) {
  const regOptions = await getRegistrationOptions(options, request, user);
  const { cookie } = await webauthnChallenge.create(
    options,
    regOptions.challenge,
    user,
  );
  return {
    status: 200,
    cookies: [...(resCookies ?? []), cookie],
    body: {
      action: "register",
      options: regOptions,
    },
    headers: {
      "Content-Type": "application/json",
    },
  };
}
async function getAuthenticationResponse(options, request, user, resCookies) {
  const authOptions = await getAuthenticationOptions(options, request, user);
  const { cookie } = await webauthnChallenge.create(
    options,
    authOptions.challenge,
  );
  return {
    status: 200,
    cookies: [...(resCookies ?? []), cookie],
    body: {
      action: "authenticate",
      options: authOptions,
    },
    headers: {
      "Content-Type": "application/json",
    },
  };
}
async function verifyAuthenticate(options, request, resCookies) {
  const { adapter, provider } = options;
  const data =
    request.body && typeof request.body.data === "string"
      ? JSON.parse(request.body.data)
      : void 0;
  if (
    !data ||
    typeof data !== "object" ||
    !("id" in data) ||
    typeof data.id !== "string"
  ) {
    throw new AuthError("Invalid WebAuthn Authentication response");
  }
  const credentialID = toBase64(fromBase64(data.id));
  const authenticator = await adapter.getAuthenticator(credentialID);
  if (!authenticator) {
    throw new AuthError(
      `WebAuthn authenticator not found in database: ${JSON.stringify({
        credentialID,
      })}`,
    );
  }
  const { challenge: expectedChallenge } = await webauthnChallenge.use(
    options,
    request.cookies,
    resCookies,
  );
  let verification;
  try {
    const relayingParty = provider.getRelayingParty(options, request);
    verification = await provider.simpleWebAuthn.verifyAuthenticationResponse({
      ...provider.verifyAuthenticationOptions,
      expectedChallenge,
      response: data,
      authenticator: fromAdapterAuthenticator(authenticator),
      expectedOrigin: relayingParty.origin,
      expectedRPID: relayingParty.id,
    });
  } catch (e2) {
    throw new WebAuthnVerificationError(e2);
  }
  const { verified, authenticationInfo } = verification;
  if (!verified) {
    throw new WebAuthnVerificationError(
      "WebAuthn authentication response could not be verified",
    );
  }
  try {
    const { newCounter } = authenticationInfo;
    await adapter.updateAuthenticatorCounter(
      authenticator.credentialID,
      newCounter,
    );
  } catch (e2) {
    throw new AdapterError(
      `Failed to update authenticator counter. This may cause future authentication attempts to fail. ${JSON.stringify(
        {
          credentialID,
          oldCounter: authenticator.counter,
          newCounter: authenticationInfo.newCounter,
        },
      )}`,
      e2,
    );
  }
  const account = await adapter.getAccount(
    authenticator.providerAccountId,
    provider.id,
  );
  if (!account) {
    throw new AuthError(
      `WebAuthn account not found in database: ${JSON.stringify({
        credentialID,
        providerAccountId: authenticator.providerAccountId,
      })}`,
    );
  }
  const user = await adapter.getUser(account.userId);
  if (!user) {
    throw new AuthError(
      `WebAuthn user not found in database: ${JSON.stringify({
        credentialID,
        providerAccountId: authenticator.providerAccountId,
        userID: account.userId,
      })}`,
    );
  }
  return {
    account,
    user,
  };
}
async function verifyRegister(options, request, resCookies) {
  const { provider } = options;
  const data =
    request.body && typeof request.body.data === "string"
      ? JSON.parse(request.body.data)
      : void 0;
  if (
    !data ||
    typeof data !== "object" ||
    !("id" in data) ||
    typeof data.id !== "string"
  ) {
    throw new AuthError("Invalid WebAuthn Registration response");
  }
  const { challenge: expectedChallenge, registerData: user } =
    await webauthnChallenge.use(options, request.cookies, resCookies);
  if (!user) {
    throw new AuthError(
      "Missing user registration data in WebAuthn challenge cookie",
    );
  }
  let verification;
  try {
    const relayingParty = provider.getRelayingParty(options, request);
    verification = await provider.simpleWebAuthn.verifyRegistrationResponse({
      ...provider.verifyRegistrationOptions,
      expectedChallenge,
      response: data,
      expectedOrigin: relayingParty.origin,
      expectedRPID: relayingParty.id,
    });
  } catch (e2) {
    throw new WebAuthnVerificationError(e2);
  }
  if (!verification.verified || !verification.registrationInfo) {
    throw new WebAuthnVerificationError(
      "WebAuthn registration response could not be verified",
    );
  }
  const account = {
    providerAccountId: toBase64(verification.registrationInfo.credentialID),
    provider: options.provider.id,
    type: provider.type,
  };
  const authenticator = {
    providerAccountId: account.providerAccountId,
    counter: verification.registrationInfo.counter,
    credentialID: toBase64(verification.registrationInfo.credentialID),
    credentialPublicKey: toBase64(
      verification.registrationInfo.credentialPublicKey,
    ),
    credentialBackedUp: verification.registrationInfo.credentialBackedUp,
    credentialDeviceType: verification.registrationInfo.credentialDeviceType,
    transports: transportsToString(data.response.transports),
  };
  return {
    user,
    account,
    authenticator,
  };
}
async function getAuthenticationOptions(options, request, user) {
  const { provider, adapter } = options;
  const authenticators =
    user && user["id"]
      ? await adapter.listAuthenticatorsByUserId(user.id)
      : null;
  const relayingParty = provider.getRelayingParty(options, request);
  return await provider.simpleWebAuthn.generateAuthenticationOptions({
    ...provider.authenticationOptions,
    rpID: relayingParty.id,
    allowCredentials: authenticators?.map((a3) => ({
      id: fromBase64(a3.credentialID),
      type: "public-key",
      transports: stringToTransports(a3.transports),
    })),
  });
}
async function getRegistrationOptions(options, request, user) {
  const { provider, adapter } = options;
  const authenticators = user["id"]
    ? await adapter.listAuthenticatorsByUserId(user.id)
    : null;
  const userID = randomString(32);
  const relayingParty = provider.getRelayingParty(options, request);
  return await provider.simpleWebAuthn.generateRegistrationOptions({
    ...provider.registrationOptions,
    userID,
    userName: user.email,
    userDisplayName: user.name ?? void 0,
    rpID: relayingParty.id,
    rpName: relayingParty.name,
    excludeCredentials: authenticators?.map((a3) => ({
      id: fromBase64(a3.credentialID),
      type: "public-key",
      transports: stringToTransports(a3.transports),
    })),
  });
}
function assertInternalOptionsWebAuthn(options) {
  const { provider, adapter } = options;
  if (!adapter)
    throw new MissingAdapter(
      "An adapter is required for the WebAuthn provider",
    );
  if (!provider || provider.type !== "webauthn") {
    throw new InvalidProvider("Provider must be WebAuthn");
  }
  return { ...options, provider, adapter };
}
function fromAdapterAuthenticator(authenticator) {
  return {
    ...authenticator,
    credentialDeviceType: authenticator.credentialDeviceType,
    transports: stringToTransports(authenticator.transports),
    credentialID: fromBase64(authenticator.credentialID),
    credentialPublicKey: fromBase64(authenticator.credentialPublicKey),
  };
}
function fromBase64(base64) {
  return new Uint8Array(Buffer.from(base64, "base64"));
}
function toBase64(bytes) {
  return Buffer.from(bytes).toString("base64");
}
function transportsToString(transports) {
  return transports?.join(",");
}
function stringToTransports(tstring) {
  return tstring ? tstring.split(",") : void 0;
}

// ../../../../node_modules/@auth/core/lib/actions/callback/index.js
async function callback(request, options, sessionStore, cookies2) {
  if (!options.provider)
    throw new InvalidProvider("Callback route called without provider");
  const { query, body, method, headers: headers2 } = request;
  const {
    provider,
    adapter,
    url,
    callbackUrl,
    pages,
    jwt,
    events,
    callbacks,
    session: { strategy: sessionStrategy, maxAge: sessionMaxAge },
    logger: logger2,
  } = options;
  const useJwtSession = sessionStrategy === "jwt";
  try {
    if (provider.type === "oauth" || provider.type === "oidc") {
      const params =
        provider.authorization?.url.searchParams.get("response_mode") ===
        "form_post"
          ? body
          : query;
      if (options.isOnRedirectProxy && params?.state) {
        const parsedState = await state.decode(params.state, options);
        const shouldRedirect =
          parsedState?.origin &&
          new URL(parsedState.origin).origin !== options.url.origin;
        if (shouldRedirect) {
          const proxyRedirect = `${parsedState.origin}?${new URLSearchParams(params)}`;
          logger2.debug("Proxy redirecting to", proxyRedirect);
          return { redirect: proxyRedirect, cookies: cookies2 };
        }
      }
      const authorizationResult = await handleOAuth(
        params,
        request.cookies,
        options,
      );
      if (authorizationResult.cookies.length) {
        cookies2.push(...authorizationResult.cookies);
      }
      logger2.debug("authorization result", authorizationResult);
      const {
        user: userFromProvider,
        account,
        profile: OAuthProfile,
      } = authorizationResult;
      if (!userFromProvider || !account || !OAuthProfile) {
        return { redirect: `${url}/signin`, cookies: cookies2 };
      }
      let userByAccount;
      if (adapter) {
        const { getUserByAccount } = adapter;
        userByAccount = await getUserByAccount({
          providerAccountId: account.providerAccountId,
          provider: provider.id,
        });
      }
      const redirect2 = await handleAuthorized(
        {
          user: userByAccount ?? userFromProvider,
          account,
          profile: OAuthProfile,
        },
        options,
      );
      if (redirect2) return { redirect: redirect2, cookies: cookies2 };
      const {
        user,
        session: session2,
        isNewUser,
      } = await handleLoginOrRegister(
        sessionStore.value,
        userFromProvider,
        account,
        options,
      );
      if (useJwtSession) {
        const defaultToken = {
          name: user.name,
          email: user.email,
          picture: user.image,
          sub: user.id?.toString(),
        };
        const token = await callbacks.jwt({
          token: defaultToken,
          user,
          account,
          profile: OAuthProfile,
          isNewUser,
          trigger: isNewUser ? "signUp" : "signIn",
        });
        if (token === null) {
          cookies2.push(...sessionStore.clean());
        } else {
          const salt = options.cookies.sessionToken.name;
          const newToken = await jwt.encode({ ...jwt, token, salt });
          const cookieExpires = /* @__PURE__ */ new Date();
          cookieExpires.setTime(cookieExpires.getTime() + sessionMaxAge * 1e3);
          const sessionCookies = sessionStore.chunk(newToken, {
            expires: cookieExpires,
          });
          cookies2.push(...sessionCookies);
        }
      } else {
        cookies2.push({
          name: options.cookies.sessionToken.name,
          value: session2.sessionToken,
          options: {
            ...options.cookies.sessionToken.options,
            expires: session2.expires,
          },
        });
      }
      await events.signIn?.({
        user,
        account,
        profile: OAuthProfile,
        isNewUser,
      });
      if (isNewUser && pages.newUser) {
        return {
          redirect: `${pages.newUser}${pages.newUser.includes("?") ? "&" : "?"}${new URLSearchParams({ callbackUrl })}`,
          cookies: cookies2,
        };
      }
      return { redirect: callbackUrl, cookies: cookies2 };
    } else if (provider.type === "email") {
      const paramToken = query?.token;
      const paramIdentifier = query?.email;
      if (!paramToken) {
        const e2 = new TypeError(
          "Missing token. The sign-in URL was manually opened without token or the link was not sent correctly in the email.",
          { cause: { hasToken: !!paramToken } },
        );
        e2.name = "Configuration";
        throw e2;
      }
      const secret = provider.secret ?? options.secret;
      const invite = await adapter.useVerificationToken({
        // @ts-expect-error User-land adapters might decide to omit the identifier during lookup
        identifier: paramIdentifier,
        // TODO: Drop this requirement for lookup in official adapters too
        token: await createHash(`${paramToken}${secret}`),
      });
      const hasInvite = !!invite;
      const expired = hasInvite && invite.expires.valueOf() < Date.now();
      const invalidInvite =
        !hasInvite ||
        expired || // The user might have configured the link to not contain the identifier
        // so we only compare if it exists
        (paramIdentifier && invite.identifier !== paramIdentifier);
      if (invalidInvite) throw new Verification({ hasInvite, expired });
      const { identifier } = invite;
      const user = (await adapter.getUserByEmail(identifier)) ?? {
        id: crypto.randomUUID(),
        email: identifier,
        emailVerified: null,
      };
      const account = {
        providerAccountId: user.email,
        userId: user.id,
        type: "email",
        provider: provider.id,
      };
      const redirect2 = await handleAuthorized({ user, account }, options);
      if (redirect2) return { redirect: redirect2, cookies: cookies2 };
      const {
        user: loggedInUser,
        session: session2,
        isNewUser,
      } = await handleLoginOrRegister(
        sessionStore.value,
        user,
        account,
        options,
      );
      if (useJwtSession) {
        const defaultToken = {
          name: loggedInUser.name,
          email: loggedInUser.email,
          picture: loggedInUser.image,
          sub: loggedInUser.id?.toString(),
        };
        const token = await callbacks.jwt({
          token: defaultToken,
          user: loggedInUser,
          account,
          isNewUser,
          trigger: isNewUser ? "signUp" : "signIn",
        });
        if (token === null) {
          cookies2.push(...sessionStore.clean());
        } else {
          const salt = options.cookies.sessionToken.name;
          const newToken = await jwt.encode({ ...jwt, token, salt });
          const cookieExpires = /* @__PURE__ */ new Date();
          cookieExpires.setTime(cookieExpires.getTime() + sessionMaxAge * 1e3);
          const sessionCookies = sessionStore.chunk(newToken, {
            expires: cookieExpires,
          });
          cookies2.push(...sessionCookies);
        }
      } else {
        cookies2.push({
          name: options.cookies.sessionToken.name,
          value: session2.sessionToken,
          options: {
            ...options.cookies.sessionToken.options,
            expires: session2.expires,
          },
        });
      }
      await events.signIn?.({ user: loggedInUser, account, isNewUser });
      if (isNewUser && pages.newUser) {
        return {
          redirect: `${pages.newUser}${pages.newUser.includes("?") ? "&" : "?"}${new URLSearchParams({ callbackUrl })}`,
          cookies: cookies2,
        };
      }
      return { redirect: callbackUrl, cookies: cookies2 };
    } else if (provider.type === "credentials" && method === "POST") {
      const credentials = body ?? {};
      Object.entries(query ?? {}).forEach(([k3, v2]) =>
        url.searchParams.set(k3, v2),
      );
      const userFromAuthorize = await provider.authorize(
        credentials,
        // prettier-ignore
        new Request(url, { headers: headers2, method, body: JSON.stringify(body) }),
      );
      const user = userFromAuthorize;
      if (!user) throw new CredentialsSignin();
      else user.id = user.id?.toString() ?? crypto.randomUUID();
      const account = {
        providerAccountId: user.id,
        type: "credentials",
        provider: provider.id,
      };
      const redirect2 = await handleAuthorized(
        { user, account, credentials },
        options,
      );
      if (redirect2) return { redirect: redirect2, cookies: cookies2 };
      const defaultToken = {
        name: user.name,
        email: user.email,
        picture: user.image,
        sub: user.id,
      };
      const token = await callbacks.jwt({
        token: defaultToken,
        user,
        account,
        isNewUser: false,
        trigger: "signIn",
      });
      if (token === null) {
        cookies2.push(...sessionStore.clean());
      } else {
        const salt = options.cookies.sessionToken.name;
        const newToken = await jwt.encode({ ...jwt, token, salt });
        const cookieExpires = /* @__PURE__ */ new Date();
        cookieExpires.setTime(cookieExpires.getTime() + sessionMaxAge * 1e3);
        const sessionCookies = sessionStore.chunk(newToken, {
          expires: cookieExpires,
        });
        cookies2.push(...sessionCookies);
      }
      await events.signIn?.({ user, account });
      return { redirect: callbackUrl, cookies: cookies2 };
    } else if (provider.type === "webauthn" && method === "POST") {
      const action = request.body?.action;
      if (
        typeof action !== "string" ||
        (action !== "authenticate" && action !== "register")
      ) {
        throw new AuthError("Invalid action parameter");
      }
      const localOptions = assertInternalOptionsWebAuthn(options);
      let user;
      let account;
      let authenticator;
      switch (action) {
        case "authenticate": {
          const verified = await verifyAuthenticate(
            localOptions,
            request,
            cookies2,
          );
          user = verified.user;
          account = verified.account;
          break;
        }
        case "register": {
          const verified = await verifyRegister(options, request, cookies2);
          user = verified.user;
          account = verified.account;
          authenticator = verified.authenticator;
          break;
        }
      }
      await handleAuthorized({ user, account }, options);
      const {
        user: loggedInUser,
        isNewUser,
        session: session2,
        account: currentAccount,
      } = await handleLoginOrRegister(
        sessionStore.value,
        user,
        account,
        options,
      );
      if (!currentAccount) {
        throw new AuthError("Error creating or finding account");
      }
      if (authenticator && loggedInUser.id) {
        await localOptions.adapter.createAuthenticator({
          ...authenticator,
          userId: loggedInUser.id,
        });
      }
      if (useJwtSession) {
        const defaultToken = {
          name: loggedInUser.name,
          email: loggedInUser.email,
          picture: loggedInUser.image,
          sub: loggedInUser.id?.toString(),
        };
        const token = await callbacks.jwt({
          token: defaultToken,
          user: loggedInUser,
          account: currentAccount,
          isNewUser,
          trigger: isNewUser ? "signUp" : "signIn",
        });
        if (token === null) {
          cookies2.push(...sessionStore.clean());
        } else {
          const salt = options.cookies.sessionToken.name;
          const newToken = await jwt.encode({ ...jwt, token, salt });
          const cookieExpires = /* @__PURE__ */ new Date();
          cookieExpires.setTime(cookieExpires.getTime() + sessionMaxAge * 1e3);
          const sessionCookies = sessionStore.chunk(newToken, {
            expires: cookieExpires,
          });
          cookies2.push(...sessionCookies);
        }
      } else {
        cookies2.push({
          name: options.cookies.sessionToken.name,
          value: session2.sessionToken,
          options: {
            ...options.cookies.sessionToken.options,
            expires: session2.expires,
          },
        });
      }
      await events.signIn?.({
        user: loggedInUser,
        account: currentAccount,
        isNewUser,
      });
      if (isNewUser && pages.newUser) {
        return {
          redirect: `${pages.newUser}${pages.newUser.includes("?") ? "&" : "?"}${new URLSearchParams({ callbackUrl })}`,
          cookies: cookies2,
        };
      }
      return { redirect: callbackUrl, cookies: cookies2 };
    }
    throw new InvalidProvider(
      `Callback for provider type (${provider.type}) is not supported`,
    );
  } catch (e2) {
    if (e2 instanceof AuthError) throw e2;
    const error = new CallbackRouteError(e2, { provider: provider.id });
    logger2.debug("callback route error details", { method, query, body });
    throw error;
  }
}
async function handleAuthorized(params, config) {
  let authorized;
  const { signIn: signIn4, redirect: redirect2 } = config.callbacks;
  try {
    authorized = await signIn4(params);
  } catch (e2) {
    if (e2 instanceof AuthError) throw e2;
    throw new AccessDenied(e2);
  }
  if (!authorized) throw new AccessDenied("AccessDenied");
  if (typeof authorized !== "string") return;
  return await redirect2({ url: authorized, baseUrl: config.url.origin });
}

// ../../../../node_modules/@auth/core/lib/actions/session.js
async function session(options, sessionStore, cookies2, isUpdate, newSession) {
  const {
    adapter,
    jwt,
    events,
    callbacks,
    logger: logger2,
    session: { strategy: sessionStrategy, maxAge: sessionMaxAge },
  } = options;
  const response = {
    body: null,
    headers: {
      "Content-Type": "application/json",
      ...(!isUpdate && {
        "Cache-Control": "private, no-cache, no-store",
        Expires: "0",
        Pragma: "no-cache",
      }),
    },
    cookies: cookies2,
  };
  const sessionToken = sessionStore.value;
  if (!sessionToken) return response;
  if (sessionStrategy === "jwt") {
    try {
      const salt = options.cookies.sessionToken.name;
      const payload = await jwt.decode({ ...jwt, token: sessionToken, salt });
      if (!payload) throw new Error("Invalid JWT");
      const token = await callbacks.jwt({
        token: payload,
        ...(isUpdate && { trigger: "update" }),
        session: newSession,
      });
      const newExpires = fromDate(sessionMaxAge);
      if (token !== null) {
        const session2 = {
          user: { name: token.name, email: token.email, image: token.picture },
          expires: newExpires.toISOString(),
        };
        const newSession2 = await callbacks.session({
          session: session2,
          token,
        });
        response.body = newSession2;
        const newToken = await jwt.encode({ ...jwt, token, salt });
        const sessionCookies = sessionStore.chunk(newToken, {
          expires: newExpires,
        });
        response.cookies?.push(...sessionCookies);
        await events.session?.({ session: newSession2, token });
      } else {
        response.cookies?.push(...sessionStore.clean());
      }
    } catch (e2) {
      logger2.error(new JWTSessionError(e2));
      response.cookies?.push(...sessionStore.clean());
    }
    return response;
  }
  try {
    const { getSessionAndUser, deleteSession, updateSession } = adapter;
    let userAndSession = await getSessionAndUser(sessionToken);
    if (
      userAndSession &&
      userAndSession.session.expires.valueOf() < Date.now()
    ) {
      await deleteSession(sessionToken);
      userAndSession = null;
    }
    if (userAndSession) {
      const { user, session: session2 } = userAndSession;
      const sessionUpdateAge = options.session.updateAge;
      const sessionIsDueToBeUpdatedDate =
        session2.expires.valueOf() -
        sessionMaxAge * 1e3 +
        sessionUpdateAge * 1e3;
      const newExpires = fromDate(sessionMaxAge);
      if (sessionIsDueToBeUpdatedDate <= Date.now()) {
        await updateSession({
          sessionToken,
          expires: newExpires,
        });
      }
      const sessionPayload = await callbacks.session({
        // TODO: user already passed below,
        // remove from session object in https://github.com/nextauthjs/next-auth/pull/9702
        // @ts-expect-error
        session: { ...session2, user },
        user,
        newSession,
        ...(isUpdate ? { trigger: "update" } : {}),
      });
      response.body = sessionPayload;
      response.cookies?.push({
        name: options.cookies.sessionToken.name,
        value: sessionToken,
        options: {
          ...options.cookies.sessionToken.options,
          expires: newExpires,
        },
      });
      await events.session?.({ session: sessionPayload });
    } else if (sessionToken) {
      response.cookies?.push(...sessionStore.clean());
    }
  } catch (e2) {
    logger2.error(new SessionTokenError(e2));
  }
  return response;
}

// ../../../../node_modules/@auth/core/lib/actions/signin/authorization-url.js
async function getAuthorizationUrl(query, options) {
  const { logger: logger2, provider } = options;
  let url = provider.authorization?.url;
  let as;
  if (!url || url.host === "authjs.dev") {
    const issuer = new URL(provider.issuer);
    const discoveryResponse = await discoveryRequest(issuer, {
      [customFetch2]: provider[customFetch],
      // TODO: move away from allowing insecure HTTP requests
      [allowInsecureRequests]: true,
    });
    const as2 = await processDiscoveryResponse(issuer, discoveryResponse).catch(
      (error) => {
        if (!(error instanceof TypeError) || error.message !== "Invalid URL")
          throw error;
        throw new TypeError(
          `Discovery request responded with an invalid issuer. expected: ${issuer}`,
        );
      },
    );
    if (!as2.authorization_endpoint) {
      throw new TypeError(
        "Authorization server did not provide an authorization endpoint.",
      );
    }
    url = new URL(as2.authorization_endpoint);
  }
  const authParams = url.searchParams;
  let redirect_uri = provider.callbackUrl;
  let data;
  if (!options.isOnRedirectProxy && provider.redirectProxyUrl) {
    redirect_uri = provider.redirectProxyUrl;
    data = provider.callbackUrl;
    logger2.debug("using redirect proxy", { redirect_uri, data });
  }
  const params = Object.assign(
    {
      response_type: "code",
      // clientId can technically be undefined, should we check this in assert.ts or rely on the Authorization Server to do it?
      client_id: provider.clientId,
      redirect_uri,
      // @ts-expect-error TODO:
      ...provider.authorization?.params,
    },
    Object.fromEntries(provider.authorization?.url.searchParams ?? []),
    query,
  );
  for (const k3 in params) authParams.set(k3, params[k3]);
  const cookies2 = [];
  if (
    // Otherwise "POST /redirect_uri" wouldn't include the cookies
    provider.authorization?.url.searchParams.get("response_mode") ===
    "form_post"
  ) {
    options.cookies.state.options.sameSite = "none";
    options.cookies.state.options.secure = true;
    options.cookies.nonce.options.sameSite = "none";
    options.cookies.nonce.options.secure = true;
  }
  const state2 = await state.create(options, data);
  if (state2) {
    authParams.set("state", state2.value);
    cookies2.push(state2.cookie);
  }
  if (provider.checks?.includes("pkce")) {
    if (as && !as.code_challenge_methods_supported?.includes("S256")) {
      if (provider.type === "oidc") provider.checks = ["nonce"];
    } else {
      const { value, cookie } = await pkce.create(options);
      authParams.set("code_challenge", value);
      authParams.set("code_challenge_method", "S256");
      cookies2.push(cookie);
    }
  }
  const nonce2 = await nonce.create(options);
  if (nonce2) {
    authParams.set("nonce", nonce2.value);
    cookies2.push(nonce2.cookie);
  }
  if (provider.type === "oidc" && !url.searchParams.has("scope")) {
    url.searchParams.set("scope", "openid profile email");
  }
  logger2.debug("authorization url is ready", {
    url,
    cookies: cookies2,
    provider,
  });
  return { redirect: url.toString(), cookies: cookies2 };
}

// ../../../../node_modules/@auth/core/lib/actions/signin/send-token.js
async function sendToken(request, options) {
  const { body } = request;
  const { provider, callbacks, adapter } = options;
  const normalizer = provider.normalizeIdentifier ?? defaultNormalizer;
  const email = normalizer(body?.email);
  const defaultUser = { id: crypto.randomUUID(), email, emailVerified: null };
  const user = (await adapter.getUserByEmail(email)) ?? defaultUser;
  const account = {
    providerAccountId: email,
    userId: user.id,
    type: "email",
    provider: provider.id,
  };
  let authorized;
  try {
    authorized = await callbacks.signIn({
      user,
      account,
      email: { verificationRequest: true },
    });
  } catch (e2) {
    throw new AccessDenied(e2);
  }
  if (!authorized) throw new AccessDenied("AccessDenied");
  if (typeof authorized === "string") {
    return {
      redirect: await callbacks.redirect({
        url: authorized,
        baseUrl: options.url.origin,
      }),
    };
  }
  const { callbackUrl, theme } = options;
  const token =
    (await provider.generateVerificationToken?.()) ?? randomString(32);
  const ONE_DAY_IN_SECONDS = 86400;
  const expires = new Date(
    Date.now() + (provider.maxAge ?? ONE_DAY_IN_SECONDS) * 1e3,
  );
  const secret = provider.secret ?? options.secret;
  const baseUrl = new URL(options.basePath, options.url.origin);
  const sendRequest = provider.sendVerificationRequest({
    identifier: email,
    token,
    expires,
    url: `${baseUrl}/callback/${provider.id}?${new URLSearchParams({
      callbackUrl,
      token,
      email,
    })}`,
    provider,
    theme,
    request: toRequest(request),
  });
  const createToken = adapter.createVerificationToken?.({
    identifier: email,
    token: await createHash(`${token}${secret}`),
    expires,
  });
  await Promise.all([sendRequest, createToken]);
  return {
    redirect: `${baseUrl}/verify-request?${new URLSearchParams({
      provider: provider.id,
      type: provider.type,
    })}`,
  };
}
function defaultNormalizer(email) {
  if (!email) throw new Error("Missing email from request body.");
  let [local, domain] = email.toLowerCase().trim().split("@");
  domain = domain.split(",")[0];
  return `${local}@${domain}`;
}

// ../../../../node_modules/@auth/core/lib/actions/signin/index.js
async function signIn(request, cookies2, options) {
  const signInUrl = `${options.url.origin}${options.basePath}/signin`;
  if (!options.provider) return { redirect: signInUrl, cookies: cookies2 };
  switch (options.provider.type) {
    case "oauth":
    case "oidc": {
      const { redirect: redirect2, cookies: authCookies } =
        await getAuthorizationUrl(request.query, options);
      if (authCookies) cookies2.push(...authCookies);
      return { redirect: redirect2, cookies: cookies2 };
    }
    case "email": {
      const response = await sendToken(request, options);
      return { ...response, cookies: cookies2 };
    }
    default:
      return { redirect: signInUrl, cookies: cookies2 };
  }
}

// ../../../../node_modules/@auth/core/lib/actions/signout.js
async function signOut2(cookies2, sessionStore, options) {
  const {
    jwt,
    events,
    callbackUrl: redirect2,
    logger: logger2,
    session: session2,
  } = options;
  const sessionToken = sessionStore.value;
  if (!sessionToken) return { redirect: redirect2, cookies: cookies2 };
  try {
    if (session2.strategy === "jwt") {
      const salt = options.cookies.sessionToken.name;
      const token = await jwt.decode({ ...jwt, token: sessionToken, salt });
      await events.signOut?.({ token });
    } else {
      const session3 = await options.adapter?.deleteSession(sessionToken);
      await events.signOut?.({ session: session3 });
    }
  } catch (e2) {
    logger2.error(new SignOutError(e2));
  }
  cookies2.push(...sessionStore.clean());
  return { redirect: redirect2, cookies: cookies2 };
}

// ../../../../node_modules/@auth/core/lib/utils/session.js
async function getLoggedInUser(options, sessionStore) {
  const {
    adapter,
    jwt,
    session: { strategy: sessionStrategy },
  } = options;
  const sessionToken = sessionStore.value;
  if (!sessionToken) return null;
  if (sessionStrategy === "jwt") {
    const salt = options.cookies.sessionToken.name;
    const payload = await jwt.decode({ ...jwt, token: sessionToken, salt });
    if (payload && payload.sub) {
      return {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        image: payload.picture,
      };
    }
  } else {
    const userAndSession = await adapter?.getSessionAndUser(sessionToken);
    if (userAndSession) {
      return userAndSession.user;
    }
  }
  return null;
}

// ../../../../node_modules/@auth/core/lib/actions/webauthn-options.js
async function webAuthnOptions(request, options, sessionStore, cookies2) {
  const narrowOptions = assertInternalOptionsWebAuthn(options);
  const { provider } = narrowOptions;
  const { action } = request.query ?? {};
  if (
    action !== "register" &&
    action !== "authenticate" &&
    typeof action !== "undefined"
  ) {
    return {
      status: 400,
      body: { error: "Invalid action" },
      cookies: cookies2,
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
  const sessionUser = await getLoggedInUser(options, sessionStore);
  const getUserInfoResponse = sessionUser
    ? {
        user: sessionUser,
        exists: true,
      }
    : await provider.getUserInfo(options, request);
  const userInfo = getUserInfoResponse?.user;
  const decision = inferWebAuthnOptions(
    action,
    !!sessionUser,
    getUserInfoResponse,
  );
  switch (decision) {
    case "authenticate":
      return getAuthenticationResponse(
        narrowOptions,
        request,
        userInfo,
        cookies2,
      );
    case "register":
      if (typeof userInfo?.email === "string") {
        return getRegistrationResponse(
          narrowOptions,
          request,
          userInfo,
          cookies2,
        );
      }
      break;
    default:
      return {
        status: 400,
        body: { error: "Invalid request" },
        cookies: cookies2,
        headers: {
          "Content-Type": "application/json",
        },
      };
  }
}

// ../../../../node_modules/@auth/core/lib/index.js
async function AuthInternal(request, authOptions) {
  const { action, providerId, error, method } = request;
  const csrfDisabled = authOptions.skipCSRFCheck === skipCSRFCheck;
  const { options, cookies: cookies2 } = await init({
    authOptions,
    action,
    providerId,
    url: request.url,
    callbackUrl: request.body?.callbackUrl ?? request.query?.callbackUrl,
    csrfToken: request.body?.csrfToken,
    cookies: request.cookies,
    isPost: method === "POST",
    csrfDisabled,
  });
  const sessionStore = new SessionStore(
    options.cookies.sessionToken,
    request.cookies,
    options.logger,
  );
  if (method === "GET") {
    const render = renderPage({
      ...options,
      query: request.query,
      cookies: cookies2,
    });
    switch (action) {
      case "callback":
        return await callback(request, options, sessionStore, cookies2);
      case "csrf":
        return render.csrf(csrfDisabled, options, cookies2);
      case "error":
        return render.error(error);
      case "providers":
        return render.providers(options.providers);
      case "session":
        return await session(options, sessionStore, cookies2);
      case "signin":
        return render.signin(providerId, error);
      case "signout":
        return render.signout();
      case "verify-request":
        return render.verifyRequest();
      case "webauthn-options":
        return await webAuthnOptions(request, options, sessionStore, cookies2);
      default:
    }
  } else {
    const { csrfTokenVerified } = options;
    switch (action) {
      case "callback":
        if (options.provider.type === "credentials")
          validateCSRF(action, csrfTokenVerified);
        return await callback(request, options, sessionStore, cookies2);
      case "session":
        validateCSRF(action, csrfTokenVerified);
        return await session(
          options,
          sessionStore,
          cookies2,
          true,
          request.body?.data,
        );
      case "signin":
        validateCSRF(action, csrfTokenVerified);
        return await signIn(request, cookies2, options);
      case "signout":
        validateCSRF(action, csrfTokenVerified);
        return await signOut2(cookies2, sessionStore, options);
      default:
    }
  }
  throw new UnknownAction(`Cannot handle action: ${action}`);
}

// ../../../../node_modules/@auth/core/lib/utils/env.js
function setEnvDefaults(envObject, config, suppressBasePathWarning = false) {
  try {
    const url = envObject.AUTH_URL;
    if (url) {
      if (config.basePath) {
        if (!suppressBasePathWarning) {
          const logger2 = setLogger(config);
          logger2.warn("env-url-basepath-redundant");
        }
      } else {
        config.basePath = new URL(url).pathname;
      }
    }
  } catch {
  } finally {
    config.basePath ?? (config.basePath = `/auth`);
  }
  if (!config.secret?.length) {
    config.secret = [];
    const secret = envObject.AUTH_SECRET;
    if (secret) config.secret.push(secret);
    for (const i4 of [1, 2, 3]) {
      const secret2 = envObject[`AUTH_SECRET_${i4}`];
      if (secret2) config.secret.unshift(secret2);
    }
  }
  config.redirectProxyUrl ??
    (config.redirectProxyUrl = envObject.AUTH_REDIRECT_PROXY_URL);
  config.trustHost ??
    (config.trustHost = !!(
      envObject.AUTH_URL ??
      envObject.AUTH_TRUST_HOST ??
      envObject.VERCEL ??
      envObject.CF_PAGES ??
      envObject.NODE_ENV !== "production"
    ));
  config.providers = config.providers.map((provider) => {
    const { id } = typeof provider === "function" ? provider({}) : provider;
    const ID = id.toUpperCase().replace(/-/g, "_");
    const clientId = envObject[`AUTH_${ID}_ID`];
    const clientSecret = envObject[`AUTH_${ID}_SECRET`];
    const issuer = envObject[`AUTH_${ID}_ISSUER`];
    const apiKey = envObject[`AUTH_${ID}_KEY`];
    const finalProvider =
      typeof provider === "function"
        ? provider({ clientId, clientSecret, issuer, apiKey })
        : provider;
    if (finalProvider.type === "oauth" || finalProvider.type === "oidc") {
      finalProvider.clientId ?? (finalProvider.clientId = clientId);
      finalProvider.clientSecret ?? (finalProvider.clientSecret = clientSecret);
      finalProvider.issuer ?? (finalProvider.issuer = issuer);
    } else if (finalProvider.type === "email") {
      finalProvider.apiKey ?? (finalProvider.apiKey = apiKey);
    }
    return finalProvider;
  });
}
function createActionURL(action, protocol, headers2, envObject, config) {
  const basePath = config?.basePath;
  const envUrl = envObject.AUTH_URL ?? envObject.NEXTAUTH_URL;
  let url;
  if (envUrl) {
    url = new URL(envUrl);
    if (basePath && basePath !== "/" && url.pathname !== "/") {
      if (url.pathname !== basePath) {
        const logger2 = setLogger(config);
        logger2.warn("env-url-basepath-mismatch");
      }
      url.pathname = "/";
    }
  } else {
    const detectedHost =
      headers2.get("x-forwarded-host") ?? headers2.get("host");
    const detectedProtocol =
      headers2.get("x-forwarded-proto") ?? protocol ?? "https";
    const _protocol = detectedProtocol.endsWith(":")
      ? detectedProtocol
      : detectedProtocol + ":";
    url = new URL(`${_protocol}//${detectedHost}`);
  }
  const sanitizedUrl = url.toString().replace(/\/$/, "");
  if (basePath) {
    const sanitizedBasePath = basePath?.replace(/(^\/|\/$)/g, "") ?? "";
    return new URL(`${sanitizedUrl}/${sanitizedBasePath}/${action}`);
  }
  return new URL(`${sanitizedUrl}/${action}`);
}

// ../../../../node_modules/@auth/core/index.js
async function Auth(request, config) {
  const logger2 = setLogger(config);
  const internalRequest = await toInternalRequest(request, config);
  if (!internalRequest) return Response.json(`Bad request.`, { status: 400 });
  const warningsOrError = assertConfig(internalRequest, config);
  if (Array.isArray(warningsOrError)) {
    warningsOrError.forEach(logger2.warn);
  } else if (warningsOrError) {
    logger2.error(warningsOrError);
    const htmlPages = /* @__PURE__ */ new Set([
      "signin",
      "signout",
      "error",
      "verify-request",
    ]);
    if (
      !htmlPages.has(internalRequest.action) ||
      internalRequest.method !== "GET"
    ) {
      const message2 =
        "There was a problem with the server configuration. Check the server logs for more information.";
      return Response.json({ message: message2 }, { status: 500 });
    }
    const { pages, theme } = config;
    const authOnErrorPage =
      pages?.error &&
      internalRequest.url.searchParams
        .get("callbackUrl")
        ?.startsWith(pages.error);
    if (!pages?.error || authOnErrorPage) {
      if (authOnErrorPage) {
        logger2.error(
          new ErrorPageLoop(
            `The error page ${pages?.error} should not require authentication`,
          ),
        );
      }
      const page = renderPage({ theme }).error("Configuration");
      return toResponse(page);
    }
    const url = `${internalRequest.url.origin}${pages.error}?error=Configuration`;
    return Response.redirect(url);
  }
  const isRedirect = request.headers?.has("X-Auth-Return-Redirect");
  const isRaw = config.raw === raw;
  try {
    const internalResponse = await AuthInternal(internalRequest, config);
    if (isRaw) return internalResponse;
    const response = toResponse(internalResponse);
    const url = response.headers.get("Location");
    if (!isRedirect || !url) return response;
    return Response.json({ url }, { headers: response.headers });
  } catch (e2) {
    const error = e2;
    logger2.error(error);
    const isAuthError = error instanceof AuthError;
    if (isAuthError && isRaw && !isRedirect) throw error;
    if (request.method === "POST" && internalRequest.action === "session")
      return Response.json(null, { status: 400 });
    const isClientSafeErrorType = isClientError(error);
    const type = isClientSafeErrorType ? error.type : "Configuration";
    const params = new URLSearchParams({ error: type });
    if (error instanceof CredentialsSignin) params.set("code", error.code);
    const pageKind = (isAuthError && error.kind) || "error";
    const pagePath =
      config.pages?.[pageKind] ??
      `${config.basePath}/${pageKind.toLowerCase()}`;
    const url = `${internalRequest.url.origin}${pagePath}?${params}`;
    if (isRedirect) return Response.json({ url });
    return Response.redirect(url);
  }
}

// ../../../../node_modules/next-auth/lib/env.js
var import_server = __toESM(require_server(), 1);
function reqWithEnvURL(req) {
  const url = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;
  if (!url) return req;
  const { origin: envOrigin } = new URL(url);
  const { href, origin: origin2 } = req.nextUrl;
  return new import_server.NextRequest(href.replace(origin2, envOrigin), req);
}
function setEnvDefaults2(config) {
  try {
    config.secret ??
      (config.secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET);
    const url = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;
    if (!url) return;
    const { pathname } = new URL(url);
    if (pathname === "/") return;
    config.basePath || (config.basePath = pathname);
  } catch {
  } finally {
    config.basePath || (config.basePath = "/api/auth");
    setEnvDefaults(process.env, config, true);
  }
}

// ../../../../node_modules/next-auth/lib/index.js
var import_headers = __toESM(require_headers3(), 1);
var import_server2 = __toESM(require_server(), 1);
async function getSession2(headers2, config) {
  const url = createActionURL(
    "session",
    // @ts-expect-error `x-forwarded-proto` is not nullable, next.js sets it by default
    headers2.get("x-forwarded-proto"),
    headers2,
    process.env,
    config,
  );
  const request = new Request(url, {
    headers: { cookie: headers2.get("cookie") ?? "" },
  });
  return Auth(request, {
    ...config,
    callbacks: {
      ...config.callbacks,
      // Since we are server-side, we don't need to filter out the session data
      // See https://authjs.dev/getting-started/migrating-to-v5#authenticating-server-side
      // TODO: Taint the session data to prevent accidental leakage to the client
      // https://react.dev/reference/react/experimental_taintObjectReference
      async session(...args) {
        const session2 =
          // If the user defined a custom session callback, use that instead
          (await config.callbacks?.session?.(...args)) ?? {
            ...args[0].session,
            expires:
              args[0].session.expires?.toISOString?.() ??
              args[0].session.expires,
          };
        const user = args[0].user ?? args[0].token;
        return { user, ...session2 };
      },
    },
  });
}
function isReqWrapper(arg) {
  return typeof arg === "function";
}
function initAuth(config, onLazyLoad) {
  if (typeof config === "function") {
    return async (...args) => {
      if (!args.length) {
        const _headers = await (0, import_headers.headers)();
        const _config2 = await config(void 0);
        onLazyLoad?.(_config2);
        return getSession2(_headers, _config2).then((r3) => r3.json());
      }
      if (args[0] instanceof Request) {
        const req = args[0];
        const ev = args[1];
        const _config2 = await config(req);
        onLazyLoad?.(_config2);
        return handleAuth([req, ev], _config2);
      }
      if (isReqWrapper(args[0])) {
        const userMiddlewareOrRoute = args[0];
        return async (...args2) => {
          const _config2 = await config(args2[0]);
          onLazyLoad?.(_config2);
          return handleAuth(args2, _config2, userMiddlewareOrRoute);
        };
      }
      const request = "req" in args[0] ? args[0].req : args[0];
      const response = "res" in args[0] ? args[0].res : args[1];
      const _config = await config(request);
      onLazyLoad?.(_config);
      return getSession2(new Headers(request.headers), _config).then(
        async (authResponse) => {
          const auth2 = await authResponse.json();
          for (const cookie of authResponse.headers.getSetCookie())
            if ("headers" in response)
              response.headers.append("set-cookie", cookie);
            else response.appendHeader("set-cookie", cookie);
          return auth2;
        },
      );
    };
  }
  return (...args) => {
    if (!args.length) {
      return Promise.resolve((0, import_headers.headers)()).then((h3) =>
        getSession2(h3, config).then((r3) => r3.json()),
      );
    }
    if (args[0] instanceof Request) {
      const req = args[0];
      const ev = args[1];
      return handleAuth([req, ev], config);
    }
    if (isReqWrapper(args[0])) {
      const userMiddlewareOrRoute = args[0];
      return async (...args2) => {
        return handleAuth(args2, config, userMiddlewareOrRoute).then((res) => {
          return res;
        });
      };
    }
    const request = "req" in args[0] ? args[0].req : args[0];
    const response = "res" in args[0] ? args[0].res : args[1];
    return getSession2(
      // @ts-expect-error
      new Headers(request.headers),
      config,
    ).then(async (authResponse) => {
      const auth2 = await authResponse.json();
      for (const cookie of authResponse.headers.getSetCookie())
        if ("headers" in response)
          response.headers.append("set-cookie", cookie);
        else response.appendHeader("set-cookie", cookie);
      return auth2;
    });
  };
}
async function handleAuth(args, config, userMiddlewareOrRoute) {
  const request = reqWithEnvURL(args[0]);
  const sessionResponse = await getSession2(request.headers, config);
  const auth2 = await sessionResponse.json();
  let authorized = true;
  if (config.callbacks?.authorized) {
    authorized = await config.callbacks.authorized({ request, auth: auth2 });
  }
  let response = import_server2.NextResponse.next?.();
  if (authorized instanceof Response) {
    response = authorized;
    const redirect2 = authorized.headers.get("Location");
    const { pathname } = request.nextUrl;
    if (
      redirect2 &&
      isSameAuthAction(pathname, new URL(redirect2).pathname, config)
    ) {
      authorized = true;
    }
  } else if (userMiddlewareOrRoute) {
    const augmentedReq = request;
    augmentedReq.auth = auth2;
    response =
      (await userMiddlewareOrRoute(augmentedReq, args[1])) ??
      import_server2.NextResponse.next();
  } else if (!authorized) {
    const signInPage = config.pages?.signIn ?? `${config.basePath}/signin`;
    if (request.nextUrl.pathname !== signInPage) {
      const signInUrl = request.nextUrl.clone();
      signInUrl.pathname = signInPage;
      signInUrl.searchParams.set("callbackUrl", request.nextUrl.href);
      response = import_server2.NextResponse.redirect(signInUrl);
    }
  }
  const finalResponse = new Response(response?.body, response);
  for (const cookie of sessionResponse.headers.getSetCookie())
    finalResponse.headers.append("set-cookie", cookie);
  return finalResponse;
}
function isSameAuthAction(requestPath, redirectPath, config) {
  const action = redirectPath.replace(`${requestPath}/`, "");
  const pages = Object.values(config.pages ?? {});
  return (
    (actions2.has(action) || pages.includes(redirectPath)) &&
    redirectPath === requestPath
  );
}
var actions2 = /* @__PURE__ */ new Set([
  "providers",
  "session",
  "csrf",
  "signin",
  "signout",
  "callback",
  "verify-request",
  "error",
]);

// ../../../../node_modules/next-auth/lib/actions.js
var import_headers2 = __toESM(require_headers3(), 1);
var import_navigation = __toESM(require_navigation2(), 1);
async function signIn2(provider, options = {}, authorizationParams, config) {
  const headers2 = new Headers(await (0, import_headers2.headers)());
  const {
    redirect: shouldRedirect = true,
    redirectTo,
    ...rest
  } = options instanceof FormData ? Object.fromEntries(options) : options;
  const callbackUrl = redirectTo?.toString() ?? headers2.get("Referer") ?? "/";
  const signInURL = createActionURL(
    "signin",
    // @ts-expect-error `x-forwarded-proto` is not nullable, next.js sets it by default
    headers2.get("x-forwarded-proto"),
    headers2,
    process.env,
    config,
  );
  if (!provider) {
    signInURL.searchParams.append("callbackUrl", callbackUrl);
    if (shouldRedirect) (0, import_navigation.redirect)(signInURL.toString());
    return signInURL.toString();
  }
  let url = `${signInURL}/${provider}?${new URLSearchParams(authorizationParams)}`;
  let foundProvider = {};
  for (const providerConfig of config.providers) {
    const { options: options2, ...defaults2 } =
      typeof providerConfig === "function" ? providerConfig() : providerConfig;
    const id = options2?.id ?? defaults2.id;
    if (id === provider) {
      foundProvider = {
        id,
        type: options2?.type ?? defaults2.type,
      };
      break;
    }
  }
  if (!foundProvider.id) {
    const url2 = `${signInURL}?${new URLSearchParams({ callbackUrl })}`;
    if (shouldRedirect) (0, import_navigation.redirect)(url2);
    return url2;
  }
  if (foundProvider.type === "credentials") {
    url = url.replace("signin", "callback");
  }
  headers2.set("Content-Type", "application/x-www-form-urlencoded");
  const body = new URLSearchParams({ ...rest, callbackUrl });
  const req = new Request(url, { method: "POST", headers: headers2, body });
  const res = await Auth(req, { ...config, raw, skipCSRFCheck });
  const cookieJar = await (0, import_headers2.cookies)();
  for (const c3 of res?.cookies ?? [])
    cookieJar.set(c3.name, c3.value, c3.options);
  const responseUrl =
    res instanceof Response ? res.headers.get("Location") : res.redirect;
  const redirectUrl = responseUrl ?? url;
  if (shouldRedirect) return (0, import_navigation.redirect)(redirectUrl);
  return redirectUrl;
}
async function signOut3(options, config) {
  const headers2 = new Headers(await (0, import_headers2.headers)());
  headers2.set("Content-Type", "application/x-www-form-urlencoded");
  const url = createActionURL(
    "signout",
    // @ts-expect-error `x-forwarded-proto` is not nullable, next.js sets it by default
    headers2.get("x-forwarded-proto"),
    headers2,
    process.env,
    config,
  );
  const callbackUrl = options?.redirectTo ?? headers2.get("Referer") ?? "/";
  const body = new URLSearchParams({ callbackUrl });
  const req = new Request(url, { method: "POST", headers: headers2, body });
  const res = await Auth(req, { ...config, raw, skipCSRFCheck });
  const cookieJar = await (0, import_headers2.cookies)();
  for (const c3 of res?.cookies ?? [])
    cookieJar.set(c3.name, c3.value, c3.options);
  if (options?.redirect ?? true)
    return (0, import_navigation.redirect)(res.redirect);
  return res;
}
async function update(data, config) {
  const headers2 = new Headers(await (0, import_headers2.headers)());
  headers2.set("Content-Type", "application/json");
  const url = createActionURL(
    "session",
    // @ts-expect-error `x-forwarded-proto` is not nullable, next.js sets it by default
    headers2.get("x-forwarded-proto"),
    headers2,
    process.env,
    config,
  );
  const body = JSON.stringify({ data });
  const req = new Request(url, { method: "POST", headers: headers2, body });
  const res = await Auth(req, { ...config, raw, skipCSRFCheck });
  const cookieJar = await (0, import_headers2.cookies)();
  for (const c3 of res?.cookies ?? [])
    cookieJar.set(c3.name, c3.value, c3.options);
  return res.body;
}

// ../../../../node_modules/next-auth/index.js
function NextAuth(config) {
  if (typeof config === "function") {
    const httpHandler2 = async (req) => {
      const _config = await config(req);
      setEnvDefaults2(_config);
      return Auth(reqWithEnvURL(req), _config);
    };
    return {
      handlers: { GET: httpHandler2, POST: httpHandler2 },
      // @ts-expect-error
      auth: initAuth(config, (c3) => setEnvDefaults2(c3)),
      signIn: async (provider, options, authorizationParams) => {
        const _config = await config(void 0);
        setEnvDefaults2(_config);
        return signIn2(provider, options, authorizationParams, _config);
      },
      signOut: async (options) => {
        const _config = await config(void 0);
        setEnvDefaults2(_config);
        return signOut3(options, _config);
      },
      unstable_update: async (data) => {
        const _config = await config(void 0);
        setEnvDefaults2(_config);
        return update(data, _config);
      },
    };
  }
  setEnvDefaults2(config);
  const httpHandler = (req) => Auth(reqWithEnvURL(req), config);
  return {
    handlers: { GET: httpHandler, POST: httpHandler },
    // @ts-expect-error
    auth: initAuth(config),
    signIn: (provider, options, authorizationParams) => {
      return signIn2(provider, options, authorizationParams, config);
    },
    signOut: (options) => {
      return signOut3(options, config);
    },
    unstable_update: (data) => {
      return update(data, config);
    },
  };
}

// ../../../../node_modules/@auth/core/providers/credentials.js
function Credentials(config) {
  return {
    id: "credentials",
    name: "Credentials",
    type: "credentials",
    credentials: {},
    authorize: () => null,
    // @ts-expect-error
    options: config,
  };
}

// ../../lib/api/diagnostic-client.ts
var diagnosticClient = axios_default.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});
diagnosticClient.interceptors.request.use(
  async (config) => {
    const session2 = await getSession();
    if (session2?.accessToken) {
      config.headers.Authorization = `Bearer ${session2.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ../../lib/api/auth-api.ts
function saveRefreshTokenBackup(refreshToken) {
  if (typeof window !== "undefined") {
    localStorage.setItem("debug_refresh_token", refreshToken);
    console.log("Debug: Saved refresh token backup");
  }
}

// ../../lib/auth.ts
var apiBaseUrl2 =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
var authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth: auth2, request: { nextUrl } }) {
      const isLoggedIn = !!auth2?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/(admin)");
      if (isAdminRoute) {
        if (isLoggedIn) return true;
        return false;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
        token.permissions = user.permissions;
        token.expiresAt = user.expiresAt;
        token.refreshRetryCount = 0;
      }
      if (
        token.error === "MaxRefreshAttemptsExceeded" ||
        token.error === "RefreshAccessTokenError" ||
        token.error === "NoRefreshToken"
      ) {
        console.log(
          "Token has permanent error, not attempting refresh:",
          token.error,
        );
        return token;
      }
      if (token.error === "InvalidRefreshToken") {
        const lastRefreshAttempt = Number(token.lastRefreshAttempt) || 0;
        const now4 = Math.floor(Date.now() / 1e3);
        const timeSinceLastAttempt = now4 - lastRefreshAttempt;
        if (timeSinceLastAttempt < 30) {
          console.log(
            `InvalidRefreshToken: waiting ${30 - timeSinceLastAttempt}s before retry`,
          );
          return token;
        }
        console.log("InvalidRefreshToken: retrying after backoff period");
        token.error = void 0;
      }
      const now3 = Math.floor(Date.now() / 1e3);
      if (
        token.expiresAt &&
        typeof token.expiresAt === "number" &&
        now3 < token.expiresAt
      ) {
        return token;
      }
      console.log("Access token expired, attempting refresh...");
      return refreshAccessToken(token);
    },
    async session({ session: session2, token }) {
      console.log("Session callback - token data:", {
        hasToken: !!token,
        hasAccessToken: !!token?.accessToken,
        hasError: !!token?.error,
        tokenError: token?.error,
      });
      if (token.error) {
        console.log("Token has error, returning minimal session:", token.error);
        return {
          ...session2,
          user: {
            ...session2.user,
            id: "",
            role: "",
            permissions: [],
          },
          accessToken: "",
          error: token.error,
        };
      }
      if (token && session2.user) {
        session2.user.id = token.id;
        session2.user.role = token.role;
        session2.user.permissions = token.permissions;
        session2.accessToken = token.accessToken;
        if (true) {
          session2.refreshToken = token.refreshToken;
        }
      }
      console.log("Session callback - final session:", {
        hasUser: !!session2.user,
        hasAccessToken: !!session2.accessToken,
        userId: session2.user?.id,
      });
      return session2;
    },
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const response = await fetch(`${apiBaseUrl2}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
          if (!response.ok) {
            console.error("Authentication failed:", await response.text());
            return null;
          }
          const data = await response.json();
          const user = {
            id: data.id || data.sub,
            name: data.name,
            email: data.email,
            role: data.role,
            permissions: data.permissions || [],
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            expiresAt: Math.floor(Date.now() / 1e3) + (data.expiresIn || 900),
          };
          return user;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
};
async function refreshAccessToken(token) {
  try {
    console.log("Refreshing token, API URL:", apiBaseUrl2);
    if (!token.refreshToken) {
      console.error("No refresh token available");
      return {
        ...token,
        error: "NoRefreshToken",
      };
    }
    if (true) {
      saveRefreshTokenBackup(token.refreshToken);
    }
    const retryCount = token.refreshRetryCount || 0;
    if (retryCount > 2) {
      console.error("Too many refresh attempts, aborting");
      return {
        ...token,
        error: "MaxRefreshAttemptsExceeded",
      };
    }
    console.log(`Refresh attempt ${retryCount + 1}/3`);
    const response = await fetch(`${apiBaseUrl2}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // The backend might be expecting Authorization header with the refresh token
        Authorization: `Bearer ${token.refreshToken}`,
      },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
      // Add credentials to ensure cookies are sent if they're being used
      credentials: "include",
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Failed to refresh token: ${response.status} ${response.statusText}`,
        errorText,
      );
      if (response.status === 401) {
        console.error("Refresh token details:", {
          tokenLength: token.refreshToken?.length,
          tokenPreview: token.refreshToken?.substring(0, 20) + "...",
          hasToken: !!token.refreshToken,
          retryCount,
          apiUrl: `${apiBaseUrl2}/auth/refresh`,
        });
      }
      if (response.status === 401) {
        console.error("Refresh token is invalid, marking as permanent error");
        return {
          ...token,
          error: "InvalidRefreshToken",
          lastRefreshAttempt: Math.floor(Date.now() / 1e3),
        };
      }
      return {
        ...token,
        refreshRetryCount: retryCount + 1,
        error: "RefreshAccessTokenError",
      };
    }
    const refreshedTokens = await response.json();
    console.log("Token refreshed successfully");
    if (refreshedTokens.refreshToken) {
      saveRefreshTokenBackup(refreshedTokens.refreshToken);
    }
    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
      expiresAt:
        Math.floor(Date.now() / 1e3) + (refreshedTokens.expiresIn || 900),
      refreshRetryCount: 0,
      // Reset retry count on success
      error: void 0,
      // Clear any previous errors
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    const retryCount = token.refreshRetryCount || 0;
    return {
      ...token,
      refreshRetryCount: retryCount + 1,
      error: "RefreshAccessTokenError",
    };
  }
}
var {
  auth,
  signIn: signIn3,
  signOut: signOut4,
  handlers,
} = NextAuth(authConfig);

// ../../lib/auth-utils.ts
async function handleTokenRefreshFailure(error, redirectToLogin = true) {
  console.error("Token refresh failed:", error);
  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname;
    if (currentPath.includes("/auth-diagnostics")) {
      console.log("On diagnostics page, not redirecting");
      return;
    }
  }
  await signOut({ redirect: false });
  if (redirectToLogin) {
    window.location.href = "/login?error=session_expired";
  }
}
function isTokenRefreshError(error) {
  if (!error) return false;
  if (typeof error === "string") {
    return (
      error.includes("refresh token") ||
      error.includes("RefreshAccessTokenError") ||
      error.includes("401") ||
      error.includes("Unauthorized")
    );
  }
  if (error.message) {
    return isTokenRefreshError(error.message);
  }
  return false;
}

// ../../lib/api/api-client.ts
var apiClient = axios_default.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});
var noRedirectPaths = [
  "/auth/check-token",
  "/auth/session-info",
  "/auth/cleanup-sessions",
];
function debugLog(operation, details) {
  console.group(`\u{1F310} API Client Debug: ${operation}`);
  console.log("Timestamp:", /* @__PURE__ */ new Date().toISOString());
  console.log("Details:", details);
  console.groupEnd();
}
apiClient.interceptors.request.use(
  async (config) => {
    debugLog("Request", {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: {
        ...config.headers,
        // Don't log the actual auth token for security
        Authorization: config.headers.Authorization ? "[REDACTED]" : void 0,
      },
      data: config.data,
    });
    const session2 = await getSession();
    debugLog("Session Check", {
      sessionExists: !!session2,
      sessionKeys: session2 ? Object.keys(session2) : [],
      hasAccessToken: !!session2?.accessToken,
      accessTokenLength: session2?.accessToken?.length,
      user: session2?.user
        ? {
            id: session2.user.id,
            email: session2.user.email,
            name: session2.user.name,
          }
        : null,
    });
    if (session2?.accessToken) {
      config.headers.Authorization = `Bearer ${session2.accessToken}`;
      debugLog("Auth Token Added", {
        hasToken: true,
        tokenLength: session2.accessToken.length,
        tokenPreview: session2.accessToken.substring(0, 20) + "...",
      });
    } else {
      debugLog("Auth Token Missing", {
        hasToken: false,
        sessionExists: !!session2,
        sessionData: session2
          ? {
              keys: Object.keys(session2),
              hasUser: !!session2.user,
              hasAccessToken: !!session2.accessToken,
            }
          : null,
      });
    }
    return config;
  },
  (error) => {
    debugLog("Request Error", {
      error: error.message,
      config: error.config,
    });
    return Promise.reject(error);
  },
);
apiClient.interceptors.response.use(
  (response) => {
    debugLog("Response Success", {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
      dataType: typeof response.data,
      dataLength: Array.isArray(response.data) ? response.data.length : void 0,
      headers: response.headers,
    });
    return response;
  },
  async (error) => {
    debugLog("Response Error", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      errorMessage: error.message,
      responseData: error.response?.data,
      responseHeaders: error.response?.headers,
    });
    const requestPath = error.config?.url;
    const shouldRedirect = !noRedirectPaths.some(
      (path) => requestPath && requestPath.includes(path),
    );
    if (
      error.response?.status === 401 &&
      isTokenRefreshError(error.response?.data) &&
      shouldRedirect
    ) {
      debugLog("Token Refresh Error", {
        shouldRedirect,
        requestPath,
        responseData: error.response?.data,
      });
      if (typeof window !== "undefined") {
        await handleTokenRefreshFailure(error);
      }
    }
    return Promise.reject(error);
  },
);

// ../../lib/plugin-api.ts
var PLUGIN_API_PATH = "/api/plugins";
function debugLog2(operation, details) {
  console.group(`\u{1F50C} Plugin API Debug: ${operation}`);
  console.log("Timestamp:", /* @__PURE__ */ new Date().toISOString());
  console.log("Details:", details);
  console.groupEnd();
}
function errorLog(operation, error, context) {
  console.group(`\u274C Plugin API Error: ${operation}`);
  console.log("Timestamp:", /* @__PURE__ */ new Date().toISOString());
  console.error("Error:", error);
  if (context) {
    console.log("Context:", context);
  }
  if (error.response) {
    console.log("Response Status:", error.response.status);
    console.log("Response Data:", error.response.data);
    console.log("Response Headers:", error.response.headers);
  }
  if (error.config) {
    console.log("Request Config:", {
      url: error.config.url,
      method: error.config.method,
      baseURL: error.config.baseURL,
      headers: error.config.headers,
    });
  }
  console.groupEnd();
}
async function updatePluginConfig(installedPluginId, config) {
  const operation = "updatePluginConfig";
  try {
    const endpoint = `${PLUGIN_API_PATH}/installed/${installedPluginId}/configure`;
    debugLog2(operation, {
      endpoint,
      method: "PATCH",
      installedPluginId,
      config,
      description: "Updating plugin configuration",
    });
    const response = await apiClient.patch(endpoint, config);
    debugLog2(`${operation} - Success`, {
      status: response.status,
      installedPluginId,
      data: response.data,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    errorLog(operation, error, {
      installedPluginId,
      config,
      endpoint: `${PLUGIN_API_PATH}/installed/${installedPluginId}/configure`,
    });
    return {
      success: false,
      data: null,
      error:
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred",
    };
  }
}

// components/admin-settings.tsx
function AdminSettingsComponent({ initialConfig, pluginId }) {
  const [config, setConfig] = useState4(initialConfig);
  const [isSaving, setIsSaving] = useState4(false);
  const [saved, setSaved] = useState4(false);
  const [error, setError] = useState4(null);
  const handleChange = (e2) => {
    const { name, value, type, checked } = e2.target;
    setConfig({
      ...config,
      [name]: type === "checkbox" ? checked : value,
    });
    setSaved(false);
  };
  const handleSubmit = async (e2) => {
    e2.preventDefault();
    setIsSaving(true);
    setError(null);
    setSaved(false);
    try {
      await updatePluginConfig(pluginId, config);
      setSaved(true);
    } catch (err) {
      console.error("Failed to save settings:", err);
      setError("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="apiKey"
          className="block text-sm font-medium text-gray-700"
        >
          Stripe API Key
        </label>
        <input
          id="apiKey"
          name="apiKey"
          type="text"
          placeholder="sk_test_..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={config.apiKey || ""}
          onChange={handleChange}
          disabled={isSaving}
          required
        />
        <p className="mt-1 text-xs text-gray-500">
          Your Stripe API key is used to process payments. You can find it in
          your Stripe dashboard.
        </p>
      </div>
      <div>
        <label
          htmlFor="webhookUrl"
          className="block text-sm font-medium text-gray-700"
        >
          Webhook URL
        </label>
        <input
          id="webhookUrl"
          name="webhookUrl"
          type="url"
          placeholder="https://..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={config.webhookUrl || ""}
          onChange={handleChange}
          disabled={isSaving}
        />
        <p className="mt-1 text-xs text-gray-500">
          Stripe will send payment events to this URL. Optional if you're only
          using client-side checkout.
        </p>
      </div>
      <div className="flex items-center">
        <input
          id="testMode"
          name="testMode"
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          checked={config.testMode || false}
          onChange={handleChange}
          disabled={isSaving}
        />
        <label htmlFor="testMode" className="ml-2 block text-sm text-gray-700">
          Test Mode
        </label>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {saved && (
        <div className="text-green-500 text-sm">
          Settings saved successfully!
        </div>
      )}
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}

// index.tsx
var TypedPaymentMethodComponent = registerExtensionPoint(
  ({ context, configuration, plugin }) => {
    const { cart } = context;
    const { apiKey, webhookUrl } = configuration;
    return (
      <PaymentMethodComponent
        apiKey={apiKey}
        webhookUrl={webhookUrl}
        amount={cart?.total || 0}
        currency={cart?.currency || "USD"}
        orderId={cart?.id}
        customerEmail={cart?.customer?.email}
        onSuccess={context.onSuccess}
      />
    );
  },
);
var TypedAdminSettingsComponent = registerExtensionPoint(
  ({ configuration, plugin }) => {
    return (
      <AdminSettingsComponent
        initialConfig={configuration}
        pluginId={plugin.id}
      />
    );
  },
);
var stripe_plugin_default = definePlugin({
  name: "Stripe Payment Gateway",
  version: "1.0.0",
  description: "Process credit card payments with Stripe",
  category: "payments",
  // Legacy format for backwards compatibility
  metadata: {
    author: "Ticket Platform, Inc.",
    priority: 100,
    // Higher priority will display before other payment methods
    displayName: "Credit Card (Stripe)",
  },
  // New format for the marketplace
  adminComponents: {
    settings: "./AdminSettingsComponent",
    eventCreation: null,
    dashboard: null,
  },
  storefrontComponents: {
    checkout: "./PaymentMethodComponent",
    eventDetail: null,
    ticketSelection: null,
    widgets: {
      sidebar: null,
      footer: "./CheckoutConfirmation",
    },
  },
  requiredPermissions: ["read:orders", "write:transactions"],
  extensionPoints: {
    // Register components for various extension points
    "payment-methods": TypedPaymentMethodComponent,
    "admin-settings": TypedAdminSettingsComponent,
    "checkout-confirmation": registerExtensionPoint(({ context }) => {
      const { paymentDetails } = context;
      if (paymentDetails?.provider !== "stripe") {
        return null;
      }
      return (
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <svg
            className="h-5 w-5 text-green-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>Payment processed by Stripe</span>
        </div>
      );
    }),
  },
});
export { stripe_plugin_default as default };
/*! Bundled license information:

@auth/core/lib/vendored/cookie.js:
  (**
   * @source https://github.com/jshttp/cookie
   * @author blakeembrey
   * @license MIT
   *)
*/
