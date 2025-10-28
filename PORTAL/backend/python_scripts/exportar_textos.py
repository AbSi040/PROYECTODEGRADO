import mysql.connector
import pandas as pd

# Conexión a la base
conexion = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",  
    database="proyecto_videojuego_portal"
)


query = """
SELECT r.id_recurso, r.titulo, r.tipo, r.descripcion_corta, rt.texto_limpio
FROM recurso r
JOIN recurso_texto rt ON rt.id_recurso = r.id_recurso;
"""

df = pd.read_sql(query, conexion)
conexion.close()

df.to_csv("dataset_tfidf.csv", index=False, encoding="utf-8")
print(f"Dataset exportado: {len(df)} recursos listos.")
