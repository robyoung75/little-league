import React, { useState, useEffect } from "react";
import "./TeamSignUpForm.css";
import ContentBlock from "../../Components/ContentBlock/ContentBlock";
import {
  AdminRequirements,
  TeamNameRequirements,
  PlayersRequirements,
  CoachesRequirements,
  ScheduleRequirements,
} from "../../Components/Forms/FormRequirements";
import { Link } from "react-router-dom";
import { ThemedButton } from "../../utils/ThemedComponents";

const RequirementsBtn = ({ link }) => {
  return <ThemedButton className="requirements__btn">{link}</ThemedButton>;
};

function TeamSignUpForm() {
  return (
    <div className="teamSignUpForm">
      <div className="teamSignUpForm__left">
        <ContentBlock
          title="Admin Signup"
          content={<AdminRequirements />}
          button={
            <RequirementsBtn
              link={
                <Link to="/forms/create_admin" className="requirements__link">
                  Create Admin
                </Link>
              }
            />
          }
        />
        <ContentBlock
          title="Team Information"
          content={<TeamNameRequirements />}
          button={
            <RequirementsBtn
              link={
                <Link
                  to="/forms/create_teamName"
                  className="requirements__link"
                >
                  Create Team
                </Link>
              }
            />
          }
        />
        <ContentBlock
          title="Players Information"
          content={<PlayersRequirements />}
          button={
            <RequirementsBtn
              link={
                <Link to="/forms/create_players" className="requirements__link">
                  Create Players
                </Link>
              }
            />
          }
        />
      </div>
      <div className="teamSignUpForm__right">
        <ContentBlock
          title="Coaches Information"
          content={<CoachesRequirements />}
          link={<Link to="/forms/create_coaches">Create Coaches</Link>}
          button={
            <RequirementsBtn
              link={
                <Link to="/forms/create_coaches" className="requirements__link">
                  Create Coaches
                </Link>
              }
            />
          }
        />
        <ContentBlock
          title="Schedule Information"
          content={<ScheduleRequirements />}
          link={<Link to="/forms/create_schedule">Create Schedule</Link>}
          button={
            <RequirementsBtn
              link={
                <Link
                  to="/forms/create_schedule"
                  className="requirements__link"
                >
                  Create Schedule
                </Link>
              }
            />
          }
        />
      </div>

      {/* <Link to="/forms/completed_form">Team Review</Link> */}
    </div>
  );
}
export default TeamSignUpForm;
