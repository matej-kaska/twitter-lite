import './ProfileWindow.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dropdown from '../dropdown/Dropdown';
import {iProfileData, iFollowers} from '../../interfaces/ProfileInterface';
import useEscapeKeyHandler from '../../hooks/useEscapeKeyHandler';
import { handleProfile } from '../../utils/handleProfile';

function ProfileWindow(props: {user_id: string}) {
  const [profile, setProfile] = useState<iProfileData>();
  const [followersList, setFollowersList] = useState<iFollowers[]>([]);
  const [followingList, setFollowingList] = useState<iFollowers[]>([]);
  const id_of_user = localStorage.getItem("id_of_user");
  const [ownProfile, setOwnProfile] = useState(false);
  const [following, setFollowing] = useState(false);
  const [followCount, setFollowCount] = useState(0);
  const [isFollowersOpen, setIsFollowersOpen] = useState(false);
  const [isFollowingOpen, setIsFollowingOpen] = useState(false);
  const navigate = useNavigate();

  const handleFollow = () => {
    axios.post("../follow", {
      user_id: props.user_id,
      master_id: id_of_user
    })
    .then(() => {
      setFollowing(following => !following);
      setFollowCount((followCount) => (following  ? followCount - 1 : followCount + 1));
    })
    .catch(error => {
      console.error(error);
    });
  };
  
  const handleModalFollowers = () => {
    axios.post("../loadFollowers", {
      user_id: props.user_id
    })
    .then(response => {
      setFollowersList(response.data);
    })
    .catch(error => {
      console.error(error);
    });
    setIsFollowersOpen(!isFollowersOpen);
  };

  const handleModalFollowing = () => {
    axios.post("../loadFollowing", {
      user_id: props.user_id
    })
    .then(response => {
      setFollowingList(response.data);
    })
    .catch(error => {
      console.error(error);
    });
    setIsFollowingOpen(!isFollowingOpen);
  };

  useEffect(() => {
    axios.post("../loadProfile", {
      user_id: props.user_id
    })
    .then(response => {
      setProfile(response.data);
      if (id_of_user === props.user_id) {
        setOwnProfile(true);
      }
    })
    .catch(error => {
      console.error(error);
    });
  }, []);

  useEffect(() => {
    if (id_of_user && profile?.followers.includes(id_of_user)) {
      setFollowing(true);
    }
    setFollowCount(profile?.followers.length || 0);
  }, [profile]);

  useEscapeKeyHandler([
    { stateSetter: setIsFollowersOpen, isOpen: isFollowersOpen },
    { stateSetter: setIsFollowingOpen, isOpen: isFollowingOpen }
  ]);

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
                  <button onClick={handleFollow} className="buttonFollowing">Following</button>
                ) : (
                  <button onClick={handleFollow} className="buttonFollow">Follow</button>
                )}
              </>
            ) : (
              <Dropdown></Dropdown>
            )}
          </div>
          <h3>@{profile.username}</h3>
          <h2>{profile.bio}</h2>
          <div className="date">
            <FontAwesomeIcon className="buttonSvgCal" icon={solid("calendar-day")}/>
            <h3>Joined {new Date(profile.ts_created).toLocaleDateString("cs-CZ")}</h3>
          </div>
          <div className="wrapper-follows">
            <a onClick={handleModalFollowing} className="number">{profile.following.length.toString()}</a>
            <a onClick={handleModalFollowing} className="text">Following</a>
            <a onClick={handleModalFollowers} className="number">{followCount.toString()}</a>
            <a onClick={handleModalFollowers} className="text">Followers</a>
          </div>
          {isFollowersOpen && followersList && (
            <div className="modal-container">
              <div className="modal">
                <div className="top-bar">
                  Followers:
                  <button onClick={handleModalFollowers}>
                    <FontAwesomeIcon icon={solid("x")}/>
                  </button>
                </div>
                <div className="follower-list">
                  {followersList.length === 0 ? (
                    <div>This user has no followers</div>
                  ) : (
                    followersList.map((follower) => (
                      <div key={follower._id} className="follower">
                        <div onClick={() => handleProfile(follower._id, navigate)} className="follower-name">-&nbsp;{follower.name}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
          {isFollowingOpen && followingList && (
            <div className="modal-container">
              <div className="modal">
                <div className="top-bar border">
                  Following:
                  <button onClick={handleModalFollowing}><FontAwesomeIcon icon={solid("x")}/></button>
                </div>
                <div className="follower-list">
                  {followingList.length === 0 ? (
                    <div>This user doesn't follow anyone</div>
                  ) : (
                    followingList.map((follower) => (
                      <div key={follower._id} className="follower">
                        <div onClick={() => handleProfile(follower._id, navigate)} className="follower-name">-&nbsp;{follower.name}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )}
  </section>
  );
}

export default ProfileWindow;