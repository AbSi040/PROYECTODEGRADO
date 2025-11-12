import sys
import mysql.connector
import pandas as pd
import pickle, os, json
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv


load_dotenv()
MODELS_DIR = r"D:\ABRIL SIERRA\Descargas\PROYECTODEGRADO\PROYECTODEGRADO\PORTAL\backend\python_scripts\models"

with open(os.path.join(MODELS_DIR, "vectorizer.pkl"), "rb") as f:
    vectorizer = pickle.load(f)


connection = mysql.connector.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME"),
)
cursor = connection.cursor(dictionary=True)


cursor.execute("SELECT id_recurso, texto_limpio FROM recurso_texto")
rows = cursor.fetchall()
df = pd.DataFrame(rows)


consulta = " ".join(sys.argv[1:]).strip().lower()

if not consulta:
    print(json.dumps([]))
    sys.exit()


try:
    consulta_vec = vectorizer.transform([consulta])
    corpus_vec = vectorizer.transform(df["texto_limpio"].fillna(""))
    similitudes = cosine_similarity(consulta_vec, corpus_vec)[0]

    df["similitud"] = similitudes
    df = df.sort_values(by="similitud", ascending=False)

    resultados = [
        {"id_recurso": int(row.id_recurso), "score": float(row.similitud)}
        for row in df.itertuples()
        if row.similitud >= 0
    ]

    print(json.dumps(resultados, ensure_ascii=False))

except Exception as e:
    print(json.dumps([]))
