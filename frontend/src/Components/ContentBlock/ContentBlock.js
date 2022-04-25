import React from "react";
import "./ContentBlock.css";

function ContentBlock({ title, content, link, subTitle, button }) {
  return (
    <div className="contentBlock">
      <div className="contentBlock__header">
        <h1>{title}</h1>
        {subTitle && <h3>{subTitle}</h3>}
      </div>
      <div className="contentBlock__content">
       {content}
       {link && <div>{link}</div>}
       {button && <div className="contentBlock__btn">{button}</div>}
      </div>
     
   
    </div>
  );
}

export default ContentBlock;
