import mysql.connector
import pandas as pd
import os, pickle
from dotenv import load_dotenv
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report


load_dotenv()

connection = mysql.connector.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME")
)

query = """
SELECT 
    r.id_recurso,
    CONCAT(r.titulo, ' ', r.descripcion_corta, ' ', rt.texto_limpio) AS texto,
    GROUP_CONCAT(DISTINCT rc.id_tipo) AS etiqueta_violencia,
    GROUP_CONCAT(DISTINCT rc.id_categoria) AS etiqueta_categoria
FROM recurso r
LEFT JOIN recurso_texto rt ON r.id_recurso = rt.id_recurso
LEFT JOIN recurso_categoria rc ON rc.id_recurso = r.id_recurso
WHERE r.origen_dato = 'ENTRENAMIENTO'
GROUP BY r.id_recurso;
"""

df = pd.read_sql(query, connection)
connection.close()

print(f"📘 Recursos cargados para entrenamiento: {len(df)}")


df = df.dropna(subset=["texto", "etiqueta_violencia", "etiqueta_categoria"])


vectorizer = TfidfVectorizer(max_features=5000)
X = vectorizer.fit_transform(df["texto"])


y_violencia = df["etiqueta_violencia"]

X_train, X_test, y_train, y_test = train_test_split(X, y_violencia, test_size=0.2, random_state=42)

modelo_violencia = MultinomialNB()
modelo_violencia.fit(X_train, y_train)

preds_v = modelo_violencia.predict(X_test)
acc_v = accuracy_score(y_test, preds_v)
print(f"\nPrecisión modelo Violencia: {acc_v:.2f}")
print(classification_report(y_test, preds_v))

# =========================================================
# 4️⃣ Entrenamiento – Modelo B: categoría de contenido
# =========================================================
y_categoria = df["etiqueta_categoria"]

X_train2, X_test2, y_train2, y_test2 = train_test_split(X, y_categoria, test_size=0.2, random_state=42)

modelo_categoria = MultinomialNB()
modelo_categoria.fit(X_train2, y_train2)

preds_c = modelo_categoria.predict(X_test2)
acc_c = accuracy_score(y_test2, preds_c)
print(f"\nPrecisión modelo Categoría: {acc_c:.2f}")
print(classification_report(y_test2, preds_c))


os.makedirs("backend/python_scripts/models", exist_ok=True)

with open("backend/python_scripts/models/vectorizer.pkl", "wb") as f:
    pickle.dump(vectorizer, f)

with open("backend/python_scripts/models/tfidf_nb_violencia.pkl", "wb") as f:
    pickle.dump(modelo_violencia, f)

with open("backend/python_scripts/models/tfidf_nb_categoria.pkl", "wb") as f:
    pickle.dump(modelo_categoria, f)

print("\nModelos y vectorizador guardados correctamente en /models/")
