import ProfileWindow from '../components/profile/ProfileWindow';
import Navbar from '../components/navbar/Navbar';
import './Profile.scss';


function Profile() {
  return (
    <section className="window">
        <Navbar></Navbar>
        <div className="profile">
            <ProfileWindow></ProfileWindow>
        </div>
    </section>
  )
}

export default Profile