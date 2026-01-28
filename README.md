### 🏗 Project Structure

```text
TEE-AOF/
├── backend/                # Python (FastAPI/Flask)
│   ├── main.py             # Entry point
│   ├── requirements.txt    # Python dependencies
│   └── venv/               # Virtual environment
├── frontend/               # React (Vite)
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
└── .gitignore              # Ignores both node_modules and venv
```
<hr \>

## Setup
## Clone the repository

```
git clone https://github.com/rxsemxrriee/TEE-AOF && cd TEE-AOF
```
## Backend setup
```
cd backend
python -m venv venv
source venv/bin/activate  # For Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
## Frontend setup
```
cd frontend
npm install
npm run dev
```

<hr \>

## Techstacks:
<div style="display: flex; align-items: flex-start;"><h1>React(frontend)</h1><img src="https://techstack-generator.vercel.app/react-icon.svg" alt="icon" width="65" height="65" /></div>
<div style="display: flex; align-items: flex-start;"><h1>FastAPI(backend entry point)</h1><img src="https://techstack-generator.vercel.app/python-icon.svg" alt="icon" width="65" height="65" /></div>
<div style="display: flex; align-items: flex-start;"><h1>Github(version control)</h1><img src="https://techstack-generator.vercel.app/github-icon.svg" alt="icon" width="65" height="65" /></div>
<div style="display: flex; align-items: flex-start;"><h1>MySQL(Database)</h1><img src="https://techstack-generator.vercel.app/mysql-icon.svg" alt="icon" width="65" height="65" /></div>
