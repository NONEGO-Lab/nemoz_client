import React from 'react';
import ReactDOM from 'react-dom';

export const ModalPortal = ({ children }) => {
  const modalRoot = document.getElementById('modal-root');
  return ReactDOM.createPortal(children, modalRoot);
};


export const ModalPortal2Depth = ({children}) => {
  const modalRoot2Depth = document.getElementById("2-depth-modal-root");
  return ReactDOM.createPortal(children, modalRoot2Depth)
}

