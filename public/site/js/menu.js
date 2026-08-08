/* Menu page: rendering, option builder, live pricing */
const ITEMS = window.DAISY_DATA.MENU;
const CATS = window.DAISY_DATA.CATEGORIES;

let activeCat = "all";
let query = "";

const grid = document.getElementById("menuGrid");
const filters = document.getElementById("filters");
const modal = document.getElementById("modal");
const sheet = document.getElementById("sheet");

function renderFilters() {
  filters.innerHTML = CATS.map(
    (c) => `<button class="chip ${c.key === activeCat ? "active" : ""}" data-cat="${c.key}">${c.label}</button>`
  ).join("");
  filters.querySelectorAll(".chip").forEach((b) =>
    b.addEventListener("click", () => { activeCat = b.dataset.cat; renderFilters(); renderGrid(); })
  );
}

function renderGrid() {
  const list = ITEMS.filter(
    (m) => (activeCat === "all" || m.cat === activeCat) && m.name.toLowerCase().includes(query)
  );
  grid.innerHTML = list.length
    ? list.map((m) => `
      <article class="card item tilt reveal">
        <div class="thumb"><img src="/site/img/${m.id}.jpg" alt="${m.name}" loading="lazy" width="768" height="576" /></div>
        <div class="top">
          <h3>${m.name}</h3>
          <span class="price">${ngn(m.base)}</span>
        </div>
        ${m.badge ? `<span class="badge ${m.hot ? "hot" : ""}">${m.badge}</span>` : ""}
        <p>${m.desc}</p>
        <button class="btn sm" style="margin-top:auto;align-self:flex-start" data-open="${m.id}">
          ${m.options.length ? "Customise & add" : "Add to cart"}
        </button>
      </article>`).join("")

    : `<p class="lead">Nothing matches that search.</p>`;

  grid.querySelectorAll("[data-open]").forEach((b) =>
    b.addEventListener("click", () => openItem(b.dataset.open))
  );
  initReveal();
}

document.getElementById("search").addEventListener("input", (e) => {
  query = e.target.value.toLowerCase().trim();
  renderGrid();
});

/* ---------- item sheet ---------- */
let current = null;

function openItem(id, existing = null) {
  current = { item: ITEMS.find((m) => m.id === id), qty: existing ? existing.qty : 1, editing: existing?.lineId || null, note: existing?.note || "" };
  const { item } = current;

  sheet.innerHTML = `
    <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start">
      <div><h2 style="font-size:24px">${item.name}</h2><p class="lead" style="font-size:14px;margin-top:6px">${item.desc}</p></div>
      <button class="btn sm ghost" id="closeSheet">✕</button>
    </div>
    <img class="sheet-img" src="/site/img/${item.id}.jpg" alt="${item.name}" loading="lazy" />
    <div id="opts">

      ${item.options.map((g) => `
        <div class="opt-group">
          <h4>${g.label}${g.optional ? " (optional)" : ""}</h4>
          ${g.items.map((o, i) => `
            <label class="opt">
              <input type="${g.type === "multi" ? "checkbox" : "radio"}" name="${g.key}" value="${i}" data-group="${g.key}" />
              <span>${o.name}</span>
              ${o.price ? `<span class="p">+${ngn(o.price)}</span>` : `<span class="p">Included</span>`}
            </label>`).join("")}
        </div>`).join("")}
      <div class="opt-group">
        <h4>Special instructions</h4>
        <div class="field"><textarea id="note" rows="2" placeholder="e.g. extra spicy, no onions">${current.note}</textarea></div>
      </div>
    </div>
    <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:22px">
      <div class="qty"><button id="minus">−</button><b id="qtyVal">${current.qty}</b><button id="plus">+</button></div>
      <div style="margin-left:auto;text-align:right">
        <div style="font-size:12px;color:var(--ink-soft)">Total</div>
        <div class="price" id="livePrice" style="font-size:24px">${ngn(item.base)}</div>
      </div>
    </div>
    <button class="btn" id="addBtn" style="width:100%;margin-top:16px">${current.editing ? "Update item" : "Add to cart"}</button>`;

  // preselect when editing
  if (existing) {
    existing.choices.forEach((c) => {
      const el = sheet.querySelector(`input[data-group="${c.group}"][value="${c.index}"]`);
      if (el) el.checked = true;
    });
  }

  sheet.querySelectorAll("input").forEach((i) => i.addEventListener("change", price));
  sheet.querySelector("#minus").onclick = () => { current.qty = Math.max(1, current.qty - 1); sheet.querySelector("#qtyVal").textContent = current.qty; price(); };
  sheet.querySelector("#plus").onclick = () => { current.qty++; sheet.querySelector("#qtyVal").textContent = current.qty; price(); };
  sheet.querySelector("#closeSheet").onclick = close;
  sheet.querySelector("#addBtn").onclick = commit;
  price();
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function collect() {
  const choices = [];
  sheet.querySelectorAll("input:checked").forEach((el) => {
    const g = current.item.options.find((o) => o.key === el.dataset.group);
    const opt = g.items[+el.value];
    choices.push({ group: g.key, groupLabel: g.label, index: +el.value, name: opt.name, price: opt.price });
  });
  const unit = current.item.base + choices.reduce((s, c) => s + c.price, 0);
  return { choices, unit };
}

function price() {
  const { unit } = collect();
  sheet.querySelector("#livePrice").textContent = ngn(unit * current.qty);
}

function commit() {
  const { choices, unit } = collect();
  const note = sheet.querySelector("#note").value.trim();
  const required = current.item.options.filter((g) => !g.optional);
  const missing = required.find((g) => !choices.some((c) => c.group === g.key));
  if (missing) return toast("Please choose: " + missing.label, "bad");

  const line = { lineId: current.editing || uid(), id: current.item.id, name: current.item.name, base: current.item.base, choices, note, unit, qty: current.qty };
  if (current.editing) { Cart.update(current.editing, line); toast("Item updated"); }
  else { Cart.add(line); toast(`${current.item.name} added — ${ngn(unit * current.qty)}`); }
  close();
}

function close() { modal.classList.remove("open"); document.body.style.overflow = ""; }
modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

renderFilters();
renderGrid();

// deep-link for editing from the cart page
const editRaw = sessionStorage.getItem("daisy_edit");
if (editRaw) {
  sessionStorage.removeItem("daisy_edit");
  const line = JSON.parse(editRaw);
  setTimeout(() => openItem(line.id, line), 200);
}
