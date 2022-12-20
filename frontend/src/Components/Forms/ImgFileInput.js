import React from "react";
import { useStateValue } from "../../Context/stateProvider";
import { ThemedDiv } from "../../utils/ThemedComponents";
import "./Forms.css";

function ImgFileInput({
  className,
  id,
  name,
  htmlFor,
  title,
  onChange,
  onClick,
  preview,
  alt,
  hovering,
  onMouseOver,
  onMouseOut,
  multipleImgs
}) {
  const [{ theme }] = useStateValue();
  return (
    <ThemedDiv
      theme={theme}
      hovering={hovering}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      className={`${className} imageUploadContainer`}
    >
      {preview === null ? (
        <>
          <label className="imgFileInput__label" htmlFor={htmlFor}>
            {title}
          </label>
          <input
            type="file"
            id={id}
            name={name}
            accept=".jpg, .jpeg, .png"
            multiple={multipleImgs}
            onChange={onChange}
          />
        </>
      ) : null}

      {!preview ? (
        <div
          className={
            className
              ? "imgFileInput__imgContainer" + " " + className
              : "imgFileInput__imgContainer"
          }
          onClick={onClick}
        >
          {preview ? <span>cancel</span> : null}
        </div>
      ) : (
        <div
          className={
            className
              ? "imgFileInput__imgContainer" + " " + className
              : "imgFileInput__imgContainer"
          }
        >
          <div className="imgFileInput__imgContainer__col" onClick={onClick}>
            <span>cancel</span>
          </div>
          <div className="imgFileInput__imgContainer__col ">
            <img className="imgFileInput__img" src={preview} alt={alt} />
          </div>
        </div>
      )}
    </ThemedDiv>
  );
}

export default ImgFileInput;
