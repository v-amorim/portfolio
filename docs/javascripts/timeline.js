// Entries are grouped by company. A company with multiple roles renders as a
// single card with an internal mini-timeline showing the progression there.
const careerData = {
  "Pessoal": [
    {
      company: "Open Source",
      roles: [
        {
          start_date: "2020-01",
          end_date: null,
          role: "Criador de Temas",
          description: "VSCode theme publicado no marketplace. Tema Oh-My-Posh customizado para terminal",
          tag: { text: "VSCODE", type: "hobby" }
        }
      ]
    },
    {
      company: "Freelance",
      roles: [
        {
          start_date: "2016-01",
          end_date: null,
          role: "Diagramador",
          description: "Scripts ExtendScript para automação de inserção de textos traduzidos no InDesign. Redução de 70% em tempo de diagramação via atalhos customizados",
          tag: { text: "AUTOMATE", type: "hobby" }
        }
      ]
    },
    {
      company: "Side Projects",
      roles: [
        {
          start_date: null,
          end_date: null,
          role: "Automação",
          description: "Scripts PowerShell e Python para automação Windows. Ferramentas CLI experimentais",
          tag: { text: "CLI", type: "hobby" }
        }
      ]
    }
  ],
  "Em Progresso": [
    {
      company: "DEEP ESG",
      roles: [
        {
          start_date: "2024-01",
          end_date: null,
          role: "Engenheiro de Dados - Pleno",
          description: "Ownership end-to-end: ingestão, ETL (tradução/padronização) e processamento de cálculos em PySpark/Airflow/GCP. Gestão de demandas via Jira",
          tag: { text: "DATA ENG", type: "active" }
        },
        {
          start_date: "2023-07",
          end_date: "2023-12",
          role: "Engenheiro de Dados - Junior",
          description: "Pipelines ETL/ELT com Python e PySpark em GCP. Arquitetura de data lakes e warehouses",
          tag: { text: "PYSPARK", type: "done" }
        }
      ]
    }
  ],
  "Concluído": [
    {
      company: "Quero Educação",
      roles: [
        {
          start_date: "2023-08",
          end_date: "2024-01",
          role: "Web Operations - Líder",
          description: "Liderança de equipe em pipelines ETL. Automação Python/Pandas para padronização e carga de dados Excel → PostgreSQL",
          tag: { text: "LEAD", type: "done" }
        },
        {
          start_date: "2021-07",
          end_date: "2023-08",
          role: "Web Operations - Estagiário",
          description: "ETL de dados de clientes via Excel/Pandas. Scripts Python para tradução, normalização e validação pré-carga em banco",
          tag: { text: "ETL", type: "done" }
        }
      ]
    }
  ],
};

function calculateDuration(start_date, end_date) {
  // Se não houver data de início, retornar string vazia
  if (!start_date) return "";

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
  if (!start_date) return "";

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

// Overall span of a company across all its roles: earliest start, and the
// latest end (or null/Presente if any role is still ongoing).
function getCompanySpan(roles) {
  const starts = roles.map(r => r.start_date).filter(Boolean);
  const start = starts.length ? starts.reduce((a, b) => (a < b ? a : b)) : null;

  const ongoing = roles.some(r => r.start_date && !r.end_date);
  let end = null;
  if (!ongoing) {
    const ends = roles.map(r => r.end_date).filter(Boolean);
    end = ends.length ? ends.reduce((a, b) => (a > b ? a : b)) : null;
  }

  return { start, end };
}

// Shared inner markup for a company card: header with the company name and
// total tenure, plus an internal mini-timeline of its roles. Used by both the
// Kanban and the vertical timeline views.
function companyCardInner(group) {
  const span = getCompanySpan(group.roles);
  const spanRange = formatDateRange(span.start, span.end);
  const spanDuration = calculateDuration(span.start, span.end);
  const spanText = span.start && spanDuration ? `${spanRange} · ${spanDuration}` : spanRange;
  const multi = group.roles.length > 1 ? ' multi' : '';

  const rolesHTML = group.roles.map(role => {
    const dateRange = formatDateRange(role.start_date, role.end_date);
    const duration = calculateDuration(role.start_date, role.end_date);
    const dateText = role.start_date && duration ? `${dateRange} (${duration})` : dateRange;
    return `
      <div class="role-item ${role.tag.type}">
        <span class="role-dot"></span>
        <div class="role-content">
          <h5 class="role-title">${role.role}</h5>
          ${dateText ? `<span class="role-date">${dateText}</span>` : ''}
          <p class="role-description">${role.description}</p>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="card-header">
      <h4 class="card-company">${group.company}</h4>
      ${spanText ? `<span class="card-span">${spanText}</span>` : ''}
    </div>
    <div class="card-body">
      <div class="role-timeline${multi}">
        ${rolesHTML}
      </div>
    </div>
  `;
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
                ${cards.map((group, index) => `
                    <div class="kanban-card" style="animation-delay: ${index * 0.1}s">
                      ${companyCardInner(group)}
                    </div>
                  `).join('')}
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

function createVerticalTimeline() {
  const container = document.getElementById('career-timeline-vertical');
  if (!container) return;

  // Flatten company groups from every column into a single ordered list
  const groups = Object.values(careerData).flat();

  // Sort by the most recent role's start_date descending; groups without a
  // start_date go last
  groups.sort((a, b) => {
    const sa = a.roles[0].start_date;
    const sb = b.roles[0].start_date;
    if (!sa) return 1;
    if (!sb) return -1;
    return sb.localeCompare(sa);
  });

  const itemsHTML = groups.map((group, index) => {
    const side = index % 2 === 0 ? 'left' : 'right';
    const markerType = group.roles[0].tag.type;
    return `
      <div class="timeline-item ${side}" style="animation-delay: ${index * 0.08}s">
        <div class="timeline-marker ${markerType}"></div>
        <div class="timeline-content kanban-card">
          ${companyCardInner(group)}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="career-timeline">
      <div class="timeline-track">
        ${itemsHTML}
      </div>
    </div>
  `;

  const observer = new IntersectionObserver((entriesObs) => {
    entriesObs.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        setTimeout(() => {
          entry.target.style.willChange = 'auto';
        }, 400);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.timeline-item').forEach(item => {
    observer.observe(item);
  });
}

function initTimelineToggle() {
  const toggle = document.querySelector('.timeline-toggle');
  if (!toggle) return;

  const kanban = document.getElementById('career-timeline');
  const vertical = document.getElementById('career-timeline-vertical');
  const buttons = toggle.querySelectorAll('.timeline-toggle-btn');

  function setView(view) {
    buttons.forEach(b => b.classList.toggle('active', b.dataset.view === view));
    if (kanban) kanban.classList.toggle('view-hidden', view !== 'kanban');
    if (vertical) vertical.classList.toggle('view-hidden', view !== 'timeline');
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => setView(btn.dataset.view));
  });
}

function initTimeline() {
  createKanbanBoard();
  createVerticalTimeline();
  initTimelineToggle();
}

// Initial load
document.addEventListener('DOMContentLoaded', initTimeline);

// Handle instant navigation (MkDocs Material)
document$.subscribe(function () {
  initTimeline();
});
