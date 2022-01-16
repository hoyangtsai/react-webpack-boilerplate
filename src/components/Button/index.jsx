import React from 'react';
import styles from './index.module.scss';

const Button = ({onClick, children, className, ...props}) => {
  const handleClick = (e) => {
    e.preventDefault();
    onClick(e);
  }

  return (
    <button className={[styles.button, className].join(' ')} onClick={handleClick}>{children || 'Button'}</button>
  )
}

export default Button;
