db.principio.insertMany([
  {
    "_id": "PRI001",
    "nombre": "Paracetamol",
    "familias": ["Analgésicos", "Antipiréticos"],
    "incompatibilidades": ["PRI007", "PRI016", "PRI018"]
  },
  {
    "_id": "PRI002",
    "nombre": "Ibuprofeno",
    "familias": ["Analgésicos", "Antipiréticos", "Antiinflamatorios"],
    "incompatibilidades": ["PRI014", "PRI020", "PRI031", "PRI050", "PRI058", "PRI070"]
  },
  {
    "_id": "PRI003",
    "nombre": "Omeprazol",
    "familias": ["Antiácidos"],
    "incompatibilidades": ["PRI012"]
  },
  {
    "_id": "PRI004",
    "nombre": "Loratadina",
    "familias": ["Antihistamínicos"],
    "incompatibilidades": ["PRI007", "PRI005", "PRI006"]
  },
  {
    "_id": "PRI005",
    "nombre": "Cetirizina",
    "familias": ["Antihistamínicos"],
    "incompatibilidades": ["PRI007", "PRI004", "PRI006"]
  },
  {
    "_id": "PRI006",
    "nombre": "Desloratadina",
    "familias": ["Antihistamínicos"],
    "incompatibilidades": ["PRI007", "PRI004", "PRI005"]
  },
  {
    "_id": "PRI007",
    "nombre": "Clorfenamina",
    "familias": ["Antihistamínicos"],
    "incompatibilidades": ["PRI001", "PRI004", "PRI005", "PRI006", "PRI009", "PRI016", "PRI017", "PRI018", "PRI019"]
  },
  {
    "_id": "PRI008",
    "nombre": "Pseudoefedrina",
    "familias": ["Antitusígenos"],
    "incompatibilidades": ["PRI010", "PRI014"]
  },
  {
    "_id": "PRI009",
    "nombre": "Dextrometorfano",
    "familias": ["Antitusígenos"],
    "incompatibilidades": ["PRI007", "PRI013", "PRI016", "PRI024", "PRI052", "PRI054", "PRI061"]
  },
  {
    "_id": "PRI010",
    "nombre": "Cafeína",
    "familias": [],
    "incompatibilidades": ["PRI008"]
  },
  {
    "_id": "PRI011",
    "nombre": "Ácido ascórbico",
    "familias": ["Vitaminas"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI012",
    "nombre": "Esomeprazol",
    "familias": ["Antiácidos"],
    "incompatibilidades": ["PRI003"]
  },
  {
    "_id": "PRI013",
    "nombre": "Carbocisteína",
    "familias": ["Mucolíticos"],
    "incompatibilidades": ["PRI009"]
  },
  {
    "_id": "PRI014",
    "nombre": "Candesartán",
    "familias": ["Antihipertensivos"],
    "incompatibilidades": ["PRI002", "PRI008", "PRI020"]
  },
  {
    "_id": "PRI015",
    "nombre": "Amoxicilina",
    "familias": ["Antibióticos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI016",
    "nombre": "Lorazepam",
    "familias": ["Ansiolíticos", "Hipnóticos", "Sedantes"],
    "incompatibilidades": ["PRI001", "PRI007", "PRI009", "PRI017", "PRI018", "PRI055", "PRI069"]
  },
  {
    "_id": "PRI017",
    "nombre": "Loperamida hidrocloruro",
    "familias": ["Antidiarreicos"],
    "incompatibilidades": ["PRI007", "PRI016"]
  },
  {
    "_id": "PRI018",
    "nombre": "Diazepam",
    "familias": ["Ansiolíticos", "Hipnóticos", "Sedantes"],
    "incompatibilidades": ["PRI001", "PRI007", "PRI016", "PRI069"]
  },
  {
    "_id": "PRI019",
    "nombre": "Ebastina",
    "familias": ["Antihistamínicos"],
    "incompatibilidades": ["PRI007"]
  },
  {
    "_id": "PRI020",
    "nombre": "Ácido acetilsalicílico",
    "familias": ["Analgésicos", "Antipiréticos", "Antiagregantes"],
    "incompatibilidades": ["PRI002", "PRI014", "PRI031", "PRI050"]
  },
  {
    "_id": "PRI021",
    "nombre": "Atorvastatina",
    "familias": ["Antihipertensivos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI022",
    "nombre": "Metformina",
    "familias": ["Antidiabéticos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI023",
    "nombre": "Salbutamol",
    "familias": ["Broncodilatadores"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI024",
    "nombre": "Sertralina",
    "familias": ["Antidepresivos"],
    "incompatibilidades": ["PRI009"]
  },
  {
    "_id": "PRI025",
    "nombre": "Simvastatina",
    "familias": ["Antihipertensivos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI026",
    "nombre": "Ramipril",
    "familias": ["Antihipertensivos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI027",
    "nombre": "Amlodipino",
    "familias": ["Antihipertensivos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI028",
    "nombre": "Vardenafilo",
    "familias": ["Antihipertensivos"],
    "incompatibilidades": ["PRI034"]
  },
  {
    "_id": "PRI029",
    "nombre": "Rosuvastatina",
    "familias": ["Antihipertensivos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI030",
    "nombre": "Mometasona",
    "familias": ["Antiinflamatorios"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI031",
    "nombre": "Diclofenaco",
    "familias": ["Antiinflamatorios"],
    "incompatibilidades": ["PRI002", "PRI020", "PRI050", "PRI058", "PRI070"]
  },
  {
    "_id": "PRI032",
    "nombre": "Azitromicina",
    "familias": ["Antibióticos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI033",
    "nombre": "Sildenafilo",
    "familias": ["Antihipertensivos"],
    "incompatibilidades": ["PRI034"]
  },
  {
    "_id": "PRI034",
    "nombre": "Tamsulosina",
    "familias": ["Diuréticos"],
    "incompatibilidades": ["PRI028", "PRI033", "PRI064"]
  },
  {
    "_id": "PRI035",
    "nombre": "Butilescopolamina",
    "familias": ["Analgésicos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI036",
    "nombre": "Metamizol",
    "familias": ["Analgésicos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI037",
    "nombre": "Alginato de Sodio",
    "familias": ["Antiácidos"],
    "incompatibilidades": ["PRI044"]
  },
  {
    "_id": "PRI038",
    "nombre": "Diosmina",
    "familias": ["Antihipertensivos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI039",
    "nombre": "Levotiroxina",
    "familias": ["Vitaminas"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI040",
    "nombre": "Clotrimazol",
    "familias": ["Antifúngicos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI041",
    "nombre": "Pregabalina",
    "familias": ["Ansiolíticos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI042",
    "nombre": "Vareniclina",
    "familias": ["Ansiolíticos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI043",
    "nombre": "Latanoprost",
    "familias": ["Antihipertensivos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI044",
    "nombre": "Ciprofloxacino",
    "familias": ["Antibióticos"],
    "incompatibilidades": ["PRI037", "PRI065", "PRI072"]
  },
  {
    "_id": "PRI045",
    "nombre": "Nifedipino",
    "familias": ["Antihipertensivos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI046",
    "nombre": "Betahistina",
    "familias": ["Antihipertensivos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI047",
    "nombre": "Polivitamínico",
    "familias": ["Vitaminas"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI048",
    "nombre": "Testosterona",
    "familias": ["Vitaminas"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI049",
    "nombre": "Acarbosa",
    "familias": ["Antidiabéticos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI050",
    "nombre": "Aceclofenaco",
    "familias": ["Antiinflamatorios"],
    "incompatibilidades": ["PRI002", "PRI020", "PRI031", "PRI058", "PRI070"]
  },
  {
    "_id": "PRI051",
    "nombre": "Cleboprida",
    "familias": ["Antidiarreicos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI052",
    "nombre": "Escitalopram",
    "familias": ["Antidepresivos"],
    "incompatibilidades": ["PRI009"]
  },
  {
    "_id": "PRI053",
    "nombre": "Olmesartán",
    "familias": ["Antihipertensivos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI054",
    "nombre": "Duloxetina",
    "familias": ["Antidepresivos"],
    "incompatibilidades": ["PRI009"]
  },
  {
    "_id": "PRI055",
    "nombre": "Lormetazepam",
    "familias": ["Ansiolíticos"],
    "incompatibilidades": ["PRI016"]
  },
  {
    "_id": "PRI056",
    "nombre": "Valsartán",
    "familias": ["Antihipertensivos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI057",
    "nombre": "Gliclazida",
    "familias": ["Antidiabéticos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI058",
    "nombre": "Clopidogrel",
    "familias": ["Antiagregantes"],
    "incompatibilidades": ["PRI002", "PRI031", "PRI050"]
  },
  {
    "_id": "PRI059",
    "nombre": "Fluticasona",
    "familias": ["Antiinflamatorios"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI060",
    "nombre": "Pantoprazol",
    "familias": ["Antiácidos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI061",
    "nombre": "Venlafaxina",
    "familias": ["Antidepresivos"],
    "incompatibilidades": ["PRI009"]
  },
  {
    "_id": "PRI062",
    "nombre": "Levetiracetam",
    "familias": ["Ansiolíticos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI063",
    "nombre": "Bisoprolol",
    "familias": ["Antihipertensivos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI064",
    "nombre": "Tadalafilo",
    "familias": ["Antihipertensivos"],
    "incompatibilidades": ["PRI034"]
  },
  {
    "_id": "PRI065",
    "nombre": "Hierro",
    "familias": ["Vitaminas"],
    "incompatibilidades": ["PRI044"]
  },
  {
    "_id": "PRI066",
    "nombre": "Polimixina B",
    "familias": ["Antibióticos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI067",
    "nombre": "Fosfomicina",
    "familias": ["Antibióticos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI068",
    "nombre": "Cefuroxima",
    "familias": ["Antibióticos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI069",
    "nombre": "Alprazolam",
    "familias": ["Ansiolíticos"],
    "incompatibilidades": ["PRI016", "PRI018"]
  },
  {
    "_id": "PRI070",
    "nombre": "Rivaroxabán",
    "familias": ["Anticoagulantes"],
    "incompatibilidades": ["PRI002", "PRI031", "PRI050"]
  },
  {
    "_id": "PRI071",
    "nombre": "Fesoterodina",
    "familias": ["Diuréticos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI072",
    "nombre": "Almagato",
    "familias": ["Antiácidos"],
    "incompatibilidades": ["PRI044"]
  },
  {
    "_id": "PRI073",
    "nombre": "Azelastina",
    "familias": ["Antihistamínicos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI074",
    "nombre": "Bilastina",
    "familias": ["Antihistamínicos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI075",
    "nombre": "Lansoprazol",
    "familias": ["Antiácidos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI076",
    "nombre": "Ácido Clavulánico",
    "familias": ["Antibióticos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI077",
    "nombre": "Hesperidina",
    "familias": ["Antihipertensivos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI078",
    "nombre": "Neomicina",
    "familias": ["Antibióticos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI079",
    "nombre": "Gramicidina",
    "familias": ["Antibióticos"],
    "incompatibilidades": []
  },
  {
    "_id": "PRI080",
    "nombre": "Bicarbonato de Sodio",
    "familias": ["Antiácidos"],
    "incompatibilidades": []
  }
]);