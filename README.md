# TEE-AOF
Interactive buffet ordering website
buffet-project/
├── backend/
    ├── app/
    │   ├── api/                # API route handlers (Controllers)
    │   │   ├── orders.py
    │   │   └── menu.py
    │   ├── core/               # Security, Auth, and Global Config
    │   ├── models/             # OOP Classes (Database Blueprints)
    │   │   ├── base.py         # Base Class for inheritance
    │   │   ├── item.py         # MenuItem, Dish, Drink classes
    │   │   └── order.py        # Order and Table classes
    │   ├── schemas/            # Pydantic models (Data Validation)
    │   ├── services/           # Business Logic (Calculations, logic)
    │   └── main.py             # Entry point
├── tests/                  # Unit tests for QA
├── requirements.txt        # Python dependencies
└── .env                    # Environment variables (DB URLs, etc.)
├── frontend/               # React (Vite/CRA) code
├── docs/                   # API specs, DB diagrams, and meeting notes
├── .gitignore
└── README.md               # Setup instructions for the team
