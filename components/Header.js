import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
  return (
    <Menu style={{ marginTop: "15px" }}>
        <Link route="/">
          <a className="item">CampaignCoin</a>
        </Link>
        <Menu.Menu position="right">
        <Link route="campaigns/new">
          <a className="item">+</a>
        </Link>
        </Menu.Menu>
    </Menu>
  );
}