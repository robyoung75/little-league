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
            onChange={onChange}
          />
        </>
      ) : null}

      {preview ? (
        <ThemedDiv className="imgFileInput__select" onClick={onClick}>
          {preview ? "Cancel" : null}
        </ThemedDiv>
      ) : null}
      <div className="imgFileInput__imgContainer">
        {preview ? (
          <img className="imgFileInput__img" src={preview} alt={alt} />
        ) : null}
      </div>
    </ThemedDiv>
  );
}

export default ImgFileInput;
