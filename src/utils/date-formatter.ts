/**
 * Date formatting utilities
 */

import { TimeScale } from '../types';

/**
 * Format date to string
 */
export function formatDate(date: Date | number, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  const d = typeof date === 'number' ? new Date(date) : date;

  const tokens: Record<string, string> = {
    YYYY: d.getFullYear().toString(),
    YY: d.getFullYear().toString().slice(-2),
    MM: String(d.getMonth() + 1).padStart(2, '0'),
    M: String(d.getMonth() + 1),
    DD: String(d.getDate()).padStart(2, '0'),
    D: String(d.getDate()),
    HH: String(d.getHours()).padStart(2, '0'),
    H: String(d.getHours()),
    mm: String(d.getMinutes()).padStart(2, '0'),
    m: String(d.getMinutes()),
    ss: String(d.getSeconds()).padStart(2, '0'),
    s: String(d.getSeconds()),
  };

  let result = format;
  for (const [token, value] of Object.entries(tokens)) {
    result = result.replace(token, value);
  }

  return result;
}

/**
 * Get relative time string
 */
export function getRelativeTime(date: Date | number, now: Date | number = new Date()): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  const n = typeof now === 'number' ? new Date(now) : now;

  const diff = n.getTime() - d.getTime();
  const seconds = Math.floor(Math.abs(diff) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  const isFuture = diff < 0;
  const suffix = isFuture ? '后' : '前';

  if (seconds < 60) return `${seconds}秒${suffix}`;
  if (minutes < 60) return `${minutes}分钟${suffix}`;
  if (hours < 24) return `${hours}小时${suffix}`;
  if (days < 30) return `${days}天${suffix}`;
  if (months < 12) return `${months}个月${suffix}`;
  return `${years}年${suffix}`;
}

/**
 * Get month name
 */
export function getMonthName(month: number, short: boolean = false): string {
  const months = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月',
  ];
  const shortMonths = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月',
  ];

  return short ? shortMonths[month] : months[month];
}

/**
 * Get day name
 */
export function getDayName(day: number, short: boolean = false): string {
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const shortDays = ['日', '一', '二', '三', '四', '五', '六'];

  return short ? shortDays[day] : days[day];
}

/**
 * Calculate time range
 */
export function getTimeRange(timestamps: number[]): { min: number; max: number; range: number } {
  if (timestamps.length === 0) {
    return { min: 0, max: 0, range: 0 };
  }

  const min = Math.min(...timestamps);
  const max = Math.max(...timestamps);
  const range = max - min;

  return { min, max, range };
}

/**
 * Get appropriate time scale for range
 */
export function getTimeScale(range: number): TimeScale {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;

  if (range < minute * 5) return TimeScale.SECOND;
  if (range < hour * 2) return TimeScale.MINUTE;
  if (range < day * 2) return TimeScale.HOUR;
  if (range < month * 2) return TimeScale.DAY;
  if (range < year * 2) return TimeScale.MONTH;
  return TimeScale.YEAR;
}

/**
 * Get scale format string
 */
export function getScaleFormat(scale: TimeScale): string {
  switch (scale) {
    case TimeScale.YEAR:
      return 'YYYY';
    case TimeScale.MONTH:
      return 'YYYY-MM';
    case TimeScale.DAY:
      return 'MM-DD';
    case TimeScale.HOUR:
      return 'HH:mm';
    case TimeScale.MINUTE:
      return 'HH:mm';
    case TimeScale.SECOND:
      return 'HH:mm:ss';
    default:
      return 'YYYY-MM-DD';
  }
}

/**
 * Get scale interval (in milliseconds)
 */
export function getScaleInterval(scale: TimeScale): number {
  switch (scale) {
    case TimeScale.YEAR:
      return 365 * 24 * 60 * 60 * 1000;
    case TimeScale.MONTH:
      return 30 * 24 * 60 * 60 * 1000;
    case TimeScale.DAY:
      return 24 * 60 * 60 * 1000;
    case TimeScale.HOUR:
      return 60 * 60 * 1000;
    case TimeScale.MINUTE:
      return 60 * 1000;
    case TimeScale.SECOND:
      return 1000;
    default:
      return 24 * 60 * 60 * 1000;
  }
}

/**
 * Generate scale ticks
 */
export function generateScaleTicks(min: number, max: number, scale: TimeScale): number[] {
  const ticks: number[] = [];
  const interval = getScaleInterval(scale);

  let current = Math.floor(min / interval) * interval;

  while (current <= max) {
    if (current >= min) {
      ticks.push(current);
    }
    current += interval;
  }

  return ticks;
}

/**
 * Parse date string
 */
export function parseDate(dateString: string): Date | null {
  const timestamp = Date.parse(dateString);
  return isNaN(timestamp) ? null : new Date(timestamp);
}

/**
 * Check if date is valid
 */
export function isValidDate(date: any): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Convert to timestamp
 */
export function toTimestamp(date: Date | number | string): number {
  if (typeof date === 'number') return date;
  if (typeof date === 'string') {
    const parsed = parseDate(date);
    return parsed ? parsed.getTime() : 0;
  }
  return date.getTime();
}

