import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  FiGrid, FiTerminal, FiFolder, FiFileText, FiFile, FiMusic, FiList, FiSliders, FiBookOpen,
  FiChevronLeft, FiChevronRight, FiVolume, FiVolume1, FiVolume2, FiVolumeX, FiSun, FiMoon, FiChevronDown,
} from 'react-icons/fi'
import Menu from './Menu'

const base = import.meta.env.BASE_URL

const PANEL_APPS = [
  { id: 'terminal', Icon: FiTerminal },
  { id: 'files', Icon: FiFolder },
  { id: 'editor', Icon: FiFileText },
  { id: 'viewer', Icon: FiFile },
  { id: 'music', Icon: FiMusic },
  { id: 'commands', Icon: FiList },
  { id: 'settings', Icon: FiSliders },
  { id: 'simple', Icon: FiBookOpen },
]

const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

// Ventana emergente no modal anclada a un botón del panel: Escape o un clic fuera la cierran.
// Va en un portal: el centro del panel usa translate y eso cambiaría la referencia de position: fixed
function Popover({ anchor, label, onClose, children, align = 'left', className = '' }) {
  const ref = useRef(null)
  const [pos, setPos] = useState(null)

  useLayoutEffect(() => {
    const rect = anchor.getBoundingClientRect()
    const width = ref.current.offsetWidth
    const left = align === 'center' ? rect.left + rect.width / 2 - width / 2 : align === 'right' ? rect.right - width : rect.left
    setPos({ left: Math.max(8, Math.min(left, window.innerWidth - width - 8)), top: rect.bottom + 6 })
  }, [anchor, align])

  useEffect(() => {
    const onDown = (e) => {
      if (!ref.current?.contains(e.target) && !anchor.contains(e.target)) onClose(false)
    }
    document.addEventListener('pointerdown', onDown, true)
    return () => document.removeEventListener('pointerdown', onDown, true)
  }, [anchor, onClose])

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-label={label}
      className={`popover ${className}`}
      style={pos || { left: 0, top: 0, opacity: 0 }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation()
          onClose(true)
        }
      }}
    >
      {children}
    </div>,
    document.body,
  )
}

// Botón del panel que abre una ventana emergente; al cerrar con teclado el foco vuelve al botón
function usePopover() {
  const [open, setOpen] = useState(false)
  const button = useRef(null)
  const close = (returnFocus) => {
    setOpen(false)
    if (returnFocus) button.current?.focus()
  }
  return { open, setOpen, button, close }
}

// ---------- Aplicaciones: buscador tipo combobox ----------

function AppsMenu({ d, onLaunch }) {
  const pop = usePopover()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const listId = useId()
  const p = d.panel

  const items = PANEL_APPS.filter((a) => {
    const q = fold(query.trim())
    return !q || fold(p.appNames[a.id]).includes(q) || fold(p.appHints[a.id]).includes(q)
  })
  const current = Math.min(active, items.length - 1)

  const launch = (id) => {
    pop.close(false)
    setQuery('')
    onLaunch(id)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const step = e.key === 'ArrowDown' ? 1 : -1
      setActive((current + step + items.length) % Math.max(items.length, 1))
    } else if (e.key === 'Enter' && items[current]) {
      e.preventDefault()
      launch(items[current].id)
    } else if (e.key === 'Tab') {
      pop.close(false)
    }
  }

  return (
    <>
      <button
        ref={pop.button}
        type="button"
        className="panel-btn panel-apps"
        aria-expanded={pop.open}
        aria-haspopup="dialog"
        onClick={() => { pop.setOpen(!pop.open); setActive(0) }}
      >
        <FiGrid size={14} aria-hidden="true" />
        {p.apps}
      </button>
      {pop.open && (
        <Popover anchor={pop.button.current} label={p.apps} onClose={pop.close} className="apps-pop">
          <input
            className="apps-search"
            type="search"
            role="combobox"
            aria-label={p.search}
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={items[current] ? `${listId}-${items[current].id}` : undefined}
            aria-autocomplete="list"
            placeholder={p.search}
            value={query}
            autoFocus
            onChange={(e) => { setQuery(e.target.value); setActive(0) }}
            onKeyDown={onKeyDown}
          />
          <ul className="apps-list" role="listbox" id={listId} aria-label={p.apps}>
            {items.map(({ id, Icon }, i) => (
              <li
                key={id}
                id={`${listId}-${id}`}
                role="option"
                aria-selected={i === current}
                className="apps-item"
                onPointerMove={() => setActive(i)}
                onClick={() => launch(id)}
              >
                <span className="apps-icon"><Icon size={18} aria-hidden="true" /></span>
                <span className="apps-text">
                  <span className="apps-name">{p.appNames[id]}</span>
                  <span className="apps-hint">{p.appHints[id]}</span>
                </span>
              </li>
            ))}
          </ul>
          {!items.length && <p className="apps-empty" role="status">{p.noResults}</p>}
        </Popover>
      )}
    </>
  )
}

// ---------- reloj y calendario ----------

function useNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    let interval
    // Se alinea al cambio de minuto y desde ahí avanza cada 60 s
    const timeout = setTimeout(() => {
      setNow(new Date())
      interval = setInterval(() => setNow(new Date()), 60000)
    }, 60000 - (Date.now() % 60000))
    return () => { clearTimeout(timeout); clearInterval(interval) }
  }, [])
  return now
}

function Calendar({ d, now }) {
  const [month, setMonth] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1))
  const mondayFirst = d.locale.startsWith('es')
  const title = new Intl.DateTimeFormat(d.locale, { month: 'long', year: 'numeric' }).format(month)
  const weekday = new Intl.DateTimeFormat(d.locale, { weekday: 'narrow' })
  const weekdayLong = new Intl.DateTimeFormat(d.locale, { weekday: 'long' })

  const offset = (month.getDay() + (mondayFirst ? 6 : 0)) % 7
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const cells = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]
  while (cells.length % 7) cells.push(null)
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7))
  const headers = Array.from({ length: 7 }, (_, i) => new Date(2024, 0, (mondayFirst ? 1 : 7) + i)) // 1 ene 2024 fue lunes
  const isToday = (day) => day && month.getFullYear() === now.getFullYear() && month.getMonth() === now.getMonth() && day === now.getDate()
  const shift = (n) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1))

  return (
    <div className="calendar">
      <p className="calendar-today">{new Intl.DateTimeFormat(d.locale, { dateStyle: 'full' }).format(now)}</p>
      <div className="calendar-head">
        <button type="button" className="panel-icon-btn" onClick={() => shift(-1)} aria-label={d.panel.prevMonth} autoFocus>
          <FiChevronLeft size={16} aria-hidden="true" />
        </button>
        <p className="calendar-title" aria-live="polite">{title}</p>
        <button type="button" className="panel-icon-btn" onClick={() => shift(1)} aria-label={d.panel.nextMonth}>
          <FiChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
      <table className="calendar-grid">
        <caption className="sr-only">{title}</caption>
        <thead>
          <tr>{headers.map((h) => <th key={h.getDay()} scope="col" abbr={weekdayLong.format(h)}>{weekday.format(h)}</th>)}</tr>
        </thead>
        <tbody>
          {weeks.map((week, i) => (
            <tr key={i}>
              {week.map((day, j) => (
                <td key={j} aria-current={isToday(day) ? 'date' : undefined}>{day || ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ClockButton({ d }) {
  const now = useNow()
  const pop = usePopover()
  const date = new Intl.DateTimeFormat(d.locale, { weekday: 'short', day: 'numeric', month: 'short' }).format(now).replace(/\./g, '')
  const time = new Intl.DateTimeFormat(d.locale, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(now)
  return (
    <>
      <button
        ref={pop.button}
        type="button"
        className="panel-btn clock"
        aria-expanded={pop.open}
        aria-haspopup="dialog"
        aria-label={`${d.panel.calendar}: ${date}, ${time}`}
        onClick={() => pop.setOpen(!pop.open)}
      >
        <span className="clock-date" aria-hidden="true">{date}</span>
        <time className="clock-time" dateTime={now.toISOString()} aria-hidden="true">{time}</time>
      </button>
      {pop.open && (
        <Popover anchor={pop.button.current} label={d.panel.calendar} onClose={pop.close} align="center">
          <Calendar d={d} now={now} />
        </Popover>
      )}
    </>
  )
}

// ---------- bandeja ----------

function VolumeButton({ d, player }) {
  const pop = usePopover()
  const before = useRef(0.8)
  const v = player.volume
  const Icon = v === 0 ? FiVolumeX : v < 0.34 ? FiVolume : v < 0.67 ? FiVolume1 : FiVolume2
  const toggleMute = () => {
    if (v > 0) { before.current = v; player.setVolume(0) } else player.setVolume(before.current || 0.8)
  }
  return (
    <>
      <button
        ref={pop.button}
        type="button"
        className="panel-icon-btn"
        aria-expanded={pop.open}
        aria-haspopup="dialog"
        aria-label={`${d.panel.volume}: ${Math.round(v * 100)}%`}
        onClick={() => pop.setOpen(!pop.open)}
      >
        <Icon size={15} aria-hidden="true" />
      </button>
      {pop.open && (
        <Popover anchor={pop.button.current} label={d.panel.volume} onClose={pop.close} align="right" className="volume-pop">
          <div className="volume-row">
            <button type="button" className="panel-icon-btn" onClick={toggleMute} aria-label={v === 0 ? d.panel.unmute : d.panel.mute} aria-pressed={v === 0}>
              <Icon size={16} aria-hidden="true" />
            </button>
            <input
              type="range"
              className="range"
              min="0"
              max="1"
              step="0.05"
              value={v}
              autoFocus
              aria-label={d.panel.volume}
              aria-valuetext={`${Math.round(v * 100)}%`}
              onChange={(e) => player.setVolume(Number(e.target.value))}
              style={{ '--fill': `${v * 100}%` }}
            />
            <span className="volume-value" aria-hidden="true">{Math.round(v * 100)}</span>
          </div>
          {player.track
            ? <p className="volume-track">{player.track.title} — {player.track.artist}</p>
            : <p className="volume-track">{d.player.empty}</p>}
        </Popover>
      )}
    </>
  )
}

function UserButton({ d, onAction }) {
  const button = useRef(null)
  const [menu, setMenu] = useState(null)
  const open = () => {
    const rect = button.current.getBoundingClientRect()
    setMenu({ x: rect.right - 200, y: rect.bottom + 6 })
  }
  return (
    <>
      <button
        ref={button}
        type="button"
        className="panel-btn panel-user"
        aria-haspopup="menu"
        aria-expanded={!!menu}
        aria-label={d.panel.user}
        onClick={() => (menu ? setMenu(null) : open())}
        onKeyDown={(e) => { if (e.key === 'ArrowDown') { e.preventDefault(); open() } }}
      >
        <img src={`${base}profile.webp`} alt="" width="20" height="20" />
        <span>daniel</span>
        <FiChevronDown size={13} aria-hidden="true" />
      </button>
      {menu && (
        <Menu
          x={menu.x}
          y={menu.y}
          label={d.panel.user}
          returnFocus={button.current}
          onClose={() => setMenu(null)}
          items={[
            { label: d.panel.contact, onSelect: () => onAction('contact') },
            { label: d.panel.downloadCv, onSelect: () => onAction('cv') },
            { separator: true },
            { label: d.simpleView, onSelect: () => onAction('simple') },
          ]}
        />
      )}
    </>
  )
}

export default function Panel({ t, d, lang, setLang, theme, setTheme, player, onLaunch, onUserAction }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <AppsMenu d={d} onLaunch={onLaunch} />
      </div>
      <div className="topbar-center">
        <ClockButton d={d} />
      </div>
      <div className="topbar-right" role="group" aria-label={d.panel.tray}>
        {player.playing && player.track && (
          <button type="button" className="now-playing" onClick={() => onLaunch('music')}>
            <FiMusic size={13} aria-hidden="true" />
            <span className="sr-only">{d.nowPlaying}: </span>
            {player.track.title} — {player.track.artist}
          </button>
        )}
        <VolumeButton d={d} player={player} />
        <button
          type="button"
          className="panel-icon-btn"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label={theme === 'dark' ? t.nav.toLight : t.nav.toDark}
          title={theme === 'dark' ? t.nav.toLight : t.nav.toDark}
        >
          {theme === 'dark' ? <FiSun size={15} aria-hidden="true" /> : <FiMoon size={15} aria-hidden="true" />}
        </button>
        <div className="lang-switch" role="group" aria-label={t.nav.language}>
          {['es', 'en'].map((code) => (
            <button key={code} type="button" aria-pressed={lang === code} onClick={() => setLang(code)}>
              {code.toUpperCase()}
            </button>
          ))}
        </div>
        <span className="bar-sep" aria-hidden="true" />
        <UserButton d={d} onAction={onUserAction} />
      </div>
    </header>
  )
}
