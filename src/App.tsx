import { BriefsReel } from "./components/BriefsReel"
import { Footer } from "./components/Footer"
import { Hero } from "./components/Hero"
import { LaunchLab } from "./components/LaunchLab"
import { Library } from "./components/Library"
import { Nav } from "./components/Nav"

export default function App() {
  return (
    <>
      <a className="skip" href="#news">
        Skip to this week’s brief
      </a>
      <Nav />
      <main>
        <Hero />
        <BriefsReel />
        <Library />
        <LaunchLab />
      </main>
      <Footer />
    </>
  )
}
