from flask import Flask, render_template, request, jsonify
import sqlite3

from app.prediction.predict import get_match_result, get_logo_from_id

app = Flask(__name__, static_folder="static", template_folder="templates")

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'GET':
        return render_template('main.html')
    elif request.method == 'POST':
        return render_template('main.html')
    
@app.route('/get_lineup/<team_id>')
def get_lineup(team_id):
    conn = sqlite3.connect('app/data/latest_lineup.db')
    cur_row = conn.cursor()
    cur_row.row_factory = sqlite3.Row

    lineup_query = "SELECT * FROM latest_lineup WHERE team_id = ?"
    lineup_data = cur_row.execute(lineup_query, (team_id, )).fetchall()

    lineup = {}

    for entry in lineup_data:
        for key, value in dict(entry).items():
            if key in lineup:
                lineup[key].append(value)
            else:
                lineup[key] = [value]
    
    lineup["logo_link"] = get_logo_from_id(team_id)

    conn.close()
    return jsonify(lineup)

@app.route('/get_result', methods=['POST'])
def get_result():
    if request.method == "POST":
        home_stats, away_stats = request.get_json()
        result = get_match_result(home_stats, away_stats)

        
        return jsonify(result)
