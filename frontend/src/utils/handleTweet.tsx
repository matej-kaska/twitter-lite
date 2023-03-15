export const handleTweet = (id_of_tweet: string, navigate: any) => {
  const pathname = window.location.pathname;

  if (pathname === '/tweet/' + id_of_tweet) {
    window.location.reload();
  } else {
    navigate("/tweet/" + id_of_tweet);
  }
};