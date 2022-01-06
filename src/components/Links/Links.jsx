import './links.css'
import LINKS from '../../config/links'

export default function Links() {
    return (
        <ul className="Links">
            <li><a href={LINKS.linkedin}>LinkedIn</a></li>
            <li><a href={LINKS.github}>Github</a></li>
            <li><a href={LINKS.codepen}>Codepen</a></li>
            <li><a href={LINKS.youtube}>YouTube</a></li>
          </ul>
    )
}