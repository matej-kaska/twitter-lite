import ProfileWindow from '../components/profile/ProfileWindow';
import Navbar from '../components/navbar/Navbar';
import './Profile.scss';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

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
    console.log(user_id)

    const loadTweets = () => {
        axios.post("loadTweetsUser",{
            user_id: user_id,
            likes: likes,
            number_of_bunch: number_of_bunch,
        })
        .then(response => {
            setEnd(false);
            setTweets(response.data);
            if (response.data.length < 10 * number_of_bunch) {
                setEnd(true);
            }
            setNumberOfBunch(prev => prev + 1);
        })
        .catch(error => {
            console.error(error);
        });
    };
    

  return (
    <section className="window">
        <Navbar></Navbar>
        <div className="profile">
            {user_id ? <ProfileWindow user_id={user_id} /> : null}
        </div>
    </section>
  )
}

export default Profile