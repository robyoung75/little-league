import React, { useState, useEffect } from "react";
import "./PostInput.css";
import { ThemedHeader, ThemedButton } from "../../utils/ThemedComponents";
import { useStateValue } from "../../Context/stateProvider";
import Avatar from "../Avatar/Avatar";
function PostInput() {
  const [{ theme, userData }] = useStateValue();
  const [hovering_1, setHovering_1] = useState(false);
  const [hovering_2, setHovering_2] = useState(false);

  const handleHovering_1 = () => {
    setHovering_1(true);
  };

  const handleNotHovering_1 = () => {
    setHovering_1(false);
  };

  const handleHovering_2 = () => {
    setHovering_2(true);
  };

  const handleNotHovering_2 = () => {
    setHovering_2(false);
  };

  useEffect(() => {
    console.log("new user");
  }, [userData]);

  return (
    <div className="postInput">
      <ThemedHeader theme={theme} className="postInput__header">
        <input
          className="postInput__input"
          placeholder={
            !userData
              ? "Welcome, sign in to post"
              : `Welcome ${userData.firstName.slice(0, 1).toUpperCase()} ${
                  userData.lastName
                }`
          }
        />
        <div className="postInput__btns">
          <div className="postInput__btn">
            <ThemedButton
              className="btn"
              theme={theme}
              hovering={hovering_1}
              onMouseOver={handleHovering_1}
              onMouseOut={handleNotHovering_1}
            >
              Upload Image
            </ThemedButton>
          </div>

          <div className="postInput__btn">
            <ThemedButton
              className="btn"
              theme={theme}
              hovering={hovering_2}
              onMouseOver={handleHovering_2}
              onMouseOut={handleNotHovering_2}
            >
              Submit
            </ThemedButton>
          </div>
        </div>
      </ThemedHeader>
      <div className="postInput__avatar">
        <Avatar />
      </div>
    </div>
  );
}

export default PostInput;
