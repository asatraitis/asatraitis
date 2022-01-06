import {useMachine} from '@xstate/react'
import Background from "../Background/Background"
import appMachine from "../../machines/app"
import Header from '../Header/Header';
import Me from '../Me/Me';
import ResumeDownload from '../ResumeDownload/ResumeDownload';
import Links from '../Links/Links';
import Footer from '../Footer/Footer';
import './app.css';


function App() {
  const [state] = useMachine(appMachine)

  return (
    <div className="App">
      <Background threeActor={state?.context?.threeActor} />
      <main className="App-main">
        <Header />
        <div className="App-content">
          <Me />
          <ResumeDownload text="RESUME" />
          <Links className="App-links" />
        </div>
        <Footer />
      </main>
    </div>
  )}

export default App
