import React from "react";
import { Link } from "react-router-dom";

import "./ThemedComponents.css";

export const ThemeWrapper = ({ children, theme }) => {
  return <div style={theme ? theme.style : null}>{children}</div>;
};
export const ThemedDiv = ({
  children,
  theme,
  className,
  onClick,
  onMouseOver,
  onMouseOut,
  hovering,
}) => {
  return (
    <div
      style={hovering && theme ? theme.btn__hover : theme ? theme.style : null}
      className={className}
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      {children}
    </div>
  );
};

export const ThemedButton = ({
  theme,
  children,
  className,
  onMouseOver,
  onMouseOut,
  hovering,
  onClick,
  type,
}) => {
  return (
    <button
      type={type}
      style={hovering && theme ? theme.btn__hover : theme ? theme.style : null}
      className={className ? "themedButton" + " " + className : "themedButton"}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const ThemedHeader = ({ title, theme, children, className }) => {
  return (
    <div
      style={theme ? theme.style : null}
      className={className ? "themedHeader" + " " + className : "themedHeader"}
    >
      {title}
      {children}
    </div>
  );
};

export const ThemedLink = ({ className, route, theme, children }) => {
  return (
    <Link className={className} to={route} style={theme && theme.style}>
      {children}
    </Link>
  );
};
