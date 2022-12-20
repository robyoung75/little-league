import React from "react";
import { Link } from "react-router-dom";
import { useStateValue } from "../../Context/stateProvider";
import { ThemedDiv, ThemedLink } from "../../utils/ThemedComponents";
import "./Footer.css";

function Footer() {
  const [{ authTheme }] = useStateValue();

  return (
    <ThemedDiv theme={authTheme} className="footer">
      <div className="footer__container">
        <h3>About</h3>
        <div className="footer__content">
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
            commodo ligula eget dolor. Aenean massa. Cum sociis natoque
            penatibus et magnis dis parturient montes, nascetur ridiculus mus.
      
          </p>
        </div>
      </div>
      <div className="footer__container">
        <h3>Quick Links</h3>
        <div className="footer__content">
          <ThemedLink theme={authTheme} className="footer__link" route="/">
            Home
          </ThemedLink>
          <ThemedLink theme={authTheme} className="footer__link" route="/social">
            Social
          </ThemedLink>
          <ThemedLink theme={authTheme} className="footer__link" route="/roster">
            Roster
          </ThemedLink>
          <ThemedLink theme={authTheme} className="footer__link" route="/schedule">
            Schedule
          </ThemedLink>
        </div>
      </div>
      <div className="footer__container">
        <h3>Social</h3>
        <div className="footer__content">
          <p>Instagram</p>
          <p>Instagram</p>
          <p>Instagram</p>
        </div>
      </div>
    </ThemedDiv>
  );
}

export default Footer;
