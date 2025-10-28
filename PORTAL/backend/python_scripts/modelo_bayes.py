import pandas as pd
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report, accuracy_score

train = pd.read_csv("train_bayes.csv")
test = pd.read_csv("test_bayes.csv")

vectorizer = TfidfVectorizer(max_features=2000)
X_train = vectorizer.fit_transform(train["texto_limpio"])
y_train = train["categoria"]

X_test = vectorizer.transform(test["texto_limpio"])
y_test = test["categoria"]

model = MultinomialNB()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

print("Precisión:", round(accuracy_score(y_test, y_pred)*100, 2), "%")
print("\n", classification_report(y_test, y_pred))

pickle.dump(model, open("modelo_bayes.pkl","wb"))
pickle.dump(vectorizer, open("vectorizer_bayes.pkl","wb"))
print("Modelo y vectorizador guardados correctamente.")
