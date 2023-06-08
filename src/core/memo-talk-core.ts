import { nanoid } from "nanoid";
import * as Y from "yjs";
import { fromUint8Array, toUint8Array } from "js-base64";
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

  getMemoTalkById(id: string): MemoTalk;

  getMemoTalkList(): MemoTalk[];

  deleteMemoTalkById(id: string): void;

  /**
   * 把整个数据库序列化为字符串
   */
  encode(): string;

  merge(data: string): void;
}

const enum YDocKey {
  /**
   * 避免 id 重复
   */
  id = "id",
  memoTalks = "memoTalks",
}

export class MemoTalkCore implements IMemoTalkCore {
  private ydoc: Y.Doc;
  constructor() {
    this.ydoc = new Y.Doc();
  }

  createMemoTalk(content: string): string {
    if (typeof content !== "string") {
      throw new Error("content must be string");
    }
    const idMap = this.ydoc.getMap(YDocKey.id);
    let id: string = nanoid();
    while (idMap.has(id)) {
      id = nanoid();
    }
    const memoTalksArray = this.ydoc.getArray<string>(YDocKey.memoTalks);

    const memoTalk = this.ydoc.getMap(id);
    memoTalk.set("content", content ?? "");
    memoTalk.set("createTime", Date.now());
    memoTalksArray.push([id]);
    return id;
  }

  getMemoTalkById(id: string): MemoTalk {
    const memoTalk = this.ydoc.getMap(id);
    return {
      id,
      content: memoTalk.get("content") as string,
      createTime: memoTalk.get("createTime") as number,
    };
  }

  getMemoTalkList(): MemoTalk[] {
    const memoTalksArray = this.ydoc.getArray<string>(YDocKey.memoTalks);
    return memoTalksArray.map((id) => this.getMemoTalkById(id));
  }

  deleteMemoTalkById(id: string): void {
    const memoTalksArray = this.ydoc.getArray<string>(YDocKey.memoTalks);
    memoTalksArray.delete(memoTalksArray.toArray().indexOf(id));
  }

  encode(): string {
    return fromUint8Array(Y.encodeStateAsUpdate(this.ydoc));
  }

  merge(data: string): void {
    Y.applyUpdate(this.ydoc, toUint8Array(data));
  }
}
