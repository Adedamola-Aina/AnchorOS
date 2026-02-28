type ConsoleLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

interface ConsoleEntry {
  ts: string;
  level: ConsoleLevel;
  message: string;
}

interface ConsoleCaptureApi {
  getLogs: () => ConsoleEntry[];
  clear: () => void;
  exportText: () => string;
}

const STORAGE_KEY = 'anchor_staging_console_logs_v1';
const MAX_LOGS = 250;

declare global {
  interface Window {
    __ANCHOR_CONSOLE_CAPTURE__?: ConsoleCaptureApi;
  }
}

const serializeArg = (value: unknown): string => {
  if (value instanceof Error) return `${value.name}: ${value.message}`;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean' || value === null || value === undefined) {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return '[unserializable]';
  }
};

const loadLogs = (): ConsoleEntry[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ConsoleEntry[];
    return Array.isArray(parsed) ? parsed.slice(-MAX_LOGS) : [];
  } catch {
    return [];
  }
};

const saveLogs = (logs: ConsoleEntry[]): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(-MAX_LOGS)));
  } catch {
    // Best-effort only; do not block app
  }
};

export const initStagingConsoleCapture = (appEnv: string = __APP_ENV__): void => {
  if (appEnv !== 'staging') return;
  if (typeof window === 'undefined') return;
  if (window.__ANCHOR_CONSOLE_CAPTURE__) return;

  const original = {
    log: console.log.bind(console),
    info: console.info.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
    debug: console.debug.bind(console),
  } as const;

  let buffer = loadLogs();

  const push = (level: ConsoleLevel, args: unknown[]): void => {
    const entry: ConsoleEntry = {
      ts: new Date().toISOString(),
      level,
      message: args.map(serializeArg).join(' '),
    };
    buffer = [...buffer, entry].slice(-MAX_LOGS);
    saveLogs(buffer);
  };

  const wrap = (level: ConsoleLevel, fn: (...args: unknown[]) => void) => {
    return (...args: unknown[]) => {
      push(level, args);
      fn(...args);
    };
  };

  console.log = wrap('log', original.log);
  console.info = wrap('info', original.info);
  console.warn = wrap('warn', original.warn);
  console.error = wrap('error', original.error);
  console.debug = wrap('debug', original.debug);

  window.addEventListener('error', (event) => {
    push('error', [`window.error: ${event.message}`]);
  });

  window.addEventListener('unhandledrejection', (event) => {
    push('error', ['unhandledrejection', event.reason]);
  });

  window.__ANCHOR_CONSOLE_CAPTURE__ = {
    getLogs: () => [...buffer],
    clear: () => {
      buffer = [];
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Best-effort only
      }
    },
    exportText: () => JSON.stringify(buffer, null, 2),
  };

  original.info('[Anchor][staging] Console capture enabled. Use window.__ANCHOR_CONSOLE_CAPTURE__.getLogs()');
};
