const express = require('express');
const axios = require('./node_modules/axios/index.d.cts');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

let produtos = []; // banco de dados temporário

// Rota para adicionar link
app.post('/api/links', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL é obrigatória' });
  }

  try {
    const response = await axios.get(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
    const data = response.data.data;

    const novoProduto = {
      id: produtos.length + 1,
      nome: data.title || 'Sem título',
      preco: extrairPreco(data.description) || 'R$ --',
      imagem: data.image?.url || '',
      url: data.url || url
    };

    produtos.push(novoProduto);
    res.status(201).json(novoProduto);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Erro ao extrair dados da URL' });
  }
});

// Rota para listar links
app.get('/api/links', (req, res) => {
  res.json(produtos);
});

// Função para extrair preço do texto
function extrairPreco(texto) {
  const match = texto?.match(/R\\$\\s?\\d+[.,]?\\d+/);
  return match ? match[0] : null;
}

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
