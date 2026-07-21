const TABS = [
  { id: 'tasks', label: 'Задачи', icon: 'bi-check2-square' },
  { id: 'events', label: 'События', icon: 'bi-calendar-heart' },
  { id: 'pomodoro', label: 'Помодоро', icon: 'bi-clock-history' },
  { id: 'tabata', label: 'Табата', icon: 'bi-stopwatch' },
  { id: 'cat', label: 'Котик', icon: 'bi-heart' },
]

export default function BottomTabBar({ activeTab, onSelectTab }) {
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
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
