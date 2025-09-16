/* app.js - simple SPA to drive the static IMO resource site */
const app = document.getElementById('app');
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

let PROBLEMS = []; // will load from JSON
let currentUser = null;

// Firebase configuration
const firebaseConfig = {
  apiKey: "REMOVED",
  authDomain: "imo-resource.firebaseapp.com",
  projectId: "imo-resource",
  storageBucket: "imo-resource.firebasestorage.app",
  messagingSenderId: "813525356997",
  appId: "1:813525356997:web:a9ec854bc77af749cdfbac",
  measurementId: "G-RBGJ11ZF2D"
};

// Initialize Firebase (check if Firebase is available)
let db, auth;
if (typeof firebase !== 'undefined') {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }
  db = firebase.firestore();
  auth = firebase.auth();
}

/* utils */
function el(tag, cls = '', html = '') {
  const d = document.createElement(tag);
  if (cls) d.className = cls;
  if (html) d.innerHTML = html;
  return d;
}

// Define escapeHtml function early since it's used throughout
function escapeHtml(s = '') {
  return String(s).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

function fetchProblems() {
  // Use the auto-generated data.json (now built from Markdown)
  return fetch('data/data.json').then(r => {
    if (!r.ok) throw new Error('Failed to load data.json');
    return r.json();
  }).catch(error => {
    console.error('Error loading data:', error);
    // Fallback: return empty array or cached data
    return [];
  });
}

/* authentication functions */
function initAuth() {
    if (!auth) {
    console.warn('Firebase auth not available');
    return;
  }
  
  auth.onAuthStateChanged(user => {
    currentUser = user;
    updateAuthUI();
  });
}

function updateAuthUI() {
  const authBtn = document.getElementById('auth-button');
  if (!authBtn) return;
  
  if (currentUser) {
    authBtn.innerHTML = `Logout (${currentUser.email})`;
    authBtn.onclick = () => auth.signOut();
  } else {
    authBtn.innerHTML = 'Login / Register';
    authBtn.onclick = showLoginModal;
  }
}

function showLoginModal() {
  const modalOverlay = el('div', 'modal-overlay');
  const modal = el('div', 'modal');
  
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h3>Login / Register</h3>
      <input type="email" id="login-email" class="input" placeholder="Email">
      <input type="password" id="login-password" class="input" placeholder="Password">
      <div class="modal-buttons">
        <button id="do-login" class="btn">Login</button>
        <button id="do-register" class="btn">Register</button>
      </div>
    </div>
  `;
  
  modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);
  
  // Add the text visibility fix
  setTimeout(() => {
    const inputs = modal.querySelectorAll('input');
    inputs.forEach(input => {
      input.style.color = '#000';
      input.style.backgroundColor = '#fff';
      input.style.setProperty('color', '#000', 'important');
      input.style.setProperty('background-color', '#fff', 'important');
    });
  }, 100);
  
  // ✅ MODIFIED: Login button with auto-reload
  document.getElementById('do-login').onclick = () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        // Close modal first
        document.body.removeChild(modalOverlay);
       
        const message = el('div', 'success-message', 'Success! Reloading...');
        message.style.cssText = `
        position: fixed; top: 20px; right: 20px; 
        background: #4CAF50; color: white; padding: 1rem;
        border-radius: 4px; z-index: 10000; font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      `;
        document.body.appendChild(message);
  
        setTimeout(() => {
          // Remove message right before reload for clean transition
          if (document.body.contains(message)) {
            document.body.removeChild(message);
          }
          window.location.reload();
        }, 1500);
      })
      .catch(error => {
        alert('Login error: ' + error.message);
      });
  };
  
  // ✅ MODIFIED: Register button with auto-reload
  document.getElementById('do-register').onclick = () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        // Close modal first
        document.body.removeChild(modalOverlay);
       
        const message = el('div', 'success-message', 'Success! Reloading...');
        message.style.cssText = `
        position: fixed; top: 20px; right: 20px; 
        background: #4CAF50; color: white; padding: 1rem;
        border-radius: 4px; z-index: 10000; font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      `;
        document.body.appendChild(message);
  
        setTimeout(() => {
          // Remove message right before reload for clean transition
          if (document.body.contains(message)) {
            document.body.removeChild(message);
          }
          window.location.reload();
        }, 1500);
      })
      .catch(error => {
        alert('Registration error: ' + error.message);
      });
  };
  
  // Close modal when clicking X or overlay
  document.querySelector('.close-modal').onclick = () => {
    document.body.removeChild(modalOverlay);
  };
  
  modalOverlay.onclick = (e) => {
    if (e.target === modalOverlay) {
      document.body.removeChild(modalOverlay);
    }
  };
  
  // Close with Escape key
  document.addEventListener('keydown', function handleEscape(e) {
    if (e.key === 'Escape') {
      document.body.removeChild(modalOverlay);
      document.removeEventListener('keydown', handleEscape);
    }
  });
}

/* rendering functions */
function renderHome() {
  app.innerHTML = '';
  const hero = el('div', 'hero', `<h2>Free IMO Resources</h2>
    <p>Problems, discussion prompts, strategies, and weekly challenges curated for IMO aspirants worldwide.</p>`);
  const weekly = el('div', 'card weekly-hero');
  weekly.innerHTML = `<h3>Weekly Challenge</h3><div id="weekly-content"><p class="small">Loading...</p></div>
    <p class="small">Submit solutions: use the "Submit" link inside the weekly page (you can replace it with a Google Form).</p>`;
  app.appendChild(hero);
  app.appendChild(weekly);

  // show latest weekly (we store weekly in problems.json as `weekly` entry)
  const weeklyContent = document.getElementById('weekly-content');
  const weeklyEntry = PROBLEMS.find(p => p.type === 'weekly');
  if (weeklyEntry) {
    weeklyContent.innerHTML = `<strong>${escapeHtml(weeklyEntry.title)}</strong>
      <div class="small" style="margin-top:8px">${escapeHtml(weeklyEntry.statement)}</div>
      <div style="margin-top:10px"><a href="#/weekly" class="btn">Open Weekly Page →</a></div>`;
  } else {
    weeklyContent.innerHTML = '<p class="small">No weekly challenge right now — add one in data/problems.json (type="weekly").</p>';
  }

  // show sample recent problems
  const recent = el('div', 'card');
  recent.innerHTML = `<h3>Recent Problems</h3><div class="problem-list" id="recent-list"></div>`;
  app.appendChild(recent);

  const recentList = document.getElementById('recent-list');
  const sample = PROBLEMS.filter(p => p.type === 'problem').slice(0,6);
  if (sample.length === 0) recentList.innerHTML = `<p class="small">No problems yet. Add some in <code>data/problems.json</code>.</p>`;
  sample.forEach(p => {
    const item = el('div', 'problem-item');
    item.innerHTML = `<div style="flex:1">
        <div class="problem-meta">${escapeHtml(p.year || '')} • ${escapeHtml(p.source || '')}</div>
        <div><strong>${escapeHtml(p.title)}</strong></div>
        <div class="small" style="margin-top:6px">${escapeHtml((p.statement || '').slice(0,140))}${(p.statement && p.statement.length>140)?'...':''}</div>
      </div>
      <div><a href="#/problem/${p.id}" class="btn small">Open</a></div>`;
    recentList.appendChild(item);
  });

  if (typeof MathJax !== 'undefined') MathJax.typesetPromise();
}

function renderProblemsList(query = '') {
  app.innerHTML = '';
  const header = el('div','card');
  header.innerHTML = `<h3>Problems</h3>
    <div class="controls"><input id="search" class="input" placeholder="Search by tag/title/year" value="${escapeHtml(query)}">
    <select id="filter" class="input"><option value="">All tags</option></select></div>`;
  app.appendChild(header);

  const listWrap = el('div','card');
  listWrap.innerHTML = `<div id="problems-container" class="problem-list small">Loading...</div>`;
  app.appendChild(listWrap);

  // populate tag filter
  const tags = new Set();
  PROBLEMS.filter(p=>p.type==='problem').forEach(p=> (p.tags||[]).forEach(t=>tags.add(t)));
  const filter = document.getElementById('filter');
  tags.forEach(t=>{
    const o = document.createElement('option'); o.value = t; o.textContent = t; filter.appendChild(o);
  });

  function doRender(q, tag) {
    const cont = document.getElementById('problems-container');
    let items = PROBLEMS.filter(p=>p.type==='problem');
    if (tag) items = items.filter(it => (it.tags||[]).includes(tag));
    if (q) {
      const ql = q.toLowerCase();
      items = items.filter(it => (it.title||'').toLowerCase().includes(ql) || (it.statement||'').toLowerCase().includes(ql) || (it.year||'').toString().includes(ql));
    }
    if (items.length===0) { cont.innerHTML = `<p class="small">No problems found.</p>`; return; }
    cont.innerHTML = '';
    items.forEach(p=>{
      const item = el('div','problem-item');
      item.innerHTML = `<div style="flex:1">
        <div class="problem-meta">${escapeHtml(p.year||'')} • ${escapeHtml(p.source||'')}</div>
        <div><strong>${escapeHtml(p.title)}</strong></div>
        <div class="small" style="margin-top:6px">${escapeHtml((p.statement||'').slice(0,200))}${(p.statement&&p.statement.length>200)?'...':''}</div>
      </div>
      <div><a href="#/problem/${p.id}" class="btn small">Open</a></div>`;
      cont.appendChild(item);
    });

    if (typeof MathJax !== 'undefined') MathJax.typesetPromise();
  }

  const search = document.getElementById('search');
  search.addEventListener('input', ()=> doRender(search.value, filter.value));
  filter.addEventListener('change', ()=> doRender(search.value, filter.value));

  doRender(query, '');
}

function renderProblemDetail(id) {
  const p = PROBLEMS.find(x => String(x.id)===String(id));
  if (!p) {
    app.innerHTML = `<div class="card"><h3>Problem not found</h3><p class="small">Problem ID ${id} not found.</p></div>`;
    if (typeof MathJax !== 'undefined') MathJax.typesetPromise();
    return;
  }

  app.innerHTML = '';
  const meta = el('div','card');
  meta.innerHTML = `<div class="problem-meta">${escapeHtml(p.year||'')} • ${escapeHtml(p.source||'')}</div>
    <h2 style="margin-top:8px">${escapeHtml(p.title)}</h2>
    <div class="problem-body">${formatText(p.statement||'')}</div>`;

  app.appendChild(meta);

  if (p.solution) {
    const sol = el('div','card solution');
    sol.innerHTML = `<h3>Solution</h3><div class="solution">${formatText(p.solution)}</div>`;
    app.appendChild(sol);
  } else {
    const sol = el('div','card');
    sol.innerHTML = `<h3>Solution</h3><p class="small">Solution not available yet. Contributions welcome.</p>`;
    app.appendChild(sol);
  }

  // Comments section
  const discuss = el('div','card');
  discuss.innerHTML = `
    <h3>Discussion</h3>
    <div id="comments-container"><p class="small">Loading comments...</p></div>
    <div style="margin-top: 16px">
      <textarea id="comment-text" class="input" placeholder="${currentUser ? 'Add your comment...' : 'Please login to comment'}" rows="3" style="width: 100%" ${!currentUser ? 'disabled' : ''}></textarea>
      <button id="submit-comment" class="btn" style="margin-top: 8px" ${!currentUser ? 'disabled' : ''}>Post Comment</button>
    </div>
  `;
  app.appendChild(discuss);
  
  // Load and display comments
  loadComments(id);
  setupCommentSubmission(id);

  if (typeof MathJax !== 'undefined') MathJax.typesetPromise();
}

function loadComments(problemId) {
  const container = document.getElementById('comments-container');
  
  db.collection('comments')
    .where('problemId', '==', problemId)
    .orderBy('timestamp', 'desc')
    .get()
    .then(snapshot => {
      container.innerHTML = '';
      
      if (snapshot.empty) {
        container.innerHTML = '<p class="small">No comments yet. Be the first to comment!</p>';
        return;
      }
      
      snapshot.forEach(doc => {
        const comment = doc.data();
        const commentEl = el('div', 'comment');
        commentEl.innerHTML = `
          <div class="comment-meta">${escapeHtml(comment.author || 'Anonymous')} • ${new Date(comment.timestamp.toDate()).toLocaleDateString()}</div>
          <div>${escapeHtml(comment.text)}</div>
        `;
        container.appendChild(commentEl);
      });
    })
    .catch(err => {
      container.innerHTML = `<p class="small">Error loading comments: ${err.message}</p>`;
    });
}

function setupCommentSubmission(problemId) {
  const submitBtn = document.getElementById('submit-comment');
  const textarea = document.getElementById('comment-text');
  
  if (!submitBtn || !textarea) return;
  
  submitBtn.addEventListener('click', () => {
    const text = textarea.value.trim();
    if (!text) return;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Posting...';
    
    db.collection('comments').add({
      problemId: problemId,
      text: text,
      author: currentUser ? currentUser.email : 'Anonymous',
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      textarea.value = '';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Post Comment';
      loadComments(problemId); // Reload comments
    })
    .catch(err => {
      alert('Error posting comment: ' + err.message);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Post Comment';
    });
  });
}

function renderStrategies() {
  app.innerHTML = '<div class="card"><p class="small">Loading strategies...</p></div>';
  
  // Load strategies from your data.json
  const strategies = PROBLEMS.filter(p => p.type === 'strategy');
  
  if (strategies.length === 0) {
    app.innerHTML = `
      <div class="card">
        <h3>Strategies & Tutorials</h3>
        <p class="small">No strategies available yet. Check back soon!</p>
      </div>
    `;
    return;
  }
  
  app.innerHTML = '';
  
  const header = el('div', 'card');
  header.innerHTML = `<h3>Strategies & Tutorials</h3>
    <p class="small">${strategies.length} strategy resources available</p>`;
  app.appendChild(header);
  
  strategies.forEach(strategy => {
    const card = el('div', 'card');
    card.innerHTML = `
      <h3>${escapeHtml(strategy.title)}</h3>
      <div class="problem-meta">
        ${strategy.tags ? strategy.tags.map(tag => 
          `<span class="tag">${escapeHtml(tag)}</span>`
        ).join(' ') : ''}
        ${strategy.difficulty ? `<span class="tag">${escapeHtml(strategy.difficulty)}</span>` : ''}
      </div>
      <div class="problem-body strategy-content">${formatText(strategy.statement || '')}</div>
      ${strategy.solution ? `
        <details class="solution">
          <summary>View Strategy Details</summary>
          <div>${formatText(strategy.solution)}</div>
        </details>
      ` : ''}
    `;
    app.appendChild(card);
  });

  if (typeof MathJax !== 'undefined') MathJax.typesetPromise();
}

function renderWeekly() {
  app.innerHTML = '';
  const weekly = PROBLEMS.find(p => p.type === 'weekly');
  if (!weekly) {
    app.innerHTML = `<div class="card"><h3>Weekly Challenge</h3><p class="small">No weekly challenge configured. Add a weekly entry in <code>data/problems.json</code> with <code>type:"weekly"</code>.</p></div>`;
    return;
  }
  const w = el('div','card');
  w.innerHTML = `<h3>Weekly Challenge • ${escapeHtml(weekly.title)}</h3>
    <div class="small" style="margin-top:8px">${formatText(weekly.statement)}</div>
    <div style="margin-top:12px"><strong>Deadline:</strong> ${escapeHtml(weekly.deadline || 'No deadline')}</div>
    <div style="margin-top:12px"><a href="${weekly.submit || '#'}" target="_blank" rel="noopener" class="btn small">Submit Solution</a></div>
    <div style="margin-top:16px" class="small">Past solutions may appear here after review.</div>`;
  app.appendChild(w);

  if (typeof MathJax !== 'undefined') MathJax.typesetPromise();
}

/* routing */
function router() {
  const hash = location.hash || '#/';
  // patterns: #/ , #/problems , #/problem/ID , #/strategies, #/weekly, #/about
  if (hash === '#/' || hash === '#') {
    renderHome();
  } else if (hash.startsWith('#/problems')) {
    // check query: #/problems?q=xxx
    const q = getQueryParam(hash,'q') || '';
    renderProblemsList(q);
  } else if (hash.startsWith('#/problem/')) {
    const id = hash.split('/')[2];
    renderProblemDetail(id);
  } else if (hash.startsWith('#/strategies')) {
    renderStrategies();
  } else if (hash.startsWith('#/weekly')) {
    renderWeekly();
  } else if (hash.startsWith('#/about')) {
    renderAbout();
  } else {
    renderHome();
  }
}

function renderAbout(){
  app.innerHTML = '';
  const card = el('div','card');
  card.innerHTML = `<h3>About this project</h3>
    <p class="small">This is an open, free resource for IMO aspirants. You can host on GitHub Pages. Contribute problems and solutions by editing <code>data/problems.json</code> and opening a pull request.</p>
    <p class="small">If you want a discussion forum, integrate Discourse, use GitHub discussions, or embed a comments widget like Disqus per problem.</p>`;
  app.appendChild(card);

  if (typeof MathJax !== 'undefined') MathJax.typesetPromise();
}

/* helpers */
function getQueryParam(hash, key) {
  const idx = hash.indexOf('?');
  if (idx === -1) return null;
  const qs = new URLSearchParams(hash.slice(idx+1));
  return qs.get(key);
}

/**
 * A simple markdown-to-HTML converter that handles specific block types.
 * Correctly escapes content to prevent XSS.
 * Supports:
 * - Markdown Tables
 * - Headers (##)
 * - Unordered lists (-)
 * - Paragraphs with line breaks
 */
function formatText(s = '') {
  if (!s) return '';
  
  // Split content into blocks (e.g., paragraphs, separated by double newlines)
  const blocks = s.split(/\n\s*\n/);
  
  const htmlBlocks = blocks.map(block => {
    block = block.trim();
    if (!block) return '';

    // Check for Markdown table (must start with a |)
    if (block.startsWith('|')) {
      const lines = block.split('\n');
      if (lines.length < 2 || !lines[1].includes('-')) {
        return `<p>${escapeHtml(block)}</p>`; // Not a valid table, treat as paragraph
      }
      try {
        const header = lines[0].split('|').slice(1, -1).map(h => `<th>${escapeHtml(h.trim())}</th>`).join('');
        const body = lines.slice(2).map(row => {
          const cells = row.split('|').slice(1, -1).map(cell => `<td>${escapeHtml(cell.trim())}</td>`).join('');
          return `<tr>${cells}</tr>`;
        }).join('');
        return `<table class="markdown-table"><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>`;
      } catch (e) {
        // If parsing fails for any reason, display as preformatted text
        return `<pre>${escapeHtml(block)}</pre>`;
      }
    }
    
    // Check for headers (starts with ##)
    if (block.startsWith('## ')) {
      return `<h3>${escapeHtml(block.substring(3))}</h3>`;
    }
    
    // Check for lists (each line starts with -)
    if (block.startsWith('- ')) {
      const items = block.split('\n').map(line => {
        if (line.trim().startsWith('- ')) {
          return `<li>${escapeHtml(line.trim().substring(2))}</li>`;
        }
        return ''; // Ignore invalid lines in a list block
      }).join('');
      return `<ul>${items}</ul>`;
    }
    
    // Otherwise, treat as a standard paragraph.
    // Escape all HTML and convert single newlines to <br> tags.
    return `<p>${escapeHtml(block).replace(/\n/g, '<br>')}</p>`;
  });
  
  return htmlBlocks.join('');
}

/* initialization */
document.addEventListener('DOMContentLoaded', () => {
  // Add auth button to header
 const headerInner = document.querySelector('.header-inner');
if (headerInner) {
  const authBtn = el('button', 'btn small', 'Login / Register');
  authBtn.id = 'auth-button';
  headerInner.appendChild(authBtn);
}
  
  // Initialize auth
  initAuth();
  
  // Load problems and initialize router
  fetchProblems().then(data => {
    PROBLEMS = data;
    router();
    window.addEventListener('hashchange', router);
  }).catch(err => {
    app.innerHTML = `<div class="card"><h3>Error</h3><p class="small">Failed to load data: ${escapeHtml(err.message)}</p></div>`;
  });
});