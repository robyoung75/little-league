import React from "react";
import './ImgContainer.css'

function ImgContainer({ image, alt }) {
  return (
    <div className="imgContainer">{image && <img className="imgContainer__image" src={image} alt={alt} />}</div>
  );
}

export default ImgContainer;
