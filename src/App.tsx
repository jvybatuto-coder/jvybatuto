import { CursorGlow } from './components/layout/CursorGlow'
import { Navbar } from './components/layout/Navbar'
import { About } from './sections/About'
import { Certificates } from './sections/Certificates'
import { Contact } from './sections/contact/Contact'
import { Hero } from './sections/Hero'
import { Projects } from './sections/projects/Projects'
import { Skills } from './sections/Skills'

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-crimson focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <CursorGlow />
      <Navbar />
      <main id="main" className="relative z-[1]">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Certificates />
        <Contact />
      </main>
    </>
  )
}
