//Variaveis:
const apiKeyInput = document.getElementById('apiKey');
const gameSelect = document.getElementById('gameSelect');
const questionInput = document.getElementById('questionInput');
const askButton = document.getElementById('askButton');
const aiResponse = document.getElementById('aiResponse');
const form = document.getElementById('form');

const markdownToHTML = (text) => {
  const converter = new showdown.Converter(); //Criação de um obj também
  return converter.makeHtml(text);
}
 
/*async = assicrono - signigica que em algum momento iremos sair da
 aplicação e ir para uma outra qualquer e retornar para a aplicação 
 dentro da função - neste caso a saída será para a API do google */

const perguntarIA = async (question, game, apiKey) => {
    const model = "gemini-2.0-flash";
    //Template Strings = ` `
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`; // link API
    //Engenharia de prompt
    const pergunta = `
      ## Especialidade
      Você é um especialista assistente de meta para o jogo ${game}

      ## Tarefa
      Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, build e dicas

      ## Regras
      - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
      - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'
      - Considere a data atual ${new Date().toLocaleDateString()}
      - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
      - Nunca responsda itens que vc não tenha certeza de que existe no patch atual.

      ## Resposta
      - Economize na resposta, seja direto e responda no máximo 500 caracteres
      - Responda em markdown
      - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.

      ## Exemplo de resposta
      pergunta do usuário: Melhor build rengar jungle
      resposta: A build mais atual é: \n\n **Itens:**\n\n coloque os itens aqui.\n\n**Runas:**\n\nexemplo de runas\n\n

      ---
      Aqui está a pergunta do usuário: ${question}
      `

    // Objeto em js sem nome fica entre = [{}]
    const contents = [{
      //Agente
      role: "user",
      parts: [{
        text: pergunta
      }]
    }];

    //Agente
    const tools = [{
      google_search: {}
    }]

    //chamada API - cominicação com o Gemini

  /*await - esperar - significa...
    fetch - ... */
  const response = await fetch(geminiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    //stringify - serve para transformar um obj javascript para o formato JSON
    body: JSON.stringify({
      contents,
      //Agente
      tools
    })
  })

  const data = await response.json();
  console.log({data});
  return data.candidates[0].content.parts[0].text;
}  
// Função de exemplo: 

// event = (argunmento)
const enviarFormulario = async (event) => {
  event.preventDefault(); // deixa de enviar o padrão, no caso, não recarrega a pagina
  const apiKey = apiKeyInput.value;
  const game = gameSelect.value;
  const question = questionInput.value;

  if(apiKey == '' || game == '' || question == ''){
    alert("Por favor, preencha todos os campos");
    return; // Para a execução da função
  }
  askButton.disabled = true; /* desabilita o uso do botão, após clicado pela primeira vez
  o que limita a quantidade de clicks*/
  askButton.textContent = 'Perguntando...';
  askButton.classList.add('loading'); // Coloca o botão para carregar

  // Tratamento de erros/Retorna o botão para o estado original: 

  try{
    // Perguntar para IA: 
    const text = await perguntarIA(question, game, apiKey);
    aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text);
    aiResponse.classList.remove('hidden');

  }catch(error){
    console.log('Erro: ', error);
  }finally{
    //Faz o botão voltar ao normal
    askButton.disabled = false;
    askButton.textContent = 'Perguntar';
    askButton.classList.remove('loading');
  }
}

// Adicione um ouvidor de evento = sempre que ocorrer um evento
// submit = tipo do evento
form.addEventListener('submit', enviarFormulario);

/*Exercicio de treino: fazer um segundo prompt especifico para treinar a IA com as informações de valorat
e fazer uma condição para verificar se a seleção do jogo é igual a valorant ou a outra opção selecionada, 
fazer isso para os demais jogos também*/