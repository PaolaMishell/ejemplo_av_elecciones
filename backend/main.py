# backend/main.py
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
import pdfplumber
import pytesseract
import pandas as pd
import docx
from PIL import Image
from io import BytesIO
from dotenv import load_dotenv
import openai

# Cargar API Key desde .env
load_dotenv()
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))  # ✅ Crear cliente OpenAI

app = FastAPI(title="Chatbot de Análisis de Documentos")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)
document_content = ""  # Almacena el contenido del archivo subido

# ✅ Función para extraer texto de cualquier tipo de archivo
def extract_text(file: BytesIO, filename: str) -> str:
    file_ext = filename.split(".")[-1].lower()

    try:
        if file_ext == "pdf":
            with pdfplumber.open(file) as pdf:
                return "\n".join(page.extract_text() for page in pdf.pages if page.extract_text())

        elif file_ext in ["jpg", "jpeg", "png"]:
            image = Image.open(file)
            return pytesseract.image_to_string(image)

        elif file_ext in ["docx"]:
            doc = docx.Document(file)
            return "\n".join([para.text for para in doc.paragraphs if para.text.strip()])

        elif file_ext in ["txt"]:
            return file.read().decode("utf-8")

        elif file_ext in ["csv"]:
            df = pd.read_csv(file)
            return df.to_string()

        elif file_ext in ["xls", "xlsx"]:
            df = pd.read_excel(file)
            return df.to_string()

        else:
            return "Formato no soportado. Intenta con PDF, Word, Excel, TXT, CSV o imágenes."

    except Exception as e:
        return f"❌ Error procesando el archivo: {str(e)}"

# ✅ Endpoint para subir archivos
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    global document_content

    file_bytes = await file.read()
    file_stream = BytesIO(file_bytes)

    document_content = extract_text(file_stream, file.filename)

    if "Error" in document_content or "Formato no soportado" in document_content:
        raise HTTPException(status_code=400, detail=f"No se pudo procesar el archivo. {document_content}")

    return {"message": "Archivo subido correctamente. Ahora puedes hacer preguntas sobre él."}

# ✅ Endpoint para hacer preguntas sobre el documento
@app.post("/ask")
async def ask_question(question: str = Form(...)):
    global document_content
    if not document_content:
        return {"error": "No hay un documento cargado. Sube un archivo primero."}

    try:
        response = client.chat.completions.create(  # ✅ Método correcto en la nueva versión
            model="gpt-4-turbo",
            messages=[
                {"role": "system", "content": "Eres un asistente que responde preguntas basadas en el contenido del documento proporcionado"},
                {"role": "user", "content": f"Documento:\n{document_content}\n\nPregunta: {question}"}
            ]
        )

        return {"answer": response.choices[0].message.content}  # ✅ Obtener respuesta correctamente

    except Exception as e:
        return {"error": str(e)}