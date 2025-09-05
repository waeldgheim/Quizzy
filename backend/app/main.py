from fastapi import FastAPI, UploadFile, File

app = FastAPI(title="Quizzy Backend")

@app.get("/")
def read_root():
    return {"message": "Quizzy backend is running!"}

@app.post("/upload-document/")
async def upload_document(file: UploadFile = File(...)):
    # For now, just return file info
    return {"filename": file.filename, "content_type": file.content_type}
