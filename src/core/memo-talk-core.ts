import { createDecorator } from '@/vscf/platform/instantiation/common';
import { fromUint8Array, toUint8Array } from 'js-base64';
import { nanoid } from 'nanoid';
import * as Y from 'yjs';
export interface MemoTalk {
  id: string;
  content: string;
  createTime: number;
}

/**
 * MemoTalkCore 核心为一个 Y.Doc 对象
 * 保存的时候 encode 为字符串
 * 可以合并别的 MemoTalkCore, 入参为字符串
 */
export interface IMemoTalkCore {
  createMemoTalk(content: string): string;

  updateMemoTalk(id: string, content: string): void;

  getMemoTalkById(id: string): MemoTalk | null;

  getMemoTalkList(): MemoTalk[];

  deleteMemoTalkById(id: string): void;

  /**
   * 把整个数据库序列化为字符串
   */
  encode(): string;

  merge(data: string): void;

  onUpdate(handler: () => void): void;
}

const enum YDocKey {
  /**
   * 避免 id 重复
   */
  id = 'id',
  memoTalks = 'memoTalks',
}

export class MemoTalkCore implements IMemoTalkCore {
  static merge(current: string, target: string) {
    const doc = new MemoTalkCore();
    if (current) {
      doc.merge(current);
    }
    if (target) {
      doc.merge(target);
    }
    return doc.encode();
  }

  private ydoc: Y.Doc;

  constructor() {
    this.ydoc = new Y.Doc();
  }

  createMemoTalk(content: string): string {
    if (typeof content !== 'string') {
      throw new Error('content must be string');
    }
    const idMap = this.ydoc.getMap(YDocKey.id);
    let id: string = nanoid();
    while (idMap.has(id)) {
      id = nanoid();
    }
    const memoTalksArray = this.ydoc.getArray<string>(YDocKey.memoTalks);

    const memoTalk = this.ydoc.getMap(id);
    memoTalk.set('content', content ?? '');
    memoTalk.set('createTime', Date.now());
    memoTalksArray.push([id]);
    return id;
  }

  getMemoTalkById(id: string): MemoTalk | null {
    const memoTalk = this.ydoc.getMap(id);
    const createTime = memoTalk.get('createTime') as number;
    // 如果没有 createTime, 说明这个 memoTalk 不存在
    if (typeof createTime !== 'number') {
      return null;
    }
    if (memoTalk.get('deleted')) {
      return null;
    }
    return {
      id,
      content: memoTalk.get('content') as string,
      createTime,
    };
  }

  getMemoTalkList(): MemoTalk[] {
    const memoTalksArray = this.ydoc.getArray<string>(YDocKey.memoTalks);
    return memoTalksArray
      .map((id) => this.getMemoTalkById(id))
      .filter((o): o is MemoTalk => !!o)
      .sort((a, b) => a.createTime - b.createTime);
  }

  deleteMemoTalkById(id: string): void {
    if (!this.getMemoTalkById(id)) {
      throw new Error('memoTalk not exist');
    }

    const memoTalk = this.ydoc.getMap(id);
    memoTalk.set('deleted', true);
  }

  updateMemoTalk(id: string, content: string): void {
    if (!this.getMemoTalkById(id)) {
      throw new Error('memoTalk not exist');
    }
    const memoTalksArray = this.ydoc.getArray<string>(YDocKey.memoTalks);
    const index = memoTalksArray.toArray().indexOf(id);
    if (index !== -1) {
      const memoTalk = this.ydoc.getMap(id);
      memoTalk.set('content', content);
    } else {
      throw new Error('memoTalk not exist');
    }
  }

  encode(): string {
    return fromUint8Array(Y.encodeStateAsUpdate(this.ydoc));
  }

  merge(data: string): void {
    Y.applyUpdate(this.ydoc, toUint8Array(data));
  }

  onUpdate(handler: () => void): void {
    this.ydoc.on('update', handler);
  }
}

export const IMemoTalkCore = createDecorator<IMemoTalkCore>('IMemoTalkCore');
