
import '@testing-library/jest-dom';

// 1. Pure-JS Polyfill Shim for Next.js Fetch API
if (typeof global.Request === 'undefined') {
  global.Headers = class Headers {
    map: any = {};
    constructor(init: any) {
      if (init) Object.assign(this.map, init);
    }
    get(name: string) { return this.map[name.toLowerCase()] || null; }
    set(name: string, value: string) { this.map[name.toLowerCase()] = value; }
    has(name: string) { return name.toLowerCase() in this.map; }
    forEach(cb: any) { Object.keys(this.map).forEach(k => cb(this.map[k], k)); }
  } as any;

  global.Request = class Request {
    url: string;
    method: string;
    headers: any;
    bodyUsed: boolean = false;
    _body: any;
    constructor(input: any, init: any = {}) {
      this.url = typeof input === 'string' ? input : input.url;
      this.method = init.method || 'GET';
      this.headers = new global.Headers(init.headers);
      this._body = init.body;
    }
    async json() { 
      this.bodyUsed = true; 
      return typeof this._body === 'string' ? JSON.parse(this._body) : this._body; 
    }
    async text() { 
      this.bodyUsed = true; 
      return typeof this._body === 'string' ? this._body : JSON.stringify(this._body); 
    }
  } as any;

  global.Response = class Response {
    _body: any;
    status: number;
    headers: any;
    constructor(body: any, init: any = {}) {
      this._body = body;
      this.status = init.status || 200;
      this.headers = new global.Headers(init.headers);
    }
    async json() { return typeof this._body === 'string' ? JSON.parse(this._body) : this._body; }
    async text() { return typeof this._body === 'string' ? this._body : JSON.stringify(this._body); }
  } as any;
}

// 2. Global Mock for Upstash (ESM conflict resolution)
jest.mock('@upstash/ratelimit', () => ({
  Ratelimit: {
    slidingWindow: jest.fn().mockReturnValue({})
  }
}));

jest.mock('@upstash/redis', () => ({
  Redis: jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn()
  }))
}));

// 3. Global UI Mocks
if (typeof window !== 'undefined') {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
}

jest.mock('dompurify', () => ({
  sanitize: (val: string) => val
}));
