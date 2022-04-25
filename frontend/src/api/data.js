import playerData from "./playerData";
import coachesData from "./coachesData";
import scheduleData from "./scheduleData";
import { razorbackLogo } from "./imagesData";
import { cottonwoodLogo } from "./imagesData";
import { noUserLogo } from "./imagesData";

const data = [
  {
    id: 2,
    teamId: "111112",
    team: "razorbacks",
    color: "redGrey",
    logo: razorbackLogo,
    players: playerData,
    coachesData: coachesData,
    scheduleData,
  },

  {
    id: 1,
    teamId: "111111",
    team: "colts",
    color: "yelowBlack",
    logo: cottonwoodLogo,
    players: playerData,
    coachesData: coachesData,
    scheduleData,
  },


];

export default data;
