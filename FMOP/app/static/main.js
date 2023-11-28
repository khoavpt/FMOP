document.addEventListener('DOMContentLoaded', function() {
    const homeTeam = document.getElementById('homeTeam')
    const homeTeamLineup = document.getElementById('homeTeamLineup');
    const awayTeam = document.getElementById('awayTeam');
    const awayTeamLineup = document.getElementById('awayTeamLineup');

    function addTeamLineup(teamDiv, lineupDiv){
        // Get the selected home team value
        const selectedTeam = teamDiv.value;

        // Fetch backend for home team lineup
        fetch(`/get_lineup/${selectedTeam}`)
            .then(response => response.json())
            .then(data => {
                while (lineupDiv.firstChild) {
                    lineupDiv.removeChild(lineupDiv.firstChild);
                }

                for (let i = 0; i < 11; i++) {
                    const li = document.createElement('li');
                    li.innerHTML = data.short_name[i];
                    lineupDiv.append(li);
                }
            })
    }

    homeTeam.addEventListener('change', function() {
        addTeamLineup(homeTeam, homeTeamLineup);
    });

    awayTeam.addEventListener('change', function() {
        addTeamLineup(awayTeam, awayTeamLineup);
    });
});
