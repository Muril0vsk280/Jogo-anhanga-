# ANHANGA – Salve a Floresta

## Sobre o projeto

**ANHANGA – Salve a Floresta** é um jogo desenvolvido em **JavaScript**, inspirado no **folclore brasileiro** e com foco em **conscientização ambiental**. O projeto foi criado como parte do processo de aprendizado no curso de **Desenvolvimento de Sistemas do SENAC**, com o objetivo principal de aplicar e consolidar conceitos de **lógica de programação**, **estruturação de código** e **Programação Orientada a Objetos (POO)**.

Mais do que um jogo completo, o projeto funciona como um exercício prático de evolução técnica, organização e boas práticas de desenvolvimento.

---

## Visão geral do jogo

O jogador controla o **Anhanga**, uma entidade espiritual guardiã da floresta, responsável por proteger os animais e impedir a destruição ambiental. As mecânicas são simples e objetivas, permitindo maior foco no aprendizado técnico e na clareza da implementação do código.

---

## História (resumo)

A floresta enfrenta ameaças externas e um grave desequilíbrio ambiental. Diante disso, o Anhanga desperta com a missão de restaurar a harmonia natural, proteger os animais e garantir a sobrevivência da natureza.

A narrativa atua como base conceitual do jogo, enquanto o foco principal do projeto permanece no desenvolvimento técnico.

---

## Linha do tempo do desenvolvimento

### Primeira versão – Programação Estruturada

Na etapa inicial, o jogo foi desenvolvido utilizando **programação estruturada**, com foco na validação da lógica e das mecânicas básicas.

Principais características dessa fase:

* Seletores diretos do DOM
* Funções globais para movimentação, pulo e colisão
* Uso de `setInterval` para controle do loop do jogo
* Manipulação direta de classes CSS e sprites
* Controle dos personagens feito diretamente pelo código principal

Essa abordagem permitiu compreender conceitos fundamentais como eventos, temporizadores, manipulação do DOM e lógica de jogos.

---

### Versão final – Programação Orientada a Objetos (POO)

Após a validação da lógica inicial, o projeto passou por uma **refatoração completa**, adotando **Programação Orientada a Objetos**, com foco em organização, reutilização e manutenção do código.

Principais melhorias aplicadas:

* Separação clara de responsabilidades
* Encapsulamento da lógica em classes
* Código mais modular e reutilizável
* Facilidade para expansão futura do projeto

---

## Estrutura em classes

O jogo foi organizado a partir de uma arquitetura orientada a objetos, composta por:

### Classe base: `Personagem`

Responsável por atributos e comportamentos comuns às entidades do jogo, como:

* Referência ao elemento no DOM
* Controle básico de estado
* Base para herança

### Classes especializadas

* **Anhanga** (personagem controlado pelo jogador)
* Inimigos e obstáculos
* Elementos do cenário

As classes especializadas herdam de `Personagem`, aplicando conceitos como:

* Herança (`extends`)
* Uso de `super()`
* Encapsulamento
* Métodos específicos para cada entidade

---

## Conceitos de Programação Orientada a Objetos aplicados

* Classes e instâncias
* Construtores
* Atributos e métodos
* Herança
* Encapsulamento
* Separação entre lógica e interface (DOM)

---

## Direção artística

A identidade visual do jogo foi pensada para representar:

* A floresta como um ambiente vivo
* Os animais como símbolos de equilíbrio natural
* Estética inspirada no folclore brasileiro e na cultura indígena

---

## Objetivo educacional

Este projeto tem como finalidade demonstrar a **evolução prática no aprendizado de programação**, evidenciando melhorias na lógica, estrutura e organização do código. Além disso, busca incentivar a **consciência ambiental** e a valorização do **folclore brasileiro** por meio da tecnologia.

---

## Curso

Projeto desenvolvido durante o curso de **Desenvolvimento de Sistemas** do **SENAC**.

---

## Status do projeto

Em desenvolvimento. Melhorias e expansões futuras incluem novas fases, personagens, mecânicas e aprimoramento da arquitetura orientada a objetos.

---

## Contribuições

Sugestões são bem-vindas, especialmente relacionadas a:

* Arquitetura do código
* Organização em classes
* Novas mecânicas
* Otimização e desempenho
