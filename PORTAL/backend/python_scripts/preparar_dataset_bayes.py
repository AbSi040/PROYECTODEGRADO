import mysql.connector
import pandas as pd

conexion = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",    
    database="el_eco_db"
)

query = """
SELECT r.id_recurso, r.titulo, rt.texto_limpio, r.tipo, r.etiquetas
FROM recurso r
JOIN recurso_texto rt ON r.id_recurso = rt.id_recurso
WHERE rt.texto_limpio IS NOT NULL;
"""
df = pd.read_sql(query, conexion)
conexion.close()

df.to_csv("dataset_bayes.csv", index=False, encoding="utf-8")
print(f"✅ Dataset exportado con {len(df)} recursos.")
