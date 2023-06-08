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
export interface MemoTalkCore {
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

class NoteCore implements NoteCore {}
