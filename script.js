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
    const pergunta = `Olha, tenho esse jogo ${game} e queria saber ${question}`;

    // Objeto em js sem nome fica entre = [{}]
    const contents = [{
      parts: [{
        text: pergunta
      }]
    }];

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
      contents
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