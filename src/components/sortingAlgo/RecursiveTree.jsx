import { useState, useMemo } from 'react'

const NODE_WIDTH = 100
const NODE_HEIGHT = 28
const GAP_Y = 25
const GAP_X = 10

export default function RecursiveTree({ tree = [], activeNode }) {
  const [collapsed, setCollapsed] = useState(new Set())

  const nodesById = useMemo(() => {
    const map = new Map()
    tree.forEach((node) => map.set(node.id, { ...node, children: [] }))
    map.forEach((node) => {
      if (node.parentId !== null && map.has(node.parentId)) {
        map.get(node.parentId).children.push(node)
      }
    })
    return map
  }, [tree])

  const roots = useMemo(
    () => [...nodesById.values()].filter((n) => n.parentId === null),
    [nodesById]
  )

  const toggleCollapse = (id) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const collapseAll = () => {
    setCollapsed(
      new Set(
        [...nodesById.values()]
          .filter((n) => n.children.length > 0)
          .map((n) => n.id)
      )
    )
  }

  // ── Layout engine ──────────────────────────────────────────────
  // Returns { nodes: [{id, x, y, node}], edges: [{x1,y1,x2,y2}], width, height }
  const layout = useMemo(() => {
    const placed = [] // { id, x, y, node }
    const edges = [] // { x1, y1, x2, y2 }

    // measureHeight: total pixel height a subtree occupies
    const measureWidth = (node) => {
      if (collapsed.has(node.id) || node.children.length === 0)
        return NODE_WIDTH
      const childrenW =
        node.children.reduce((sum, c) => sum + measureWidth(c), 0) +
        (node.children.length - 1) * GAP_X
      return Math.max(NODE_WIDTH, childrenW)
    }

    // place: recursively place node at (x, centerY)
    const place = (node, centerX, y) => {
      placed.push({ id: node.id, x: centerX - NODE_WIDTH / 2, y, node })
      if (collapsed.has(node.id) || node.children.length === 0) return

      const childY = y + NODE_HEIGHT + GAP_Y
      const totalW =
        node.children.reduce((sum, c) => sum + measureWidth(c), 0) +
        (node.children.length - 1) * GAP_X

      let cursor = centerX - totalW / 2
      node.children.forEach((child) => {
        const childW = measureWidth(child)
        const childCenter = cursor + childW / 2
        const midY = y + NODE_HEIGHT + GAP_Y / 2

        edges.push({ x1: centerX, y1: y + NODE_HEIGHT, x2: centerX, y2: midY })
        edges.push({ x1: centerX, y1: midY, x2: childCenter, y2: midY })
        edges.push({ x1: childCenter, y1: midY, x2: childCenter, y2: childY })

        place(child, childCenter, childY)
        cursor += childW + GAP_X
      })
    }

    // place each root stacked vertically
    let rootCursor = 0
    roots.forEach((root) => {
      const w = measureWidth(root)
      place(root, rootCursor + w / 2, 0)
      rootCursor += w + GAP_X * 2
    })

    const maxX = placed.reduce((m, n) => Math.max(m, n.x + NODE_WIDTH), 0)
    const maxY = placed.reduce((m, n) => Math.max(m, n.y + NODE_HEIGHT), 0)
    return { nodes: placed, edges, width: maxX, height: maxY }
  }, [roots, collapsed])

  const getColors = (node) => {
    if (node.id === activeNode)
      return { bg: 'rgba(59,130,246,0.25)', border: '#3b82f6', text: '#93c5fd' }
    if (node.status === 'completed')
      return { bg: 'rgba(139,92,246,0.18)', border: '#7c3aed', text: '#c4b5fd' }
    return { bg: 'rgba(30,37,51,0.6)', border: '#374151', text: '#6b7280' }
  }

  const PAD = 16

  return (
    <div
      style={{
        border: '1px solid rgba(75,85,99,0.4)',
        borderRadius: 12,
        background: 'rgba(10,15,28,0.85)',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 200,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#9ca3af',
          }}
        >
          Recursive Call Tree
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              fontSize: 9,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#4b5563',
            }}
          >
            Merge Sort
          </span>
          <button
            onClick={collapseAll}
            style={{
              fontSize: 9,
              padding: '2px 8px',
              border: '1px solid rgba(107,114,128,0.4)',
              borderRadius: 4,
              color: '#6b7280',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ overflowX: 'auto', overflowY: 'auto', flex: 1 }}>
        <div
          style={{
            position: 'relative',
            width: layout.width + PAD,
            height: layout.height + PAD,
          }}
        >
          {/* SVG edges */}
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              overflow: 'visible',
              pointerEvents: 'none',
            }}
            width={layout.width + PAD}
            height={layout.height + PAD}
          >
            {layout.edges.map((e, i) => (
              <line
                key={i}
                x1={e.x1}
                y1={e.y1}
                x2={e.x2}
                y2={e.y2}
                stroke="rgba(107,114,128,0.45)"
                strokeWidth={1}
              />
            ))}
          </svg>

          {/* Nodes */}
          {layout.nodes.map(({ id, x, y, node }) => {
            const colors = getColors(node)
            const hasChildren = node.children.length > 0
            return (
              <div
                key={id}
                onClick={() => hasChildren && toggleCollapse(id)}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  width: NODE_WIDTH,
                  height: NODE_HEIGHT,
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 5,
                  color: colors.text,
                  fontFamily: 'monospace',
                  fontSize: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap',
                  cursor: hasChildren ? 'pointer' : 'default',
                  userSelect: 'none',
                }}
              >
                {node.label}
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          paddingTop: 10,
          borderTop: '1px solid rgba(75,85,99,0.25)',
          fontSize: 10,
          color: '#6b7280',
        }}
      >
        {[
          { color: '#3b82f6', label: 'Current Call' },
          { color: '#7c3aed', label: 'Completed' },
          { color: '#4b5563', label: 'Pending' },
        ].map(({ color, label }) => (
          <div
            key={label}
            style={{ display: 'flex', alignItems: 'center', gap: 5 }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: color,
              }}
            />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}
