import pickle
import numpy as np
import sqlite3

model = pickle.load(open("app/prediction/final_model/finalized_model.sav", 'rb'))
pca_transformer = pickle.load(open("app/prediction/final_model/pca_transformer.pkl", 'rb'))

# model = pickle.load(open("final_model/finalized_model.sav", 'rb'))
# pca_transformer = pickle.load(open("final_model/pca_transformer.pkl", 'rb'))

max_stats = ["Vision","LongPass","SprintSpeed","Acceleration","Finishing","LongShots","Curve"]
average_stats = ["Height","Weight","Acceleration","BallControl","Marking","Dribbling","SlideTackle","StandTackle","Aggression","Reactions","Att.Position","Interceptions","Vision", "Crossing","ShortPass","LongPass","Acceleration","Stamina","Strength","Balance","SprintSpeed","Agility","Jumping","Heading","ShotPower","Finishing","Curve","FKAcc.","Penalties","Volleys","GKPositioning","GKDiving","GKHandling","GKKicking","GKReflexes","Overall","Potential"]

example_result = {"result": "ABC",
                  "result logo": "/static/unknown.png",
                  "home name": "ABC",
                  "away name": "CDE",
                  "home win prob": 70,
                  "draw prob": 20,
                  "away win prob": 10}

def get_logo_from_id(team_id):
    conn = sqlite3.connect('app/data/team_logo.db')
    cur = conn.cursor()

    logo_query = "SELECT team_logo FROM team_logo WHERE team_id = ?"
    logo_link = cur.execute(logo_query, (team_id, )).fetchone()[0]
    
    conn.close()
    return logo_link

def preprocess_match_data(home_stats, away_stats):
    processed_input = []

    # Add average gap stats
    for stat in average_stats:
        processed_input.append(np.average(home_stats[stat]) - np.average(away_stats[stat]))

    # Add max gap stats
    for stat in max_stats:
        processed_input.append(np.max(home_stats[stat]) - np.max(away_stats[stat]))

    # Add recent games info
    # TODO
    processed_input.extend([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

    return np.array(processed_input).reshape(1, -1)


def get_prediction_proba_from_processed_match_data(processed_match_data):
    transformed_input = pca_transformer.transform(processed_match_data)
    prediction_proba = model.predict_proba(transformed_input)
    return prediction_proba

def get_match_result(home_stats, away_stats):
    processed_match_data = preprocess_match_data(home_stats, away_stats)
    prediction_percentages = get_prediction_proba_from_processed_match_data(processed_match_data)[0] * 100
    status = prediction_percentages.argmax()

    result = {
        "home_name": home_stats['Club'][0],
        "away_name": away_stats['Club'][0],
        "home_win_prob": round(prediction_percentages[2], 2),
        "draw_prob": round(prediction_percentages[1], 2),
        "away_win_prob": round(prediction_percentages[0], 2)
    }

    if (status == 2):
        winner_id = home_stats['team_id'][0]
        result["result_logo"] =  get_logo_from_id(winner_id)

        result['result'] = f"{home_stats['Club'][0]} win!"
    elif (status == 0):
        winner_id = away_stats['team_id'][0]
        result["result_logo"] =  get_logo_from_id(winner_id)

        result['result'] = f"{away_stats['Club'][0]} win!"
    else:
        result['result'] = "Draw!"
        result["result logo"] =  "/static/unknown.png"

    return result