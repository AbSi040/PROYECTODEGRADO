import pandas as pd
import re, unicodedata
from sklearn.model_selection import train_test_split

df = pd.read_csv("dataset_bayes.csv")

def limpiar(t):
    if not isinstance(t, str): return ""
    t = t.lower()
    t = unicodedata.normalize("NFKD", t).encode("ascii","ignore").decode("utf-8")
    t = re.sub(r"[^a-z\s]", " ", t)
    return " ".join([p for p in t.split() if len(p) > 2])

df["texto_limpio"] = df["texto_limpio"].apply(limpiar)

train_df, test_df = train_test_split(df, test_size=0.2, random_state=42, stratify=df["categoria"])
train_df.to_csv("train_bayes.csv", index=False)
test_df.to_csv("test_bayes.csv", index=False)
print("Dataset dividido (80 % entrenamiento / 20 % prueba).")
