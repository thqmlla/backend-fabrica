import express from 'express';
import cors from 'cors';
import {
  listarIngredientesPorTipo,
  adicionarIngrediente,
  excluirIngrediente
} from './servico/ingredienteServico.js';
import {
  listarFeedbacks,
  adicionarFeedback,
  excluirFeedback
} from './servico/feedbackServico.js';

const app = express();
app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));



app.get('/ingredientes/:tipo', async (req, res) => {
  const { tipo } = req.params;
  try {
    const ingredientes = await listarIngredientesPorTipo(tipo);
    res.json(ingredientes);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

app.post('/ingredientes', async (req, res) => {
  const { nome, tipo, valor } = req.body;
  try {
    const novo = await adicionarIngrediente({ nome, tipo, valor });
    res.status(201).json(novo);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

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

app.get('/feedbacks', async (req, res) => {
  try {
    const feedbacks = await listarFeedbacks();
    // retorna o feedbacks com data_criacao no formato ISO do banco
    res.json(feedbacks);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

app.post('/feedbacks', async (req, res) => {
  const { id_cliente, estrelas, comentario, foto } = req.body;
  try {
    console.log(`Recebendo feedback - tamanho foto base64: ${foto?.length || 0} caracteres`);
    const novoFeedback = await adicionarFeedback({
      id_cliente,
      estrelas,
      comentario,
      foto
    });
    res.status(201).json({
      id: novoFeedback.id || novoFeedback,
      mensagem: 'Feedback adicionado com sucesso'
    });
  } catch (error) {
    console.error('Erro no POST /feedbacks:', error);
    res.status(400).json({ erro: 'Não foi possível cadastrar o feedback' });
  }
});

app.delete('/feedbacks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const sucesso = await excluirFeedback(id);
    if (sucesso) {
      res.json({ mensagem: 'Feedback excluído com sucesso' });
    } else {
      res.status(404).json({ erro: 'Feedback não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao excluir feedback' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
