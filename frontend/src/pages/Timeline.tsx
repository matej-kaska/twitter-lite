import TimilineWindow from '../components/timeline/TimelineWindow';
import Navbar from '../components/navbar/Navbar';
import './Timeline.scss';


function Timeline() {
  return (
    <div className="window">
      <Navbar></Navbar>
      <section className="timeline">
        <TimilineWindow></TimilineWindow>
      </section>
    </div>
    
  )
}

export default Timeline