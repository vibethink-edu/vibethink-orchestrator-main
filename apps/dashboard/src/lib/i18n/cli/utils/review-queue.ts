/**
 * Review Queue - Human-in-the-Loop for AI Classification
 *
 * JSON append-only queue for terms that need human review.
 * Supports workflow: pending → approved/rejected → merged
 */

import fs from 'fs/promises';
import path from 'path';
import { ClassifierOutput } from '../../ai/output-schema';
import { TenantContext } from '../../ai/classifier';

const QUEUE_PATH = path.resolve(__dirname, '../../../registry/review-queue.json');

export interface ReviewQueueItem {
  id: string;
  term: string;
  context: TenantContext;
  result: ClassifierOutput;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected' | 'merged';
  reviewedAt?: string;
  reviewedBy?: string;
  resolution?: {
    action: 'use_existing' | 'create_new' | 'skip';
    key?: string;
    namespace?: string;
    notes?: string;
  };
}

export interface ReviewQueue {
  version: string;
  items: ReviewQueueItem[];
}

async function loadQueue(): Promise<ReviewQueue> {
  try {
    const raw = await fs.readFile(QUEUE_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { version: '1.0', items: [] };
  }
}

async function saveQueue(queue: ReviewQueue): Promise<void> {
  // Ensure directory exists
  const dir = path.dirname(QUEUE_PATH);
  await fs.mkdir(dir, { recursive: true });

  await fs.writeFile(QUEUE_PATH, JSON.stringify(queue, null, 2));
}

export async function appendToReviewQueue(item: {
  term: string;
  context: TenantContext;
  result: ClassifierOutput;
  timestamp: string;
}): Promise<string> {
  const queue = await loadQueue();

  // Generate unique ID
  const id = `review_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  // Check for duplicate term+context
  const existing = queue.items.find(
    (i) =>
      i.term.toLowerCase() === item.term.toLowerCase() &&
      i.context.vertical === item.context.vertical &&
      i.context.subvertical === item.context.subvertical &&
      i.status === 'pending'
  );

  if (existing) {
    return existing.id; // Don't duplicate
  }

  queue.items.push({
    id,
    ...item,
    status: 'pending',
  });

  await saveQueue(queue);
  return id;
}

export async function getReviewQueue(
  options: {
    status?: ReviewQueueItem['status'];
    limit?: number;
  } = {}
): Promise<ReviewQueueItem[]> {
  const queue = await loadQueue();
  let items = queue.items;

  if (options.status) {
    items = items.filter((i) => i.status === options.status);
  }

  // Sort by timestamp desc (newest first)
  items.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  if (options.limit) {
    items = items.slice(0, options.limit);
  }

  return items;
}

export async function resolveReviewItem(
  id: string,
  resolution: ReviewQueueItem['resolution'],
  reviewer: string
): Promise<boolean> {
  const queue = await loadQueue();
  const item = queue.items.find((i) => i.id === id);

  if (!item || item.status !== 'pending') {
    return false;
  }

  item.status = resolution?.action === 'skip' ? 'rejected' : 'approved';
  item.reviewedAt = new Date().toISOString();
  item.reviewedBy = reviewer;
  item.resolution = resolution;

  await saveQueue(queue);
  return true;
}

export async function getQueueStats(): Promise<{
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  merged: number;
}> {
  const queue = await loadQueue();
  return {
    total: queue.items.length,
    pending: queue.items.filter((i) => i.status === 'pending').length,
    approved: queue.items.filter((i) => i.status === 'approved').length,
    rejected: queue.items.filter((i) => i.status === 'rejected').length,
    merged: queue.items.filter((i) => i.status === 'merged').length,
  };
}

export async function markAsMerged(id: string): Promise<boolean> {
  const queue = await loadQueue();
  const item = queue.items.find((i) => i.id === id);

  if (!item || item.status !== 'approved') {
    return false;
  }

  item.status = 'merged';
  await saveQueue(queue);
  return true;
}
