export const handleProfile = (id_of_profile: string, navigate: any) => {
  const pathname = window.location.pathname;

  if (pathname === '/profile/' + id_of_profile) {
    window.location.reload();
  } else {
    navigate("/profile/" + id_of_profile);
  }
};