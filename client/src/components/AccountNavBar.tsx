import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import ArrowForwardIosOutlinedIcon from '@material-ui/icons/ArrowForwardIosOutlined';

type NavItemProps = {
  isLast: boolean;
  path: string;
  link: string;
};

const AccountNavBar = () => {
  const { pathname } = useLocation();
  const paths = pathname.split('/');
  paths.shift();
  if (paths.length === 1) return null;
  return (
    <div className="w-2/3 m-auto">
      <nav className="mt-2 left-56 relative">
        {paths.map((path, index) => {
          let link = '/account';
          for (let i = 1; i < index + 1; i += 1) {
            link += '/';
            link += paths[i];
          }
          return (
            <NavItem
              isLast={index === paths.length - 1}
              path={path}
              link={link}
              key={path}
            />
          );
        })}
      </nav>
    </div>
  );
};

const NavItem = ({ isLast, path, link }: NavItemProps) => {
  let finalPath = path;
  if (path === 'addAddress') {
    finalPath = 'New Address';
  } else if (path.length === 24) {
    finalPath = 'Update Address';
  }

  if (finalPath.split(' ').length === 1) {
    finalPath = `Your ${finalPath}`;
  }

  return isLast ? (
    <span className="text-purple-500">{finalPath}</span>
  ) : (
    <span>
      <Link
        to={link}
        className="text-gray-700 hover:text-purple-500 hover:underline"
      >
        {finalPath}
      </Link>

      <ArrowForwardIosOutlinedIcon
        className="ml-0.5 mr-0.5 text-gray-700"
        style={{ fontSize: 10 }}
      />
    </span>
  );
};

export default AccountNavBar;
