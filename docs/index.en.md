---
title: Home
hide:
  - navigation
  - toc
---

<div class="home-container" markdown>

<div class="tx-hero" markdown>

<div class="hero-reel-stage"></div>

<div class="tx-hero__content" markdown>

# Vinicius C. Amorim

## Data & AI Engineer @ [educbank](https://educbank.com.br){: target="_blank" rel="noopener" }

I build the data platforms a business relies on to make decisions: from ingestion to the Gold layer, with schema contracts between layers and a quarantine that stops bad data before it reaches a dashboard.
Databricks, PySpark and Unity Catalog, on Azure and GCP.

<a href="projects/" class="md-button">:material-briefcase-outline: Projects</a>
<a href="mailto:vamorim.dev@gmail.com" class="md-button md-button--primary" title="vamorim.dev@gmail.com">:material-email: Get in touch</a>
<a href="https://www.linkedin.com/in/vinicius-amorim/" class="md-button" target="_blank" rel="noopener">:fontawesome-brands-linkedin: LinkedIn</a>
<a href="../assets/cv-vinicius-amorim-en.pdf" class="md-button" download>:material-file-download-outline: Download CV</a>

</div>

</div>

<div class="stat-strip">
<div class="stat"><span class="stat__value"><span data-count="5">5</span></span><span class="stat__label">years in data</span></div>
<div class="stat"><span class="stat__value"><span data-count="150">150</span>+</span><span class="stat__label">Gold layer tables</span></div>
<div class="stat"><span class="stat__value"><span data-count="2">2</span></span><span class="stat__label">clouds in production</span></div>
<div class="stat"><span class="stat__value"><span data-count="11">11</span></span><span class="stat__label">Moonlight theme ports</span></div>
</div>

## What I build

<div class="bento" markdown>

<div class="card bento__platform" markdown>
<div class="card-content" markdown>

### :material-database: Medallion platform

<div class="layer-flow"><span class="layer layer--bronze">Bronze</span><span class="layer layer--silver">Silver</span><span class="layer layer--gold">Gold</span></div>

I design and run educbank's data platform on Databricks and Unity Catalog. More than 150 Gold tables, processed in PySpark and orchestrated with Lakeflow, feed the dashboards and the decisions behind them.

</div>
</div>

<div class="card bento__cloud" markdown>
<div class="card-content" markdown>

### :material-cloud: Azure + GCP

Medallion with Unity Catalog on Azure, s0 to s3 layers on GCP. Same principle, two implementations.

</div>
</div>

<div class="card bento__ci" markdown>
<div class="card-content" markdown>

### :material-rocket-launch-outline: CI/CD

Multi-environment Databricks Asset Bundles and GitHub Actions. When a contract breaks, the deploy does not ship.

</div>
</div>

<div class="card bento__ai" markdown>
<div class="card-content" markdown>

### :material-robot-outline: AI in the loop

Claude Code for boilerplate and review, with the process written up on the [blog](blog/claude-code-data-engineering.md).

</div>
</div>

<div class="card bento__oss" markdown>
<div class="card-content" markdown>

### :material-code-braces: Open source

A VS Code theme on the marketplace, an Oh My Posh theme and a Python template with uv and ruff.

</div>
</div>

</div>

## How I work

<div class="principles" markdown>

<div class="card principle" markdown>
<div class="card-content" markdown>

<span class="principle__index">01</span>

### Contracts between layers

Every layer declares the schema it delivers. When a contract breaks, the CI gate blocks the deploy before the problem reaches the next layer.

</div>
</div>

<div class="card principle" markdown>
<div class="card-content" markdown>

<span class="principle__index">02</span>

### Quarantine, not delete

Duplicates, invalid rows and test data go to quarantine. They stay out of the Gold layer but remain visible to whoever needs to investigate.

</div>
</div>

<div class="card principle" markdown>
<div class="card-content" markdown>

<span class="principle__index">03</span>

### Written process

Decisions, investigations and how AI is used get written down. Whoever comes next understands the why, not just the what.

</div>
</div>

</div>

<blockquote class="pull-quote"><p>I would rather stop a bad record in quarantine than find the problem after it has already become a wrong decision.</p></blockquote>

## Recent writing

Articles on data engineering, AI tooling and design.

<div class="post-grid">
<a class="post-teaser" href="blog/moonlight-palette/"><time datetime="2026-09-07">September 7, 2026</time><strong>The Moonlight palette, the full guide</strong><span>Every palette role, its current hex, where it lives, and the recipe for bringing the theme somewhere new.</span></a>
<a class="post-teaser" href="blog/mermaid-examples/"><time datetime="2026-09-04">September 4, 2026</time><strong>Every Mermaid diagram in the Moonlight theme</strong><span>All 28 Mermaid diagram types in the site's theme, dark and light, with what to look at in each one.</span></a>
<a class="post-teaser" href="blog/claude-code-data-engineering/"><time datetime="2026-04-21">April 21, 2026</time><strong>Claude Code for data engineering</strong><span>How I use Claude Code with pipelines, transformations and infrastructure: where it saves time and where review stays mandatory.</span></a>
</div>

## Stack

<div class="stack-groups">
<div class="stack-group"><span class="stack-group__label">Languages</span><div class="project-tags"><span class="tag python">Python</span><span class="tag code">SQL</span><span class="tag spark">PySpark</span></div></div>
<div class="stack-group"><span class="stack-group__label">Platform</span><div class="project-tags"><span class="tag engenharia-de-dados">Databricks</span><span class="tag engenharia-de-dados">Unity Catalog</span><span class="tag etl">Lakeflow</span><span class="tag etl">Airflow</span></div></div>
<div class="stack-group"><span class="stack-group__label">Cloud</span><div class="project-tags"><span class="tag etl">Azure</span><span class="tag etl">GCP</span></div></div>
<div class="stack-group"><span class="stack-group__label">Delivery</span><div class="project-tags"><span class="tag etl">CI/CD</span><span class="tag etl">Databricks Asset Bundles</span><span class="tag etl">GitHub Actions</span></div></div>
<div class="stack-group"><span class="stack-group__label">Quality</span><div class="project-tags"><span class="tag engenharia-de-dados">Data Quality</span></div></div>
</div>

## Education and languages

<div class="card-grid" markdown>

<div class="card" markdown>
<div class="card-content" markdown>

### :material-school-outline: Education

BSc in Computer Science, Universidade Paulista

</div>
</div>

<div class="card" markdown>
<div class="card-content" markdown>

### :material-translate: Languages

Native Portuguese, fluent English, basic Japanese

</div>
</div>

<div class="card" markdown>
<div class="card-content" markdown>

### :material-map-marker-outline: Based in

São José dos Campos, Brazil. Remote and hybrid

</div>
</div>

</div>

## Career timeline {: #career }

<div class="timeline-toggle-wrap">
  <div class="timeline-toggle" role="tablist" aria-label="Switch career view">
    <button class="timeline-toggle-btn active" data-view="kanban" type="button">Kanban</button>
    <button class="timeline-toggle-btn" data-view="timeline" type="button">Timeline</button>
  </div>
</div>

<div class="career-collapse" data-label-more="Show full career" data-label-less="Collapse career">
<div id="career-timeline"></div>
<div id="career-timeline-vertical" class="view-hidden"></div>
</div>

</div>
