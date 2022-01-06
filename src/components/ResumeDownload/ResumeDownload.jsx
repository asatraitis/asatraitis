import './resumeDownload.css';
import resume from '../../assets/Andrius Satraitis resume.pdf';

export default function ResumeDownload({text}) {
    return <a className="ResumeDownload" href={resume}><button className='ResumeDownload-btn'>{text}</button></a>
}