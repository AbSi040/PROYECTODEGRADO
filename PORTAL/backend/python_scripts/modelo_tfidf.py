import pandas as pd
import pickle
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer

df = pd.read_csv("dataset_tfidf_limpio.csv")

vectorizer = TfidfVectorizer(max_features=2000)
X = vectorizer.fit_transform(df["texto_limpio"])

# Guardar modelo y matrices
pickle.dump(vectorizer, open("tfidf_vectorizer.pkl", "wb"))
np.save("tfidf_matrix.npy", X.toarray())
df[["id_recurso"]].to_csv("tfidf_ids.csv", index=False)

print(f"Modelo TF-IDF entrenado ({X.shape[0]} recursos, {X.shape[1]} términos).")
