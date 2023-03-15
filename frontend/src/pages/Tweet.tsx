import TweetWindow from '../components/tweet/TweetWindow';
import Navbar from '../components/navbar/Navbar';
import './Tweet.scss';
import { useParams } from 'react-router-dom';

function Tweet() {
  const { tweet_id } = useParams();

  return (
    <section className="window">
        <Navbar></Navbar>
        <div className="one_tweet">
          {tweet_id ? <TweetWindow tweet_id={tweet_id}/> : null}
        </div>
    </section>
  );
}

export default Tweet;