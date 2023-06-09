import React from 'react';
import './mem-talk.css';

interface MemoTalk {
  id: string;
  content: string;
  createTime: number;
}

interface Props {
  memoTalks: MemoTalk[];
}

const MemoTalkContainer: React.FC<Props> = ({ memoTalks }) => {
  return (
    <div className="messages">
      {memoTalks.map((memoTalk) => (
        <div key={memoTalk.id} className="message">
          {memoTalk.content}
        </div>
      ))}
    </div>
  );
};

export { MemoTalkContainer };
