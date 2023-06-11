/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './index.module.css';

interface Props {
  content: string;
}

interface LinkProps {
  href?: string;
  children: any;
}

const Link: React.FC<LinkProps> = (props) => {
  return (
    <a href={props.href} target="_blank">
      {props.children}
    </a>
  );
};

export const Markdown: React.FC<Props> = (props) => {
  return (
    <ReactMarkdown className={styles.markdown} components={{ a: Link }}>
      {props.content}
    </ReactMarkdown>
  );
};
