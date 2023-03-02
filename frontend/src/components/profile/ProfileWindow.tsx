import './ProfileWindow.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro';

function ProfileWindow() {
  return (
    <section className="profile_window">
         <div className="box noborder">
            <div className="wrapper-info-profile">
                <div className="wrapper-name">
                    <h1>Matěj Kaška</h1>
                    <FontAwesomeIcon className="buttonSvgDots" icon={solid("ellipsis")}/>
                </div>
                <h3>@matej.kaska</h3>
                <h2>BIOBIOBIOBIOBIOBIOBIOBIOBIOBIOBIOBIOBIOBIOBIOBIO</h2>
                <div className="date">
                    <FontAwesomeIcon className="buttonSvgCal" icon={solid("calendar-day")}/>
                    <h3>Připojeno 19.2. 2023</h3>
                </div>
                <div className="wrapper-follows">
                    <a className="number">100</a>
                    <a className="text"> Sledování</a>
                    <a className="number">100</a>
                    <a className="text"> Sledujících</a>
                </div>
            </div>
            <p></p>
            <div className="wrapper-buttons">
                <div className="wrapper-button">
                    <button>Tweety</button> 
                    <FontAwesomeIcon className="buttonSvgLine" icon={solid("window-minimize")}/>
                </div>
                <div className="wrapper-button">
                    <button>Lajky</button>
                    <FontAwesomeIcon className="buttonSvgLine" icon={solid("window-minimize")}/>
                </div>
            </div>
        </div>
    </section>
  )
}

export default ProfileWindow