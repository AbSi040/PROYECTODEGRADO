# 📁 backend/python_scripts/limpieza_texto.py
import mysql.connector
import pandas as pd
import re, os
from dotenv import load_dotenv
import unicodedata
import nltk
from nltk.corpus import stopwords
from nltk.stem import SnowballStemmer


load_dotenv()

connection = mysql.connector.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME")
)
cursor = connection.cursor(dictionary=True)

# Descargar recursos de NLTK (solo la primera vez)
nltk.download('stopwords', quiet=True)

stop_words = set(stopwords.words("spanish"))
stemmer = SnowballStemmer("spanish")


def limpiar_texto(texto):
    if not texto:
        return ""

    
    texto = texto.lower()

   
    texto = ''.join(
        c for c in unicodedata.normalize('NFD', texto)
        if unicodedata.category(c) != 'Mn'
    )

    texto = re.sub(r"http\S+|www\S+|@\S+", " ", texto)
    texto = re.sub(r"[^a-záéíóúñ\s]", " ", texto)
    texto = re.sub(r"\s+", " ", texto)


    palabras = texto.split()
    palabras_filtradas = [
        stemmer.stem(p) for p in palabras if p not in stop_words and len(p) > 2
    ]

    return " ".join(palabras_filtradas)


cursor.execute("SELECT id_recurso, texto_limpio FROM recurso_texto")
registros = cursor.fetchall()

procesados = 0

for r in registros:
    texto_original = r["texto_limpio"]
    texto_procesado = limpiar_texto(texto_original)

    if len(texto_procesado) > 20:
        cursor.execute("""
            UPDATE recurso_texto
            SET texto_limpio = %s
            WHERE id_recurso = %s
        """, (texto_procesado, r["id_recurso"]))
        procesados += 1

connection.commit()
cursor.close()
connection.close()

print(f"✅ Limpieza completada. Total registros procesados: {procesados}")
