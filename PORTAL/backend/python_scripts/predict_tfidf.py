
import mysql.connector
import pandas as pd
import pickle, os
from dotenv import load_dotenv


load_dotenv()

MODELS_DIR = "backend/python_scripts/models"

with open(os.path.join(MODELS_DIR, "vectorizer.pkl"), "rb") as f:
    vectorizer = pickle.load(f)

with open(os.path.join(MODELS_DIR, "tfidf_nb_violencia.pkl"), "rb") as f:
    modelo_violencia = pickle.load(f)

with open(os.path.join(MODELS_DIR, "tfidf_nb_categoria.pkl"), "rb") as f:
    modelo_categoria = pickle.load(f)

print("Modelos cargados correctamente.")


connection = mysql.connector.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME")
)
cursor = connection.cursor(dictionary=True)


query = """
SELECT 
    r.id_recurso,
    CONCAT(r.titulo, ' ', r.descripcion_corta, ' ', rt.texto_limpio) AS texto
FROM recurso r
LEFT JOIN recurso_texto rt ON r.id_recurso = rt.id_recurso
WHERE r.origen_dato = 'NUEVO'
GROUP BY r.id_recurso;
"""

df_nuevos = pd.read_sql(query, connection)

if df_nuevos.empty:
    print("No hay recursos nuevos para clasificar.")
    exit()

print(f"📘 Recursos por clasificar: {len(df_nuevos)}")


X_new = vectorizer.transform(df_nuevos["texto"].fillna(""))


pred_violencia = modelo_violencia.predict(X_new)
pred_categoria = modelo_categoria.predict(X_new)

df_nuevos["id_tipo_pred"] = pred_violencia
df_nuevos["id_categoria_pred"] = pred_categoria


for _, row in df_nuevos.iterrows():
    id_recurso = int(row["id_recurso"])
    id_tipo = str(row["id_tipo_pred"])
    id_categoria = str(row["id_categoria_pred"])

    cursor.execute("""
        INSERT INTO recurso_categoria (id_recurso, id_tipo, id_categoria)
        VALUES (%s, %s, %s)
        ON DUPLICATE KEY UPDATE id_tipo = VALUES(id_tipo), id_categoria = VALUES(id_categoria);
    """, (id_recurso, id_tipo, id_categoria))

    cursor.execute("""
        UPDATE recurso SET origen_dato = 'PROCESADO' WHERE id_recurso = %s;
    """, (id_recurso,))

connection.commit()
cursor.close()
connection.close()

print("\nClasificación completada y base actualizada correctamente.")
