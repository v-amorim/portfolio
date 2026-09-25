---
title: Início
hide:
  - navigation
  - toc
---

<div class="home-container" markdown>

<div class="tx-hero" markdown>

<div class="hero-reel-stage"></div>

<div class="tx-hero__content" markdown>

# Vinicius C. Amorim

## Engenheiro de Dados e IA @ [educbank](https://educbank.com.br){: target="_blank" rel="noopener" }

Construo as plataformas de dados em que o negócio se apoia para decidir: da ingestão à camada Ouro, com contrato de schema entre as camadas e uma quarentena que barra o dado ruim antes que ele chegue a um dashboard.
Databricks, PySpark e Unity Catalog, em Azure e GCP.

<a href="projects/" class="md-button">:material-briefcase-outline: Projetos</a>
<a href="mailto:vamorim.dev@gmail.com" class="md-button md-button--primary" title="vamorim.dev@gmail.com">:material-email: Entre em contato</a>
<a href="https://www.linkedin.com/in/vinicius-amorim/" class="md-button" target="_blank" rel="noopener">:fontawesome-brands-linkedin: LinkedIn</a>
<a href="assets/cv-vinicius-amorim.pdf" class="md-button" download>:material-file-download-outline: Baixar CV</a>

</div>

</div>

<div class="stat-strip">
<div class="stat"><span class="stat__value"><span data-count="5">5</span></span><span class="stat__label">anos em dados</span></div>
<div class="stat"><span class="stat__value"><span data-count="150">150</span>+</span><span class="stat__label">tabelas na camada Ouro</span></div>
<div class="stat"><span class="stat__value"><span data-count="2">2</span></span><span class="stat__label">nuvens em produção</span></div>
<div class="stat"><span class="stat__value"><span data-count="11">11</span></span><span class="stat__label">ports do tema Moonlight</span></div>
</div>

## O que eu construo

<div class="bento" markdown>

<div class="card bento__platform" markdown>
<div class="card-content" markdown>

### :material-database: Plataforma medalhão

<div class="layer-flow"><span class="layer layer--bronze">Bronze</span><span class="layer layer--silver">Prata</span><span class="layer layer--gold">Ouro</span></div>

Desenho e mantenho a plataforma de dados da educbank sobre Databricks e Unity Catalog. Mais de 150 tabelas na camada Ouro, processadas em PySpark e orquestradas com Lakeflow, alimentam os dashboards e as decisões do negócio.

</div>
</div>

<div class="card bento__cloud" markdown>
<div class="card-content" markdown>

### :material-cloud: Azure + GCP

Medalhão com Unity Catalog na Azure, camadas s0 a s3 no GCP. Mesmo princípio, duas implementações.

</div>
</div>

<div class="card bento__ci" markdown>
<div class="card-content" markdown>

### :material-rocket-launch-outline: CI/CD

Databricks Asset Bundles multiambiente e GitHub Actions. Quando um contrato quebra, o deploy não sai.

</div>
</div>

<div class="card bento__ai" markdown>
<div class="card-content" markdown>

### :material-robot-outline: IA no fluxo

Claude Code para boilerplate e revisão, com o processo documentado no [blog](blog/claude-code-data-engineering.md).

</div>
</div>

<div class="card bento__oss" markdown>
<div class="card-content" markdown>

### :material-code-braces: Open source

Tema VS Code no marketplace, tema Oh My Posh e um template Python com uv e ruff.

</div>
</div>

</div>

## Como eu trabalho

<div class="principles" markdown>

<div class="card principle" markdown>
<div class="card-content" markdown>

<span class="principle__index">01</span>

### Contrato entre camadas

Cada camada declara o schema que entrega. Se o contrato quebra, o gate no CI bloqueia o deploy antes que o problema chegue à próxima camada.

</div>
</div>

<div class="card principle" markdown>
<div class="card-content" markdown>

<span class="principle__index">02</span>

### Quarentena, não descarte

Duplicados, inválidos e dados de teste vão para a quarentena. Ficam fora da camada Ouro, mas continuam visíveis para quem precisa investigar.

</div>
</div>

<div class="card principle" markdown>
<div class="card-content" markdown>

<span class="principle__index">03</span>

### Processo por escrito

Decisões, investigações e o uso de IA ficam documentados. Quem chega depois entende o porquê, não só o quê.

</div>
</div>

</div>

<blockquote class="pull-quote"><p>Prefiro travar um dado ruim na quarentena a descobrir o problema só depois que ele já virou decisão errada.</p></blockquote>

## Artigos recentes

Artigos em inglês sobre engenharia de dados, ferramentas de IA e design.

<div class="post-grid">
<a class="post-teaser" href="blog/moonlight-palette/"><time datetime="2026-09-07">7 de setembro de 2026</time><strong>The Moonlight palette, the full guide</strong><span>Cada papel da paleta, o hex atual, onde ele vive e a receita para levar o tema para outras ferramentas.</span></a>
<a class="post-teaser" href="blog/mermaid-examples/"><time datetime="2026-09-04">4 de setembro de 2026</time><strong>Every Mermaid diagram in the Moonlight theme</strong><span>Os 28 tipos de diagrama Mermaid no tema do site, claro e escuro, com o que observar em cada um.</span></a>
<a class="post-teaser" href="blog/claude-code-data-engineering/"><time datetime="2026-04-21">21 de abril de 2026</time><strong>Claude Code for data engineering</strong><span>Como uso o Claude Code com pipelines, transformações e infraestrutura: onde economiza tempo e onde a revisão continua obrigatória.</span></a>
</div>

## Stack

<div class="stack-groups">
<div class="stack-group"><span class="stack-group__label">Linguagens</span><div class="project-tags"><span class="tag python">Python</span><span class="tag code">SQL</span><span class="tag spark">PySpark</span></div></div>
<div class="stack-group"><span class="stack-group__label">Plataforma</span><div class="project-tags"><span class="tag engenharia-de-dados">Databricks</span><span class="tag engenharia-de-dados">Unity Catalog</span><span class="tag etl">Lakeflow</span><span class="tag etl">Airflow</span></div></div>
<div class="stack-group"><span class="stack-group__label">Nuvem</span><div class="project-tags"><span class="tag etl">Azure</span><span class="tag etl">GCP</span></div></div>
<div class="stack-group"><span class="stack-group__label">Entrega</span><div class="project-tags"><span class="tag etl">CI/CD</span><span class="tag etl">Databricks Asset Bundles</span><span class="tag etl">GitHub Actions</span></div></div>
<div class="stack-group"><span class="stack-group__label">Qualidade</span><div class="project-tags"><span class="tag engenharia-de-dados">Data Quality</span></div></div>
</div>

## Formação e idiomas

<div class="card-grid" markdown>

<div class="card" markdown>
<div class="card-content" markdown>

### :material-school-outline: Formação

Bacharelado em Ciência da Computação, Universidade Paulista

</div>
</div>

<div class="card" markdown>
<div class="card-content" markdown>

### :material-translate: Idiomas

Português nativo, inglês fluente e japonês básico

</div>
</div>

<div class="card" markdown>
<div class="card-content" markdown>

### :material-map-marker-outline: Base

São José dos Campos, SP. Atuação remota e híbrida

</div>
</div>

</div>

## Linha do tempo da carreira

<div class="timeline-toggle-wrap">
  <div class="timeline-toggle" role="tablist" aria-label="Alternar visualização da carreira">
    <button class="timeline-toggle-btn active" data-view="kanban" type="button">Kanban</button>
    <button class="timeline-toggle-btn" data-view="timeline" type="button">Timeline</button>
  </div>
</div>

<div class="career-collapse" data-label-more="Ver carreira completa" data-label-less="Recolher carreira">
<div id="career-timeline"></div>
<div id="career-timeline-vertical" class="view-hidden"></div>
</div>

</div>
