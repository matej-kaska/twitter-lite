import './ProfileWindow.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import axios from 'axios';
import { useState, useEffect } from 'react';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Dropdown from '../dropdown/Dropdown';

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
    following: string[];
    followers: string[];
    liked: any[];
    ts_created: Date;
    ts_edited: Date;
}


interface iFollowers {
    _id: string;
    name: string;
}

function ProfileWindow(user_id : user_id) {
    const [profile, setProfile] = useState<iProfileData>();
    const [followersList, setFollowersList] = useState<iFollowers[]>([]);
    const [followingList, setFollowingList] = useState<iFollowers[]>([]);
    const id_of_user = localStorage.getItem("id_of_user")
    const [ownProfile, setOwnProfile] = useState(false);
    const [following, setFollowing] = useState(false);
    const [followCount, setFollowCount] = useState(0);
    const [isFollowersOpen, setIsFollowersOpen] = useState(false);
    const [isFollowingOpen, setIsFollowingOpen] = useState(false);
    const navigate = useNavigate();

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

    const handleFollow = () => {
        axios.post("../follow",{
            user_id: user_id.user_id,
            master_id: id_of_user
        })
        .then(response => {
            setFollowing(following => !following);
            setFollowCount((followCount) => (following  ? followCount - 1 : followCount + 1));
        })
        .catch(error => {
            console.error(error);
        });
    }
    
    const handleModalFollowers = () => {
        setIsFollowersOpen(!isFollowersOpen);
    }

    const handleModalFollowing = () => {
        setIsFollowingOpen(!isFollowingOpen);
    }

    const handleProfile = (id_of_profile: string) => {
        navigate("/profile/" + id_of_profile);
        window.location.reload();
    }

    useEffect(() => {
        axios.post("../loadProfile",{
            user_id: user_id.user_id,
        })
        .then(response => {
            setProfile(response.data);
            if(id_of_user == user_id.user_id){
                setOwnProfile(true);
            }
        })
        .catch(error => {
            console.error(error);
        });
        axios.post("../loadFollowing",{
            user_id: user_id.user_id,
        })
        .then(response => {
            console.log(response.data)
            setFollowingList(response.data)
        })
        .catch(error => {
            console.error(error);
        });
        
        },[]);

    useEffect(() => {
        if(id_of_user){
            if(profile?.followers.includes(id_of_user)){
                setFollowing(true);
            }
        }
        setFollowCount(profile?.followers.length || 0)
    },[profile]);

    useEffect(() => {
        axios.post("../loadFollowers",{
            user_id: user_id.user_id,
        })
        .then(response => {
            setFollowersList(response.data)
        })
        .catch(error => {
            console.error(error);
        });
    },[followCount]);

    useEffect(() => {
        const handleEscapeKeyPress = (event: KeyboardEvent) => {
          if (event.key === 'Escape') {
            setIsFollowersOpen(false);
            setIsFollowingOpen(false);
          }
        };
    
        window.addEventListener('keydown', handleEscapeKeyPress);
    
        return () => {
          window.removeEventListener('keydown', handleEscapeKeyPress);
        };
      }, []);

  return (
    <section className="profile_window">
        {profile && (
         <div className="box noborder">
            <div className="wrapper-info-profile">
                <div className="wrapper-name">
                    <h1>{profile.name}</h1>
                    {!ownProfile ? (
                        <>
                        {following ? (
                            <>
                            <button onClick={handleFollow} className="buttonFollowing">Sleduješ</button>
                            </>
                        ) : (
                            <>
                            <button onClick={handleFollow} className="buttonFollow">Sledovat</button>
                            </>
                        )}
                        </>
                    ) : (
                        <>
                            <Dropdown></Dropdown>
                        </>
                    )}
                </div>
                <h3>@{profile.username}</h3>
                <h2>{profile.bio}</h2>
                <div className="date">
                    <FontAwesomeIcon className="buttonSvgCal" icon={solid("calendar-day")}/>
                    <h3>Připojeno {new Date(profile.ts_created).toLocaleDateString("cs-CZ")}</h3>
                </div>
                <div className="wrapper-follows">
                    <a onClick={handleModalFollowing} className="number">{profile.following.length.toString()}</a>
                    <a onClick={handleModalFollowing} className="text"> Sledování</a>
                    <a onClick={handleModalFollowers} className="number">{followCount.toString()}</a>
                    <a onClick={handleModalFollowers} className="text"> Sledujících</a>
                </div>
                {isFollowersOpen && followersList && (
                    <div className="modal-container">
                        <div className="modal">
                            <div className="top-bar">
                                Sledující:
                                <button onClick={handleModalFollowers}>X</button>
                            </div>
                            <div className="follower-list">
                            {followersList.length === 0 ?
                                <div>Tento uživatel nemá žádné sledující</div> :
                            followersList.map(follower => (
                                <div key={follower._id} className="follower">
                                    <div onClick={() => handleProfile(follower._id)} className="follower-name">-&nbsp;{follower.name}</div>
                                </div>
                            ))}
                            </div>
                        </div>
                    </div>
                )}
                {isFollowingOpen && followingList && (
                    <div className="modal-container">
                        <div className="modal">
                            <div className="top-bar">
                                Sleduje:
                                <button onClick={handleModalFollowing}>X</button>
                            </div>
                            <div className="follower-list">
                            {followingList.length === 0 ?
                                <div>Tento uživatel nikoho nesleduje</div> :
                            followingList.map(follower => (
                                <div key={follower._id} className="follower">
                                    <div onClick={() => handleProfile(follower._id)} className="follower-name">-&nbsp;{follower.name}</div>
                                </div>
                            ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        )}
    </section>
  )
}

export default ProfileWindow