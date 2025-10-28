from flask import Flask, request, jsonify
import pickle
from sklearn.naive_bayes import MultinomialNB

app = Flask(__name__)

modelo = pickle.load(open("modelo_bayes.pkl","rb"))
vectorizer = pickle.load(open("vectorizer_bayes.pkl","rb"))

@app.route("/clasificar", methods=["POST"])
def clasificar():
    texto = request.json.get("texto", "")
    if not texto: return jsonify({"error":"Texto vacío"}),400
    X = vectorizer.transform([texto])
    categoria = modelo.predict(X)[0]
    return jsonify({"categoria": categoria})

if __name__ == "__main__":
    app.run(port=5001, debug=True)
