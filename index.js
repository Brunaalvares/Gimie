const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 10000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('API Gimie rodando! Acesse /links para ver os produtos.');
});

app.get('/links', (req, res) => {
  res.json([
    {
      nome: "Tênis Nike",
      preco: "R$ 399,90",
      imagem: "https://exemplo.com/tenis.jpg",
      url: "https://nike.com/tenis"
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
