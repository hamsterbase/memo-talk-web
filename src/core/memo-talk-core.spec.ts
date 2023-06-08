import { MemoTalkCore, IMemoTalkCore } from "./memo-talk-core";
import { describe, beforeEach, afterEach, test, expect } from "vitest";

describe("MemoTalkCore", () => {
  let memoTalkCore: IMemoTalkCore;

  beforeEach(() => {
    memoTalkCore = new MemoTalkCore();
  });

  afterEach(() => {
    memoTalkCore.getMemoTalkList().forEach((memoTalk) => {
      memoTalkCore.deleteMemoTalkById(memoTalk.id);
    });
  });

  test("createMemoTalk should create a new MemoTalk with the given content", () => {
    const content = "test content";
    const memoTalkId = memoTalkCore.createMemoTalk(content);

    const memoTalk = memoTalkCore.getMemoTalkById(memoTalkId);
    expect(memoTalk?.content).toBe(content);
  });

  test("getMemoTalkById should return the MemoTalk with the given id", () => {
    const content1 = "test content 1";
    const content2 = "test content 2";
    const memoTalkId1 = memoTalkCore.createMemoTalk(content1);
    const memoTalkId2 = memoTalkCore.createMemoTalk(content2);

    const memoTalk1 = memoTalkCore.getMemoTalkById(memoTalkId1);
    const memoTalk2 = memoTalkCore.getMemoTalkById(memoTalkId2);

    expect(memoTalk1?.content).toBe(content1);
    expect(memoTalk2?.content).toBe(content2);
  });

  test("getMemoTalkList should return a list of all MemoTalks", () => {
    const content1 = "test content 1";
    const content2 = "test content 2";
    memoTalkCore.createMemoTalk(content1);
    memoTalkCore.createMemoTalk(content2);

    const memoTalkList = memoTalkCore.getMemoTalkList();

    expect(memoTalkList.length).toBe(2);
    expect(memoTalkList[0].content).toBe(content1);
    expect(memoTalkList[1].content).toBe(content2);
  });

  test("deleteMemoTalkById should delete the MemoTalk with the given id", () => {
    const content = "test content";
    const memoTalkId = memoTalkCore.createMemoTalk(content);

    memoTalkCore.deleteMemoTalkById(memoTalkId);
    const memoTalk = memoTalkCore.getMemoTalkById(memoTalkId);

    expect(memoTalk).toBeNull();
  });

  test("merge should merge the serialized data into the MemoTalkCore", () => {
    const content1 = "test content 1";
    const content2 = "test content 2";
    const memoTalkCore1 = new MemoTalkCore();
    memoTalkCore1.createMemoTalk(content1);
    const memoTalkCore2 = new MemoTalkCore();
    memoTalkCore2.createMemoTalk(content2);

    memoTalkCore.merge(memoTalkCore1.encode());
    memoTalkCore.merge(memoTalkCore2.encode());

    const memoTalkList = memoTalkCore.getMemoTalkList();
    expect(memoTalkList.length).toBe(2);

    expect(memoTalkList.map((memoTalk) => memoTalk.content).sort()).toEqual([
      content1,
      content2,
    ]);
  });

  test("should throw an error if the MemoTalk does not exist", () => {
    const invalidId = "invalid-id";
    expect(() => memoTalkCore.deleteMemoTalkById(invalidId)).toThrowError(
      "memoTalk not exist"
    );
  });

  test("should throw an error if trying to delete the same MemoTalk twice", () => {
    const id = memoTalkCore.createMemoTalk("note");
    memoTalkCore.deleteMemoTalkById(id);
    expect(() => memoTalkCore.deleteMemoTalkById(id)).toThrowError(
      "memoTalk not exist"
    );
  });
});
