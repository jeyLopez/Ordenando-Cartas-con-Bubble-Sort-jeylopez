import "bootstrap";
import "./style.css";


import "./assets/img/rigo-baby.jpg";
import "./assets/img/4geeks.ico";

    (() => {
    
      const SUITS = [
        { key:'♠', color:'black' },
        { key:'♥', color:'red'   },
        { key:'♦', color:'red'   },
        { key:'♣', color:'black' }
      ];
      const RANKS = [
        { key:'A', value:14 }, { key:'K', value:13 }, { key:'Q', value:12 }, { key:'J', value:11 },
        { key:'10', value:10 }, { key:'9', value:9 }, { key:'8', value:8 }, { key:'7', value:7 },
        { key:'6', value:6 }, { key:'5', value:5 }, { key:'4', value:4 }, { key:'3', value:3 }, { key:'2', value:2 }
      ];

    
      function randomCard() {
        const s = SUITS[Math.floor(Math.random() * SUITS.length)];
        const r = RANKS[Math.floor(Math.random() * RANKS.length)];
        return { rank: r.key, value: r.value, suit: s.key, color: s.color };
      }
      function generateCards(n) {
        const out = [];
        for (let i = 0; i < n; i++) out.push(randomCard());
        return out;
      }
      const cloneCards = arr => arr.map(c => ({...c}));

      function cardHTML({rank, suit, color}) {
        const colorClass = (color === 'red') ? 'red' : 'black';
        return `
          <div class="playing-card ${colorClass}">
            <div class="pc-corner">
       
              <div class="suit">${suit}</div>
            </div>
            <div class="pc-center">${rank}</div>
            <div class="pc-corner bottom">
            <div class="suit">${suit}</div>
           
            </div>
          </div>
        `;
      }

      // Render de cartas en un contenedor (grid bootstrap)
      function renderCards(container, cards, {mini=false} = {}) {
        container.classList.toggle('mini', mini);
        container.innerHTML = '';
        const frag = document.createDocumentFragment();
        cards.forEach(c => {
          const col = document.createElement('div');
          col.className = 'col';
          col.innerHTML = cardHTML(c);
          frag.appendChild(col);
        });
        container.appendChild(frag);
      }

      function bubbleSortWithLog(cards) {
        const a = cloneCards(cards);
        const steps = []; 

        let swapped = true;
        for (let i = 0; i < a.length - 1 && swapped; i++) {
          swapped = false;
          for (let j = 0; j < a.length - 1 - i; j++) {
            if (a[j].value > a[j + 1].value) {
              [a[j], a[j + 1]] = [a[j + 1], a[j]];
              steps.push(cloneCards(a)); 
              swapped = true;
            }
          }
        }
        return { sorted: a, steps };
      }

      
      const qtyInput = document.getElementById('qty');
      const btnDraw = document.getElementById('btnDraw');
      const btnSort = document.getElementById('btnSort');
      const currentEl = document.getElementById('current');
      const logEl = document.getElementById('log');

      let currentCards = [];

      
      btnDraw.addEventListener('click', () => {
        const n = Math.max(1, Math.min(52, parseInt(qtyInput.value || '0', 10)));
        currentCards = generateCards(n);
        renderCards(currentEl, currentCards);
        logEl.innerHTML = '';                 
      });
      
      btnSort.addEventListener('click', () => {
        if (!currentCards.length) return;

        const { sorted, steps } = bubbleSortWithLog(currentCards);

        currentCards = sorted;
        renderCards(currentEl, currentCards);

        logEl.innerHTML = '';
        if (!steps.length) {
          logEl.innerHTML = '<div class="text-white-50">No swaps needed (already sorted).</div>';
          return;
        }
        steps.forEach((snapshot, idx) => {
          const wrap = document.createElement('div');
          wrap.innerHTML = `
            <span class="badge-step">Step ${idx + 1}</span>
            <div class="row row-cols-2 row-cols-md-4 row-cols-xl-8 g-2 mt-1"></div>
          `;
          const row = wrap.querySelector('.row');
          renderCards(row, snapshot, { mini:true });
          logEl.appendChild(wrap);
        });
      });

      
      btnDraw.click();
    })();
 

window.onload = function() {
  //write your code here
  console.log("Hello Rigo from the console!");
};
