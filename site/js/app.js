/* Daisy Life — shared front-end logic (vanilla JS, localStorage only) */
const STORE = {
  users: "daisy_users",
  session: "daisy_session",
  cart: "daisy_cart",
  orders: "daisy_orders",
};

const BUSINESS = {
  name: "Daisy Life",
  email: "orders@daisylife.demo",
  phone: "+234 800 000 0000",
  address: "Sabbath Bustop, 7 Umueke St, New Haven, Enugu 400102, Enugu State, Nigeria",
  hours: "Mon – Sun · 9:00am – 10:00pm",
};

const ngn = (n) => "₦" + Number(n || 0).toLocaleString("en-NG");
const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const uid = () => Math.random().toString(36).slice(2, 10);

/* ---------------- auth ---------------- */
const Auth = {
  user: () => read(STORE.session, null),
  users: () => read(STORE.users, []),
  signup(name, email, password, phone) {
    const users = Auth.users();
    if (users.some((u) => u.email === email.toLowerCase())) throw new Error("That email already has an account.");
    const user = { id: uid(), name, email: email.toLowerCase(), phone, password: btoa(password) };
    users.push(user); write(STORE.users, users);
    write(STORE.session, { id: user.id, name, email: user.email, phone });
    return user;
  },
  login(email, password) {
    const user = Auth.users().find((u) => u.email === email.toLowerCase());
    if (!user || atob(user.password) !== password) throw new Error("Email or password is incorrect.");
    write(STORE.session, { id: user.id, name: user.name, email: user.email, phone: user.phone });
    return user;
  },
  logout() { localStorage.removeItem(STORE.session); location.href = "/site/index.html"; },
  require() {
    if (!Auth.user()) { location.href = "/site/login.html?next=" + encodeURIComponent(location.pathname); return false; }
    return true;
  },
};

/* ---------------- cart ---------------- */
const Cart = {
  all: () => read(STORE.cart, []),
  save(items) { write(STORE.cart, items); Cart.paintCount(); },
  count: () => Cart.all().reduce((s, i) => s + i.qty, 0),
  total: () => Cart.all().reduce((s, i) => s + i.unit * i.qty, 0),
  add(line) { const items = Cart.all(); items.push(line); Cart.save(items); },
  update(id, patch) { Cart.save(Cart.all().map((i) => (i.lineId === id ? { ...i, ...patch } : i))); },
  remove(id) { Cart.save(Cart.all().filter((i) => i.lineId !== id)); },
  clear() { Cart.save([]); },
  paintCount() {
    const n = Cart.count();
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      el.textContent = n;
      el.style.display = n ? "grid" : "none";
    });
  },
};

/* ---------------- toasts ---------------- */
function toast(msg, kind = "good") {
  let host = document.getElementById("toasts");
  if (!host) { host = document.createElement("div"); host.id = "toasts"; document.body.appendChild(host); }
  const el = document.createElement("div");
  el.className = "toast " + kind;
  el.textContent = msg;
  host.appendChild(el);
  setTimeout(() => { el.style.transition = "opacity .4s, transform .4s"; el.style.opacity = "0"; el.style.transform = "translateY(10px)"; }, 2600);
  setTimeout(() => el.remove(), 3100);
}

/* ---------------- chrome (header/footer) ---------------- */
function mountChrome() {
  const page = document.body.dataset.page || "";
  const user = Auth.user();
  const link = (href, key, label) => `<a href="/site/${href}" class="${page === key ? "active" : ""}">${label}</a>`;

  const head = document.createElement("header");
  head.className = "site-head";
  head.innerHTML = `
    <div class="wrap bar">
      <a class="brand" href="/site/index.html"><em>Daisy</em><span>Life</span><small>ENUGU</small></a>
      <button class="burger" aria-label="Menu">☰</button>
      <nav class="nav">
        ${link("index.html", "home", "Home")}
        ${link("menu.html", "menu", "Menu")}
        ${link("contact.html", "contact", "Contact")}
        <a href="/site/cart.html" class="cart-pill ${page === "cart" ? "active" : ""}">Cart <b data-cart-count style="display:none">0</b></a>
        ${user
          ? `<a href="#" id="logoutBtn" class="btn sm ghost" style="margin-left:6px">Hi, ${user.name.split(" ")[0]} · Log out</a>`
          : `${link("login.html", "login", "Log in")}<a href="/site/signup.html" class="btn sm" style="margin-left:6px">Sign up</a>`}
      </nav>
    </div>`;
  document.body.prepend(head);

  head.querySelector(".burger").addEventListener("click", () => head.querySelector(".nav").classList.toggle("open"));
  const lo = head.querySelector("#logoutBtn");
  if (lo) lo.addEventListener("click", (e) => { e.preventDefault(); Auth.logout(); });

  const foot = document.createElement("footer");
  foot.className = "site-foot";
  foot.innerHTML = `
    <div class="wrap cols">
      <div>
        <div class="brand" style="color:#fff"><em style="color:#ff6b5e">Daisy</em><span>Life</span></div>
        <p style="color:#b9b5a7;line-height:1.7;max-width:32ch">Grills, BBQ, pasta and rice made fresh daily in New Haven, Enugu.</p>
      </div>
      <div><h4 style="margin-bottom:10px">Visit us</h4><p style="color:#b9b5a7;line-height:1.7">${BUSINESS.address}</p></div>
      <div><h4 style="margin-bottom:10px">Order & enquiries</h4>
        <p style="line-height:1.9"><a href="tel:${BUSINESS.phone.replace(/\s/g, "")}">${BUSINESS.phone}</a><br>
        <a href="mailto:${BUSINESS.email}">${BUSINESS.email}</a><br>
        <span style="color:#b9b5a7">${BUSINESS.hours}</span></p></div>
      <div><h4 style="margin-bottom:10px">Explore</h4><p style="line-height:1.9">
        <a href="/site/menu.html">Full menu</a><br><a href="/site/cart.html">Your cart</a><br><a href="/site/contact.html">Contact</a></p></div>
    </div>
    <div class="wrap"><small>© ${new Date().getFullYear()} Daisy Life · Demo website. Orders placed here are for demonstration only.</small></div>`;
  document.body.appendChild(foot);

  Cart.paintCount();
}

/* ---------------- reveal on scroll ---------------- */
function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 6) * 60 + "ms"; io.observe(el); });
}

document.addEventListener("DOMContentLoaded", () => {
  const aurora = document.createElement("div");
  aurora.className = "aurora";
  aurora.innerHTML = "<span></span><span></span><span></span>";
  document.body.prepend(aurora);
  mountChrome();
  initReveal();
});
