import { FiPause, FiPlay, FiSkipBack, FiSkipForward, FiVolume1, FiMusic } from 'react-icons/fi'

function clock(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function Music({ d, player }) {
  const p = d.player
  const empty = !player.tracks.length
  const max = player.duration || 0

  return (
    <div className="pane music" role="group" aria-label={p.label}>
      <div className="music-now">
        <span className="music-disc" aria-hidden="true">
          <FiMusic size={22} />
        </span>
        <div className="music-meta">
          {empty ? (
            <>
              <p className="music-title">{p.empty}</p>
              <p className="music-artist">{p.emptyHint}</p>
            </>
          ) : (
            <>
              <p className="music-title">{player.track.title}</p>
              <p className="music-artist">{player.track.artist}</p>
            </>
          )}
        </div>
      </div>

      <div className="music-progress">
        <input
          type="range"
          className="range"
          min="0"
          max={max || 1}
          step="0.1"
          value={Math.min(player.time, max || 1)}
          onChange={(e) => player.seek(Number(e.target.value))}
          disabled={empty || !max}
          aria-label={p.progress}
          aria-valuetext={`${clock(player.time)} / ${clock(max)}`}
          style={{ '--fill': `${max ? (player.time / max) * 100 : 0}%` }}
        />
        <div className="music-times" aria-hidden="true">
          <span>{clock(player.time)}</span>
          <span>{clock(max)}</span>
        </div>
      </div>

      <div className="music-controls">
        <button type="button" className="icon-btn" onClick={player.prev} disabled={empty} aria-label={p.prev}>
          <FiSkipBack size={17} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="icon-btn music-play"
          onClick={player.toggle}
          disabled={empty}
          aria-label={player.playing ? p.pause : p.play}
        >
          {player.playing ? <FiPause size={20} aria-hidden="true" /> : <FiPlay size={20} aria-hidden="true" />}
        </button>
        <button type="button" className="icon-btn" onClick={player.next} disabled={empty} aria-label={p.next}>
          <FiSkipForward size={17} aria-hidden="true" />
        </button>
      </div>

      <label className="music-volume">
        <FiVolume1 size={16} aria-hidden="true" />
        <span className="sr-only">{p.volume}</span>
        <input
          type="range"
          className="range"
          min="0"
          max="1"
          step="0.05"
          value={player.volume}
          onChange={(e) => player.setVolume(Number(e.target.value))}
          style={{ '--fill': `${player.volume * 100}%` }}
        />
      </label>

      {player.error && <p className="music-error" role="alert">{p.error}</p>}

      {!empty && (
        <ol className="music-list" aria-label={p.playlist}>
          {player.tracks.map((track, i) => (
            <li key={track.src}>
              <button
                type="button"
                className="music-track"
                aria-current={i === player.index ? 'true' : undefined}
                onClick={() => player.select(i)}
              >
                <span className="music-track-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="music-track-title">{track.title}</span>
                <span className="music-track-artist">{track.artist}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
