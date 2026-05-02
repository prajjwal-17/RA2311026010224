import { compareByRecency } from "@/utils/date";
import {
  NOTIFICATION_PRIORITY,
  type NotificationRecord,
} from "@/utils/notification-types";

function scoreNotification(notification: NotificationRecord): [number, number] {
  return [
    NOTIFICATION_PRIORITY[notification.type] ?? 0,
    Date.parse(notification.timestamp) || 0,
  ];
}

function isLowerPriority(left: NotificationRecord, right: NotificationRecord): boolean {
  const [leftWeight, leftTimestamp] = scoreNotification(left);
  const [rightWeight, rightTimestamp] = scoreNotification(right);

  if (leftWeight !== rightWeight) {
    return leftWeight < rightWeight;
  }

  return leftTimestamp < rightTimestamp;
}

class MinHeap {
  private readonly items: NotificationRecord[] = [];

  get size(): number {
    return this.items.length;
  }

  toArray(): NotificationRecord[] {
    return [...this.items];
  }

  peek(): NotificationRecord | undefined {
    return this.items[0];
  }

  push(value: NotificationRecord): void {
    this.items.push(value);
    this.bubbleUp(this.items.length - 1);
  }

  replaceTop(value: NotificationRecord): void {
    this.items[0] = value;
    this.bubbleDown(0);
  }

  private bubbleUp(index: number): void {
    let current = index;

    while (current > 0) {
      const parentIndex = Math.floor((current - 1) / 2);

      if (!isLowerPriority(this.items[current], this.items[parentIndex])) {
        break;
      }

      [this.items[current], this.items[parentIndex]] = [
        this.items[parentIndex],
        this.items[current],
      ];
      current = parentIndex;
    }
  }

  private bubbleDown(index: number): void {
    let current = index;

    while (true) {
      const left = current * 2 + 1;
      const right = current * 2 + 2;
      let smallest = current;

      if (
        left < this.items.length &&
        isLowerPriority(this.items[left], this.items[smallest])
      ) {
        smallest = left;
      }

      if (
        right < this.items.length &&
        isLowerPriority(this.items[right], this.items[smallest])
      ) {
        smallest = right;
      }

      if (smallest === current) {
        return;
      }

      [this.items[current], this.items[smallest]] = [
        this.items[smallest],
        this.items[current],
      ];
      current = smallest;
    }
  }
}

export function getTopNotifications(
  notifications: NotificationRecord[],
  limit = 10,
): NotificationRecord[] {
  if (limit <= 0) {
    return [];
  }

  const heap = new MinHeap();

  for (const notification of notifications) {
    if (heap.size < limit) {
      heap.push(notification);
      continue;
    }

    const smallest = heap.peek();

    if (smallest && isLowerPriority(smallest, notification)) {
      heap.replaceTop(notification);
    }
  }

  return heap
    .toArray()
    .sort((left, right) => {
      const priorityDelta =
        NOTIFICATION_PRIORITY[right.type] - NOTIFICATION_PRIORITY[left.type];

      if (priorityDelta !== 0) {
        return priorityDelta;
      }

      return compareByRecency(right.timestamp, left.timestamp);
    });
}
