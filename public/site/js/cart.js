/* Cart page: list, edit, update qty, delete, totals */
const linesEl = document.getElementById("lines");
const summaryEl = document.getElementById("summary");

function describe(line) {
  const groups = {};
  line.choices.forEach((c) => { (groups[c.groupLabel] ||= []).push(c.price ? `${c.name} (+${ngn(c.price)})` : c.name); });
  const parts = Object.entries(groups).map(([g, v]) => `<b>${g}:</b> ${v.join(", ")}`);
  if (line.note) parts.push(`<b>Note:</b> ${line.note}`);
  return parts.length ? parts.join("<br>") : "No extras selected";
}

function render() {
  const items = Cart.all();
  if (!items.length) {
    linesEl.innerHTML = `<div style="text-align:center;padding:40px 10px">
      <div style="font-size:46px">🛒</div>
      <h2 style="margin:12px 0 8px">Your cart is empty</h2>
      <p class="lead" style="margin:0 auto 20px">Head to the menu and build something smoky.</p>
      <a class="btn" href="/site/menu.html">Browse the menu</a></div>`;
    summaryEl.style.display = "none";
    return;
  }
  summaryEl.style.display = "";
  linesEl.innerHTML = items.map((l) => `
    <div class="line">
      <div>
        <h3 style="font-size:18px">${l.name}</h3>
        <small>${describe(l)}</small>
        <small style="margin-top:6px">Base ${ngn(l.base)} · Unit ${ngn(l.unit)}</small>
        <div style="display:flex;gap:8px;align-items:center;margin-top:12px;flex-wrap:wrap">
          <div class="qty"><button data-dec="${l.lineId}">−</button><b>${l.qty}</b><button data-inc="${l.lineId}">+</button></div>
          <button class="btn sm ghost" data-edit="${l.lineId}">Edit options</button>
          <button class="btn sm ghost" data-del="${l.lineId}" style="color:var(--red-deep)">Delete</button>
        </div>
      </div>
      <div class="price" style="font-size:19px">${ngn(l.unit * l.qty)}</div>
    </div>`).join("");

  const sub = Cart.total();
  summaryEl.innerHTML = `
    <h3 style="margin-bottom:16px">Order summary</h3>
    <div class="row"><span>Items</span><span>${Cart.count()}</span></div>
    <div class="row"><span>Subtotal</span><span>${ngn(sub)}</span></div>
    <div class="row"><span>Delivery</span><span style="color:var(--ink-soft)">Calculated at checkout</span></div>
    <div class="row total"><span>Total</span><span>${ngn(sub)}</span></div>
    <button class="btn" id="buy" style="width:100%;margin-top:14px">Buy now →</button>
    <a class="btn ghost" href="/site/menu.html" style="width:100%;margin-top:10px">Add more items</a>
    <button class="btn ghost" id="clear" style="width:100%;margin-top:10px;color:var(--red-deep)">Clear cart</button>`;

  linesEl.querySelectorAll("[data-inc]").forEach((b) => b.onclick = () => { const l = get(b.dataset.inc); Cart.update(l.lineId, { qty: l.qty + 1 }); render(); });
  linesEl.querySelectorAll("[data-dec]").forEach((b) => b.onclick = () => { const l = get(b.dataset.dec); Cart.update(l.lineId, { qty: Math.max(1, l.qty - 1) }); render(); });
  linesEl.querySelectorAll("[data-del]").forEach((b) => b.onclick = () => { Cart.remove(b.dataset.del); toast("Item removed", "bad"); render(); });
  linesEl.querySelectorAll("[data-edit]").forEach((b) => b.onclick = () => {
    sessionStorage.setItem("daisy_edit", JSON.stringify(get(b.dataset.edit)));
    location.href = "/site/menu.html";
  });
  summaryEl.querySelector("#clear").onclick = () => { Cart.clear(); toast("Cart cleared", "bad"); render(); };
  summaryEl.querySelector("#buy").onclick = () => {
    if (!Auth.user()) { toast("Please log in to continue", "bad"); setTimeout(() => location.href = "/site/login.html?next=/site/checkout.html", 700); return; }
    location.href = "/site/checkout.html";
  };
}

const get = (id) => Cart.all().find((l) => l.lineId === id);
document.addEventListener("DOMContentLoaded", render);
