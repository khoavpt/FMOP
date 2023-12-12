const teams = {1: 'West Ham United',
                6: 'Tottenham Hotspur',
                8: 'Liverpool',
                9: 'Manchester City',
                10: 'West Bromwich Albion',
                11: 'Fulham',
                13: 'Everton',
                14: 'Manchester United',
                15: 'Aston Villa',
                18: 'Chelsea',
                19: 'Arsenal',
                20: 'Newcastle United',
                21: 'Sheffield United',
                25: 'Watford',
                27: 'Burnley',
                29: 'Wolverhampton Wanderers',
                33: 'Norwich City',
                36: 'Celta de Vigo',
                37: 'Roma',
                42: 'Leicester City',
                43: 'Lazio',
                44: 'Olympique Marseille',
                51: 'Crystal Palace',
                59: 'Nantes',
                60: 'SD Eibar',
                65: 'Southampton',
                67: 'Schalke 04',
                68: 'Borussia Dortmund',
                71: 'Leeds United',
                78: 'Brighton & Hove Albion',
                79: 'Olympique Lyonnais',
                82: 'Werder Bremen',
                83: 'FC Barcelona',
                89: 'Crotone',
                90: 'FC Augsburg',
                102: 'Genoa',
                103: 'Granada',
                106: 'Getafe',
                108: 'Saint-Etienne',
                109: 'Fiorentina',
                113: 'Milan',
                214: 'Valencia',
                236: 'Brentford',
                266: 'Brest',
                267: 'Venezia',
                271: 'Lens',
                274: 'Huesca',
                277: 'RB Leipzig',
                345: 'Spezia',
                346: 'Udinese',
                361: 'Real Valladolid',
                366: 'Eintracht Frankfurt',
                377: 'Rayo Vallecano',
                397: 'Empoli',
                398: 'Parma',
                450: 'Nice',
                459: 'Osasuna',
                485: 'Real Betis',
                503: 'FC Bayern Munchen',
                510: 'VfL Wolfsburg',
                522: 'Sampdoria',
                528: 'Espanyol',
                563: 'Benevento',
                581: 'Montpellier',
                585: 'Cagliari',
                591: 'Paris Saint Germain',
                594: 'Real Sociedad',
                597: 'Napoli',
                598: 'Rennes',
                613: 'Torino',
                625: 'Juventus',
                645: 'Mallorca',
                676: 'Sevilla',
                683: 'Borussia Monchengladbach',
                686: 'Strasbourg',
                690: 'Lille',
                708: 'Atalanta',
                776: 'Angers SCO',
                794: 'FSV Mainz 05',
                999: 'VfL Bochum 1848',
                1028: 'Reims',
                1079: 'FC Union Berlin',
                1099: 'Elche',
                1123: 'Hellas Verona',
                2714: 'Sassuolo',
                2726: 'TSG Hoffenheim',
                2927: 'DSC Arminia Bielefeld',
                2930: 'Inter',
                2975: 'Deportivo Alaves',
                3317: 'Hertha BSC',
                3319: 'VfB Stuttgart',
                3320: 'FC Koln',
                3321: 'Bayer 04 Leverkusen',
                3431: 'SpVgg Greuther Furth',
                3457: 'Levante',
                3468: 'Real Madrid',
                3477: 'Villarreal',
                3513: 'Metz',
                3543: 'SC Freiburg',
                3562: 'Bordeaux',
                6789: 'Monaco',
                6827: 'Cadiz',
                6842: 'Dijon',
                6898: 'Clermont',
                6967: 'Nimes',
                7047: 'Troyes',
                7743: 'Salernitana',
                7980: 'Atletico Madrid',
                8513: 'Bologna',
                9257: 'Lorient',
                13258: 'Athletic Club'
}

const displayed_stats = ["Height","Weight","Dribbling","Reactions","Crossing","ShortPass","Stamina","Strength","Balance","Agility","Heading","ShotPower","Penalties","GKHandling","GKReflexes","Vision","LongPass","SprintSpeed","Finishing","Acceleration","Overall","Potential"];

function addTeamOption(selectElement, id, name) {
    // Create a new option element
    var option = document.createElement("option");

    option.value = id;
    option.innerHTML = name;

    selectElement.appendChild(option);
}

function addTeamsToSelect(selectElement) {
    for (var teamId in teams) {
        if (teams.hasOwnProperty(teamId)) {
            var teamName = teams[teamId];
            addTeamOption(selectElement, teamId, teamName);
        }
    }
}

function initialize_form() {
    var selectHome = document.getElementById("homeTeam");
    var selectAway = document.getElementById("awayTeam");

    addTeamsToSelect(selectHome);
    addTeamsToSelect(selectAway)

}

document.addEventListener('DOMContentLoaded', function() {

    const homeTeam = document.getElementById('homeTeam')
    const homeTeamLineup = document.getElementById('homeTeamLineup');
    const awayTeam = document.getElementById('awayTeam');
    const awayTeamLineup = document.getElementById('awayTeamLineup');

    const submitButton = document.getElementById("submitButton");
    const probabilityResult = document.getElementsByClassName("progress-bar")
    const mainForm = document.getElementById("mainForm");

    const resultLogo = document.getElementById("winner-logo");
    const homeLogo = document.getElementById("home-logo");
    const awayLogo = document.getElementById("away-logo");

    let homeTeamStats = null;
    let awayTeamStats = null;

    initialize_form()
    
    function addTeamLineup(teamStats, logo, teamDiv, lineupDiv){
        // Get the selected home team value
        const selectedTeam = teamDiv.value;

        // Fetch backend for home team lineup
        fetch(`/get_lineup/${selectedTeam}`)
            .then(response => response.json())
            .then(data => {
                teamStats = data

                if (teamDiv === homeTeam) {
                    homeTeamStats = data;
                    homeLogo.src = data["logo_link"]
                } else if (teamDiv === awayTeam) {
                    awayTeamStats = data;
                    awayLogo.src = data["logo_link"]
                }

                while (lineupDiv.firstChild) {
                    lineupDiv.removeChild(lineupDiv.firstChild);
                }

                for (let i = 0; i < 11; i++) {
                    const li = document.createElement('li');
                    li.classList.add("list-group-item", "list-group-item-action");
                
                    li.setAttribute("data-toggle", "popover");
                    li.setAttribute("title", data.player_name[i])
                    let statsHTML = "<ul>";
                    for (let j = 0; j < displayed_stats.length; j++) {
                        statsHTML += `<li>${displayed_stats[j]}: ${data[displayed_stats[j]][i]}</li>`
                    }
                    statsHTML += "</ul>";
                    li.setAttribute("data-content", statsHTML);
                    li.innerHTML = data.player_name[i];
                    lineupDiv.append(li);
                    $(li).popover({
                        trigger: 'hover',
                        html: true 
                    });
                }
            })
    }

    homeTeam.addEventListener('change', function() {
        addTeamLineup(homeTeamStats, homeLogo, homeTeam, homeTeamLineup);
    });

    awayTeam.addEventListener('change', function() {
        addTeamLineup(awayTeamStats, homeTeam, awayTeam, awayTeamLineup);
    });

    submitButton.addEventListener('click', function() {
        fetch('/get_result', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([homeTeamStats, awayTeamStats])
          })
          .then(response => response.json())
          .then(result => {

            resultLogo.src = result["result_logo"]

            document.getElementById("winner").innerHTML = `${result["result"]}`
            document.getElementById("home").innerHTML = `${result["home_name"]} win: ${result["home_win_prob"]} %`
            document.getElementById("draw").innerHTML = `Draw: ${result["draw_prob"]} %`
            document.getElementById("away").innerHTML = `${result["away_name"]} win: ${result["away_win_prob"]} %`

            probabilityResult[0].style.width = parseFloat(result["home_win_prob"]) + "%";
            probabilityResult[1].style.width = parseFloat(result["draw_prob"]) + "%";
            probabilityResult[2].style.width = parseFloat(result["away_win_prob"]) + "%";
            
          });
    });
});
