import ProfileWindow from '../components/profile/ProfileWindow';
import Navbar from '../components/navbar/Navbar';
import './Profile.scss';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { useForm } from 'react-hook-form';
import Tweet from '../components/timeline/Tweet';

interface iTweet {
    _id: string;
    id_of_user: string;
    name_of_user: string;
    username_of_user: string;
    comments: any[];
    likes: any[];
    ts_created: Date;
    text: string;
  }

function Profile() {
    const [tweets, setTweets] = useState<iTweet[]>([]);
    const [number_of_bunch, setNumberOfBunch] = useState(1);
    const [end, setEnd] = useState(false);
    const [likes, setlikes] = useState(false);
    let { user_id } = useParams();
    const [ownTweets, setOwnTweets] = useState(true);
    

    type Form = {
        user_id: string;
        number_of_bunch: number;
        apiError: string
    }

    const formSchema = yup.object().shape({
        tweets: yup.string().required(),
        user_id: yup.string().required(),
        number_of_bunch: yup.number().required()
    })

    const {setError, register, handleSubmit, formState: { errors } } = useForm<Form>({ 
        resolver: yupResolver(formSchema)
    });

    const ChangeTweets = (click: boolean) => {
        if(click != ownTweets) {
            setOwnTweets(own => !own)
        }
        setNumberOfBunch(1);
    }

    useEffect(() => {
        
        ReloadTweets();
    },[ownTweets]);

    const ReloadTweets = () => {
        if(ownTweets) {
            axios.post("../loadTweetsUser",{
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
            .catch(err => {
                setError("apiError", {
                type: "server",
                message: "Někde nastala chyba zkuste to znovu!",
            });
            })
        } else {
            axios.post("../loadLikesUser",{
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
            .catch(err => {
                setError("apiError", {
                type: "server",
                message: "Někde nastala chyba zkuste to znovu!",
            });
            })
        }
    }

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
                <button className="active">Tweety</button> 
                <FontAwesomeIcon className="buttonSvgLineActive" icon={solid("window-minimize")}/>
            </div>
            </>
            ) : (
            <>
            <div onClick={() => ChangeTweets(true)} className="wrapper-button">
                <button className="nonactive">Tweety</button> 
                <FontAwesomeIcon className="buttonSvgLineNonactive" icon={solid("window-minimize")}/>
            </div>
            </>
            )}
            {ownTweets ? (
            <>
            <div onClick={() => ChangeTweets(false)} className="wrapper-button">
                <button className="nonactive">Lajky</button>
                <FontAwesomeIcon className="buttonSvgLineNonactive" icon={solid("window-minimize")}/>
            </div>
            </>
            ) : (
            <>
            <div onClick={() => ChangeTweets(false)} className="wrapper-button">
                <button className="active">Lajky</button>
                <FontAwesomeIcon className="buttonSvgLineActive" icon={solid("window-minimize")}/>
            </div>
            </>
            )}
        </div>
        {tweets.map(tweet => <Tweet key={tweet._id} tweet={tweet} />)}
        <p></p>
          {end ? (
            <>
            <div className="boxended">
              <h3>Došel si na konec!</h3>
            </div>
            </>
          ) : (
            <>
            <div onClick={ReloadTweets} className="boxload">
              <h3>Načíst další</h3>
              <FontAwesomeIcon className="buttonSvg" icon={solid("angle-down")}/>
            </div>
            </>
          )}
        </div>
        </div>
    </section>
  )
}

export default Profile