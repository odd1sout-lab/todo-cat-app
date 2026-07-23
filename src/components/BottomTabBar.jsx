const TABS = [
  { id: 'tasks', key: 'tabTasks', icon: 'bi-check2-square' },
  { id: 'events', key: 'tabEvents', icon: 'bi-calendar-heart' },
  { id: 'pomodoro', key: 'tabPomodoro', icon: 'bi-clock-history' },
  { id: 'tabata', key: 'tabTabata', icon: 'bi-stopwatch' },
  { id: 'cat', key: 'tabCat', icon: 'bi-heart' },
]

export default function BottomTabBar({ activeTab, onSelectTab, t }) {
  return (
    <nav className="bottom-tab-bar">
      {TABS.map(tab => (
        <button
          key={tab.id}
          type="button"
          className={`bottom-tab-btn ${activeTab === tab.id ? 'bottom-tab-active' : ''}`}
          onClick={() => onSelectTab(tab.id)}
        >
          <i className={`bi ${tab.icon}`} />
          <span>{t(tab.key)}</span>
        </button>
      ))}
    </nav>
  )
}
