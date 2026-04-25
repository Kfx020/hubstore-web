# STATUS MVP VEZIFY

## 1. Visao geral do sistema

- O Vezify hoje e um front-end MVP em Next.js para operacao de loja com login local, painel protegido por cookie e dados em memoria.
- O sistema cobre cinco frentes principais: login, operacao da fila e atendimento, resumo do dia, ranking da equipe e metas da loja.
- A base atual usa contexto global no front para compartilhar loja atual, vendedores e atendimentos entre as paginas do painel.
- Nao ha backend, persistencia real, integracao com PDV nem autenticacao real nesta etapa.

## 2. Telas existentes

- `login`
  - Faz validacao simples de email e senha.
  - Cria a cookie `vezify_auth` no navegador e redireciona para `/operacao`.
- `operacao`
  - Tela principal do painel.
  - Controla fila, vendedores em atendimento e vendedores fora da rotatividade.
  - Permite arrastar vendedores entre estados e finalizar atendimento pelo modal.
- `resumo`
  - Consolida os atendimentos da loja atual.
  - Exibe indicadores do dia e destaque de vendedor.
- `ranking`
  - Monta ranking por vendedor com base em valor vendido, vendas e atendimentos.
  - Cruza dados de atendimento com meta diaria calculada.
- `metas`
  - Mostra meta mensal e diaria da loja.
  - Distribui a meta diaria por vendedor ativo da loja.

## 3. Fluxo atual do usuario

- O acesso inicial cai em `/`, que redireciona para `/login`.
- No login, o usuario informa email e senha.
- Com validacao minima aprovada, o front grava a cookie `vezify_auth=true` com expiracao de 1 dia.
- As rotas dentro de `app/(painel)` leem essa cookie no servidor.
- Se a cookie nao existir ou nao for `true`, o usuario volta para `/login`.
- Com acesso liberado, o usuario entra no painel e o layout protegido envolve as paginas com `AppStateProvider`.
- Na operacao, o usuario move vendedores entre fila, atendimento e fora da rotatividade.
- Ao finalizar um atendimento, o modal coleta resultado, setor, categorias e, quando for nao venda, motivo e descricao do motivo.
- O atendimento finalizado alimenta a lista de `atendimentos` no contexto.
- Resumo, ranking e metas leem essa base compartilhada e refletem o estado atual em memoria.
- A saida do painel pode acontecer pelo botao `Sair` no header ou pela protecao da operacao ao voltar no navegador.

## 4. Estado global / contexto

- O estado global fica em `apps/web/src/context/AppStateContext.tsx`.
- Dados expostos hoje:
  - `lojaAtual`
    - Loja fixa selecionada a partir do mock atual.
  - `clienteAtual`
    - Cliente dono da loja atual.
  - `marcaAtual`
    - Marca vinculada a loja atual.
  - `dataOperacao`
    - Data formatada no carregamento do provider.
  - `vendedores`
    - Lista de vendedores ativos da loja atual, com status operacional.
  - `atendimentos`
    - Historico em memoria usado por operacao, resumo e ranking.
  - `setVendedores`
    - Atualiza status de fila, atendimento e fora da rotatividade.
  - `setAtendimentos`
    - Registra novas finalizacoes no front.
- Consumo atual do contexto:
  - `operacao/page.tsx`
    - Le `lojaAtual`, `clienteAtual`, `marcaAtual`, `dataOperacao`, `vendedores`, `setVendedores` e `setAtendimentos`.
  - `resumo/page.tsx`
    - Le `lojaAtual`, `clienteAtual`, `marcaAtual`, `dataOperacao` e `atendimentos`.
  - `ranking/page.tsx`
    - Le `lojaAtual`, `clienteAtual`, `marcaAtual`, `dataOperacao`, `vendedores` e `atendimentos`.
  - `metas/page.tsx`
    - Le `lojaAtual`, `clienteAtual`, `marcaAtual`, `dataOperacao` e `vendedores`.
  - `Header.tsx`
    - Recebe dados por props vindos dessas paginas; nao consome o contexto diretamente.

## 5. O que esta ligado em que

- A operacao alimenta `atendimentos` no contexto ao finalizar um atendimento.
- A operacao tambem atualiza `vendedores` no contexto para refletir fila, atendimento e fora da rotatividade.
- O resumo le `atendimentos` da loja atual para gerar KPIs e vendedor destaque.
- O ranking le `vendedores` ativos e `atendimentos` para montar posicao, valor vendido, vendas e falta para meta.
- As metas leem `lojaAtual` e `vendedores` ativos para calcular meta diaria e distribuicao.
- O header usa props de produto, cliente, loja, data e status para manter informacao contextual no topo do painel.
- O layout protegido em `app/(painel)/layout.tsx` envolve as paginas com `AppStateProvider`.
- A cookie `vezify_auth` controla acesso as rotas protegidas.
- `mock-data.ts` alimenta contexto inicial com cliente, marca, loja, vendedores e atendimentos.
- `calculations.ts` centraliza calculos de metas e formatacao monetaria.

## 6. Arquivos principais do MVP hoje

- `apps/web/src/context/AppStateContext.tsx`
  - Provider global do front e fonte compartilhada de vendedores e atendimentos.
- `apps/web/src/lib/mock-data.ts`
  - Base mockada inicial de cliente, marca, loja, vendedores e atendimentos.
- `apps/web/src/lib/types.ts`
  - Tipos centrais de loja, vendedor, atendimento, resultado e motivo.
- `apps/web/src/lib/calculations.ts`
  - Regras centralizadas de dias operacionais, metas da loja, metas por vendedor e moeda.
- `apps/web/src/app/login/page.tsx`
  - Login local do MVP e criacao da cookie de acesso.
- `apps/web/src/app/(painel)/layout.tsx`
  - Protege rotas internas por cookie e injeta o contexto global.
- `apps/web/src/app/(painel)/operacao/page.tsx`
  - Orquestra drag and drop, estados de vendedores e gravacao de atendimento.
- `apps/web/src/app/(painel)/resumo/page.tsx`
  - Resume os principais numeros operacionais da loja atual.
- `apps/web/src/app/(painel)/ranking/page.tsx`
  - Gera ranking por vendedor com base em desempenho e meta diaria.
- `apps/web/src/app/(painel)/metas/page.tsx`
  - Exibe metas da loja e distribuicao por vendedor.
- `apps/web/src/components/Header.tsx`
  - Header compartilhado do painel com contexto da loja, navegacao e saida.
- `apps/web/src/components/FinalizarAtendimentoModal.tsx`
  - Modal de finalizacao com resultado, setor, categorias, motivo e descricao do motivo.
- `apps/web/src/components/DraggableSellerCard.tsx`
  - Card reutilizado dos vendedores nas faixas operacionais.
- `apps/web/src/components/DropZone.tsx`
  - Area de destino do drag and drop da operacao.
- `apps/web/src/components/BackToOperationButton.tsx`
  - Acao compartilhada para retorno rapido a operacao.

## 7. Regras de negocio ja implementadas

- Protecao por cookie
  - O painel depende da cookie `vezify_auth=true`.
  - Sem cookie valida, a navegação interna e redirecionada para `/login`.
- Status do vendedor
  - Cada vendedor pode estar em `fila`, `emAtendimento` ou `foraDaRotatividade`.
  - A operacao altera esses estados por drag and drop e por botoes auxiliares.
- Inicio e finalizacao de atendimento
  - Ao sair da fila para atendimento, o sistema registra o horario de inicio em memoria.
  - Ao finalizar, registra horario de fim e cria um atendimento novo no contexto.
- Finalizacao de atendimento
  - Exige pelo menos uma categoria.
  - Para resultado `Nao venda`, exibe motivo da nao venda.
  - A descricao do motivo reaproveita `detalheMotivo`.
  - Para `Falta`, `Tamanho`, `Preco` e `Olhadinha`, a descricao e opcional.
  - Para `Outro`, a descricao e obrigatoria e bloqueia o salvamento quando vazia.
- Motivo da nao venda
  - Motivos atuais: `Falta`, `Tamanho`, `Preco`, `Olhadinha` e `Outro`.
  - O texto de interface do modal passou a usar `Descricao do motivo`.
- Metas por loja e por vendedor
  - A meta mensal vem da loja mockada.
  - A meta diaria e calculada com base nos dias operacionais do mes.
  - A meta por vendedor divide a meta da loja entre vendedores ativos.
- Ranking
  - Ordena por valor vendido, depois vendas, depois atendimentos e depois nome.
  - Mostra falta para meta comparando realizado vs meta diaria por vendedor.
- Resumo
  - Conta vendas, nao vendas, trocas e trocas com diferenca.
  - Identifica vendedor destaque pela melhor combinacao de vendas e atendimentos.

## 8. Limitações atuais

- Todo o estado operacional esta em memoria no front.
- Recarregar a pagina perde alteracoes de fila, atendimento e atendimentos criados durante a sessao.
- O login nao valida usuario real nem conversa com backend.
- A protecao por cookie e apenas de MVP e nao substitui autenticacao segura.
- A base de lojas, vendedores e atendimentos ainda e mockada.
- O ranking depende de `valorVenda`, mas a maior parte dos dados mockados nao tem esse valor preenchido.
- O PA ainda nao e calculado porque falta integracao com ticket e quantidade de itens.
- Nao existe integracao com PDV.
- Nao existe persistencia em banco.
- Nao existe historico compartilhado entre dispositivos ou sessoes.

## 9. Pendencias do MVP

- Integrar autenticacao real.
- Persistir vendedores, fila e atendimentos.
- Integrar vendas e valores reais vindos de backend ou PDV.
- Consolidar nomes e codificacao de resultados para evitar dupla leitura de `Nao venda` e `Troca com diferenca`.
- Incluir identificacao de usuario e possivel loja selecionavel, se isso fizer parte do produto.
- Evoluir metricas como PA e demais indicadores dependentes de ticket/itens.
- Definir tratamento real para logout, expiracao de sessao e perfil de acesso.

## 10. Proximos passos recomendados

- Criar uma camada de servico para substituir os mocks sem reescrever as telas.
- Persistir `vendedores` e `atendimentos` primeiro, porque isso estabiliza operacao, resumo e ranking ao mesmo tempo.
- Unificar os enums/strings de resultado e motivo em uma unica fonte de verdade.
- Integrar autenticacao segura antes de abrir o painel para uso externo.
- Ligar o fluxo de finalizacao a valor de venda e dados do PDV quando essa frente estiver pronta.
- Adicionar testes para:
  - validacao do modal de finalizacao;
  - calculos de metas;
  - protecao das rotas do painel;
  - agregacoes de resumo e ranking.

## Mapa de dependencias do front

- Paginas que dependem do contexto
  - `operacao/page.tsx`
  - `resumo/page.tsx`
  - `ranking/page.tsx`
  - `metas/page.tsx`
- Componentes compartilhados
  - `Header.tsx` e compartilhado entre operacao, resumo, ranking e metas.
  - `BackToOperationButton.tsx` e compartilhado por resumo, ranking e metas.
  - `FinalizarAtendimentoModal.tsx`, `DraggableSellerCard.tsx` e `DropZone.tsx` sao compartilhados dentro da operacao.
- Calculos centralizados
  - `calculations.ts` concentra dias operacionais, metas da loja, metas por vendedor e formatacao de moeda.
- Dados que vem de mock
  - `clienteAtual`, `marcaAtual`, `lojaAtual`, `vendedoresLojaAtual` e `atendimentosIniciais` saem de `mock-data.ts`.
  - O provider usa esse mock como estado inicial.
- Pontos sem persistencia real
  - Mudancas de status dos vendedores.
  - Atendimentos finalizados no modal.
  - Sessao de login baseada em cookie local.
  - Indicadores de resumo, ranking e metas que dependem desses dados em memoria.
