import "./Forms.css";

export const AdminRequirements = () => {
  return (
    <div className="adminRequirements requirements">
      <p>
        Each team is allowed one admin user, typically a coach. The team admin
        will be the only member allowed to modify the roster, schedule, team
        colors and logos.
      </p>
      <h3>Form Requirements</h3>
      <ul>
        <li>First name</li>
        <li>Last name</li>
        <li>Email address</li>
        <li>Password</li>
      </ul>
    </div>
  );
};

export const TeamNameRequirements = () => {
  return (
    <div className="TeamNameRequirements requirements">
      <p>Fully customized design using your team name, logo, and colors.</p>
      <h3>Form Requirements</h3>
      <ul>
        <li>Team name</li>
        <li>Primary color</li>
        <li>Secondary color</li>
        <li>Team logo</li>
      </ul>
    </div>
  );
};

export const PlayersRequirements = () => {
  return (
    <div className="PlayersRequirements requirements">
      <p>Add player names, numbers, stats and images</p>
      <h3>Form Requirements</h3>
      <ul>
        <li>First name</li>
        <li>Last name</li>
        <li>Player positions</li>
        <li>Player batting stance</li>
        <li>Player headshot image</li>
        <li>Player offense image</li>
        <li>Player defense image</li>
      </ul>
      <p>
        If no player headshot image is provided the team logo will be used in
        place as a default. If no offense or defense images are uploaded the
        image will default to the headshot or team logo.
      </p>
    </div>
  );
};

export const CoachesRequirements = () => {
  return (
    <div className="CoachesRequirements requirements">
      <p>Coaches are included too.</p>
      <h3>Form Requirements</h3>
      <ul>
        <li>First name</li>
        <li>Last name</li>
        <li>Email</li>
        <li>Coach headshot</li>
      </ul>
      <p>
        If no coach headshot image is provided the team logo will be used in
        place as a default.
      </p>
    </div>
  );
};

export const ScheduleRequirements = () => {
  return (
    <div className="ScheduleRequirements requirements">
      <p>Create your customized schedule.</p>
      <h3>Form Requirements</h3>
      <ul>
        <li>Opponent name</li>
        <li>Date</li>
        <li>Game time</li>
        <li>Address</li>
        <li>Home or away</li>
        <li>Uniform color</li>
      </ul>
    </div>
  );
};
