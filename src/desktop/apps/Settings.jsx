import { WALLPAPERS } from '../wallpapers'

function Choice({ name, value, current, onChange, children }) {
  return (
    <label className="choice">
      <input type="radio" name={name} value={value} checked={current === value} onChange={() => onChange(value)} />
      {children}
    </label>
  )
}

export default function Settings({ d, t, wallpaper, setWallpaper, theme, setTheme, lang, setLang, onReset }) {
  const s = d.settings
  return (
    <div className="pane settings">
      <fieldset className="settings-group">
        <legend>{s.wallpaper}</legend>
        <div className="wallpaper-grid">
          {WALLPAPERS.map((w) => (
            <Choice key={w} name="wallpaper" value={w} current={wallpaper} onChange={setWallpaper}>
              <span className="wallpaper-swatch" data-wallpaper={w} aria-hidden="true" />
              <span>{s.wallpapers[w]}</span>
            </Choice>
          ))}
        </div>
      </fieldset>

      <fieldset className="settings-group">
        <legend>{s.theme}</legend>
        <div className="choice-row">
          <Choice name="theme" value="light" current={theme} onChange={setTheme}><span>{s.light}</span></Choice>
          <Choice name="theme" value="dark" current={theme} onChange={setTheme}><span>{s.dark}</span></Choice>
        </div>
      </fieldset>

      <fieldset className="settings-group">
        <legend>{t.nav.language}</legend>
        <div className="choice-row">
          <Choice name="lang" value="es" current={lang} onChange={setLang}><span lang="es">Español</span></Choice>
          <Choice name="lang" value="en" current={lang} onChange={setLang}><span lang="en">English</span></Choice>
        </div>
      </fieldset>

      <div className="settings-group">
        <h3 className="settings-heading">{s.reset}</h3>
        <p className="settings-hint">{s.resetHint}</p>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onReset}>{d.menu.reset}</button>
      </div>
    </div>
  )
}
