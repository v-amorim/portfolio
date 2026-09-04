---
title: Diagramas Mermaid com zoom
---

# Diagramas Mermaid com zoom

<small>4 de setembro de 2026 · Ferramentas, Documentação</small>

Todo diagrama Mermaid deste site tem um botão de expandir no canto superior direito. Ele abre o diagrama em tela cheia com pan e zoom: roda do mouse ou pinça para aproximar, arrastar para mover, duplo clique ou a tecla `0` para ajustar à tela, `+` e `-` para zoom, `Esc` para fechar. Esta página reúne cenários de tamanhos e formatos diferentes para testar o comportamento.

## Fluxograma pequeno, da esquerda para a direita

```mermaid
graph LR
    A[Fonte] --> B[Bronze]
    B --> C[Prata]
    C --> D[Ouro]
```

## Fluxograma de cima para baixo, com decisão

```mermaid
graph TD
    A[Arquivo chega no landing] --> B{Schema válido?}
    B -->|Sim| C[Bronze]
    B -->|Não| Q[Quarentena]
    C --> D{Duplicado?}
    D -->|Sim| Q
    D -->|Não| E[Prata]
    E --> F{Contrato da camada OK?}
    F -->|Sim| G[Ouro]
    F -->|Não| Q
    Q --> H[Alerta no Slack]
    G --> I[Dashboards]
```

## Fluxograma largo, com subgrafos

Bom para testar o ajuste horizontal: em telas menores ele encolhe até ficar ilegível, e o zoom resolve.

```mermaid
graph LR
    subgraph Fontes
        S1[(PostgreSQL)]
        S2[(MySQL)]
        S3[API REST]
        S4[Planilhas]
        S5[Eventos Kafka]
    end
    subgraph Bronze
        B1[raw.postgres]
        B2[raw.mysql]
        B3[raw.api]
        B4[raw.sheets]
        B5[raw.events]
    end
    subgraph Prata
        P1[clientes]
        P2[contratos]
        P3[pagamentos]
        P4[escolas]
    end
    subgraph Ouro
        O1[obt_financeiro]
        O2[obt_inadimplencia]
        O3[obt_comercial]
    end
    subgraph Consumo
        C1[Power BI]
        C2[Notebooks]
        C3[Modelos ML]
    end
    S1 --> B1 --> P1
    S2 --> B2 --> P2
    S3 --> B3 --> P3
    S4 --> B4 --> P4
    S5 --> B5 --> P3
    P1 --> O1
    P2 --> O1
    P3 --> O2
    P1 --> O2
    P4 --> O3
    P2 --> O3
    O1 --> C1
    O2 --> C1
    O2 --> C3
    O3 --> C2
```

## Fluxograma alto, de baixo para cima

Testa a rolagem vertical e o ajuste quando a altura é o limite.

```mermaid
graph BT
    N1[Etapa 1: coleta] --> N2[Etapa 2: validação de schema]
    N2 --> N3[Etapa 3: deduplicação]
    N3 --> N4[Etapa 4: normalização de nomes]
    N4 --> N5[Etapa 5: conversão de tipos]
    N5 --> N6[Etapa 6: enriquecimento com cadastro]
    N6 --> N7[Etapa 7: cálculo de indicadores]
    N7 --> N8[Etapa 8: agregação mensal]
    N8 --> N9[Etapa 9: contrato da camada Ouro]
    N9 --> N10[Etapa 10: publicação]
    N10 --> N11[Etapa 11: atualização de dashboards]
    N11 --> N12[Etapa 12: notificação]
```

## Fluxograma da direita para a esquerda

```mermaid
graph RL
    D[Decisão] --> C[Dashboard]
    C --> B[Tabela Ouro]
    B --> A[Pipeline]
```

## Diagrama de sequência

```mermaid
sequenceDiagram
    autonumber
    participant GH as GitHub Actions
    participant DAB as Databricks Asset Bundles
    participant DBX as Databricks
    participant DQ as Gate de qualidade
    GH->>DAB: bundle validate
    DAB-->>GH: OK
    GH->>DAB: bundle deploy (dev)
    DAB->>DBX: cria jobs e pipelines
    GH->>DBX: executa testes
    DBX->>DQ: valida contratos
    alt contrato quebrado
        DQ-->>GH: falha, deploy bloqueado
    else contrato OK
        DQ-->>GH: sucesso
        GH->>DAB: bundle deploy (prod)
    end
```

## Diagrama de classes

```mermaid
classDiagram
    class Pipeline {
        +String nome
        +List~Etapa~ etapas
        +executar()
        +validar()
    }
    class Etapa {
        <<abstract>>
        +String origem
        +String destino
        +processar(DataFrame) DataFrame
    }
    class Ingestao {
        +String formato
        +ler()
    }
    class Transformacao {
        +List~Regra~ regras
        +aplicar()
    }
    class Quarentena {
        +String motivo
        +isolar()
    }
    Pipeline "1" --> "*" Etapa
    Etapa <|-- Ingestao
    Etapa <|-- Transformacao
    Etapa <|-- Quarentena
```

## Diagrama de estados

```mermaid
stateDiagram-v2
    [*] --> Recebido
    Recebido --> Validando
    Validando --> Bronze: schema OK
    Validando --> Quarentena: schema inválido
    Bronze --> Prata: sem duplicados
    Bronze --> Quarentena: duplicado
    Prata --> Ouro: contrato OK
    Prata --> Quarentena: contrato quebrado
    Quarentena --> Revisao
    Revisao --> Recebido: corrigido
    Revisao --> Descartado: inválido
    Ouro --> [*]
    Descartado --> [*]
```

## Modelo entidade-relacionamento

```mermaid
erDiagram
    ESCOLA ||--o{ CONTRATO : assina
    CONTRATO ||--|{ PARCELA : gera
    PARCELA ||--o| PAGAMENTO : quitada_por
    ESCOLA {
        int id PK
        string nome
        string cidade
    }
    CONTRATO {
        int id PK
        int escola_id FK
        date inicio
        date fim
        decimal valor
    }
    PARCELA {
        int id PK
        int contrato_id FK
        date vencimento
        decimal valor
    }
    PAGAMENTO {
        int id PK
        int parcela_id FK
        date data
        decimal valor
    }
```

## Gantt

```mermaid
gantt
    title Migração da plataforma
    dateFormat YYYY-MM-DD
    section Ingestão
        Conectores        :done, a1, 2026-05-01, 20d
        Camada Bronze     :done, a2, after a1, 15d
    section Transformação
        Camada Prata      :active, b1, 2026-06-05, 30d
        Contratos         :b2, after b1, 10d
    section Consumo
        Camada Ouro       :c1, after b2, 25d
        Dashboards        :c2, after c1, 15d
```

## Pizza

```mermaid
pie showData
    title Registros por destino no último mês
    "Ouro" : 86
    "Quarentena: duplicados" : 8
    "Quarentena: inválidos" : 4
    "Quarentena: dados de teste" : 2
```

## Grafo de git

```mermaid
gitGraph
    commit id: "init"
    branch feature/quarentena
    checkout feature/quarentena
    commit id: "regra de duplicados"
    commit id: "regra de teste"
    checkout main
    commit id: "hotfix contrato"
    merge feature/quarentena
    branch release/1.2
    checkout release/1.2
    commit id: "bump 1.2.0" tag: "v1.2.0"
    checkout main
    merge release/1.2
```

## Jornada do usuário

```mermaid
journey
    title Um dado ruim entrando na plataforma
    section Ingestão
        Arquivo chega: 5: Pipeline
        Schema falha: 2: Pipeline
    section Quarentena
        Registro isolado: 4: Pipeline
        Alerta enviado: 3: Engenheiro
    section Correção
        Origem ajustada: 4: Engenheiro
        Reprocessamento: 5: Pipeline
```

## Mapa mental

```mermaid
mindmap
  root((Plataforma de dados))
    Ingestão
      Batch
      Streaming
      APIs
    Qualidade
      Contratos
      Quarentena
        Duplicados
        Inválidos
        Dados de teste
      Gates no CI
    Consumo
      Dashboards
      Notebooks
      Modelos
```

## Linha do tempo

```mermaid
timeline
    title Evolução da plataforma
    2021 : Planilhas e scripts Python
    2023 : Primeiros pipelines PySpark no GCP
         : Camadas s0 a s3
    2024 : Airflow e cálculos ESG
    2026 : Databricks e Unity Catalog
         : Medalhão com contratos e quarentena
```

## Quadrantes

```mermaid
quadrantChart
    title Priorização de fontes de dados
    x-axis Baixo esforço --> Alto esforço
    y-axis Baixo valor --> Alto valor
    quadrant-1 Planejar
    quadrant-2 Fazer agora
    quadrant-3 Descartar
    quadrant-4 Reavaliar
    CRM: [0.25, 0.85]
    ERP: [0.7, 0.9]
    Planilhas: [0.2, 0.3]
    Logs de app: [0.8, 0.35]
    Eventos: [0.55, 0.6]
```

## Requisitos

```mermaid
requirementDiagram
    requirement contrato_ouro {
        id: 1
        text: Toda tabela Ouro tem schema versionado
        risk: high
        verifymethod: test
    }
    functionalRequirement quarentena {
        id: 1.1
        text: Registro inválido nunca chega à camada Ouro
        risk: high
        verifymethod: test
    }
    performanceRequirement latencia {
        id: 2
        text: Pipeline diário termina antes das 6h
        risk: medium
        verifymethod: analysis
    }
    element gate_ci {
        type: GitHub Actions
    }
    element pipeline_prata {
        type: Lakeflow
    }
    gate_ci - verifies -> contrato_ouro
    pipeline_prata - satisfies -> quarentena
    quarentena - derives -> contrato_ouro
    pipeline_prata - satisfies -> latencia
```

## Contexto C4

```mermaid
C4Context
    title Plataforma de dados: contexto
    Person(analista, "Analista", "Consome dashboards e notebooks")
    Person(eng, "Engenheiro de dados", "Mantém pipelines e contratos")
    System(plataforma, "Plataforma de dados", "Databricks, Unity Catalog, Lakeflow")
    System_Ext(erp, "ERP", "Origem de contratos e pagamentos")
    System_Ext(crm, "CRM", "Origem de escolas e leads")
    System_Ext(bi, "Power BI", "Dashboards")
    Rel(erp, plataforma, "Exporta diariamente")
    Rel(crm, plataforma, "Exporta diariamente")
    Rel(plataforma, bi, "Camada Ouro")
    Rel(analista, bi, "Consulta")
    Rel(eng, plataforma, "Opera")
```

## Sankey

```mermaid
sankey-beta
    Fontes,Bronze,120
    Bronze,Prata,105
    Bronze,Quarentena,15
    Prata,Ouro,98
    Prata,Quarentena,7
    Quarentena,Reprocessado,14
    Quarentena,Descartado,8
```

## Gráfico XY

```mermaid
xychart-beta
    title "Registros em quarentena por mês"
    x-axis [Mar, Abr, Mai, Jun, Jul, Ago]
    y-axis "Registros" 0 --> 1200
    bar [980, 870, 640, 410, 320, 240]
    line [980, 870, 640, 410, 320, 240]
```

## Blocos

```mermaid
block-beta
    columns 4
    Fontes:4
    space:4
    A["Bronze"] B["Prata"] C["Ouro"] D["BI"]
    A --> B
    B --> C
    C --> D
    space:4
    Q["Quarentena"]:2 R["Reprocessamento"]:2
    Q --> R
```

## Pacote

```mermaid
packet-beta
    0-15: "Cabeçalho"
    16-31: "Versão do schema"
    32-63: "Timestamp de ingestão"
    64-95: "Hash do registro"
    96-127: "Payload"
```

## Kanban

```mermaid
kanban
    backlog[Backlog]
        t1[Migrar conector do CRM]
        t2[Contrato da tabela de escolas]
    doing[Em andamento]
        t3[Quarentena para dados de teste]@{ assigned: "vinicius" }
    review[Revisão]
        t4[Gate de schema no CI]
    done[Concluído]
        t5[Camada Bronze do ERP]
        t6[Deploy com Asset Bundles]
```

## Arquitetura

```mermaid
architecture-beta
    group cloud(cloud)[Azure]
    service lake(disk)[Data Lake] in cloud
    service dbx(server)[Databricks] in cloud
    service uc(database)[Unity Catalog] in cloud
    service bi(internet)[Power BI]
    service erp(database)[ERP]
    erp:R --> L:lake
    lake:R --> L:dbx
    dbx:B --> T:uc
    dbx:R --> L:bi
```

## Radar

```mermaid
radar-beta
    title Cobertura por camada
    axis ing["Ingestão"], val["Validação"], doc["Documentação"], tst["Testes"], mon["Monitoramento"]
    curve bronze["Bronze"]{90, 70, 40, 60, 50}
    curve ouro["Ouro"]{80, 95, 85, 90, 75}
    max 100
    min 0
```
