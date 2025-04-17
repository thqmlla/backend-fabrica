import express from 'express';
import cors from 'cors';
import {
  listarIngredientesPorTipo,
  adicionarIngrediente,
  excluirIngrediente,
} from './servico/ingredienteServico.js';

const app = express();
app.use(cors());
app.use(express.json());

// Listar ingredientes por tipo
app.get('/ingredientes/:tipo', async (req, res) => {
  const { tipo } = req.params;
  try {
    const ingredientes = await listarIngredientesPorTipo(tipo);
    res.json(ingredientes);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// Adicionar novo ingrediente
app.post('/ingredientes', async (req, res) => {
  const { nome, tipo, valor } = req.body;
  try {
    const novo = await adicionarIngrediente({ nome, tipo, valor });
    res.status(201).json(novo);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// Excluir ingrediente por id
app.delete('/ingredientes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const sucesso = await excluirIngrediente(id);
    if (sucesso) {
      res.json({ mensagem: 'Ingrediente excluído com sucesso' });
    } else {
      res.status(404).json({ erro: 'Ingrediente não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao excluir ingrediente' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
