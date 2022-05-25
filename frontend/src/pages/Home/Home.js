import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import ContentBlock from "../../Components/ContentBlock/ContentBlock";
import ImgContainer from "../../Components/ImgContainer/ImgContainer";
import collage from "../../assets/images/backgrounds/sampleCol.jpg";
import { ThemedButton } from "../../utils/ThemedComponents";

function Home({ isActive }) {
  const showcaseContent =
    "Showcasing your baseball team has never been easier.";
  const createTeamLink = (
    <Link to="/create_team" className="home__btnLink">
      Design Your Site
    </Link>
  );

  const buildWebsiteTitle = "Build Your Team Website";
  const buildWebsiteContent = "Build a team website in minutes.";

  const featuresTitle = "Features";
  const featuresContent = (
    <ul className="home__featuresList">
      <li>Coaches Admin</li>
      <li>Players and stats updates</li>
      <li>Team social media page</li>
      <li>Parents and players can post</li>
      <li>Team calendar</li>
      <li>Team roster</li>
      <li>Mobile phone optimized</li>
      <li>Responsive design</li>
      <li>Secure</li>
    </ul>
  );

  const contentBtn = (
    <ThemedButton className="home__btnTextBox">{createTeamLink}</ThemedButton>
  );

  return (
    
    <div className={isActive ? "home home__active" : "home"}>
      <div className="home__content">
        <div className="home__header">
          <h1>{showcaseContent}</h1>
          <ThemedButton className="home__btn">{createTeamLink}</ThemedButton>
        </div>

        <div className="home__bottom">
          <div className="home__image">
            <h1>Example Components</h1>
            <ImgContainer image={collage} alt="collage" />
          </div>
          <div className="home__bottomRight">
            <ContentBlock
              title={buildWebsiteTitle}
              content={buildWebsiteContent}
              button={contentBtn}
            />

            <ContentBlock
              title={featuresTitle}
              content={featuresContent}
              button={contentBtn}
            />
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default Home;
