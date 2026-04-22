<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:0f0c29,50:302b63,100:24243e&height=200&section=header&text=HR%20Workflow%20Designer&fontSize=52&fontColor=ffffff&fontAlignY=38&desc=Build%20%E2%80%A2%20Validate%20%E2%80%A2%20Simulate%20Workflows&descAlignY=58&descSize=18&animation=fadeIn"/>

<br/>

<p>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/ReactFlow-Graph_Engine-FF6B35?style=for-the-badge&logoColor=white"/>
  <img src="https://img.shields.io/badge/Status-Production_Ready-00D68F?style=for-the-badge&logoColor=white"/>
</p>

<br/>

```
╔══════════════════════════════════════════════════════════════╗
║   ⚡  A Logic-Driven Workflow Engine with Simulation Powers  ║
╚══════════════════════════════════════════════════════════════╝
```

</div>

---

<div align="center">

## ✦ What is this?

</div>

A **visual workflow builder** where you can:

| 🧩 | Drag & drop nodes |
|----|---|
| 🔀 | Create branching logic (Approved / Rejected) |
| 🧠 | Validate workflows (no broken logic) |
| ⚙️ | Simulate execution like a real system |

> **Basically →** you built a **mini workflow engine** — not just a UI 👀

---

<div align="center">

## ✦ Features

</div>

<table>
<tr>
<td width="50%">

### 🧱 Workflow Builder
- Drag & Drop nodes (Start, Task, Approval, Automated, End)
- Connect nodes visually using edges
- Fully interactive canvas (React Flow)

### 🔀 Smart Branching
- Approval nodes support:
  - ✅ Approved path
  - ❌ Rejected path
- Only one path executes during simulation (realistic behavior)

</td>
<td width="50%">

### ✅ Validation Engine
- Start & End node checks
- Disconnected nodes detection
- Cycle detection (DFS based)
- Branch validation (approved + rejected required)

### ⚙️ Simulation Engine
- Executes workflow step-by-step
- Random decision making at approval nodes
- Timestamp-based execution log
- Real-time sandbox output

</td>
</tr>
</table>

### 📊 Sandbox Panel
- Workflow JSON preview · Execution logs · Validation results · Expand / collapse UI

---

<div align="center">

## ✦ Workflow Execution Logic

</div>

```
                        ┌─────────────┐
                        │    START    │
                        └──────┬──────┘
                               │
                        ┌──────▼──────┐
                        │    TASK     │
                        └──────┬──────┘
                               │
                        ┌──────▼──────┐
                        │  APPROVAL   │
                        └──────┬──────┘
                    ┌──────────┴──────────┐
                    │                     │
             ┌──────▼──────┐       ┌──────▼──────┐
             │  ✅ Approved │       │ ❌ Rejected  │
             └──────┬──────┘       └──────┬──────┘
                    │                     │
             ┌──────▼──────┐       ┌──────▼──────┐
             │  AUTOMATED  │       │ REWORK TASK  │
             └──────┬──────┘       └──────┬──────┘
                    │                     │
                    └──────────┬──────────┘
                        ┌──────▼──────┐
                        │     END     │
                        └─────────────┘
```

---

<div align="center">

## ✦ Architecture

</div>

```
  ╭──────────────────────────────────────────────╮
  │         Frontend (React + TypeScript)        │
  ├──────────────┬──────────────┬────────────────┤
  │   Canvas     │   Panels     │  Core Logic    │
  │  React Flow  │  Node Editor │  Validation    │
  │  ├─ Nodes    │  Sandbox     │  Simulation    │
  │  └─ Edges    │  └─ Logs     │  Serialization │
  ├──────────────┴──────────────┴────────────────┤
  │              Mock API Layer                  │
  │         Automations + Execution              │
  ╰──────────────────────────────────────────────╯

   ─────────────────────────────────────────────
  │            State Management Layer           │
  │  Centralized state using React Hooks        │
  │  for nodes & edges with real-time sync      │
  ╰─────────────────────────────────────────────╯
```


---

<div align="center">

## ✦ Folder Structure

</div>

```bash
src/
│
├── 📁 components/
│   ├── canvas/         # React Flow canvas
│   ├── nodes/          # Node type definitions
│   ├── panels/         # Editor & sandbox panels
│   └── layout/         # Page structure
│
├── 📁 data/
│   └── sampleWorkflow.ts
│
├── 📁 lib/
│   ├── validation.ts   # Validation engine
│   ├── mockApi.ts      # Mock API layer
│   └── serialization.ts
│
├── 📁 types/
│   └── workflow.ts     # TypeScript interfaces
│
└── App.tsx
```

---

<div align="center">

## ✦ Tech Stack

</div>

<div align="center">

| Technology | Role |
|:---:|:---:|
| ⚛️ **React** (with Hooks) | UI Framework |
| 🟦 **TypeScript** (strict) | Type Safety |
| 🔗 **React Flow** | Graph Rendering |
| 🎨 **Tailwind CSS** | UI Styling |
| ⚡ **Vite** | Fast Build Tool |

</div>

---

<div align="center">

## ✦ How to Run

</div>

```bash
# ─── Clone the repo ───────────────────────────────────
git clone https://github.com/HimaniMahajan27/assessment_2.git

# ─── Navigate inside ──────────────────────────────────
cd assessment_2

# ─── Install dependencies ─────────────────────────────
npm install

# ─── Start dev server ─────────────────────────────────
npm run dev
```

---

<div align="center">

## ✦ Example Use Case

</div>

> 👉 **Employee Onboarding Workflow:**

```
  [1] Collect documents
       ↓
  [2] Manager approval
       ↓
  [3] Approved? ──── YES ──→ Send email
       │
       └──── NO ──→ Rework documents
                         ↓
  [4] Complete process ←──┘
```
<div align="center">
  <img width="1897" height="915" alt="Screenshot 2026-04-22 120436" src="https://github.com/user-attachments/assets/ed7f7809-d6b8-4e33-9aa8-801df2b331dc" />

</div>

---

<div align="center">

## ✦ Key Highlights

</div>

<div align="center">

```
  ┌───────────────────────┐  ┌───────────────────────┐
  │  Graph-based workflow │  │  Real-time validation │
  │      execution        │  │        system         │
  └───────────────────────┘  └───────────────────────┘
  ┌───────────────────────┐  ┌───────────────────────┐
  │  Branch-aware         │  │  Clean modular        │
  │  simulation           │  │  architecture         │
  └───────────────────────┘  └───────────────────────┘
              ┌───────────────────────┐
              │  Production-ready     │
              │      structure        │
              └───────────────────────┘
```

</div>

---

<div align="center">

## ✦ UI Preview

</div>

```
  ┌─────────────────────────────────────────────────┐
  │  📌  Canvas View         — Node drag & drop UI  │
  │  📌  Branching Workflow  — Approval logic paths  │
  │  📌  Validation Panel    — Error detection       │
  │  📌  Execution Log       — Step-by-step trace    │
  └─────────────────────────────────────────────────┘
```

---

<div align="center">

## ✦ Future Improvements

</div>

| 🔮 Roadmap | Status |
|---|:---:|
| 🔁 Retry / failure simulation | `planned` |
| ⏱️ Delay & scheduling support | `planned` |
| 🌐 Backend integration | `planned` |
| 📦 Save / load workflows | `planned` |
| 📊 Analytics dashboard | `planned` |

---

<div align="center">

## ✦ Author

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:302b63,100:0f0c29&height=60&text=Himani%20Mahajan%20%F0%9F%92%AB&fontSize=28&fontColor=ffffff&fontAlignY=65"/>

**Full Stack + AI Enthusiast**

</div>

---

<div align="center">

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   This is not just a UI —                                    ║
║   this is a logic-driven workflow engine                     ║
║   with simulation capabilities.                              ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:24243e,50:302b63,100:0f0c29&height=120&section=footer"/>

</div>
