import pandas as pd
import re, unicodedata
from nltk.corpus import stopwords
import nltk
nltk.download('stopwords')

df = pd.read_csv("dataset_tfidf.csv")
stopwords_es = set(stopwords.words('spanish'))

def limpiar_texto(texto):
    if not isinstance(texto, str):
        return ""
    texto = texto.lower()
    texto = unicodedata.normalize('NFKD', texto).encode('ascii', 'ignore').decode('utf-8')
    texto = re.sub(r'[^a-z\\s]', ' ', texto)
    tokens = [t for t in texto.split() if t not in stopwords_es and len(t) > 2]
    return " ".join(tokens)

df["texto_limpio"] = df["texto_limpio"].apply(limpiar_texto)
df.to_csv("dataset_tfidf_limpio.csv", index=False, encoding="utf-8")
print("Textos limpiados correctamente.")
