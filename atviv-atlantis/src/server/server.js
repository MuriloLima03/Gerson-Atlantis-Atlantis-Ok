const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Add this line to serve static files from the ui directory
app.use(express.static(path.join(__dirname, '..', 'ui')));

const db = require(path.join(__dirname, 'db.js'));

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: true, 
    message: err.message || 'Internal server error'
  });
});

// Success response helper
function success(data) {
  return { error: false, data };
}

// Accommodation Types definition
const ACCOMMODATION_TYPES = {
  SolteiroSimples: {
    type: "SolteiroSimples",
    key: "SolteiroSimples",
    description: "Acomoda��o simples para solteiro(a)",
    CamaSolteiro: 1,
    CamaCasal: 0,
    Climatizacao: false,
    Garagem: 1,
    Suite: 0
  },
  CasalSimples: {
    type: "CasalSimples",
    key: "CasalSimples",
    description: "Acomoda��o simples para casal",
    CamaSolteiro: 0,
    CamaCasal: 1,
    Climatizacao: false,
    Garagem: 1,
    Suite: 0
  },
  FamiliaSimples: {
    type: "FamiliaSimples",
    key: "FamiliaSimples",
    description: "Acomoda��o para fam�lia com at� duas crian�as",
    CamaSolteiro: 2,
    CamaCasal: 1,
    Climatizacao: true,
    Garagem: 1,
    Suite: 1
  },
  FamiliaMais: {
    type: "FamiliaMais",
    key: "FamiliaMais",
    description: "Acomoda��o para fam�lia com at� cinco crian�as",
    CamaSolteiro: 3,
    CamaCasal: 1,
    Climatizacao: true,
    Garagem: 2,
    Suite: 2
  },
  FamiliaSuper: {
    type: "FamiliaSuper",
    key: "FamiliaSuper", 
    description: "Acomoda��o para at� duas familias",
    CamaSolteiro: 4,
    CamaCasal: 2,
    Climatizacao: true,
    Garagem: 2,
    Suite: 2
  },
  SolteiroMais: {
    type: "SolteiroMais",
    key: "SolteiroMais",
    description: "Acomoda��o com garagem para solteiro(a)",
    CamaSolteiro: 1,
    CamaCasal: 0,
    Climatizacao: true,
    Garagem: 2,
    Suite: 1
  }
};

// --- Health check endpoint
app.get('/api/health', async (req,res) => {
  const dbConnected = db.isConnected();
  res.json({
    status: dbConnected ? 'ok' : 'degraded',
    time: new Date(),
    database: dbConnected ? 'connected' : 'disconnected'
  });
});

// --- Accommodation Types endpoints
app.get('/api/v1/accommodation-types', (req, res) => {
  try {
    const types = Object.entries(ACCOMMODATION_TYPES).map(([key, spec]) => ({
      key,
      description: spec.description
    }));
    res.json({ data: types });
  } catch(err) {
    console.error('Error fetching accommodation types:', err);
    res.status(500).json({
      error: true,
      message: 'Failed to fetch accommodation types'
    });
  }
});

app.get('/api/v1/accommodation-types-specs', (req, res) => {
  try {
    const specs = Object.entries(ACCOMMODATION_TYPES).map(([key, spec]) => ({
      key,
      ...spec
    }));
    res.json({ data: specs });
  } catch(err) {
    console.error('Error fetching accommodation specs:', err);
    res.status(500).json({
      error: true,
      message: 'Failed to fetch accommodation specifications'
    });
  }
});

// --- Accommodations endpoints
app.get('/api/v1/accommodations', async (req, res, next) => {
  try {
    const items = await db.models.Acomodacao.find().lean();
    const accommodations = items.map(item => {
      const typeSpec = ACCOMMODATION_TYPES[item.type];
      return {
        id: String(item._id),
        name: item.name || '',
        type: item.type,
        CamaSolteiro: item.CamaSolteiro || typeSpec?.CamaSolteiro || 0,
        CamaCasal: item.CamaCasal || typeSpec?.CamaCasal || 0,
        Climatizacao: item.Climatizacao || typeSpec?.Climatizacao || false,
        Garagem: item.Garagem || typeSpec?.Garagem || 0,
        Suite: item.Suite || typeSpec?.Suite || 0,
        rate: item.rate || 0
      };
    });
    res.json(success(accommodations));
  } catch(err) {
    next(err);
  }
});

app.post('/api/v1/accommodations', async (req, res, next) => {
  try {
    const item = new db.models.Acomodacao(req.body);
    await item.save();
    res.json(success(item));
  } catch(err) {
    next(err);
  }
});

app.put('/api/v1/accommodations/:id', async (req, res, next) => {
  try {
    const item = await db.models.Acomodacao.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!item) {
      return res.status(404).json({
        error: true,
        message: 'Accommodation not found'
      });
    }
    res.json(success(item));
  } catch(err) {
    next(err);
  }
});

app.delete('/api/v1/accommodations/:id', async (req, res, next) => {
  try {
    const item = await db.models.Acomodacao.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({
        error: true,
        message: 'Accommodation not found'
      });
    }
    res.json(success(item));
  } catch(err) {
    next(err);
  }
});

// --- Start server
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await db.connect();
    console.log('Connected to MongoDB');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch(err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
