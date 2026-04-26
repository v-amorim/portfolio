const careerData = {
  "Hobbies/Extras": [
    {
      start_date: "2020-01",
      end_date: null,
      company: "Open Source",
      role: "Criador de Temas",
      description: "VSCode theme publicado no marketplace. Tema Oh-My-Posh customizado para terminal",
      tag: { text: "VSCODE", type: "hobby" }
    },
    {
      start_date: "2016-01",
      end_date: null,
      company: "Freelance",
      role: "Diagramador",
      description: "Scripts ExtendScript para automação de inserção de textos traduzidos no InDesign. Redução de 70% em tempo de diagramação via atalhos customizados",
      tag: { text: "AUTOMATE", type: "hobby" }
    },
    {
      start_date: null,
      end_date: null,
      company: "Side Projects",
      role: "Automação",
      description: "Scripts PowerShell e Python para automação Windows. Ferramentas CLI experimentais",
      tag: { text: "CLI", type: "hobby" }
    }
  ],
  "Em Progresso": [
    {
      start_date: "2024-01",
      end_date: null,
      company: "DEEP ESG",
      role: "Engenheiro de Dados - Pleno",
      description: "Ownership end-to-end: ingestão, ETL (tradução/padronização) e processamento de cálculos em PySpark/Airflow/GCP. Gestão de demandas via Jira",
      tag: { text: "DATA ENG", type: "active" }
    }
  ],
  "Concluído": [
    {
      start_date: "2023-07",
      end_date: "2023-12",
      company: "DEEP ESG",
      role: "Engenheiro de Dados - Junior",
      description: "Pipelines ETL/ELT com Python e PySpark em GCP. Arquitetura de data lakes e warehouses",
      tag: { text: "PYSPARK", type: "done" }
    },
    {
      start_date: "2023-08",
      end_date: "2024-01",
      company: "Quero Educação",
      role: "Web Operations - Líder",
      description: "Liderança de equipe em pipelines ETL. Automação Python/Pandas para padronização e carga de dados Excel → PostgreSQL",
      tag: { text: "LEAD", type: "done" }
    },
    {
      start_date: "2021-07",
      end_date: "2023-08",
      company: "Quero Educação",
      role: "Web Operations - Estagiário",
      description: "ETL de dados de clientes via Excel/Pandas. Scripts Python para tradução, normalização e validação pré-carga em banco",
      tag: { text: "ETL", type: "done" }
    }
  ],
};

function calculateDuration(start_date, end_date) {
  // Se não houver data de início, retornar "∞"
  if (!start_date) return "∞";

  const start = new Date(start_date + "-01");
  const end = end_date ? new Date(end_date + "-01") : new Date();

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  const parts = [];
  if (years > 0) {
    parts.push(`${years} ano${years > 1 ? 's' : ''}`);
  }
  if (months > 0) {
    parts.push(`${months} ${months > 1 ? 'meses' : 'mês'}`);
  }

  return parts.length > 0 ? parts.join(' ') : '< 1 mês';
}

function formatDateRange(start_date, end_date) {
  if (!start_date) return "∞";

  const months = {
    '01': 'Jan', '02': 'Fev', '03': 'Mar', '04': 'Abr',
    '05': 'Mai', '06': 'Jun', '07': 'Jul', '08': 'Ago',
    '09': 'Set', '10': 'Out', '11': 'Nov', '12': 'Dez'
  };

  const [startYear, startMonth] = start_date.split('-');
  const startFormatted = `${months[startMonth]} ${startYear}`;

  if (!end_date) {
    return `${startFormatted} - Presente`;
  }

  const [endYear, endMonth] = end_date.split('-');
  const endFormatted = `${months[endMonth]} ${endYear}`;

  return `${startFormatted} - ${endFormatted}`;
}

function createKanbanBoard() {
  const container = document.getElementById('career-timeline');
  if (!container) return;

  const columns = Object.entries(careerData);

  const boardHTML = `
      <div class="career-kanban">
        <div class="kanban-board">
          ${columns.map(([columnName, cards]) => `
            <div class="kanban-column">
              <div class="kanban-header">
                <h3 class="kanban-title">${columnName}</h3>
                <span class="kanban-count">${cards.length}</span>
              </div>
              <div class="kanban-cards">
                ${cards.map((card, index) => {
    const dateRange = formatDateRange(card.start_date, card.end_date);
    const duration = calculateDuration(card.start_date, card.end_date);
    const dateText = card.start_date ? `${dateRange} (${duration})` : dateRange;
    return `
                    <div class="kanban-card" style="animation-delay: ${index * 0.1}s">
                      <div class="card-header">
                        <h4 class="card-role">${card.role}</h4>
                      </div>
                      <div class="card-body">
                        <p class="card-description">${card.description}</p>
                      </div>
                      <div class="card-footer">
                        <div class="card-company-wrapper">
                          <span class="card-date">${dateText}</span>
                          <span class="card-company">${card.company}</span>
                        </div>
                        <span class="card-tag ${card.tag.type}">${card.tag.text}</span>
                      </div>
                    </div>
                  `;
  }).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

  container.innerHTML = boardHTML;

  // Intersection observer para animação de entrada
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Clean up will-change after animation completes
        setTimeout(() => {
          entry.target.style.willChange = 'auto';
        }, 400);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.kanban-card').forEach(card => {
    observer.observe(card);
  });
}

function initTimeline() {
  createKanbanBoard();
}

// Initial load
document.addEventListener('DOMContentLoaded', initTimeline);

// Handle instant navigation (MkDocs Material)
document$.subscribe(function () {
  initTimeline();
});
