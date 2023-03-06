import './ProfileWindow.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import axios from 'axios';
import { useState, useEffect } from 'react';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form';

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

    type Form = {
        tweets: string;
        user_id: string;
        apiError: string
    }

    const formSchema = yup.object().shape({
        liked_tweet: yup.string().required(),
        user: yup.string().required(),
    })

    const {setError, register, handleSubmit, formState: { errors } } = useForm<Form>({ 
        resolver: yupResolver(formSchema)
    });

    useEffect(() => {
        axios.post("../loadProfile",{
            user_id: user_id.user_id,
        })
        .then(response => {
            setProfile(response.data);
        })
        .catch(error => {
            console.error(error);
        });
        },[]);

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
                <h2>{profile.bio}</h2>
                <div className="date">
                    <FontAwesomeIcon className="buttonSvgCal" icon={solid("calendar-day")}/>
                    <h3>Připojeno {new Date(profile.ts_created).toLocaleDateString("cs-CZ")}</h3>
                </div>
                <div className="wrapper-follows">
                    <a className="number">{profile.following.length.toString()}</a>
                    <a className="text"> Sledování</a>
                    <a className="number">{profile.followers.length.toString()}</a>
                    <a className="text"> Sledujících</a>
                </div>
            </div>
        </div>
        )}
    </section>
  )
}

export default ProfileWindow