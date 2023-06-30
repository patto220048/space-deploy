const noAvatar =
    (process.env.REACT_APP_PUBLIC_FOLDER_SSL
        ? process.env.REACT_APP_PUBLIC_FOLDER_SSL
        : process.env.REACT_APP_PUBLIC_FOLDER) + 'no_avatar1.jpg';

const noBg =
    (process.env.REACT_APP_PUBLIC_FOLDER_SSL
        ? process.env.REACT_APP_PUBLIC_FOLDER_SSL
        : process.env.REACT_APP_PUBLIC_FOLDER) + 'no_bg2.png';
const logo =
    (process.env.REACT_APP_PUBLIC_FOLDER_SSL
        ? process.env.REACT_APP_PUBLIC_FOLDER_SSL
        : process.env.REACT_APP_PUBLIC_FOLDER) + 'logo.png';

export { noAvatar, noBg, logo };
