const axios = require('axios');

let produtos = []; // Armazena os links em memória temporária

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL é obrigatória' });

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
      return res.status(201).json(novoProduto);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao extrair dados' });
    }

  } else if (req.method === 'GET') {
    return res.status(200).json(produtos);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

function extrairPreco(texto) {
  const match = texto?.match(/R\\$\\s?\\d+[.,]?\\d+/);
  return match ? match[0] : null;
}
