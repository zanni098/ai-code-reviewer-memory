import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Github, Layers3, Play, Sparkles } from "lucide-react";
import { project } from "./project";
import "./styles.css";

type RunState = "idle" | "running" | "done";

export default function App() {
  const [input, setInput] = useState<string>(project.sampleInput);
  const [state, setState] = useState<RunState>("idle");
  const [activeStep, setActiveStep] = useState(0);

  const repoUrl = useMemo(() => `https://github.com/zanni098/${project.slug}`, []);

  function runDemo() {
    setState("running");
    setActiveStep(0);
    project.stages.forEach((_, index) => {
      window.setTimeout(() => setActiveStep(index), 420 * (index + 1));
    });
    window.setTimeout(() => setState("done"), 420 * project.stages.length + 350);
  }

  return (
    <main>
      <section className="hero">
        <nav>
          <span className="mark"><Sparkles size={18} /> Asad AI Workflow Lab</span>
          <a href={repoUrl} target="_blank" rel="noreferrer"><Github size={17} /> GitHub</a>
        </nav>
        <div className="heroGrid">
          <div className="heroCopy">
            <p className="eyebrow">Portfolio project for Mindrift AI Workflow Engineer</p>
            <h1>{project.name}</h1>
            <p className="tagline">{project.tagline}</p>
            <div className="actions">
              <button onClick={runDemo}><Play size={18} /> {project.cta}</button>
              <a className="secondary" href="#architecture">Architecture <ArrowRight size={16} /></a>
            </div>
          </div>
          <div className="console" aria-label="workflow demo console">
            <label>{project.inputLabel}</label>
            <textarea value={input} onChange={(event) => setInput(event.target.value)} />
            <div className="status">
              <span className={state === "done" ? "dot done" : state === "running" ? "dot running" : "dot"} />
              {state === "idle" ? "Ready to simulate" : state === "running" ? "Workflow running" : "Structured output ready"}
            </div>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="metric"><strong>{project.stages.length}</strong><span>workflow stages</span></div>
        <div className="metric"><strong>{project.outputs.length}</strong><span>structured outputs</span></div>
        <div className="metric"><strong>{project.stack.length}</strong><span>implementation layers</span></div>
      </section>

      <section className="workspace">
        <div className="panel">
          <h2>Workflow Run</h2>
          <div className="steps">
            {project.stages.map((stage, index) => (
              <div className={index <= activeStep && state !== "idle" ? "step active" : "step"} key={stage}>
                <CheckCircle2 size={18} />
                <span>{stage}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel output">
          <h2>Example Output</h2>
          {project.outputs.map((item) => (
            <article key={item.label}>
              <strong>{item.label}</strong>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="architecture" className="architecture">
        <div>
          <p className="eyebrow">Why this matters</p>
          <h2>Built to show real AI workflow engineering.</h2>
          <p>{project.roleFit}</p>
        </div>
        <div className="flow">
          <Layers3 size={22} />
          <p>{project.architecture}</p>
        </div>
      </section>

      <section className="stack">
        {project.stack.map((item) => <span key={item}>{item}</span>)}
      </section>
    </main>
  );
}
