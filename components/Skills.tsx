import { skills } from '@/data/content'

const MAX_LEVEL = 10

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="mb-10 text-3xl font-bold">Skills</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {skills.map((group) => (
          <div
            key={group.category}
            className="skill-card rounded-lg p-4"
          >
            <h3 className="mb-3 font-semibold text-slate-900 dark:text-slate-100">
              {group.category}
            </h3>
            <div className="space-y-3">
              {group.items.map((item) => (
                <div key={item.name}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-200">{item.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {item.level}/{MAX_LEVEL}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(item.level / MAX_LEVEL) * 100}%`,
                        backgroundImage: 'linear-gradient(90deg, #0f766e, #15803d)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
