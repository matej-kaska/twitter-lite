import ProfileWindow from '../components/profile/ProfileWindow';
import Navbar from '../components/navbar/Navbar';
import './Profile.scss';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import Tweet from '../components/timeline/Tweet';
import { iTweet } from '../interfaces/TweetInterface';

function Profile() {
  const [tweets, setTweets] = useState<iTweet[]>([]);
  const [number_of_bunch, setNumberOfBunch] = useState(1);
  const [end, setEnd] = useState(false);
  const { user_id } = useParams();
  const [ownTweets, setOwnTweets] = useState(true);

  const ChangeTweets = (click: boolean) => {
    if(click !== ownTweets) {
      setOwnTweets(own => !own);
    }
    setNumberOfBunch(1);
  }

  useEffect(() => {
    ReloadTweets();
  }, [ownTweets]);

  const ReloadTweets = () => {
    if (ownTweets) {
      axios.post("../loadTweetsUser", {
        number_of_bunch: number_of_bunch,
        user_id: user_id
      })
      .then((response) => {
        setEnd(false);
        setTweets(response.data);
        if (response.data.length < 10 * number_of_bunch) {
            setEnd(true);
        }
        setNumberOfBunch(number_of_bunch + 1);
      })
      .catch(error => {
        console.error(error);
      });
    } else {
      axios.post("../loadLikesUser", {
        number_of_bunch: number_of_bunch,
        user_id: user_id
      })
      .then((response) => {
        setEnd(false);
        setTweets(response.data);
        if (response.data.length < 10 * number_of_bunch) {
          setEnd(true);
        }
        setNumberOfBunch(number_of_bunch + 1);
      })
      .catch(error => {
        console.error(error);
      });
    }
  };

  return (
    <section className="window">
      <Navbar></Navbar>
      <div className="profile">
        {user_id ? <ProfileWindow user_id={user_id} /> : null}
        <div className="tweets-profile">
          <div className="wrapper-buttons">
            {ownTweets ? (
              <>
                <div onClick={() => ChangeTweets(true)} className="wrapper-button">
                  <button className="active">Tweets</button>
                  <FontAwesomeIcon className="buttonSvgLineActive" icon={solid("window-minimize")}/>
                </div>
              </>
            ) : (
              <>
                <div onClick={() => ChangeTweets(true)} className="wrapper-button">
                  <button className="nonactive">Tweets</button>
                  <FontAwesomeIcon className="buttonSvgLineNonactive" icon={solid("window-minimize")}/>
                </div>
              </>
            )}
            {ownTweets ? (
              <>
                <div onClick={() => ChangeTweets(false)} className="wrapper-button">
                  <button className="nonactive">Likes</button>
                  <FontAwesomeIcon className="buttonSvgLineNonactive" icon={solid("window-minimize")}/>
                </div>
              </>
            ) : (
              <>
                <div onClick={() => ChangeTweets(false)} className="wrapper-button">
                  <button className="active">Likes</button>
                  <FontAwesomeIcon className="buttonSvgLineActive" icon={solid("window-minimize")}/>
                </div>
              </>
            )}
          </div>
          {tweets.map((tweet) => (<Tweet key={tweet._id} tweet={tweet}/>))}
          <p></p>
          {end ? (
            <>
              <div className="boxended">
                <h3>You have come to the end!</h3>
              </div>
            </>
          ) : (
            <>
              <div onClick={ReloadTweets} className="boxload">
                <h3>Load more</h3>
                <FontAwesomeIcon className="buttonSvg" icon={solid("angle-down")}/>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Profile;