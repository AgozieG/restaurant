/* Checkout: validation, delivery fee, order email to the restaurant */
const DELIVERY_FEE = 1500;
const form = document.getElementById("form");
const summaryEl = document.getElementById("summary");
const errEl = document.getElementById("err");
const deliveryBox = document.getElementById("deliveryBox");

if (!Auth.require()) throw new Error("redirecting");
if (!Cart.all().length) location.href = "/site/cart.html";

const user = Auth.user();
document.getElementById("name").value = user.name || "";
document.getElementById("email").value = user.email || "";
document.getElementById("phone").value = user.phone || "";

const mode = () => form.querySelector("input[name=mode]:checked").value;
const payment = () => form.querySelector("input[name=pay]:checked").value;

form.querySelectorAll("input[name=mode]").forEach((r) =>
  r.addEventListener("change", () => { deliveryBox.style.display = mode() === "Delivery" ? "block" : "none"; paint(); })
);

function describe(line) {
  const groups = {};
  line.choices.forEach((c) => { (groups[c.groupLabel] ||= []).push(c.price ? `${c.name} (+${ngn(c.price)})` : c.name); });
  return Object.entries(groups).map(([g, v]) => `${g}: ${v.join(", ")}`).join(" | ") + (line.note ? ` | Note: ${line.note}` : "");
}

function totals() {
  const sub = Cart.total();
  const fee = mode() === "Delivery" ? DELIVERY_FEE : 0;
  return { sub, fee, grand: sub + fee };
}

function paint() {
  const { sub, fee, grand } = totals();
  summaryEl.innerHTML = `
    <h3 style="margin-bottom:14px">Order summary</h3>
    ${Cart.all().map((l) => `
      <div style="padding:10px 0;border-bottom:1px dashed var(--border)">
        <div class="row" style="margin:0"><b>${l.qty} × ${l.name}</b><span class="price">${ngn(l.unit * l.qty)}</span></div>
        <small style="color:var(--ink-soft);line-height:1.6">${describe(l) || "No extras"}</small>
      </div>`).join("")}
    <div class="row" style="margin-top:14px"><span>Subtotal</span><span>${ngn(sub)}</span></div>
    <div class="row"><span>${mode()}</span><span>${fee ? ngn(fee) : "Free"}</span></div>
    <div class="row total"><span>Total</span><span>${ngn(grand)}</span></div>
    <a class="btn ghost" href="/site/cart.html" style="width:100%;margin-top:12px">Back to cart</a>`;
}
paint();

form.addEventListener("submit", (e) => e.preventDefault());

document.getElementById("pay").addEventListener("click", () => {
  errEl.textContent = "";
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const area = document.getElementById("area").value.trim();
  const notes = document.getElementById("notes").value.trim();

  if (!name) return (errEl.textContent = "Please enter your name.");
  if (!/^\S+@\S+\.\S+$/.test(email)) return (errEl.textContent = "Please enter a valid email address.");
  if (!/^[0-9+\s-]{7,}$/.test(phone)) return (errEl.textContent = "Please enter a valid phone number.");
  if (mode() === "Delivery" && (!address || !area)) return (errEl.textContent = "Delivery orders need an address and area.");

  const { sub, fee, grand } = totals();
  const ref = "DL-" + Date.now().toString().slice(-6);
  const order = {
    ref, when: new Date().toISOString(), name, email, phone, mode: mode(), address, area,
    payment: payment(), notes, items: Cart.all(), subtotal: sub, delivery: fee, total: grand,
  };
  write(STORE.orders, [order, ...read(STORE.orders, [])]);

  const body = [
    `NEW ORDER ${ref} — Daisy Life`,
    `Placed: ${new Date().toLocaleString("en-NG")}`,
    "",
    "CUSTOMER",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Fulfilment: ${mode()}`,
    mode() === "Delivery" ? `Location: ${address}, ${area}` : `Pickup at: ${BUSINESS.address}`,
    `Payment: ${payment()}`,
    notes ? `Notes: ${notes}` : "",
    "",
    "ITEMS",
    ...Cart.all().map((l, i) => `${i + 1}. ${l.qty} x ${l.name} — ${ngn(l.unit)} each = ${ngn(l.unit * l.qty)}\n   ${describe(l) || "No extras"}`),
    "",
    `Subtotal: ${ngn(sub)}`,
    `Delivery: ${fee ? ngn(fee) : "Free (pickup)"}`,
    `TOTAL: ${ngn(grand)}`,
  ].filter(Boolean).join("\n");

  const mailto = `mailto:${BUSINESS.email}?subject=${encodeURIComponent(`New order ${ref} — ${name}`)}&body=${encodeURIComponent(body)}`;

  const overlay = document.createElement("div");
  overlay.className = "overlay open";
  overlay.innerHTML = `<div class="sheet" style="text-align:center">
    <div style="font-size:54px">✅</div>
    <h2 style="margin:10px 0 6px">Order ${ref} placed</h2>
    <p class="lead" style="margin:0 auto 8px">Thanks ${name.split(" ")[0]}! We've prepared an order email to the kitchen with your items, toppings, phone number${mode() === "Delivery" ? " and delivery location" : ""}.</p>
    <p class="price" style="font-size:28px;margin:14px 0">${ngn(grand)}</p>
    <a class="btn" href="${mailto}" id="sendMail" style="width:100%">Send order to the kitchen ✉</a>
    <pre style="text-align:left;white-space:pre-wrap;background:var(--surface-2);padding:14px;border-radius:14px;font-size:12px;margin-top:14px;max-height:220px;overflow:auto">${body.replace(/</g, "&lt;")}</pre>
    <a class="btn ghost" href="/site/menu.html" style="width:100%;margin-top:12px">Order something else</a>
  </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector("#sendMail").addEventListener("click", () => { Cart.clear(); });
  Cart.clear();
  toast("Payment confirmed (demo) — order sent");
});
