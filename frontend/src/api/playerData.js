import gameChangerData from "./gameChangerData";
import localTeamData from "./localTeamData";

let playerData = [];

for (let i = 0; i < gameChangerData.length; i++) {
  for (let j = 0; j < localTeamData.length; j++) {
    if (
      gameChangerData[i].FIELD1 === localTeamData[j].id &&
      gameChangerData[i].FIELD1 !== "" &&
      gameChangerData[i].FIELD1 !== "Glossary:" &&
      gameChangerData[i].FIELD1 !== "Number"
    ) {
      let playerObj = {
        number: gameChangerData[i].FIELD1,
        lastName: gameChangerData[i].FIELD2.toLowerCase(),
        firstName: gameChangerData[i].FIELD3.toLowerCase(),
        gamesPlayed: gameChangerData[i]["Offensive Stats"],
        plateAppearances: gameChangerData[i].FIELD5,
        atBats: gameChangerData[i].FIELD6,
        hits: gameChangerData[i].FIELD7,
        homeruns: gameChangerData[i].FIELD11,
        rbi: gameChangerData[i].FIELD12,
        runs: gameChangerData[i].FIELD13,
        baseOnBalls: gameChangerData[i].FIELD18,
        strikeouts: gameChangerData[i].FIELD19,
        battingAve: gameChangerData[i].FIELD20,
        onBasePercent: gameChangerData[i].FIELD21,
        SLG: gameChangerData[i].FIELD22,
        OPS: gameChangerData[i].FIELD23,
        inningsPitched: gameChangerData[i]["Defensive Stats"],
        gamesPitched: gameChangerData[i].FIELD55,
        gameSaves: gameChangerData[i].FIELD56,
        gameWins: gameChangerData[i].FIELD57,
        hitsAllowed: gameChangerData[i].FIELD63,
        runsAllowed: gameChangerData[i].FIELD64,
        walksAllowed: gameChangerData[i].FIELD66,
        ks: gameChangerData[i].FIELD67,
        era:
          gameChangerData[i].FIELD69 !== ".000"
            ? gameChangerData[i].FIELD69
            : null,
        position: localTeamData[j].position,
        id: localTeamData[j].id,
        image: localTeamData[j].image,
        dImage: localTeamData[j].dImage,
        oImage: localTeamData[j].oImage,
      };
      playerData.push(playerObj);
    }
  }
}

// console.log(playerData);

export default playerData;
