(function(){        
    var cnv = document.querySelector("canvas");
    var ctx = cnv.getContext("2d");
    var gameStarted = false;
   
    cnv.addEventListener("click" , function(){
        if(!gameStarted){
            gameStarted = true;
        }
    });
   
    var WIDTH = cnv.width, HEIGHT = cnv.height;
   
    var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
    var mvLeft = mvUp = mvRight = mvDown = false;
 
    var tileSize = 64;
    var tileSrcSize = 96;
 
    var img = new Image();
    img.src = "img/img.png";
    img.addEventListener("load",function(){
        requestAnimationFrame(loop,cnv);
    },false);
 
    const curupira = {
        x : 5 * tileSize,
        y : 3 * tileSize,
        width: 36,
        height:42,
        img : new Image()
    };
    curupira.img.src= "img/curupira.gif"
 
    //variavel da gaiola
    const gaiolaImg = new Image();
    gaiolaImg.src = "img/gaiola.png";
   
    // variavel pra o sistema de quiz
    var quizActive = false;
    var currentQuizAnimal = null;
    var currentQuizFogo = null;
    var quizOptions = [];
 
    // Variáveis para controle de fase
    var faseAtual = 1;
    var faseConfig = {
        1: {
            tipo: "animais",
            animaisParaPassar: 5,
            totalAnimais: 7,
            dificuldade: "Fácil"
        },
        2: {
            tipo: "fogo",
            fogosParaApagar: 3,
            totalFogos: 3,
            dificuldade: "Médio"
        }
    };
    var telaVitoriaAtiva = false;
    var telaDerrotaAtiva = false;
    var telaCreditosAtiva = false;
    var jogoPausado = false;
 
    // Sistema de fogo para fase 2
    function Fogo(x, y, pergunta, respostaCorreta) {
        this.img = new Image();
        this.img.src = "img/fogo.png";
        this.tipo = 'Fogo';
        this.pergunta = pergunta;
        this.respostaCorreta = respostaCorreta.toLowerCase();
        this.apagado = false;
        this.jaQuestionado = false;
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.id = Math.random().toString(36).substr(2, 9);
    }
 
    var fogos = [];
    var fogosApagados = 0;
 
    // Banco de perguntas para fogos
    const bancoFogos = [
        {
            pergunta: 'Qual é o principal impacto do fogo na biodiversidade da floresta?',
            respostaCorreta: 'morte de espécies animais e vegetais'
        },
        {
            pergunta: 'Como o fogo afeta a qualidade do solo na floresta?',
            respostaCorreta: 'destrói nutrientes e mata microorganismos'
        },
        {
            pergunta: 'Qual é o efeito do fogo na capacidade da floresta de reter água?',
            respostaCorreta: 'reduz a infiltração e causa erosão'
        },
        {
            pergunta: 'Como o fogo prejudica a regeneração natural da floresta?',
            respostaCorreta: 'destrói sementes e mudas jovens'
        },
        {
            pergunta: 'Qual é o impacto do fogo na emissão de gases do efeito estufa?',
            respostaCorreta: 'libera carbono armazenado na vegetação'
        }
    ];
 
    function gerarOpcoesQuiz(respostaCorreta, tipo){
        if (tipo === 'animal') {
            const respostasIncorretas = {
                'arara': ['polinização de flores', 'controle de insetos', 'limpeza do solo', 'construção de ninhos'],
                'onça': ['dispersão de sementes', 'polinização', 'fertilização do solo', 'controle de plantas'],
                'tucano': ['polinização manual', 'controle de pragas', 'fertilização natural', 'limpeza de frutas'],
                'macaco': ['controle de predadores', 'polinização noturna', 'dispersão de água', 'proteção do solo'],
                'raposa': ['polinização cruzada', 'dispersão de sementes', 'fertilização orgânica', 'controle de plantas'],
                'leão': ['dispersão genética', 'polinização indireta', 'fertilização natural', 'controle vegetal']
            };
           
            if (!currentQuizAnimal) return [respostaCorreta, "Opção 1", "Opção 2", "Opção 3"];
           
            var tipoAnimal = currentQuizAnimal.tipo.toLowerCase().split(' ')[0];
            var incorretas = respostasIncorretas[tipoAnimal] || [
                'polinização de flores',
                'controle de insetos',
                'limpeza do solo',
                'fertilização natural'
            ];
           
            var opcoesIncorretas = [...incorretas].sort(() => Math.random() - 0.5).slice(0, 3);
            var todasOpcoes = [respostaCorreta, ...opcoesIncorretas];
           
            return todasOpcoes.sort(() => Math.random() - 0.5);
           
        } else if (tipo === 'fogo') {
            const respostasIncorretasFogo = {
                'biodiversidade': ['aumenta a variedade de espécies', 'melhora a competição entre animais', 'cria novos habitats', 'estimula migração'],
                'solo': ['aumenta a fertilidade natural', 'acelera decomposição', 'cria cinzas nutritivas', 'melhora drenagem'],
                'água': ['aumenta absorção no solo', 'melhora qualidade da água', 'cria novos riachos', 'aumenta umidade'],
                'regeneração': ['estimula crescimento rápido', 'prepara solo para plantio', 'remove árvores velhas', 'aumenta disponibilidade de luz'],
                'carbono': ['absorve mais CO2', 'melhora qualidade do ar', 'cria sumidouros de carbono', 'reduz metano']
            };
           
            var tipoFogo = '';
            if (respostaCorreta.includes('espécies') || respostaCorreta.includes('biodiversidade')) tipoFogo = 'biodiversidade';
            else if (respostaCorreta.includes('solo') || respostaCorreta.includes('nutrientes')) tipoFogo = 'solo';
            else if (respostaCorreta.includes('água') || respostaCorreta.includes('erosão')) tipoFogo = 'água';
            else if (respostaCorreta.includes('regeneração') || respostaCorreta.includes('sementes')) tipoFogo = 'regeneração';
            else if (respostaCorreta.includes('carbono') || respostaCorreta.includes('gases')) tipoFogo = 'carbono';
            else tipoFogo = 'biodiversidade';
           
            var incorretas = respostasIncorretasFogo[tipoFogo] || [
                'aumenta biodiversidade',
                'melhora qualidade do ar',
                'renova a vegetação',
                'controla pragas'
            ];
           
            var opcoesIncorretas = [...incorretas].sort(() => Math.random() - 0.5).slice(0, 3);
            var todasOpcoes = [respostaCorreta, ...opcoesIncorretas];
           
            return todasOpcoes.sort(() => Math.random() - 0.5);
        }
       
        return [respostaCorreta, "Opção 1", "Opção 2", "Opção 3"];
    }
 
    //variavel global para animais
    var animais = [];
    var animaisLibertados = 0;
    var totalAnimais = 7;
    var missaoAtiva = false;
 
    function Animal(imgSrc , tipo , pergunta , respostaCorreta){
        this.img = new Image();
        this.img.src = imgSrc;
        this.tipo = tipo;
        this.pergunta = pergunta;
        this.respostaCorreta = respostaCorreta.toLowerCase();
        this.liberto = false;
        this.jaQuestionado = false;
        this.x = 0;
        this.y = 0;
        this.width = 40;
        this.height = 40;
    }
 
    const bancoAnimals = [
        {
            imgSrc: 'img/arara.png',
            tipo:'Arara Vermelha',
            pergunta:'Qual é o papel crucial das araras na regeneração das florestas, relacionado à sua alimentação?',
            respostaCorreta:'dispersão de sementes'
        },
        {
            imgSrc: 'img/arara2.png',
            tipo:'Arara Azul',
            pergunta:'Como o hábito das araras de pousar e "descascar" troncos de árvores mortas pode beneficiar outras espécies?',
           respostaCorreta:'cria abrigos para outras espécies'
        },
        {
            imgSrc: 'img/onca.png',
            tipo:'Onça',
            pergunta:'Como a onça, como predador de topo, ajuda a manter o equilíbrio das populações de herbívoros (como capivaras e veados)?',
        respostaCorreta:'controle populacional'
        },
        {
            imgSrc: 'img/tucanin.png',
            tipo:'Tucano',
            pergunta:'Por que o tucano é um dos dispersores de sementes mais importantes das florestas tropicais, especialmente para árvores de grande porte?',
            respostaCorreta:'engole sementes grandes inteiras'
        },
        {
            imgSrc: 'img/macaco.png',
            tipo:'Macaco',
            pergunta:'Qual é a importância dos macacos como jardineiros da floresta?',
            respostaCorreta:'plantam árvores através das fezes'
        },
        {
            imgSrc: 'img/raposa.png',
            tipo:'Raposa',
            pergunta:'Como o hábito alimentar onívoro e oportunista da raposa ajuda no controle de pragas em ecossistemas agrícolas e naturais?',
            respostaCorreta:'come roedores e insetos'
        },
        {
            imgSrc: 'img/leao.png',
            tipo:'Leão',
            pergunta:'Como a caça cooperativa dos leões remove indivíduos doentes ou mais fracos das manadas de herbívoros, fortalecendo as populações de presas?',
            respostaCorreta:'seleção natural'
        }
    ];
 
    function gerarPosicaoAleatoria(){
        var posicaoValida = false;
        var tentativas = 0;
        var x = 0, y = 0;
 
        while (!posicaoValida && tentativas < 100){
            var coluna = Math.floor(Math.random() * maze[0].length);
            var linha = Math.floor(Math.random() * maze.length);
 
            if(maze[linha][coluna] === 0){
                x = coluna * tileSize + tileSize/4;
                y = linha * tileSize + tileSize/4;
 
                var distanciaJogador = Math.sqrt(
                    Math.pow(x - player.x , 2) + Math.pow(y - player.y, 2)
                );
               
                var distanciaCurupira = Math.sqrt(
                    Math.pow(x - curupira.x , 2) + Math.pow(y - curupira.y , 2)
                );
               
                var colisaoParede = false;
                for(var i = 0; i < walls.length; i++){
                    var wall = walls[i];
                    if (x < wall.x + wall.width &&
                        x + 32 > wall.x &&
                        y < wall.y + wall.height &&
                        y + 32 > wall.y){
                            colisaoParede = true;
                            break;
                        }
                }
               
                if (distanciaJogador > 200 &&
                    distanciaCurupira > 150 &&
                    !colisaoParede &&
                    x > tileSize && x < T_WIDTH - tileSize &&
                    y > tileSize && y < T_HEIGHT - tileSize){
                        posicaoValida = true;
                    }
            }
            tentativas++;
        }
        return {x : x , y : y};
    }
             
    function inicializarAnimais(){
        animais = [];
        var animaisDisponiveis = [...bancoAnimals];
        animaisDisponiveis.sort(() => Math.random() - 0.5);
       
        for (var i = 0; i < Math.min(totalAnimais, animaisDisponiveis.length); i++) {
            var animalData = animaisDisponiveis[i];
            var animal = new Animal(
                animalData.imgSrc,
                animalData.tipo,
                animalData.pergunta,
                animalData.respostaCorreta
            );
            var posicao = gerarPosicaoAleatoria();
            animal.x = posicao.x;
            animal.y = posicao.y;
           
            animais.push(animal);
        }
        console.log(`${animais.length} animais posicionados no mapa`);
    }
 
    // FUNÇÕES PARA FASE 2 (FOGO)
    function inicializarFogos() {
        fogos = [];
        fogosApagados = 0;
        var fogosDisponiveis = [...bancoFogos];
        fogosDisponiveis.sort(() => Math.random() - 0.5);
       
        for (var i = 0; i < faseConfig[2].fogosParaApagar; i++) {
            var fogoData = fogosDisponiveis[i];
            if (!fogoData) break;
           
            var posicao = gerarPosicaoAleatoria();
            var fogo = new Fogo(
                posicao.x,
                posicao.y,
                fogoData.pergunta,
                fogoData.respostaCorreta
            );
           
            fogos.push(fogo);
        }
       
        console.log(`${fogos.length} focos de incêndio posicionados no mapa`);
    }
 
    var dialogoAnimalAtivo = false;
    var animalInteragindo = null;
 
    function iniciarDialogoAnimal(animal) {
        if (telaCreditosAtiva || telaVitoriaAtiva || telaDerrotaAtiva) return;
       
        if (!animal.liberto && !animal.jaQuestionado && !dialogoAnimalAtivo && !quizActive && !jogoPausado) {
            currentQuizAnimal = animal;
            currentQuizFogo = null;
            quizActive = true;
           
            animal.jaQuestionado = true;
           
            mvLeft = mvRight = mvUp = mvDown = false;
 
            var quizBox = document.getElementById("quizBox");
            var quizText = document.getElementById("quizText");
            var quizFeedback = document.getElementById("quizFeedback");
            var quizNext = document.getElementById("quizNext");
           
            if(quizBox && quizText){
                quizText.textContent = `${animal.tipo} pergunta:\n\n${animal.pergunta}`;
                quizFeedback.textContent = "";
                quizFeedback.className = "";
                quizNext.textContent = "Clique em uma opção para responder";
 
                quizOptions = gerarOpcoesQuiz(animal.respostaCorreta, 'animal');
                var optionButtons = document.querySelectorAll('.quiz-option');
 
                optionButtons.forEach(function(button, index){
                    if(index < quizOptions.length){
                        button.textContent = quizOptions[index];
                        button.classList.remove('correct', 'incorrect', 'disabled');
                        button.disabled = false;
                        button.style.display = 'block';
                    } else {
                        button.style.display = 'none';
                    }
                });
 
                quizBox.classList.remove('hidden');
            }
        }
    }
 
    function iniciarInteracaoFogo(fogo) {
        if (telaCreditosAtiva || telaVitoriaAtiva || telaDerrotaAtiva) return;
       
        if (!fogo.apagado && !fogo.jaQuestionado && !quizActive && !jogoPausado) {
            currentQuizFogo = fogo;
            currentQuizAnimal = null;
            quizActive = true;
           
            fogo.jaQuestionado = true;
           
            mvLeft = mvRight = mvUp = mvDown = false;
 
            var quizBox = document.getElementById("quizBox");
            var quizText = document.getElementById("quizText");
            var quizFeedback = document.getElementById("quizFeedback");
            var quizNext = document.getElementById("quizNext");
           
            if(quizBox && quizText){
                quizText.textContent = `🔥 Foco de Incêndio!\n\n${fogo.pergunta}`;
                quizFeedback.textContent = "";
                quizFeedback.className = "";
                quizNext.textContent = "Escolha a resposta correta para apagar o fogo!";
 
                quizOptions = gerarOpcoesQuiz(fogo.respostaCorreta, 'fogo');
                var optionButtons = document.querySelectorAll('.quiz-option');
 
                optionButtons.forEach(function(button, index){
                    if(index < quizOptions.length){
                        button.textContent = quizOptions[index];
                        button.classList.remove('correct', 'incorrect', 'disabled');
                        button.disabled = false;
                        button.style.display = 'block';
                    } else {
                        button.style.display = 'none';
                    }
                });
 
                quizBox.classList.remove('hidden');
            }
        }
    }
 
    function processarRespostaQuiz(opcaoIndex) {
        if (!quizActive || (!currentQuizAnimal && !currentQuizFogo)) return;
       
        var respostaSelecionada = quizOptions[opcaoIndex];
        var respostaCorreta;
        var tipo = '';
       
        if (currentQuizAnimal) {
            respostaCorreta = currentQuizAnimal.respostaCorreta;
            tipo = 'animal';
        } else if (currentQuizFogo) {
            respostaCorreta = currentQuizFogo.respostaCorreta;
            tipo = 'fogo';
        }
       
        var quizBox = document.getElementById("quizBox");
        var quizFeedback = document.getElementById("quizFeedback");
        var quizNext = document.getElementById("quizNext");
        var optionButtons = document.querySelectorAll('.quiz-option');
       
        optionButtons.forEach(function(button) {
            button.disabled = true;
            button.classList.add('disabled');
        });
       
        if (respostaSelecionada === respostaCorreta) {
            optionButtons[opcaoIndex].classList.add('correct');
           
            if (tipo === 'animal') {
                quizFeedback.textContent = "✓ Correto! Você libertou o animal!";
                currentQuizAnimal.liberto = true;
                animaisLibertados++;
                atualizaContador();
                verificarVitoria();
            } else if (tipo === 'fogo') {
                quizFeedback.textContent = "✓ Correto! Você apagou o fogo!";
                currentQuizFogo.apagado = true;
                fogosApagados++;
                atualizaContadorFogo();
                verificarVitoriaFogo();
            }
           
            quizFeedback.className = "correct";
            quizNext.textContent = "Pressione ESPAÇO para continuar";
           
        } else {
            optionButtons[opcaoIndex].classList.add('incorrect');
           
            optionButtons.forEach(function(button, index) {
                if (quizOptions[index] === respostaCorreta) {
                    button.classList.add('correct');
                }
            });
           
            if (tipo === 'animal') {
                quizFeedback.textContent = "✗ Resposta incorreta! O animal continua preso.";
                setTimeout(verificarDerrota, 100);
            } else if (tipo === 'fogo') {
                quizFeedback.textContent = "✗ Resposta incorreta! O fogo continua queimando!";
                setTimeout(verificarDerrotaFogo, 100);
            }
           
            quizFeedback.className = "incorrect";
            quizNext.textContent = "Pressione ESPAÇO para continuar";
        }
    }
 
    function atualizaContador(){
        var contadorElement = document.getElementById("contador");
        var totalElement = document.getElementById("total");
        var contadorDiv = document.getElementById("contadorAnimais");
 
        if(contadorElement && totalElement && contadorDiv){
            contadorElement.textContent = animaisLibertados;
            totalElement.textContent = totalAnimais;
 
            if (missaoAtiva && faseAtual === 1) {
                contadorDiv.classList.remove("hidden");
            } else {
                contadorDiv.classList.add("hidden");
            }
        }
    }
 
    function atualizaContadorFogo(){
        var fogosApagadosElement = document.getElementById("fogosApagados");
        var totalFogosElement = document.getElementById("totalFogos");
        var fogoContadorDiv = document.getElementById("fogoContador");
       
        if(fogosApagadosElement && totalFogosElement && fogoContadorDiv){
            fogosApagadosElement.textContent = fogosApagados;
            totalFogosElement.textContent = faseConfig[2].fogosParaApagar;
           
            if (missaoAtiva && faseAtual === 2) {
                fogoContadorDiv.classList.remove("hidden");
            } else {
                fogoContadorDiv.classList.add("hidden");
            }
        }
    }
 
    function verificarVitoria() {
        if (faseAtual === 1) {
            var animaisRestantes = 0;
            for (var i = 0; i < animais.length; i++) {
                var animal = animais[i];
                if (!animal.liberto && !animal.jaQuestionado) {
                    animaisRestantes++;
                }
            }
       
            if (animaisRestantes === 0 && animaisLibertados >= faseConfig[1].animaisParaPassar &&
                !telaVitoriaAtiva && !telaDerrotaAtiva && !telaCreditosAtiva) {
                mostrarTelaVitoria();
            }
        }
    }
 
    function verificarVitoriaFogo() {
        if (faseAtual === 2) {
            var fogosRestantes = 0;
            for (var i = 0; i < fogos.length; i++) {
                var fogo = fogos[i];
                if (!fogo.apagado && !fogo.jaQuestionado) {
                    fogosRestantes++;
                }
            }
           
            if (fogosRestantes === 0 && fogosApagados >= faseConfig[2].fogosParaApagar &&
                !telaVitoriaAtiva && !telaDerrotaAtiva && !telaCreditosAtiva) {
                mostrarTelaCreditos();
            }
        }
    }
 
    function verificarDerrota() {
        if (faseAtual === 1) {
            var animaisRestantes = 0;
            for (var i = 0; i < animais.length; i++) {
                var animal = animais[i];
                if (!animal.liberto && !animal.jaQuestionado) {
                    animaisRestantes++;
                }
            }
           
            if (animaisRestantes === 0 && animaisLibertados < faseConfig[1].animaisParaPassar &&
                !telaVitoriaAtiva && !telaDerrotaAtiva && !telaCreditosAtiva) {
                mostrarTelaDerrota();
            }
        }
    }
 
    function verificarDerrotaFogo() {
        if (faseAtual === 2) {
            var fogosRestantes = 0;
            for (var i = 0; i < fogos.length; i++) {
                var fogo = fogos[i];
                if (!fogo.apagado && !fogo.jaQuestionado) {
                    fogosRestantes++;
                }
            }
           
            if (fogosRestantes === 0 && fogosApagados < faseConfig[2].fogosParaApagar &&
                !telaVitoriaAtiva && !telaDerrotaAtiva && !telaCreditosAtiva) {
                mostrarTelaDerrota();
            }
        }
    }
 
    function mostrarTelaVitoria() {
        telaVitoriaAtiva = true;
        jogoPausado = true;
       
        var vitoriaScreen = document.getElementById("vitoriaScreen");
        var vitoriaText = document.getElementById("vitoriaText");
        var vitoriaSubtext = document.getElementById("vitoriaSubtext");
       
        if (vitoriaScreen && vitoriaText) {
            vitoriaText.textContent = `🎉 Parabéns! Você libertou ${animaisLibertados} de 7 animais!`;
            vitoriaSubtext.textContent = "A floresta agradece! Agora, um novo desafio se inicia...";
            vitoriaScreen.classList.remove("hidden");
        }
    }
 
    function mostrarTelaCreditos() {
        telaCreditosAtiva = true;
        jogoPausado = true;
       
        // FECHAR O QUIZ SE ESTIVER ABERTO
        if (quizActive) {
            var quizBox = document.getElementById("quizBox");
            if (quizBox) {
                quizBox.classList.add("hidden");
            }
            quizActive = false;
            currentQuizAnimal = null;
            currentQuizFogo = null;
        }
       
        // DESATIVAR CONTROLES
        mvLeft = mvRight = mvUp = mvDown = false;
       
        var creditosScreen = document.getElementById("creditosScreen");
        var creditosTitle = document.getElementById("creditosTitle");
        var creditosDesenvolvedores = document.getElementById("creditosDesenvolvedores");
        var creditosAgradecimentos = document.getElementById("creditosAgradecimentos");
        var creditosMensagem = document.getElementById("creditosMensagem");
       
        if (creditosScreen && creditosTitle) {
            creditosTitle.textContent = "🎉 MISSÃO CUMPRIDA! 🎉";
            creditosDesenvolvedores.innerHTML = `
                <h3>Desenvolvido por:</h3>
                <p><strong>Murilo Rodrigues</strong></p>
                <p><strong>Frederico Lucas</strong></p>
            `;
            creditosAgradecimentos.innerHTML = `
                <h3>Agradecimentos especiais:</h3>
                <p>Às Inteligências Artificiais que nos ajudaram a desenvolver este grande projeto!</p>
                <p style="font-style: italic;">"A tecnologia deve servir para proteger a natureza"</p>
            `;
            creditosMensagem.innerHTML = `
                <h3>A floresta agradece!</h3>
                <p>Obrigado por aprender sobre a importância da preservação ambiental.</p>
                <p>Sua jornada ajudou a salvar inúmeras vidas e proteger nosso ecossistema.</p>
                <p style="margin-top: 20px; font-size: 1.2em;">Pressione ESPAÇO para reiniciar o jogo</p>
            `;
            creditosScreen.classList.remove("hidden");
        }
    }
 
    function mostrarTelaDerrota() {
        telaDerrotaAtiva = true;
        jogoPausado = true;
       
        var derrotaScreen = document.getElementById("derrotaScreen");
        var derrotaText = document.getElementById("derrotaText");
        var derrotaSubtext = document.getElementById("derrotaSubtext");
       
        if (derrotaScreen && derrotaText) {
            if (faseAtual === 1) {
                derrotaText.textContent = `😔 Você libertou apenas ${animaisLibertados} de ${faseConfig[1].animaisParaPassar} animais necessários`;
                derrotaSubtext.textContent = "Tente salvar mais animais na próxima vez!";
            } else if (faseAtual === 2) {
                derrotaText.textContent = `🔥 Você apagou apenas ${fogosApagados} de ${faseConfig[2].fogosParaApagar} focos de incêndio necessários para zerar o jogo!`;
                derrotaSubtext.textContent = "A floresta precisa da sua ajuda!";
            }
            derrotaScreen.classList.remove("hidden");
        }
    }
 
    function avancarFase() {
        faseAtual++;
       
        var vitoriaScreen = document.getElementById("vitoriaScreen");
        if (vitoriaScreen) {
            vitoriaScreen.classList.add("hidden");
        }
       
        telaVitoriaAtiva = false;
        jogoPausado = false;
       
        if (faseAtual === 2) {
            // POSICIONAR CURUPIRA PARA O DIÁLOGO DA FASE 2
            curupira.x = 3 * tileSize;
            curupira.y = 17 * tileSize;
            curupiraTriggered = false;
            alert(`🎮 FASE 2 - COMBATE AO INCÊNDIO!\n\nNovo desafio: Apague ${faseConfig[2].fogosParaApagar} focos de incêndio respondendo sobre os danos do fogo à floresta!`);
            carregarLabirintoFase2();
        }
       
        reiniciarParaNovaFase();
    }
 
    function carregarLabirintoFase2() {
        // Labirinto para fase de incêndio
        maze = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,0,1],
            [1,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,1],
            [1,0,1,0,1,1,1,0,1,0,1,0,1,1,1,1,0,1,0,1],
            [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
            [1,0,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,0,1],
            [1,0,1,0,0,0,0,0,0,0,1,0,1,0,0,0,0,1,0,1],
            [1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,0,1,0,1],
            [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1],
            [1,0,1,0,1,0,1,1,1,1,1,1,1,1,0,1,0,1,1,1],
            [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
            [1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,1],
            [1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
            [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];
       
        T_WIDTH = maze[0].length * tileSize;
        T_HEIGHT = maze.length * tileSize;
       
        walls = [];
        for(var row in maze){
            for(var column in maze[row]){
                var tile = maze[row][column];
                if(tile === 1){
                    var wall = {
                        x: tileSize*column,
                        y: tileSize*row,
                        width: tileSize,
                        height: tileSize
                    };
                    walls.push(wall);
                }
            }
        }
    }
 
    function reiniciarParaNovaFase() {
        animais = [];
        fogos = [];
        animaisLibertados = 0;
        fogosApagados = 0;
        missaoAtiva = false;
        quizActive = false;
        currentQuizAnimal = null;
        currentQuizFogo = null;
        telaVitoriaAtiva = false;
        telaDerrotaAtiva = false;
        telaCreditosAtiva = false;
        jogoPausado = false;
        curupiraTriggered = false;
        dialogActive = false;
       
        // POSICIONAR JOGADOR PRÓXIMO AO CURUPIRA PARA NOVO DIÁLOGO
        if (faseAtual === 1) {
            player.x = tileSize + 2;
            player.y = tileSize + 2;
        } else {
            player.x = curupira.x + tileSize * 2;
            player.y = curupira.y;
        }
       
        cam.x = 0;
        cam.y = 0;
        mvLeft = mvRight = mvUp = mvDown = false;
       
        var contadorDiv = document.getElementById("contadorAnimais");
        if (contadorDiv) contadorDiv.classList.add("hidden");
       
        var fogoContadorDiv = document.getElementById("fogoContador");
        if (fogoContadorDiv) fogoContadorDiv.classList.add("hidden");
       
        var quizBox = document.getElementById("quizBox");
        if (quizBox) quizBox.classList.add("hidden");
       
        console.log(`Preparado para Fase ${faseAtual}`);
    }
 
    function reiniciarJogo() {
        faseAtual = 1;
        carregarLabirintoPadrao();
        reiniciarParaNovaFase();
       
        // Esconder tela de créditos se estiver visível
        var creditosScreen = document.getElementById("creditosScreen");
        if (creditosScreen) {
            creditosScreen.classList.add("hidden");
        }
        telaCreditosAtiva = false;
    }
 
    function carregarLabirintoPadrao() {
 
       
        curupira.x = 5 * tileSize;
        curupira.y = 3 * tileSize;
    }
   
    var walls = [];
 
    var player = {
        x: tileSize + 2,
        y: tileSize + 2,
        width: 24,
        height: 32,
        speed: 6,
        srcX: 0,
        srcY: tileSrcSize,
        countAnim: 0
    };
       
    var maze = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
        [1,1,1,0,1,1,1,0,0,1,0,0,0,1,0,0,0,0,0,1],
        [1,0,0,0,0,0,1,0,1,1,1,1,1,1,0,1,1,1,1,1],
        [1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,1],
        [1,0,1,1,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
        [1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
        [1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
        [1,0,0,1,0,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1],
        [1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
        [1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];
       
    var T_WIDTH = maze[0].length * tileSize,
        T_HEIGHT = maze.length * tileSize;
       
    for(var row in maze){
        for(var column in maze[row]){
            var tile = maze[row][column];
            if(tile === 1){
                var wall = {
                    x: tileSize*column,
                    y: tileSize*row,
                    width: tileSize,
                    height: tileSize
                };
                walls.push(wall);
            }
        }
    }
       
    var cam = {
        x: 0,
        y: 0,
        width: WIDTH,
        height: HEIGHT,
        innerLeftBoundary: function(){
            return this.x + (this.width*0.25);
        },
        innerTopBoundary: function(){
            return this.y + (this.height*0.25);
        },
        innerRightBoundary: function(){
            return this.x + (this.width*0.75);
        },
        innerBottomBoundary: function(){
            return this.y + (this.height*0.75);
        }
    };
       
    function blockRectangle(objA,objB){
        var distX = (objA.x + objA.width/2) - (objB.x + objB.width/2);
        var distY = (objA.y + objA.height/2) - (objB.y + objB.height/2);
           
        var sumWidth = (objA.width + objB.width)/2;
        var sumHeight = (objA.height + objB.height)/2;
           
        if(Math.abs(distX) < sumWidth && Math.abs(distY) < sumHeight){
            var overlapX = sumWidth - Math.abs(distX);
            var overlapY = sumHeight - Math.abs(distY);
               
            if(overlapX > overlapY){
                objA.y = distY > 0 ? objA.y + overlapY : objA.y - overlapY;
            } else {
                objA.x = distX > 0 ? objA.x + overlapX : objA.x - overlapX;
            }
        }
    }
       
    window.addEventListener("keydown",keydownHandler,false);
    window.addEventListener("keyup",keyupHandler,false);
       
    function keydownHandler(e){
        var key = e.keyCode;
        switch(key){
            case LEFT:
                mvLeft = true;
                break;
            case UP:
                mvUp = true;
                break;
            case RIGHT:
                mvRight = true;
                break;
            case DOWN:
                mvDown = true;
                break;
        }
    }
                       
    function keyupHandler(e){
        var key = e.keyCode;
        switch(key){
            case LEFT:
                mvLeft = false;
                break;
            case UP:
                mvUp = false;
                break;
            case RIGHT:
                mvRight = false;
                break;
            case DOWN:
                mvDown = false;
                break;
        }
    }
                       
    function isColliding(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }
   
    var dialogActive = false;
    var dialogIndex = 0;
    const dialogLines=[
        "Curupira: Anhangá! Finalmente você despertou! A floresta corre perigo!",
        "Anhangá: O que aconteceu?",
        "Curupira: Os Caçadores vieram e prenderam vários animais, você precisa liberta-los antes que seja tarde demais!",
        "Anhangá: E onde os animais estão?",
        "Curupira: Eles estão presos pela floresta, sua missão é acha-los e libertá-los, acertando as respostas das perguntas.",
        "Curupira: Corre! A floresta clama por socorro!"
    ];
 
    const dialogLinesFase2 = [
        "Curupira: Anhangá! A floresta agora enfrenta um novo perigo!",
        "Anhangá: O que está acontecendo agora?",
        "Curupira: Incêndios estão se espalhando pela floresta! Você precisa apagá-los!",
        "Anhangá: Como posso ajudar?",
        "Curupira: Encontre os focos de incêndio e responda corretamente sobre os danos do fogo para apagá-los!",
        "Curupira: Rápido! A floresta está queimando!"
    ];
 
    const dialogBox = document.getElementById ("dialogBox");
    const dialogText = document.getElementById("dialogText");
 
    var curupiraTriggered = false;
   
    function startDialog(){
        dialogActive = true;
        dialogIndex = 0;
        dialogBox.classList.remove("hidden");
       
        if (faseAtual === 1) {
            dialogText.textContent = dialogLines[dialogIndex];
            missaoAtiva = true;
            inicializarAnimais();
            atualizaContador();
        } else if (faseAtual === 2) {
            dialogText.textContent = dialogLinesFase2[dialogIndex];
            missaoAtiva = true;
            inicializarFogos();
            atualizaContadorFogo();
        }
    }
 
    window.addEventListener("keydown", function(e){
        if(dialogActive && e.key === "Enter"){
            dialogIndex++;
            var maxDialog = faseAtual === 1 ? dialogLines.length : dialogLinesFase2.length;
            if(dialogIndex >= maxDialog){
                dialogBox.classList.add("hidden");
                dialogActive = false;
            } else {
                if (faseAtual === 1) {
                    dialogText.textContent = dialogLines[dialogIndex];
                } else if (faseAtual === 2) {
                    dialogText.textContent = dialogLinesFase2[dialogIndex];
                }
            }
        }
    });
           
    function update(){
        if (jogoPausado) {
            mvLeft = mvRight = mvUp = mvDown = false;
            return;
        }
       
        if (quizActive) {
            mvLeft = mvRight = mvUp = mvDown = false;
            return;
        }
       
        if(mvLeft && !mvRight){
            player.x -= player.speed;
            player.srcY = tileSrcSize + player.height * 2;
        } else if(mvRight && !mvLeft){
            player.x += player.speed;
            player.srcY = tileSrcSize + player.height * 3;
        }
       
        if(mvUp && !mvDown){
            player.y -= player.speed;
            player.srcY = tileSrcSize + player.height * 1;
        } else if(mvDown && !mvUp){
            player.y += player.speed;
            player.srcY = tileSrcSize + player.height * 0;
        }
               
        if(mvLeft || mvRight || mvUp || mvDown){
            player.countAnim++;
            if(player.countAnim >= 40){
                player.countAnim = 0;
            }
            player.srcX = Math.floor(player.countAnim/5) * player.width;
        } else {
            player.srcX = 0;
            player.countAnim = 0;
        }
           
        for(var i in walls){
            var wall = walls[i];
            blockRectangle(player,wall);
        }
           
        if(player.x < cam.innerLeftBoundary()){
            cam.x = player.x - (cam.width * 0.25);
        }
        if(player.y < cam.innerTopBoundary()){
            cam.y = player.y - (cam.height * 0.25);
        }
        if(player.x + player.width > cam.innerRightBoundary()){
            cam.x = player.x + player.width - (cam.width * 0.75);
        }
        if(player.y + player.height > cam.innerBottomBoundary()){
            cam.y = player.y + player.height - (cam.height * 0.75);
        }
           
        cam.x = Math.max(0,Math.min(T_WIDTH - cam.width,cam.x));
        cam.y = Math.max(0,Math.min(T_HEIGHT - cam.height,cam.y));
 
        if (!curupiraTriggered && isColliding(player, curupira)) {
            curupiraTriggered = true;
            startDialog();
        }
       
        if (faseAtual === 1) {
            for (var i = 0; i < animais.length; i++){
                var animal = animais[i];
                if(!animal.liberto && !animal.jaQuestionado && missaoAtiva && isColliding(player, animal) && !quizActive){
                    iniciarDialogoAnimal(animal);
                    break;
                }
            }
        } else if (faseAtual === 2) {
            for (var i = 0; i < fogos.length; i++){
                var fogo = fogos[i];
                if(!fogo.apagado && !fogo.jaQuestionado && missaoAtiva && isColliding(player, fogo) && !quizActive){
                    iniciarInteracaoFogo(fogo);
                    break;
                }
            }
        }
    }
       
    function render(){
        ctx.clearRect(0,0,WIDTH,HEIGHT);
        ctx.save();
        ctx.translate(-cam.x,-cam.y);
       
        for(var row in maze){
            for(var column in maze[row]){
                var tile = maze[row][column];
                var x = column*tileSize;
                var y = row*tileSize;
                ctx.drawImage(
                    img,
                    tile * tileSrcSize,0,tileSrcSize,tileSrcSize,
                    x,y,tileSize,tileSize
                );
            }
        }
       
        ctx.drawImage(
            img,
            player.srcX,player.srcY,player.width,player.height,
            player.x,player.y,player.width,player.height
        );
       
        // DESENHAR CURUPIRA EM AMBAS AS FASES
        if (curupira.img.complete) {
            ctx.drawImage(curupira.img, curupira.x, curupira.y, curupira.width, curupira.height);
        }
       
        if (faseAtual === 1) {
            for(var i = 0; i < animais.length; i++){
                var animal = animais[i];
                if(!animal.liberto) {
                    ctx.drawImage(animal.img, animal.x, animal.y, animal.width, animal.height);
                    ctx.drawImage(gaiolaImg, animal.x -5 , animal.y - 5 , animal.width + 10 , animal.height + 10);
                }
            }
        } else if (faseAtual === 2) {
            for(var i = 0; i < fogos.length; i++){
                var fogo = fogos[i];
                if(!fogo.apagado && fogo.img.complete) {
                    ctx.drawImage(fogo.img, fogo.x, fogo.y, fogo.width, fogo.height);
                   
                    // Efeito de brilho do fogo
                    ctx.beginPath();
                    ctx.arc(fogo.x + fogo.width/2, fogo.y + fogo.height/2, 20, 0, Math.PI * 2);
                    var gradient = ctx.createRadialGradient(
                        fogo.x + fogo.width/2, fogo.y + fogo.height/2, 5,
                        fogo.x + fogo.width/2, fogo.y + fogo.height/2, 25
                    );
                    gradient.addColorStop(0, 'rgba(255, 100, 0, 0.8)');
                    gradient.addColorStop(1, 'rgba(255, 50, 0, 0)');
                    ctx.fillStyle = gradient;
                    ctx.fill();
                }
            }
        }
       
        ctx.restore();
    }
   
    const startScreen = document.getElementById("startScreen");
       
    startScreen.addEventListener("click", function(){
        gameStarted = true;
        startScreen.style.display = "none";
    });
 
    var optionButtons = document.querySelectorAll('.quiz-option');
    if (optionButtons.length > 0) {
        optionButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                if (!quizActive || button.disabled || telaCreditosAtiva || telaVitoriaAtiva || telaDerrotaAtiva) return;
                var index = parseInt(button.getAttribute('data-index'));
                processarRespostaQuiz(index);
            });
        });
    }
   
    window.addEventListener('keydown', function(e) {
        if (quizActive && e.code === 'Space' && !telaCreditosAtiva && !telaVitoriaAtiva && !telaDerrotaAtiva) {
            var quizBox = document.getElementById("quizBox");
            if (quizBox) {
                quizBox.classList.add("hidden");
                quizActive = false;
                currentQuizAnimal = null;
                currentQuizFogo = null;
               
                if (faseAtual === 1) {
                    setTimeout(verificarDerrota, 100);
                } else if (faseAtual === 2) {
                    setTimeout(verificarDerrotaFogo, 100);
                }
            }
        }
       
        if (telaVitoriaAtiva && e.code === 'Space') {
            avancarFase();
        }
       
        if (telaDerrotaAtiva && e.code === 'Space') {
            reiniciarJogo();
        }
       
        // Adicionar suporte para tela de créditos
        if (telaCreditosAtiva && e.code === 'Space') {
            reiniciarJogo();
        }
    }, false);
 
    function loop(){
        if(!gameStarted){
            requestAnimationFrame(loop);
            return;
        }
        update();
        render();
        requestAnimationFrame(loop,cnv);
    }
       
}());