from flask import Flask, request, jsonify
import pickle
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

vectorizer = pickle.load(open("tfidf_vectorizer.pkl", "rb"))
X = np.load("tfidf_matrix.npy")
ids = pd.read_csv("tfidf_ids.csv")

@app.route("/buscar", methods=["POST"])
def buscar():
    consulta = request.json.get("consulta", "")
    if not consulta:
        return jsonify([])

    q_vec = vectorizer.transform([consulta])
    similitudes = cosine_similarity(q_vec, X).flatten()
    top_idx = similitudes.argsort()[-5:][::-1]

    resultados = []
    for i in top_idx:
        resultados.append({
            "id_recurso": int(ids.iloc[i]["id_recurso"]),
            "score": round(float(similitudes[i]), 3)
        })

    return jsonify(resultados)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
