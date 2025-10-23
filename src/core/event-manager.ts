/**
 * Event Manager - Manage timeline events
 */

import { TimelineEvent, EventGroup } from '../types';
import { toTimestamp } from '../utils';

/**
 * Event Manager
 */
export class EventManager {
  private events: Map<string, TimelineEvent> = new Map();
  private groups: Map<string, EventGroup> = new Map();
  private sortedEvents: TimelineEvent[] = [];

  /**
   * Initialize with events
   */
  constructor(events: TimelineEvent[] = [], groups: EventGroup[] = []) {
    events.forEach(event => this.addEvent(event));
    groups.forEach(group => this.addGroup(group));
  }

  /**
   * Add event
   */
  addEvent(event: TimelineEvent): void {
    // Normalize timestamp
    const normalizedEvent = {
      ...event,
      timestamp: toTimestamp(event.timestamp),
      endTime: event.endTime ? toTimestamp(event.endTime) : undefined,
    };

    this.events.set(event.id, normalizedEvent);
    this.updateSortedEvents();
  }

  /**
   * Remove event
   */
  removeEvent(eventId: string): boolean {
    const deleted = this.events.delete(eventId);
    if (deleted) {
      this.updateSortedEvents();
    }
    return deleted;
  }

  /**
   * Update event
   */
  updateEvent(eventId: string, updates: Partial<TimelineEvent>): boolean {
    const event = this.events.get(eventId);
    if (!event) return false;

    const updatedEvent = {
      ...event,
      ...updates,
      id: event.id, // Prevent ID change
      timestamp: updates.timestamp ? toTimestamp(updates.timestamp) : event.timestamp,
      endTime: updates.endTime ? toTimestamp(updates.endTime) : event.endTime,
    };

    this.events.set(eventId, updatedEvent);
    this.updateSortedEvents();
    return true;
  }

  /**
   * Get event by ID
   */
  getEvent(eventId: string): TimelineEvent | undefined {
    return this.events.get(eventId);
  }

  /**
   * Get all events
   */
  getEvents(): TimelineEvent[] {
    return Array.from(this.events.values());
  }

  /**
   * Get sorted events (by timestamp)
   */
  getSortedEvents(): TimelineEvent[] {
    return [...this.sortedEvents];
  }

  /**
   * Get visible events
   */
  getVisibleEvents(): TimelineEvent[] {
    return this.sortedEvents.filter(event => event.visible !== false);
  }

  /**
   * Filter events
   */
  filterEvents(predicate: (event: TimelineEvent) => boolean): TimelineEvent[] {
    return this.sortedEvents.filter(predicate);
  }

  /**
   * Get events by group
   */
  getEventsByGroup(groupId: string): TimelineEvent[] {
    return this.sortedEvents.filter(event => event.groupId === groupId);
  }

  /**
   * Get events in time range
   */
  getEventsInRange(startTime: number, endTime: number): TimelineEvent[] {
    return this.sortedEvents.filter(event => {
      const timestamp = toTimestamp(event.timestamp);
      const eventEndTime = event.endTime ? toTimestamp(event.endTime) : timestamp;

      return (
        (timestamp >= startTime && timestamp <= endTime) ||
        (eventEndTime >= startTime && eventEndTime <= endTime) ||
        (timestamp <= startTime && eventEndTime >= endTime)
      );
    });
  }

  /**
   * Search events by title or description
   */
  searchEvents(query: string): TimelineEvent[] {
    const lowerQuery = query.toLowerCase();
    return this.sortedEvents.filter(event => {
      const title = event.title?.toLowerCase() || '';
      const description = event.description?.toLowerCase() || '';
      return title.includes(lowerQuery) || description.includes(lowerQuery);
    });
  }

  /**
   * Get time range of all events
   */
  getTimeRange(): { min: number; max: number; range: number } {
    if (this.sortedEvents.length === 0) {
      return { min: 0, max: 0, range: 0 };
    }

    let min = Infinity;
    let max = -Infinity;

    for (const event of this.sortedEvents) {
      const timestamp = toTimestamp(event.timestamp);
      const endTime = event.endTime ? toTimestamp(event.endTime) : timestamp;

      min = Math.min(min, timestamp);
      max = Math.max(max, endTime);
    }

    return { min, max, range: max - min };
  }

  /**
   * Add group
   */
  addGroup(group: EventGroup): void {
    this.groups.set(group.id, group);
  }

  /**
   * Remove group
   */
  removeGroup(groupId: string): boolean {
    return this.groups.delete(groupId);
  }

  /**
   * Update group
   */
  updateGroup(groupId: string, updates: Partial<EventGroup>): boolean {
    const group = this.groups.get(groupId);
    if (!group) return false;

    this.groups.set(groupId, {
      ...group,
      ...updates,
      id: group.id, // Prevent ID change
    });
    return true;
  }

  /**
   * Get group by ID
   */
  getGroup(groupId: string): EventGroup | undefined {
    return this.groups.get(groupId);
  }

  /**
   * Get all groups
   */
  getGroups(): EventGroup[] {
    return Array.from(this.groups.values());
  }

  /**
   * Get visible groups
   */
  getVisibleGroups(): EventGroup[] {
    return Array.from(this.groups.values()).filter(group => group.visible !== false);
  }

  /**
   * Clear all events
   */
  clear(): void {
    this.events.clear();
    this.sortedEvents = [];
  }

  /**
   * Get event count
   */
  getEventCount(): number {
    return this.events.size;
  }

  /**
   * Check if has events
   */
  hasEvents(): boolean {
    return this.events.size > 0;
  }

  /**
   * Update sorted events
   */
  private updateSortedEvents(): void {
    this.sortedEvents = Array.from(this.events.values()).sort((a, b) => {
      const aTime = toTimestamp(a.timestamp);
      const bTime = toTimestamp(b.timestamp);
      return aTime - bTime;
    });
  }

  /**
   * Batch add events
   */
  batchAddEvents(events: TimelineEvent[]): void {
    events.forEach(event => {
      const normalizedEvent = {
        ...event,
        timestamp: toTimestamp(event.timestamp),
        endTime: event.endTime ? toTimestamp(event.endTime) : undefined,
      };
      this.events.set(event.id, normalizedEvent);
    });
    this.updateSortedEvents();
  }

  /**
   * Batch remove events
   */
  batchRemoveEvents(eventIds: string[]): void {
    let changed = false;
    eventIds.forEach(id => {
      if (this.events.delete(id)) {
        changed = true;
      }
    });
    if (changed) {
      this.updateSortedEvents();
    }
  }
}

