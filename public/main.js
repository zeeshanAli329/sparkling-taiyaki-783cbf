const PRODUCTS = [
  { id: 'cappuccino', name: 'Cappuccino', desc: 'Velvety foam over a double shot, dusted with cocoa.', ratio: 'Coffee 50% | Milk 50%', price: 8.5, img: 'cappuccino.png' },
  { id: 'chai', name: 'Chai Latte', desc: 'Warming spiced tea with steamed milk and cinnamon.', ratio: 'Chai 40% | Milk 60%', price: 8.5, img: 'chai.png' },
  { id: 'macchiato', name: 'Macchiato', desc: 'Layers of silky milk marked with bold espresso.', ratio: 'Coffee 30% | Milk 70%', price: 8.5, img: 'macchiato.png' },
  { id: 'espresso', name: 'Espresso', desc: 'A pure, intense shot crowned with golden crema.', ratio: 'Coffee 100%', price: 8.5, img: 'espresso.png' },
]

const imgUrl = (file, w) => `/.netlify/images?url=/img/${file}&w=${w}&fm=webp`
const money = (n) => `$${n.toFixed(2)}`
const $ = (id) => document.getElementById(id)

const encode = (form) => new URLSearchParams(new FormData(form)).toString()
const postForm = (form) =>
  fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: encode(form) })

// Toast
let toastTimer
function toast(msg) {
  const el = $('toast')
  el.textContent = msg
  el.classList.add('is-visible')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2400)
}

// Header & mobile nav
const header = document.querySelector('.header')
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40)
window.addEventListener('scroll', onScroll, { passive: true })
onScroll()

const burger = $('burger')
const nav = $('nav')
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open')
  burger.setAttribute('aria-expanded', String(open))
})
nav.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    nav.classList.remove('is-open')
    burger.setAttribute('aria-expanded', 'false')
  }
})

// Menu
$('menu-grid').innerHTML = PRODUCTS.map(
  (p) => `
  <article class="product reveal">
    <div class="product__img"><img src="${imgUrl(p.img, 480)}" alt="${p.name}" loading="lazy" width="300" height="300" /></div>
    <div class="product__body">
      <h3>${p.name}</h3>
      <p class="product__desc">${p.desc}</p>
      <p class="product__ratio">${p.ratio}</p>
      <p class="product__price">${money(p.price)}</p>
      <div><button class="btn" data-add="${p.id}">Order Now</button></div>
    </div>
  </article>`
).join('')

// Order bag
const STORAGE_KEY = 'beanscene-bag'
let bag = {}
try { bag = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {} } catch { bag = {} }

const drawer = $('drawer')
const overlay = $('overlay')

function renderBag() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bag))
  const entries = PRODUCTS.filter((p) => bag[p.id] > 0)
  const count = entries.reduce((n, p) => n + bag[p.id], 0)
  const total = entries.reduce((n, p) => n + bag[p.id] * p.price, 0)

  $('bag-count').textContent = count
  $('bag-empty').hidden = entries.length > 0
  $('bag-total').textContent = money(total)
  $('order-submit').disabled = entries.length === 0
  $('order-items').value = entries.map((p) => `${bag[p.id]} x ${p.name}`).join(', ')
  $('order-total').value = money(total)
  $('bag-items').innerHTML = entries
    .map(
      (p) => `
    <li class="drawer__item">
      <img src="${imgUrl(p.img, 120)}" alt="" />
      <div><strong>${p.name}</strong><small>${money(p.price)} each</small></div>
      <div class="qty">
        <button data-dec="${p.id}" aria-label="Remove one ${p.name}">&minus;</button>
        <span>${bag[p.id]}</span>
        <button data-inc="${p.id}" aria-label="Add one ${p.name}">+</button>
      </div>
    </li>`
    )
    .join('')
}

function openBag() {
  drawer.classList.add('is-open')
  drawer.setAttribute('aria-hidden', 'false')
  overlay.hidden = false
}
function closeBag() {
  drawer.classList.remove('is-open')
  drawer.setAttribute('aria-hidden', 'true')
  overlay.hidden = true
}

document.addEventListener('click', (e) => {
  const t = e.target.closest('button')
  if (!t) return
  const { add, inc, dec } = t.dataset
  if (add) {
    bag[add] = (bag[add] || 0) + 1
    renderBag()
    const c = $('bag-count')
    c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump')
    toast(`${PRODUCTS.find((p) => p.id === add).name} added to your order`)
  } else if (inc) {
    bag[inc]++
    renderBag()
  } else if (dec) {
    bag[dec]--
    if (bag[dec] <= 0) delete bag[dec]
    renderBag()
  }
})
$('bag-open').addEventListener('click', openBag)
$('bag-close').addEventListener('click', closeBag)
overlay.addEventListener('click', closeBag)
document.addEventListener('keydown', (e) => e.key === 'Escape' && closeBag())
renderBag()

$('order-form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const form = e.target
  const status = $('order-status')
  const btn = $('order-submit')
  btn.disabled = true
  status.textContent = 'Sending your order...'
  try {
    const res = await postForm(form)
    if (!res.ok) throw new Error()
    status.textContent = `Thanks, ${form.elements.namedItem('name').value}! Your order is being brewed.`
    bag = {}
    form.reset()
    renderBag()
    toast('Order placed. See you soon!')
  } catch {
    status.textContent = 'Something went wrong. Please try again.'
    btn.disabled = false
  }
})

// Newsletter
$('newsletter-form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const form = e.target
  const status = $('newsletter-status')
  status.classList.remove('is-error')
  status.textContent = 'Subscribing...'
  try {
    const res = await postForm(form)
    if (!res.ok) throw new Error()
    status.textContent = "You're subscribed! Fresh news is on its way."
    form.reset()
  } catch {
    status.classList.add('is-error')
    status.textContent = 'Something went wrong. Please try again.'
  }
})

// Testimonials slider
const slides = [...document.querySelectorAll('.quote')]
const dots = $('fb-dots')
let current = 0
dots.innerHTML = slides.map((_, i) => `<button aria-label="Show review ${i + 1}"></button>`).join('')
const dotBtns = [...dots.children]
function show(i) {
  current = (i + slides.length) % slides.length
  slides.forEach((s, j) => s.classList.toggle('is-active', j === current))
  dotBtns.forEach((d, j) => d.classList.toggle('is-active', j === current))
}
dotBtns.forEach((d, i) => d.addEventListener('click', () => show(i)))
$('fb-prev').addEventListener('click', () => show(current - 1))
$('fb-next').addEventListener('click', () => show(current + 1))
show(0)
let auto = setInterval(() => show(current + 1), 6000)
$('fb-track').addEventListener('mouseenter', () => clearInterval(auto))
$('fb-track').addEventListener('mouseleave', () => { auto = setInterval(() => show(current + 1), 6000) })

// Scroll reveal
document.querySelectorAll('.section-head, .discover__text, .discover__image, .why__card, .banner__text, .banner__image, .subscribe__box').forEach((el) => el.classList.add('reveal'))
const io = new IntersectionObserver(
  (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target) } }),
  { threshold: 0.15 }
)
document.querySelectorAll('.reveal').forEach((el) => io.observe(el))

$('year').textContent = new Date().getFullYear()
