import React from 'react';
import '../styles/message.scss';

const Message: React.FC<{ children: any }> = ({ children }) => {
  return <div className='message'>{children}</div>;
};

export default Message;
