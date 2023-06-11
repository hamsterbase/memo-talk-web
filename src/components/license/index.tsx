import { Input } from 'antd-mobile';
import { useState } from 'react';
import uuidApiKey from 'uuid-apikey';
import { Markdown } from '../markdown/markdown';

export const License: React.FC<{ randomId: string }> = (props) => {
  const [password, updataPassowrd] = useState(uuidApiKey.create().apiKey);
  return (
    <>
      <div style={{ padding: 4 }}>
        <span>当前同步密码为：</span>
        <Input
          id={props.randomId}
          style={{
            '--font-size': '12px',
            textAlign: 'center',
            border: '1px solid var(--adm-color-border)',
            marginBottom: 8,
          }}
          value={password}
          onChange={(v) => updataPassowrd(v)}
        />
      </div>
      <Markdown
        content={`
  1. 如果您的密码被泄露, 其他人可能会使用该密码来访问并查看您的数据。因此, 请您妥善保管您的密码, 并确保不会将其泄露给任何人。  
  
  2. 在数据同步时，Memotalk 会使用同步密码对您的数据进行 AES 加密。加密后的数据会被上传到服务器，在数据同步时，Memotalk 不会保存上传同步密码。如果您忘记了密码，我们无法帮助您找回服务器上的数据。

  3. Memotalk 服务器部署在 [Render](https://render.com/docs/web-services) 的新加坡机房, 15 分钟无人访问自动删除**全部数据**。 
  
  4. Memotalk 不对因使用本应用程序而导致的任何数据丢失或损坏负责。`.trim()}
      ></Markdown>
    </>
  );
};
