import './ProfileWindow.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import axios from 'axios';
import { useState, useEffect } from 'react';

interface user_id {
    user_id: string;
}

interface iProfileData {
    _id: string;
    username: string;
    name: string;
    role: string;
    bio: string;
    tweets: any[];
    comments: any[];
    replies: any[];
    following: any[];
    followers: any[];
    liked: any[];
    ts_created: Date;
    ts_edited: Date;
}

function ProfileWindow(user_id : user_id) {
    const [profile, setProfile] = useState<iProfileData>();

    useEffect(() => {
        if (profile) {
            axios.post("loadProfile",{
                data_id: profile._id,
            })
            .then(response => {
                setProfile(response.data);
            })
            .catch(error => {
                console.error(error);
            });
        }
        });


  return (
    <section className="profile_window">
        {profile && (
         <div className="box noborder">
            <div className="wrapper-info-profile">
                <div className="wrapper-name">
                    <h1>{profile.name}</h1>
                    <FontAwesomeIcon className="buttonSvgDots" icon={solid("ellipsis")}/>
                </div>
                <h3>@{profile.username}</h3>
                <h2></h2>
                <div className="date">
                    <FontAwesomeIcon className="buttonSvgCal" icon={solid("calendar-day")}/>
                    <h3>Připojeno {profile.ts_created.toLocaleDateString("cs-CZ")}</h3>
                </div>
                <div className="wrapper-follows">
                    <a className="number">{profile.following.length.toString()}</a>
                    <a className="text"> Sledování</a>
                    <a className="number">{profile.followers.length.toString()}</a>
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
        )}
    </section>
  )
}

export default ProfileWindow