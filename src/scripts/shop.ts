import { products, formatEur } from '../data/products';
import { articles, articleOrder, info } from '../data/content';

type View = 'cart' | 'product' | 'article' | 'info';
const LABELS: Record<View, string> = { cart: 'Tu bolsa', product: 'Objeto', article: 'Diario', info: 'Servicio' };
const VIEWS: Record<View, string> = { cart: '#view-cart', product: '#view-product', article: '#view-article', info: '#view-info' };

// Cart is keyed by "productId|finish"
let cart: Record<string, number> = {};
let finishes: Record<string, string> = {};
let panel: View | null = null;
let current: string | null = null;
let articleId: string | null = null;
let infoId: string | null = null;
let checkedOut = false;
let lastAdded: string | null = null;
let shownCount = 0;
let shownPanel: View | null = null;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

const $ = <T extends HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
const $$ = (sel: string) => document.querySelectorAll<HTMLElement>(sel);
const bgImage = (url: string) => `url("${url}")`;
const count = () => Object.values(cart).reduce((a, b) => a + b, 0);
const finishOf = (id: string) => finishes[id] ?? products[id].finishes[0];

function el(tag: string, cls: string, text?: string) {
  const node = document.createElement(tag);
  node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

function setMenu(open: boolean) {
  $('#menu').toggleAttribute('data-open', open);
  $$('[data-toggle-menu][aria-expanded]').forEach((b) => b.setAttribute('aria-expanded', String(open)));
}

function replay(node: HTMLElement) {
  node.classList.remove('view-in');
  void node.offsetWidth;
  node.classList.add('view-in');
}

function renderProduct() {
  const id = current!;
  const p = products[id];
  const fin = finishOf(id);
  const img = $('#prod-img');
  img.style.backgroundImage = bgImage(p.img);
  img.setAttribute('aria-label', p.alt);
  $('#prod-name').textContent = p.name;
  $('#prod-price').textContent = formatEur(p.price);
  $('#prod-long').textContent = p.long;
  $('#prod-material').textContent = p.material;
  $('#prod-dims').textContent = p.dims;
  $('#prod-finish-name').textContent = fin;
  $('#prod-finishes').replaceChildren(
    ...p.finishes.map((f) => {
      const b = el('button', 'chip min-h-11 bg-white px-3.5 py-2.5 text-[13px]', f);
      b.setAttribute('aria-pressed', String(f === fin));
      b.addEventListener('click', () => {
        finishes = { ...finishes, [id]: f };
        render();
      });
      return b;
    }),
  );
  const inBag = cart[`${id}|${fin}`];
  $('#prod-add-label').textContent = inBag ? `Añadir otra · ${inBag} en la bolsa` : `Añadir a la bolsa · ${fin}`;
}

function renderArticle() {
  const a = articles[articleId!];
  $('#art-meta').textContent = a.meta;
  $('#art-title').textContent = a.title;
  const img = $('#art-img');
  img.style.backgroundImage = bgImage(a.img);
  img.setAttribute('aria-label', a.alt);
  $('#art-body').replaceChildren(...a.body.map((t) => el('p', 'm-0 max-w-150 text-[17px] leading-[1.7] text-pretty', t)));
  $('#art-author').textContent = a.author;
  const next = articles[articleOrder[(articleOrder.indexOf(a.id) + 1) % articleOrder.length]];
  const btn = $('#art-next');
  btn.textContent = `Siguiente historia: ${next.title}`;
  btn.onclick = () => {
    articleId = next.id;
    render();
  };
}

function renderInfo() {
  const data = info[infoId!];
  $('#info-title').textContent = data.title;
  $('#info-items').replaceChildren(
    ...data.items.map((it) => {
      const row = el('div', 'flex flex-col gap-1.5');
      row.append(el('span', 'font-display text-[17px]', it.h), el('span', 'text-[15px] leading-[1.65] opacity-85', it.t));
      return row;
    }),
  );
}

function renderCart() {
  const keys = Object.keys(cart);
  $('#cart-empty').hidden = keys.length > 0;
  $('#cart-footer').hidden = keys.length === 0;
  $('#checkout-note').hidden = !checkedOut;
  const tpl = $<HTMLTemplateElement>('#line-tpl');
  $('#cart-lines').replaceChildren(
    ...keys.map((key) => {
      const [id, fin] = key.split('|');
      const p = products[id];
      const q = cart[key];
      const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
      if (key === lastAdded) node.classList.add('pop-in');
      const img = node.querySelector<HTMLElement>('[data-img]')!;
      img.style.backgroundImage = bgImage(p.img);
      img.setAttribute('aria-label', p.name);
      node.querySelector('[data-name]')!.textContent = p.name;
      node.querySelector('[data-finish]')!.textContent = fin;
      node.querySelector('[data-total]')!.textContent = formatEur(p.price * q);
      node.querySelector('[data-qty]')!.textContent = String(q);
      node.querySelector('[data-inc]')!.addEventListener('click', () => setQty(key, q + 1));
      node.querySelector('[data-dec]')!.addEventListener('click', () => setQty(key, q - 1));
      node.querySelector('[data-remove]')!.addEventListener('click', () => setQty(key, 0));
      return node;
    }),
  );
  $('#cart-subtotal').textContent = formatEur(keys.reduce((a, k) => a + products[k.split('|')[0]].price * cart[k], 0));
  lastAdded = null;
}

function renderPanel() {
  const open = panel !== null;
  $('#panel').toggleAttribute('data-open', open);
  $('#backdrop').toggleAttribute('data-open', open);
  (Object.keys(VIEWS) as View[]).forEach((v) => ($(VIEWS[v]).hidden = v !== panel));
  if (!panel) {
    shownPanel = null;
    return;
  }
  $('#panel').style.setProperty('--panel-w', panel === 'article' ? '720px' : '480px');
  const label = panel === 'cart' ? `${LABELS.cart} (${count()})` : LABELS[panel];
  $('#panel-label').textContent = label;
  $('#panel').setAttribute('aria-label', label);

  if (panel === 'product' && current) renderProduct();
  if (panel === 'article' && articleId) renderArticle();
  if (panel === 'info' && infoId) renderInfo();
  if (panel === 'cart') renderCart();

  if (shownPanel !== panel) {
    $('#panel').scrollTop = 0;
    if (shownPanel !== null) replay($(VIEWS[panel]));
    shownPanel = panel;
  }
}

function render() {
  const total = count();
  $$('[data-cart-count]').forEach((n) => {
    n.textContent = String(total);
    if (total > shownCount && !reduceMotion.matches) {
      n.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }], {
        duration: 280,
        easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
      });
    }
  });
  shownCount = total;
  renderPanel();
}

function setQty(key: string, q: number) {
  const next = { ...cart };
  if (q <= 0) delete next[key];
  else next[key] = q;
  cart = next;
  checkedOut = false;
  render();
}

function add(id: string) {
  const key = `${id}|${finishOf(id)}`;
  lastAdded = key in cart ? null : key;
  cart = { ...cart, [key]: (cart[key] ?? 0) + 1 };
  panel = 'cart';
  checkedOut = false;
  render();
}

const show = (v: View) => {
  panel = v;
  setMenu(false);
  render();
};

// ---- Filters ----
function applyFilter(key: string) {
  $$('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === key)));
  let shown = 0;
  $$('[data-card]').forEach((card) => {
    const visible = key === 'todo' || card.dataset.cat === key;
    const wasHidden = card.hidden;
    card.hidden = !visible;
    if (visible && wasHidden && !reduceMotion.matches) {
      card.classList.remove('pop-in');
      void card.offsetWidth;
      card.style.animationDelay = `${shown * 60}ms`;
      card.classList.add('pop-in');
    }
    if (visible) {
      card.classList.add('is-visible');
      shown++;
    }
  });
}

// ---- Wiring ----
$$('[data-toggle-menu]').forEach((b) => b.addEventListener('click', () => setMenu(!$('#menu').hasAttribute('data-open'))));
$$('[data-open-cart]').forEach((b) => b.addEventListener('click', () => show('cart')));
$$('[data-close-panel]').forEach((b) =>
  b.addEventListener('click', () => {
    panel = null;
    render();
  }),
);
$$('[data-add]').forEach((b) => b.addEventListener('click', () => add(b.dataset.add!)));
$$('[data-open-product]').forEach((b) =>
  b.addEventListener('click', () => {
    current = b.dataset.openProduct!;
    show('product');
  }),
);
$$('[data-read]').forEach((b) =>
  b.addEventListener('click', () => {
    articleId = b.dataset.read!;
    show('article');
  }),
);
$$('[data-info]').forEach((b) =>
  b.addEventListener('click', () => {
    infoId = b.dataset.info!;
    show('info');
  }),
);
$$('[data-filter]').forEach((b) => b.addEventListener('click', () => applyFilter(b.dataset.filter!)));
$('#prod-add').addEventListener('click', () => current && add(current));
$('#checkout').addEventListener('click', () => {
  checkedOut = true;
  render();
});

// Visit form
const visitForm = $<HTMLFormElement>('#visit-form');
const visitDone = $('#visit-done');
visitForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(visitForm);
  $('#visit-name').textContent = String(fd.get('name')).trim().split(' ')[0];
  $('#visit-when').textContent = `${String(fd.get('day')).toLowerCase()} a las ${fd.get('time')}`;
  visitForm.hidden = true;
  visitDone.hidden = false;
  replay(visitDone);
});
$('#visit-reset').addEventListener('click', () => {
  visitForm.reset();
  visitDone.hidden = true;
  visitForm.hidden = false;
  replay(visitForm);
});

// Newsletter
const news = $<HTMLFormElement>('#news-form');
news.addEventListener('submit', (e) => {
  e.preventDefault();
  news.hidden = true;
  const done = $('#news-done');
  done.hidden = false;
  replay(done);
});

window.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  panel = null;
  setMenu(false);
  render();
});

render();
