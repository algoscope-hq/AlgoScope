import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_NAME = 'AlgoScope'
const SITE_URL = 'https://algo-scope-virid.vercel.app'
const DEFAULT_IMAGE = `${SITE_URL}/preview.png`
const DEFAULT_TITLE = 'AlgoScope | Interactive Algorithm Visualizer'
const DEFAULT_DESCRIPTION =
  'Visualize algorithms in real-time with interactive animations, synchronized code highlighting, and educational tools.'

const pageMetadata = {
  '/': {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  '/sort': {
    title: 'Sorting Visualizer | AlgoScope',
    description:
      'Explore sorting algorithms with interactive animations, step playback, and synchronized code views for bubble, merge, quick, heap, and more.',
  },
  '/search': {
    title: 'Graph Search Visualizer | AlgoScope',
    description:
      'Learn BFS, DFS, and graph traversal visually with animated node exploration and synchronized algorithm steps.',
  },
  '/spath': {
    title: 'Shortest Path Visualizer | AlgoScope',
    description:
      'Visualize shortest path algorithms with interactive graph animations and step-by-step execution for route discovery concepts.',
  },
  '/ldssearch': {
    title: 'Array Search Visualizer | AlgoScope',
    description:
      'Compare linear search and binary search with real-time animations, index tracking, and code-linked algorithm steps.',
  },
  '/adt': {
    title: 'Data Structures Explorer | AlgoScope',
    description:
      'Understand abstract data types visually with interactive views for stacks, queues, trees, and linked structure concepts.',
  },
  '/practice': {
    title: 'Algorithm Practice Sandbox | AlgoScope',
    description:
      'Practice algorithms directly in the browser with a multi-language code editor and instant feedback inside AlgoScope.',
  },
  '/kadane': {
    title: 'Kadane Algorithm | AlgoScope',
    description:
      'Visualize Kadane’s algorithm step by step to understand maximum subarray sums with interactive animations and synchronized code.',
  },
  '/about': {
    title: 'About AlgoScope',
    description:
      'Learn about AlgoScope, its mission, and the interactive features built to make algorithms easier to understand.',
  },
}

function setMeta(selector, attribute, value) {
  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, selector.match(/"([^"]+)"/)?.[1] ?? '')
    document.head.appendChild(element)
  }

  element.setAttribute('content', value)
}

function setLink(selector, rel, href) {
  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }

  element.setAttribute('href', href)
}

export default function SeoHead() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    const searchParams = new URLSearchParams(search)
    const algo = searchParams.get('algo')
    const type = searchParams.get('type')

    const baseMetadata = pageMetadata[pathname] ?? {
      title: 'Page Not Found | AlgoScope',
      description:
        'The requested AlgoScope page could not be found. Explore algorithm visualizations, code walkthroughs, and learning tools from the homepage.',
      noIndex: true,
    }

    let { title, description } = baseMetadata

    // Algorithm-specific logic
    if (algo) {
      const formattedAlgo = algo
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      if (pathname === '/sort') {
        title = `${formattedAlgo} Sort Visualizer | AlgoScope`
        description = `Interactive ${formattedAlgo} sort visualization. Watch how ${formattedAlgo} sort organizes data step-by-step with real-time animations and synchronized code.`
      } else if (pathname === '/search') {
        title = `${formattedAlgo} Graph Search | AlgoScope`
        description = `Visualize ${formattedAlgo} graph search algorithm. Explore nodes and edges in real-time to understand how ${formattedAlgo} traverses complex graph structures.`
      } else if (pathname === '/spath') {
        title = `${formattedAlgo} Shortest Path | AlgoScope`
        description = `Discover paths using ${formattedAlgo} shortest path algorithm. Interactive visualization showing how ${formattedAlgo} finds the most efficient route through a graph.`
      } else if (pathname === '/ldssearch') {
        title = `${formattedAlgo} Search Visualizer | AlgoScope`
        description = `Watch ${formattedAlgo} search in action. A step-by-step interactive visualization of ${formattedAlgo} search on arrays with index tracking and performance metrics.`
      }
    } else if (type && pathname === '/adt') {
      const formattedType = type.charAt(0).toUpperCase() + type.slice(1)
      title = `${formattedType} Visualization | AlgoScope`
      description = `Deep dive into the ${formattedType} data structure. Interactive visualization of ${formattedType} operations, storage patterns, and behavior.`
    }

    const canonicalUrl = `${SITE_URL}${pathname === '/' ? '/' : pathname}${search}`
    const robotsContent = baseMetadata.noIndex
      ? 'noindex, nofollow'
      : 'index, follow'

    document.title = title
    setLink('link[rel="canonical"]', 'canonical', canonicalUrl)
    setMeta('meta[name="description"]', 'name', description)
    setMeta('meta[name="robots"]', 'name', robotsContent)
    setMeta('meta[property="og:title"]', 'property', title)
    setMeta('meta[property="og:description"]', 'property', description)
    setMeta('meta[property="og:url"]', 'property', canonicalUrl)
    setMeta('meta[property="og:image"]', 'property', DEFAULT_IMAGE)
    setMeta(
      'meta[property="og:image:alt"]',
      'property',
      'AlgoScope interface preview showing algorithm visualizations'
    )

    // Twitter-specific tags (use 'name' attribute)
    setMeta('meta[name="twitter:card"]', 'name', 'summary_large_image')
    setMeta('meta[name="twitter:title"]', 'name', title)
    setMeta('meta[name="twitter:description"]', 'name', description)
    setMeta('meta[name="twitter:image"]', 'name', DEFAULT_IMAGE)
    setMeta(
      'meta[name="twitter:image:alt"]',
      'name',
      'AlgoScope interface preview showing algorithm visualizations'
    )

    const structuredDataScript = document.getElementById(
      'algoscope-structured-data'
    )

    if (structuredDataScript) {
      structuredDataScript.textContent = JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebSite',
              name: SITE_NAME,
              url: SITE_URL,
              description: DEFAULT_DESCRIPTION,
            },
            {
              '@type': 'SoftwareApplication',
              name: SITE_NAME,
              applicationCategory: 'EducationalApplication',
              operatingSystem: 'Web',
              url: canonicalUrl,
              image: DEFAULT_IMAGE,
              description: description,
            },
          ],
        },
        null,
        2
      )
    }
  }, [pathname, search])

  return null
}
