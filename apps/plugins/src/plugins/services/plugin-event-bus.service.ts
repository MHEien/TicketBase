import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';

@Injectable()
export class PluginEventBus {
  private eventEmitter = new EventEmitter();

  /**
   * Emit an event to all listeners
   * @param eventName The event name
   * @param payload The event payload
   * @param source The plugin ID that emitted the event
   */
  emit(eventName: string, payload: any, source: string): void {
    this.eventEmitter.emit(eventName, { payload, source });
  }

  /**
   * Listen for events
   * @param eventName The event name to listen for
   * @param handler The handler function
   */
  on(
    eventName: string,
    handler: (data: { payload: any; source: string }) => void,
  ): void {
    this.eventEmitter.on(eventName, handler);
  }

  /**
   * Stop listening for events
   * @param eventName The event name
   * @param handler The handler function to remove
   */
  off(
    eventName: string,
    handler: (data: { payload: any; source: string }) => void,
  ): void {
    this.eventEmitter.off(eventName, handler);
  }

  /**
   * Listen for an event once
   * @param eventName The event name to listen for
   * @param handler The handler function
   */
  once(
    eventName: string,
    handler: (data: { payload: any; source: string }) => void,
  ): void {
    this.eventEmitter.once(eventName, handler);
  }

  /**
   * Get all event names that are being listened to
   */
  getEventNames(): string[] {
    return this.eventEmitter.eventNames() as string[];
  }

  /**
   * Get the number of listeners for a specific event
   * @param eventName The event name
   */
  listenerCount(eventName: string): number {
    return this.eventEmitter.listenerCount(eventName);
  }
}
