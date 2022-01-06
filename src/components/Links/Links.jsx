import './links.css'

const LINKS = {
    linkedin: "https://www.linkedin.com/in/asatraitis/",
    github: "https://github.com/asatraitis",
    codepen: "https://codepen.io/asatraitis",
    youtube: "https://www.youtube.com/channel/UCUa7tKcxbqSpeTCd4UEaR5w"
}

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