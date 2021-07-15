type Constructor = new (...args: any[]) => {};

type Parameters<T> = T extends (...args: infer T) => any ? T : never;

class EventHandler<T extends { [key: string]: Function }> {
  listeners: { [key in keyof T]?: T[keyof T][] } = {};
  listen = <U extends keyof T>(type: U, eventHandler: T[U]) => {
    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type]?.push(eventHandler);
  };

  fire = <U extends keyof T>(type: U, ...params: Parameters<T[U]>) => {
    this.listeners[type]?.forEach((listener) => {
      listener(...params);
    });
  };

  unlisten = <U extends keyof T>(type: U, eventHandler: T[U]) => {
    this.listeners[type]?.forEach((listener) => listener !== eventHandler);
  };
}

export function withEventHandler<
  T extends { [key: string]: Function },
  TBase extends Constructor
>(Base: TBase) {
  return class extends Base {
    eventHandler = new EventHandler<T>();

    addEventListener = <U extends keyof T>(type: U, listener: T[U]) => {
      this.eventHandler.listen(type, listener);
    };

    removeEventListener = <U extends keyof T>(type: U, listener: T[U]) => {
      this.eventHandler.unlisten(type, listener);
    };
  };
}

export default EventHandler;
