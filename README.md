<div align="center">

<img src="public/logo.png" alt="AlgoScope Logo" width="300px">

# AlgoScope

**A modern, interactive algorithm visualizer that demystifies complex logic through real-time, high-fidelity animations.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind--CSS-4.x-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](CONTRIBUTING.md)
[![GSSoC'26](https://img.shields.io/badge/GSSoC-2026-orange?style=flat)](https://gssoc.girlscript.tech/)
[![Docker Hub](https://img.shields.io/badge/Docker-Hub-2496ED?style=flat&logo=docker&logoColor=white)](https://hub.docker.com/r/bimbok/algoscope-app)
[![Discord](https://img.shields.io/badge/Discord-7289DA?style=flat&logo=discord&logoColor=white)](https://discord.gg/xxFRGj82xS)

Join our community for updates and support!

### 🌐 Live Demo

Experience AlgoScope in your browser: **[algo-scope-virid.vercel.app](https://algo-scope-virid.vercel.app)**

### Core Maintainers

<table>
       <tr>
              <td align="center" style="padding: 6px 18px;">
                     <a href="https://github.com/adityapaul26">
                            <img src="https://github.com/adityapaul26.png?size=160" width="120" height="120" alt="adityapaul26" style="border-radius: 50%; border: 3px solid #16A34A;" />
                     </a>
                     <br />
                     <a href="https://github.com/adityapaul26"><strong>@adityapaul26</strong></a>
                     <br />
                     <a href="https://github.com/adityapaul26">
                            <img src="https://img.shields.io/badge/Follow-adityapaul26-16A34A?style=for-the-badge&logo=github" alt="Follow adityapaul26" />
                     </a>
              </td>
              <td align="center" style="padding: 6px 18px;">
                     <a href="https://github.com/Bimbok">
                            <img src="https://github.com/Bimbok.png?size=160" width="120" height="120" alt="Bimbok" style="border-radius: 50%; border: 3px solid #16A34A;" />
                     </a>
                     <br />
                     <a href="https://github.com/Bimbok"><strong>@Bimbok</strong></a>
                     <br />
                     <a href="https://github.com/Bimbok">
                            <img src="https://img.shields.io/badge/Follow-Bimbok-16A34A?style=for-the-badge&logo=github" alt="Follow Bimbok" />
                     </a>
              </td>
       </tr>
</table>

<sub>Click a profile or follow badge for updates and to connect with the team.</sub>

</div>

---

## 💡 Project Purpose

Learning Data Structures and Algorithms (DSA) is often a daunting task for students and developers. Traditional resources like static pseudocode and textbooks fail to capture the dynamic nature of algorithms.

**AlgoScope** bridges this gap by providing a hands-on environment where users can watch the flow behind every operation. By transforming abstract logic into fluid animations, AlgoScope helps users build a mental model of how algorithms actually work, making the learning process intuitive, engaging, and accessible.

---

## ✨ Features

| Feature                     | Description                                                                                                                      |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Real-time Visualization** | Watch algorithms come alive with smooth, step-by-step animations using Framer Motion and Anime.js.                               |
| **Adjustable Speed**        | Full control over animation speed and input data to learn at your own pace.                                                      |
| **Algorithm Coverage**      | Comprehensive support for Sorting (Quick, Merge, Bubble), Searching (Linear, Binary), and Graph Algorithms (BFS, DFS, Dijkstra). |
| **Code Insights**           | See the actual implementation in multiple programming languages (C++, Java, Python, JS) alongside the visualization.             |
| **Interactive Playground**  | Create custom inputs, change array sizes, and interact directly with the canvas.                                                 |
| **Clean UI/UX**             | Modern, dark-themed interface built with Tailwind CSS v4.                                                                        |

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite 7](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/), [Anime.js](https://animejs.com/)
- **Routing:** [React Router v7](https://reactrouter.com/)

### Utilities

- **Syntax Highlighting:** [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)
- **Icons:** Lucide React

---

## 🚀 Quick Start

Follow these steps to set up AlgoScope locally on a clean machine:

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Setup Steps

```bash
# 1. Clone the repository
git clone https://github.com/algoscope-hq/AlgoScope.git
cd AlgoScope

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open `http://localhost:5173/` in your browser to start exploring.

### Docker Quick Start

If you have Docker installed, you can pull and run the pre-built image:

```bash
# 1. Pull the image
docker pull bimbok/algoscope-app:latest

# 2. Run the container
docker run -d -p 8080:80 bimbok/algoscope-app:latest
```

Access the app at `http://localhost:8080`.

---

## 🏗️ Architecture

AlgoScope uses a component-based architecture where each algorithm category has its own specialized visualizer:

```text
src/
├── algorithms/
│   ├── searching/         # Search and shortest-path step generators/source data
│   └── sorting/           # Sorting algorithm step generators
├── assets/                # Static images and icons
├── components/
│   ├── about/             # About page cards and sections
│   ├── arraySearch/       # Linear and binary search visualizers
│   ├── dataStructures/    # Stack, queue, and tree visualizers
│   ├── searchAlgo/        # Graph traversal visualizers and controls
│   ├── shortestPathAlgo/  # Shortest-path visualizers and controls
│   ├── sortingAlgo/       # Sorting visualizers
│   └── visualizer/        # Shared code panel and playback helpers
├── App.jsx                # Main routing and global state management
├── App.css                # App-level styles
├── input.css              # Tailwind entry styles
└── main.jsx               # React entry point
```

### How It Works

1. **State Management:** React state tracks the current progress of the algorithm (e.g., current indices being compared).
2. **Animation Engine:** Framer Motion and Anime.js handle the transitions based on state changes.
3. **Pseudo-code Sync:** The `CodeDisplay` component highlights lines of code in real-time as the algorithm executes.

### System Data Flow

```mermaid
flowchart TD
    user[User]
    subgraph UI
        input_handler((1.0 Manage User Interactions))
        vis_renderer((4.0 Visualize State Changes))
    end
    subgraph Logic
        algorithm_engine((2.0 Execute Algorithms))
        state_manager((3.0 Manage System State))
    end

    %% Data Flows
    user -- Select Algorithm, Speed, Parameters --> input_handler
    input_handler -- Start/Stop/Control Commands --> algorithm_engine
    input_handler -- Initialize/Reset State --> state_manager

    algorithm_engine -- Read Current State --> state_manager
    algorithm_engine -- Step-by-Step Updates (Array/Graph) --> state_manager

    state_manager -- Current State Data --> vis_renderer

    vis_renderer -- Animated Visual Output & Feedback --> user
    vis_renderer -- Visualization Completed/Status --> input_handler
```

### User Workflow & Execution Logic

```mermaid
flowchart TD
    %% Node Definitions
    Start((Start))
    End((End))

    %% User Actions
    NavCategory["Navigate to Algorithm Category<br>(e.g., Sorting, Graph)"]
    SelectAlgo["Select Specific Algorithm<br>(e.g., Dijkstra, Quick Sort)"]
    SetConfig{"Configure Data & Parameters"}
    SetNodes["Select Source & Target Nodes"]
    SetArray["Generate or Input Array Elements"]
    SetSpeed["Adjust Visualization Speed Slider"]
    ClickStart(["Click 'Start' Button"])

    %% System Validation & Setup
    ValidateInput{"Are Inputs Valid?<br>(e.g., Nodes selected?)"}
    ShowError["Display Warning / Prompt User"]
    InitState["Initialize Algorithm State<br>(Clear highlights, reset vars)"]

    %% Execution Loop
    CheckDone{"Is Algorithm<br>Complete?"}
    ExecStep["Compute Next Algorithmic Step<br>(e.g., Compare, Swap, Traverse)"]
    UpdateState["Update Internal Data State"]
    RenderVis["Render Visual Updates via D3/React<br>(Highlight active elements)"]

    %% Playback Control
    CheckPause{"Is Execution<br>Paused?"}
    WaitResume["Wait for User to click Resume"]
    ApplyDelay["Apply Delay based on Speed Slider"]

    %% Completion
    ShowFinal["Render Final State<br>(Highlight Shortest Path / Sorted Array)"]
    ShowStats["Update Status Display<br>(Time taken, Steps completed)"]

    %% Flow logic
    Start --> NavCategory
    NavCategory --> SelectAlgo
    SelectAlgo --> SetConfig

    SetConfig -->|Graph Algorithms| SetNodes
    SetConfig -->|Array Algorithms| SetArray

    SetNodes --> SetSpeed
    SetArray --> SetSpeed
    SetSpeed --> ClickStart

    ClickStart --> ValidateInput
    ValidateInput -->|No| ShowError
    ShowError --> SetConfig

    ValidateInput -->|Yes| InitState
    InitState --> CheckDone

    %% The main visualization loop
    CheckDone -->|No| ExecStep
    ExecStep --> UpdateState
    UpdateState --> RenderVis
    RenderVis --> CheckPause

    CheckPause -->|Yes| WaitResume
    WaitResume --> CheckPause

    CheckPause -->|No| ApplyDelay
    ApplyDelay --> CheckDone

    %% Algorithm Finished
    CheckDone -->|Yes| ShowFinal
    ShowFinal --> ShowStats
    ShowStats --> End

    %% Styling for clarity
    classDef userAction fill:#2d3748,stroke:#4fd1c5,stroke-width:2px,color:#fff;
    classDef systemAction fill:#1a202c,stroke:#63b3ed,stroke-width:2px,color:#fff;
    classDef decision fill:#2b6cb0,stroke:#90cdf4,stroke-width:2px,color:#fff;

    class NavCategory,SelectAlgo,SetNodes,SetArray,SetSpeed,ClickStart,WaitResume userAction;
    class InitState,ExecStep,UpdateState,RenderVis,ApplyDelay,ShowFinal,ShowStats,ShowError systemAction;
    class SetConfig,ValidateInput,CheckDone,CheckPause decision;
```

---

## 🤝 Contributing

We welcome contributions! Whether it's a bug fix, a new algorithm visualization, or a UI improvement, your help is appreciated.

1. **Fork the repo** and create your branch from `main`.
2. **Setup locally** following the [Quick Start](#-quick-start) guide.
3. **Commit your changes** with descriptive messages.
4. **Open a Pull Request** and describe your changes in detail.

## _For more detailed guidelines, please refer to our [Contribution Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md)._

---

## ✨ Contributors

Thanks goes to these wonderful people who have contributed to AlgoScope:

<a href="https://github.com/algoscope-hq/AlgoScope/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=algoscope-hq/AlgoScope" alt="AlgoScope Contributors" />
</a>

---

## 📞 Contact

If you have any questions or want to discuss a contribution, feel free to reach out:

- **Discord:** [Join our community](https://discord.gg/xxFRGj82xS) (Real-time discussion & support)
- **Primary Channel:** [GitHub Issues](https://github.com/algoscope-hq/AlgoScope/issues) (Best for bug reports and feature requests)
- **Aditya Paul:** [LinkedIn](https://linkedin.com/in/aditya-paul-b8881a31b/)
- **Bratik Mukherjee:** [LinkedIn](https://linkedin.com/in/bratik-mukherjee)

---

## 📄 License

Released under the [MIT License](LICENSE).

<p align="center">Made with ❤️ for the DSA community.</p>
