export default function GreedyInformationPanel({ algorithm }) {
  return (
    <section
      aria-labelledby="greedy-information-title"
      className="theme-card rounded-2xl border p-5 sm:p-6"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
        Information panel
      </p>
      <h2 id="greedy-information-title" className="mt-2 text-xl font-bold theme-text-strong">
        {algorithm.name} guide
      </h2>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <TextSection title="Introduction" text={algorithm.introduction} />
        <TextSection title="Problem statement" text={algorithm.problemStatement} />
        <TextSection title="Greedy strategy" text={algorithm.greedyStrategy} />
        <TextSection title="Algorithm explanation" text={algorithm.explanation} />
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <ListSection title="Advantages" items={algorithm.advantages} />
        <ListSection title="Limitations" items={algorithm.limitations} />
        <ListSection title="Applications" items={algorithm.applications} />
        <ListSection title="Edge cases" items={algorithm.edgeCases} />
      </div>

      <ListSection
        className="mt-5"
        title="Interview questions"
        items={algorithm.interviewQuestions}
        numbered
      />
    </section>
  )
}

function TextSection({ title, text }) {
  return (
    <article className="rounded-xl border p-4 theme-border">
      <h3 className="text-sm font-bold theme-text-strong">{title}</h3>
      <p className="mt-2 text-sm leading-6 theme-text-muted">{text}</p>
    </article>
  )
}

function ListSection({ title, items, numbered = false, className = '' }) {
  const List = numbered ? 'ol' : 'ul'

  return (
    <article className={`rounded-xl border p-4 theme-border ${className}`}>
      <h3 className="text-sm font-bold theme-text-strong">{title}</h3>
      <List
        className={`mt-3 space-y-2 text-sm leading-6 theme-text-muted ${
          numbered ? 'list-decimal pl-5' : 'list-disc pl-5'
        }`}
      >
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </List>
    </article>
  )
}
