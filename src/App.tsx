import React, { useState } from 'react';
import './App.css';

interface MemoTalk {
  id: string;
  content: string;
  createTime: number;
}

interface Props {
  memoTalks: MemoTalk[];
  onCreateMemoTalk(content: string): void;
}

const App: React.FC<Props> = ({ memoTalks, onCreateMemoTalk }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onCreateMemoTalk(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="App">
      <div className="alert">此项目还在开发中，请不要使用</div>
      <div className="messages">
        {memoTalks.map((memoTalk) => (
          <div key={memoTalk.id} className="message">
            {memoTalk.content}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="请输入内容"
        />
        <button onClick={handleSubmit}>发送</button>
      </div>
    </div>
  );
};

export default App;
