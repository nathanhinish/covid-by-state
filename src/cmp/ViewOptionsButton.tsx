import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import { MoreVert, Check } from '@material-ui/icons';

interface ViewOptionsButtonProps {
  className: string | undefined;
}

const useStyles = makeStyles({
  ListItemIcon: {
    minWidth: 32,
  },
});

export const ViewOptionsButton = ({ className }: ViewOptionsButtonProps) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null as Element | null);
  const {
    dataset: { dateKeys },
    popScaled,
    firstConfirmedShift,
    showPerDay,
    showCumulative,
  } = useSelector((state) => state) as StoreState;
  const dispatch = useDispatch();
  const firstDate = dateKeys[0];
  const onMenuClick = (...rest: any) => {
    console.info(rest);
  };

  return (
    <React.Fragment>
      <IconButton
        aria-label="View Options"
        aria-controls="viewOptionsMenu"
        aria-haspopup="true"
        className={className}
        onClick={(event) => setAnchorEl(event.currentTarget as Element)}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="viewOptionsMenu"
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        onClick={onMenuClick}
      >
        <MenuItem
          value="number"
          dense
          onClick={() =>
            dispatch({
              type: 'setPopScaled',
              payload: 'number',
            })
          }
        >
          <ListItemIcon className={classes.ListItemIcon}>
            {!popScaled ? <Check /> : null}
          </ListItemIcon>
          <ListItemText>Show # of cases</ListItemText>
        </MenuItem>
        <MenuItem
          value="percent"
          dense
          divider
          onClick={() =>
            dispatch({
              type: 'setPopScaled',
              payload: 'percent',
            })
          }
        >
          <ListItemIcon className={classes.ListItemIcon}>
            {popScaled ? <Check /> : null}
          </ListItemIcon>
          <ListItemText>Show % of state pop.</ListItemText>
        </MenuItem>

        <MenuItem
          value="date"
          dense
          onClick={() =>
            dispatch({
              type: 'setFirstConfirmedShift',
              payload: 'date',
            })
          }
        >
          <ListItemIcon className={classes.ListItemIcon}>
            {!firstConfirmedShift ? <Check /> : null}
          </ListItemIcon>
          <ListItemText>Start at {firstDate}</ListItemText>
        </MenuItem>
        <MenuItem
          value="confirmed"
          dense
          divider
          onClick={() =>
            dispatch({
              type: 'setFirstConfirmedShift',
              payload: 'confirmed',
            })
          }
        >
          <ListItemIcon className={classes.ListItemIcon}>
            {firstConfirmedShift ? <Check /> : null}
          </ListItemIcon>
          <ListItemText>Start at first confirmed</ListItemText>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};
