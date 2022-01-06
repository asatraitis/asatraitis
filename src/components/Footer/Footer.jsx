import './footer.css'
import LINKS from '../../config/links'

export default function Footer() {
    return <footer className="Footer">source code:<a className="Footer-source-url" href={LINKS.source}>Github</a></footer>
}