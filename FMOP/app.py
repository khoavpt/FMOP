from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__, static_folder="app/static", template_folder="app/templates")


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'GET':
        return render_template('main.html')
    elif request.method == 'POST':
        return render_template('main.html')
    
@app.route('/get_lineup/<team_id>')
def get_lineup(team_id):
    conn = sqlite3.connect('app/data/players_22.db')
    cur = conn.cursor()
    cur.row_factory = sqlite3.Row

    lineup_query = "SELECT * FROM players_22 WHERE club_team_id = ?"
    lineup_data = cur.execute(lineup_query, (team_id, )).fetchall()
    lineup = {}
    for entry in lineup_data:
        for key, value in dict(entry).items():
            if key in lineup:
                lineup[key].append(value)
            else:
                lineup[key] = [value]

    conn.close()
    return jsonify(lineup)
