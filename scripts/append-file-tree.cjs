// scripts/append-file-tree.js
const fs = require('fs')
const path = require('path')
const { execSync, execFileSync } = require('child_process')
const semver = require('semver') // install this: npm install semver

// ----------------------- helpers -----------------------
function getAllTagsSortedByVersionDesc() {
  try {
    const raw = execSync('git tag', { encoding: 'utf8' }).trim()
    if (!raw) return []
    const tags = raw.split('\n').filter((t) => {
      const v = t.replace(/^v/, '')
      return semver.valid(v)
    })
    // sort descending by semver
    tags.sort((a, b) =>
      semver.rcompare(a.replace(/^v/, ''), b.replace(/^v/, ''))
    )
    return tags
  } catch {
    return []
  }
}

function getChangedFilesTree(fromTag, toTag) {
  let changedFiles = []
  try {
    if (fromTag) {
      const diff = execFileSync('git', ['diff', '--name-status', fromTag, toTag], {
        encoding: 'utf8',
      })
      changedFiles = diff
        .split('\n')
        .filter((line) => line.trim())
        .map((line) => {
          const [status, ...rest] = line.split('\t')
          return { status, file: rest.join('\t') }
        })
    } else {
      const all = execFileSync('git', ['ls-tree', '-r', toTag, '--name-only'], {
        encoding: 'utf8',
      })
        .split('\n')
        .filter(Boolean)
        .map((f) => ({ status: 'A', file: f }))
      changedFiles = all
    }
  } catch (e) {
    console.error(
      `Error getting changed files between ${fromTag} and ${toTag}:`,
      e.message
    )
    return ''
  }

  function buildTree(fileList) {
    const root = {}
    for (const entry of fileList) {
      const parts = entry.file.split('/')
      let current = root
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        if (i === parts.length - 1) {
          if (!current[part])
            current[part] = { type: 'file', status: entry.status }
        } else {
          if (!current[part])
            current[part] = { type: 'directory', children: {} }
          else if (current[part].type !== 'directory')
            current[part] = { type: 'directory', children: {} }
          current = current[part].children
        }
      }
    }
    return root
  }

  function renderTree(node, indent = '') {
    let out = ''
    const entries = Object.entries(node).sort((a, b) => {
      const aDir = a[1].type === 'directory'
      const bDir = b[1].type === 'directory'
      if (aDir && !bDir) return -1
      if (!aDir && bDir) return 1
      return a[0].localeCompare(b[0])
    })
    for (const [name, info] of entries) {
      if (info.type === 'directory') {
        out += `${indent}- 📁 **${name}/**\n`
        out += renderTree(info.children, indent + '  ')
      } else {
        let icon = '• '
        if (info.status === 'A') icon = '➕ '
        else if (info.status === 'M') icon = '✏️ '
        else if (info.status === 'D') icon = '❌ '
        out += `${indent}- ${icon}${name}\n`
      }
    }
    return out
  }

  if (changedFiles.length === 0) return ''
  const tree = buildTree(changedFiles)
  return renderTree(tree)
}

function extractManualEntries(changelogContent) {
  const manual = {}
  const regex =
    /^## \[(\d+\.\d+\.\d+)\](?: - \d{4}-\d{2}-\d{2})?\n+((?:### (?:Added|Changed|Fixed|Removed|Security|Deprecated)\n(?:- .+\n?)+)+)/gm
  let match
  while ((match = regex.exec(changelogContent)) !== null) {
    const version = match[1]
    // don't overwrite an already captured version (first occurrence wins – that's the manual one)
    if (!manual[version]) {
      manual[version] = match[0]
        .replace(/^## \[[\d.]+\](?: - \d{4}-\d{2}-\d{2})?\n+/, '')
        .trim()
    }
  }
  return manual
}

function generateAutoSection(tag, previousTag) {
  let gitLog = ''
  try {
    const range = previousTag ? `${previousTag}..${tag}` : tag
    gitLog = execFileSync('git', ['log', '--pretty=format:%s', range], {
      encoding: 'utf8',
    }).trim()
  } catch {
    return ''
  }
  const lines = gitLog.split('\n').filter(Boolean)
  const cat = { Added: [], Fixed: [], Changed: [] }
  for (const line of lines) {
    if (line.match(/^feat(\(.+?\))?:/)) {
      cat.Added.push(`- ${line.replace(/^feat(\(.+?\))?:\s*/, '')}`)
    } else if (line.match(/^fix(\(.+?\))?:/)) {
      cat.Fixed.push(`- ${line.replace(/^fix(\(.+?\))?:\s*/, '')}`)
    } else if (line.match(/^(perf|refactor)(\(.+?\))?:/)) {
      cat.Changed.push(
        `- ${line.replace(/^(perf|refactor)(\(.+?\))?:\s*/, '')}`
      )
    }
  }
  let output = ''
  for (const [sec, entries] of Object.entries(cat)) {
    if (entries.length > 0) {
      output += `### ${sec}\n\n${entries.join('\n')}\n\n`
    }
  }
  return output
}

// ----------------------- main -----------------------
const tagArg = process.argv[2]
if (!tagArg) {
  console.error('Usage: node scripts/append-file-tree.cjs <tag>')
  process.exit(1)
}
const newTag = tagArg // e.g. v1.1.0

// 1. get all existing tags sorted by semver (newest first)
const allTags = getAllTagsSortedByVersionDesc()
console.log('Tags (semver desc):', allTags)

// 2. read current CHANGELOG.md (it may contain manual entries we want to keep)
const changelogPath = path.join(process.cwd(), 'CHANGELOG.md')
let existingContent = ''
if (fs.existsSync(changelogPath)) {
  existingContent = fs.readFileSync(changelogPath, 'utf8')
}

// 3. extract manual entries (the beautifully formatted ones)
const manualEntries = extractManualEntries(existingContent)
console.log('Manual entries found for versions:', Object.keys(manualEntries))

// 4. build new changelog from scratch
let newChangelog = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

`

for (let i = 0; i < allTags.length; i++) {
  const tag = allTags[i]
  const version = tag.replace(/^v/, '')
  const previousTag = i < allTags.length - 1 ? allTags[i + 1] : null

  // get commit date for this tag
  let date
  try {
    date = execFileSync('git', ['log', '-1', '--format=%as', tag], {
      encoding: 'utf8',
    }).trim()
  } catch {
    date = '2026-05-18' // fallback
  }

  newChangelog += `## [${version}] - ${date}\n\n`

  if (manualEntries[version]) {
    // use the beautiful manual entry exactly as is
    newChangelog += manualEntries[version] + '\n\n'
  } else {
    // generate from commit messages
    newChangelog += generateAutoSection(tag, previousTag)
  }

  // append file tree for this release
  const tree = getChangedFilesTree(previousTag, tag)
  if (tree) {
    newChangelog += `### 📂 Changed Files\n\n\`\`\`\n${tree}\`\`\`\n\n`
  }
}

// 5. overwrite the file completely
fs.writeFileSync(changelogPath, newChangelog, 'utf8')
console.log('✅ CHANGELOG.md rebuilt successfully with semver ordering.')
