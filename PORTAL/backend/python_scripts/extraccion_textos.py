import mysql.connector
import fitz  
import pytesseract
from PIL import Image
import io
import whisper
import moviepy as mp
import os

conexion = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",  # cambia según tu configuración
    database="proyecto_videojuego_portal"
)
cursor = conexion.cursor(dictionary=True)

print("Cargando modelo Whisper (esto puede tardar unos minutos)...")
modelo_whisper = whisper.load_model("base")


cursor.execute("SELECT id_recurso, tipo, archivo FROM recurso WHERE archivo IS NOT NULL;")
recursos = cursor.fetchall()

print(f"📦 Recursos detectados: {len(recursos)}")

for r in recursos:
    texto = ""
    tipo = r["tipo"].lower()
    contenido = io.BytesIO(r["archivo"])

    try:
        # PDFs
        if tipo == "pdf":
            pdf = fitz.open(stream=contenido, filetype="pdf")
            for page in pdf:
                texto += page.get_text("text")

        # Imágenes o infografías
        elif tipo in ["imagen", "image", "infografia"]:
            img = Image.open(contenido)
            texto = pytesseract.image_to_string(img, lang="spa")

        # Audios (usa Whisper)
        elif tipo == "audio":
            temp_audio = "temp_audio.wav"
            with open(temp_audio, "wb") as f:
                f.write(contenido.getbuffer())
            result = modelo_whisper.transcribe(temp_audio, language="es")
            texto = result["text"]
            os.remove(temp_audio)

        # Videos (extrae audio y lo pasa a Whisper)
        elif tipo == "video":
            temp_video = "temp_video.mp4"
            with open(temp_video, "wb") as f:
                f.write(contenido.getbuffer())

            clip = mp.VideoFileClip(temp_video)
            clip.audio.write_audiofile("temp_audio.wav")

            result = modelo_whisper.transcribe("temp_audio.wav", language="es")
            texto = result["text"]

            clip.close()
            os.remove(temp_video)
            os.remove("temp_audio.wav")

        else:
            texto = "[Tipo de recurso no compatible para extracción automática]"

        try:
            cursor.execute(
                "INSERT INTO recurso_texto (id_recurso, texto_limpio) VALUES (%s, %s) "
                "ON DUPLICATE KEY UPDATE texto_limpio = VALUES(texto_limpio);",
                (r["id_recurso"], texto)
            )
        except:
            cursor.execute(
                "UPDATE recurso SET texto_extraido = %s WHERE id_recurso = %s;",
                (texto, r["id_recurso"])
            )

        conexion.commit()
        print(f"✅ Texto extraído y guardado para recurso {r['id_recurso']} ({tipo})")

    except Exception as e:
        print(f"❌ Error en recurso {r['id_recurso']}: {e}")

conexion.close()
print("🏁 Extracción completada.")
